import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/session";
import { parseCsvFile } from "@/lib/csv";
import { attendanceRowSchema, type AttendanceRow, type SkippedRow } from "@/lib/validation/csv-schemas";

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

  const validRows: AttendanceRow[] = [];
  const skippedRows: SkippedRow[] = [];

  rawRows.forEach((raw, index) => {
    const parsed = attendanceRowSchema.safeParse(raw);
    if (parsed.success) {
      validRows.push(parsed.data);
    } else {
      skippedRows.push({
        row: index + 2,
        lrn: raw.lrn,
        errors: parsed.error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`),
      });
    }
  });

  if (validRows.length === 0) {
    return NextResponse.json({ importedCount: 0, skippedRows });
  }

  const uniqueLrns = Array.from(new Set(validRows.map((row) => row.lrn)));
  const students = await prisma.student.findMany({
    where: { lrn: { in: uniqueLrns } },
    select: { id: true, lrn: true },
  });
  const studentIdByLrn = new Map(students.map((student) => [student.lrn, student.id]));

  const importableRows = validRows.filter((row) => {
    if (!studentIdByLrn.has(row.lrn)) {
      skippedRows.push({
        lrn: row.lrn,
        row: 0,
        errors: ["No student found with this LRN. Import the grades/roster CSV first."],
      });
      return false;
    }
    return true;
  });

  await prisma.$transaction(
    importableRows.map((row) => {
      const studentId = studentIdByLrn.get(row.lrn)!;
      return prisma.attendance.upsert({
        where: { studentId_quarter: { studentId, quarter: row.quarter } },
        update: {
          schoolDaysTotal: row.schoolDaysTotal,
          daysPresent: row.daysPresent,
          daysAbsent: row.daysAbsent,
          daysTardy: row.daysTardy,
        },
        create: {
          studentId,
          quarter: row.quarter,
          schoolDaysTotal: row.schoolDaysTotal,
          daysPresent: row.daysPresent,
          daysAbsent: row.daysAbsent,
          daysTardy: row.daysTardy,
        },
      });
    })
  );

  return NextResponse.json({ importedCount: importableRows.length, skippedRows });
}
