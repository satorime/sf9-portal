import { z } from "zod";

const gradeLevelEnum = z.enum(["GRADE_7", "GRADE_8", "GRADE_9", "GRADE_10"]);
const lrnField = z
  .string()
  .trim()
  .length(12, "LRN must be exactly 12 digits")
  .regex(/^\d{12}$/, "LRN must contain only digits");

export const createStudentSchema = z.object({
  lrn: lrnField,
  fullName: z.string().trim().min(1, "Full name is required"),
  gradeLevel: gradeLevelEnum,
  section: z.string().trim().min(1, "Section is required"),
});

export type CreateStudentInput = z.infer<typeof createStudentSchema>;

export const updateStudentSchema = z.object({
  studentId: z.string().min(1),
  fullName: z.string().trim().min(1, "Full name is required"),
  gradeLevel: gradeLevelEnum,
  section: z.string().trim().min(1, "Section is required"),
});

export type UpdateStudentInput = z.infer<typeof updateStudentSchema>;
