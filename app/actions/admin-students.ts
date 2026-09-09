"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";
import { getAdminSession } from "@/lib/session";
import { createStudentSchema, updateStudentSchema } from "@/lib/validation/student-schema";
import type { ActionState } from "@/lib/action-state";

async function requireAdmin() {
  const session = await getAdminSession();
  if (!session) {
    throw new Error("Not authorized");
  }
  return session;
}

function isUniqueConstraintError(error: unknown): boolean {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002";
}

export async function createStudent(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin();

  const parsed = createStudentSchema.safeParse({
    lrn: formData.get("lrn"),
    fullName: formData.get("fullName"),
    gradeLevel: formData.get("gradeLevel"),
    section: formData.get("section"),
  });

  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const existing = await prisma.student.findUnique({ where: { lrn: parsed.data.lrn } });
  if (existing) {
    return { fieldErrors: { lrn: ["A student with this LRN already exists"] } };
  }

  let studentId: string;
  try {
    const passwordHash = await hashPassword(parsed.data.lrn);
    const student = await prisma.student.create({
      data: { ...parsed.data, passwordHash, mustChangePassword: true },
    });
    studentId = student.id;
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return { fieldErrors: { lrn: ["A student with this LRN already exists"] } };
    }
    return { error: "Could not create student. Please try again." };
  }

  revalidatePath("/staff-portal-x7k2/students");
  redirect(`/staff-portal-x7k2/students/${studentId}`);
}

export async function updateStudent(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin();

  const parsed = updateStudentSchema.safeParse({
    studentId: formData.get("studentId"),
    fullName: formData.get("fullName"),
    gradeLevel: formData.get("gradeLevel"),
    section: formData.get("section"),
  });

  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const { studentId, ...data } = parsed.data;

  try {
    await prisma.student.update({ where: { id: studentId }, data });
  } catch {
    return { error: "Could not save changes. The student may have been deleted." };
  }

  revalidatePath(`/staff-portal-x7k2/students/${studentId}`);
  revalidatePath("/staff-portal-x7k2/students");
  return { success: "Student details updated." };
}

export async function deleteStudent(formData: FormData) {
  await requireAdmin();

  const studentId = String(formData.get("studentId") ?? "");
  if (!studentId) return;

  try {
    await prisma.student.delete({ where: { id: studentId } });
  } catch (error) {
    // P2025 = record already gone — the desired end state is already true, so no-op.
    if (!(error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025")) {
      throw error;
    }
  }

  revalidatePath("/staff-portal-x7k2/students");
  redirect("/staff-portal-x7k2/students");
}

export async function resetStudentPassword(formData: FormData) {
  await requireAdmin();

  const studentId = String(formData.get("studentId") ?? "");
  if (!studentId) return;

  const student = await prisma.student.findUnique({ where: { id: studentId } });
  if (!student) return;

  const passwordHash = await hashPassword(student.lrn);
  await prisma.student.update({
    where: { id: studentId },
    data: { passwordHash, mustChangePassword: true, passwordSetAt: null },
  });

  revalidatePath(`/staff-portal-x7k2/students/${studentId}`);
}
