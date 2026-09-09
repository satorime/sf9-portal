import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";
import { getAdminSession } from "@/lib/session";
import { parseCsvFile } from "@/lib/csv";
import { gradeRowSchema, type GradeRow, type SkippedRow } from "@/lib/validation/csv-schemas";

export async function POST(request: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Not authorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  let rawRows: Record<string, string>[];
  try {
    rawRows = await parseCsvFile(file);
  } catch {
    return NextResponse.json({ error: "Could not parse CSV file" }, { status: 400 });
  }

  const validRows: GradeRow[] = [];
  const skippedRows: SkippedRow[] = [];

  rawRows.forEach((raw, index) => {
    const parsed = gradeRowSchema.safeParse(raw);
    if (parsed.success) {
      validRows.push(parsed.data);
    } else {
      skippedRows.push({
        row: index + 2, // 1-indexed + header row
        lrn: raw.lrn,
        errors: parsed.error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`),
      });
    }
  });

  if (validRows.length === 0) {
    return NextResponse.json({ importedCount: 0, skippedRows });
  }

  const uniqueLrns = Array.from(new Set(validRows.map((row) => row.lrn)));
  const existingStudents = await prisma.student.findMany({
    where: { lrn: { in: uniqueLrns } },
    select: { lrn: true },
  });
  const existingLrnSet = new Set(existingStudents.map((student) => student.lrn));
  const newLrns = uniqueLrns.filter((lrn) => !existingLrnSet.has(lrn));
  const newPasswordHashes = new Map(
    await Promise.all(newLrns.map(async (lrn) => [lrn, await hashPassword(lrn)] as const))
  );

  // Dedupe: a student appears once per subject row, but should be upserted once.
  const studentInfoByLrn = new Map<
    string,
    Pick<GradeRow, "lrn" | "fullName" | "gradeLevel" | "section">
  >();
  const subjectKeys = new Set<string>();
  for (const row of validRows) {
    studentInfoByLrn.set(row.lrn, row);
    subjectKeys.add(`${row.subject}|${row.gradeLevel}`);
  }

  // Run independent upserts concurrently instead of one-at-a-time — a sequential
  // loop over a remote (Neon pooled) connection easily blows Prisma's default
  // 5s interactive-transaction timeout once a CSV has more than a few rows.
  await prisma.$transaction(
    async (tx) => {
      const studentEntries = await Promise.all(
        Array.from(studentInfoByLrn.values()).map(async (info) => {
          const student = await tx.student.upsert({
            where: { lrn: info.lrn },
            update: { fullName: info.fullName, gradeLevel: info.gradeLevel, section: info.section },
            create: {
              lrn: info.lrn,
              fullName: info.fullName,
              gradeLevel: info.gradeLevel,
              section: info.section,
              passwordHash: newPasswordHashes.get(info.lrn) ?? (await hashPassword(info.lrn)),
              mustChangePassword: true,
            },
          });
          return [info.lrn, student.id] as const;
        })
      );
      const studentIdByLrn = new Map(studentEntries);

      const subjectEntries = await Promise.all(
        Array.from(subjectKeys).map(async (key) => {
          const [name, gradeLevel] = key.split("|") as [string, GradeRow["gradeLevel"]];
          const subject = await tx.subject.upsert({
            where: { name_gradeLevel: { name, gradeLevel } },
            update: {},
            create: { name, gradeLevel },
          });
          return [key, subject.id] as const;
        })
      );
      const subjectIdByKey = new Map(subjectEntries);

      const gradeUpserts = validRows.flatMap((row) => {
        const studentId = studentIdByLrn.get(row.lrn)!;
        const subjectId = subjectIdByKey.get(`${row.subject}|${row.gradeLevel}`)!;
        const quarterScores: Array<["Q1" | "Q2" | "Q3" | "Q4", number | undefined]> = [
          ["Q1", row.q1],
          ["Q2", row.q2],
          ["Q3", row.q3],
          ["Q4", row.q4],
        ];

        return quarterScores
          .filter((entry): entry is ["Q1" | "Q2" | "Q3" | "Q4", number] => entry[1] !== undefined)
          .map(([quarter, score]) =>
            tx.grade.upsert({
              where: { studentId_subjectId_quarter: { studentId, subjectId, quarter } },
              update: { score },
              create: { studentId, subjectId, quarter, score },
            })
          );
      });

      await Promise.all(gradeUpserts);
    },
    { timeout: 20000 }
  );

  return NextResponse.json({ importedCount: validRows.length, skippedRows });
}
