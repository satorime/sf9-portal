import { z } from "zod";

const gradeLevelEnum = z.enum(["GRADE_7", "GRADE_8", "GRADE_9", "GRADE_10"]);
const quarterEnum = z.enum(["Q1", "Q2", "Q3", "Q4"]);
const valuesRatingEnum = z.enum(["AO", "SO", "RO", "NO"]);

const lrnField = z
  .string()
  .trim()
  .length(12, "LRN must be exactly 12 digits")
  .regex(/^\d{12}$/, "LRN must contain only digits");

// A quarter score column may be blank (student not yet graded for that quarter).
const optionalScore = z
  .string()
  .trim()
  .optional()
  .transform((value) => (value === undefined || value === "" ? undefined : Number(value)))
  .refine((value) => value === undefined || (Number.isFinite(value) && value >= 0 && value <= 100), {
    message: "Score must be a number between 0 and 100",
  });

export const gradeRowSchema = z.object({
  lrn: lrnField,
  fullName: z.string().trim().min(1, "Full name is required"),
  gradeLevel: gradeLevelEnum,
  section: z.string().trim().min(1, "Section is required"),
  subject: z.string().trim().min(1, "Subject is required"),
  q1: optionalScore,
  q2: optionalScore,
  q3: optionalScore,
  q4: optionalScore,
});

export type GradeRow = z.infer<typeof gradeRowSchema>;

export const attendanceRowSchema = z.object({
  lrn: lrnField,
  quarter: quarterEnum,
  schoolDaysTotal: z.coerce.number().int().min(0),
  daysPresent: z.coerce.number().int().min(0),
  daysAbsent: z.coerce.number().int().min(0),
  daysTardy: z.coerce.number().int().min(0).optional().default(0),
});

export type AttendanceRow = z.infer<typeof attendanceRowSchema>;

export const valuesRowSchema = z.object({
  lrn: lrnField,
  coreValue: z.string().trim().min(1, "Core value is required"),
  behaviorStatement: z.string().trim().min(1, "Behavior statement is required"),
  quarter: quarterEnum,
  rating: valuesRatingEnum,
});

export type ValuesRow = z.infer<typeof valuesRowSchema>;

export type SkippedRow = {
  row: number;
  lrn?: string;
  errors: string[];
};
