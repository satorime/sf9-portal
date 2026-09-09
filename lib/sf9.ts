import { prisma } from "@/lib/prisma";
import { getSchool } from "@/lib/school";

export type QuarterKey = "Q1" | "Q2" | "Q3" | "Q4";
const QUARTERS: QuarterKey[] = ["Q1", "Q2", "Q3", "Q4"];

export type StudentCardData = {
  student: {
    fullName: string;
    lrn: string;
    gradeLevel: string;
    section: string;
  };
  school: {
    name: string;
    address: string;
    logoUrl: string | null;
    schoolYear: string;
  } | null;
  subjects: Array<{
    subjectName: string;
    scores: Record<QuarterKey, number | null>;
    finalAverage: number | null;
  }>;
  generalAverage: number | null;
  attendance: Array<{
    quarter: QuarterKey;
    schoolDaysTotal: number;
    daysPresent: number;
    daysAbsent: number;
    daysTardy: number;
  }>;
  values: Array<{
    coreValue: string;
    behaviorStatement: string;
    ratingsByQuarter: Partial<Record<QuarterKey, string>>;
  }>;
  remarks: Array<{ quarter: QuarterKey | null; text: string }>;
};

function average(values: number[]): number | null {
  if (values.length === 0) return null;
  const sum = values.reduce((total, value) => total + value, 0);
  return Math.round((sum / values.length) * 100) / 100;
}

// Single source of truth for assembling a student's SF9 data — reused by the
// on-screen card view today, and intended for a future @react-pdf/renderer export.
export async function getStudentCardData(studentId: string): Promise<StudentCardData | null> {
  const student = await prisma.student.findUnique({
    where: { id: studentId },
    include: {
      grades: { include: { subject: true } },
      attendance: true,
      values: true,
      remarks: true,
    },
  });

  if (!student) return null;

  const school = await getSchool();

  const subjectMap = new Map<
    string,
    { subjectName: string; sortOrder: number; scores: Record<QuarterKey, number | null> }
  >();
  for (const grade of student.grades) {
    const key = grade.subjectId;
    if (!subjectMap.has(key)) {
      subjectMap.set(key, {
        subjectName: grade.subject.name,
        sortOrder: grade.subject.sortOrder,
        scores: { Q1: null, Q2: null, Q3: null, Q4: null },
      });
    }
    subjectMap.get(key)!.scores[grade.quarter as QuarterKey] = Number(grade.score);
  }

  const subjects = Array.from(subjectMap.values())
    .sort((a, b) => a.sortOrder - b.sortOrder || a.subjectName.localeCompare(b.subjectName))
    .map((entry) => {
      const scoreValues = QUARTERS.map((quarter) => entry.scores[quarter]).filter(
        (value): value is number => value !== null
      );
      return {
        subjectName: entry.subjectName,
        scores: entry.scores,
        finalAverage: average(scoreValues),
      };
    });

  const generalAverage = average(
    subjects.map((subject) => subject.finalAverage).filter((value): value is number => value !== null)
  );

  const attendance = student.attendance
    .slice()
    .sort((a, b) => QUARTERS.indexOf(a.quarter as QuarterKey) - QUARTERS.indexOf(b.quarter as QuarterKey))
    .map((entry) => ({
      quarter: entry.quarter as QuarterKey,
      schoolDaysTotal: entry.schoolDaysTotal,
      daysPresent: entry.daysPresent,
      daysAbsent: entry.daysAbsent,
      daysTardy: entry.daysTardy,
    }));

  const valuesMap = new Map<
    string,
    { coreValue: string; behaviorStatement: string; ratingsByQuarter: Partial<Record<QuarterKey, string>> }
  >();
  for (const entry of student.values) {
    const key = `${entry.coreValue}|${entry.behaviorStatement}`;
    if (!valuesMap.has(key)) {
      valuesMap.set(key, {
        coreValue: entry.coreValue,
        behaviorStatement: entry.behaviorStatement,
        ratingsByQuarter: {},
      });
    }
    valuesMap.get(key)!.ratingsByQuarter[entry.quarter as QuarterKey] = entry.rating;
  }

  const remarks = student.remarks.map((remark) => ({
    quarter: remark.quarter as QuarterKey | null,
    text: remark.text,
  }));

  return {
    student: {
      fullName: student.fullName,
      lrn: student.lrn,
      gradeLevel: student.gradeLevel,
      section: student.section,
    },
    school: school
      ? { name: school.name, address: school.address, logoUrl: school.logoUrl, schoolYear: school.schoolYear }
      : null,
    subjects,
    generalAverage,
    attendance,
    values: Array.from(valuesMap.values()),
    remarks,
  };
}
