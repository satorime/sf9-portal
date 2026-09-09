"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { hashPassword, verifyPassword } from "@/lib/auth";
import { createStudentSession, getStudentSession } from "@/lib/session";
import { namesMatch } from "@/lib/name-match";
import { studentLoginSchema, setPasswordSchema } from "@/lib/validation/auth-schemas";
import type { ActionState } from "@/lib/action-state";

export async function loginStudent(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const parsed = studentLoginSchema.safeParse({
    fullName: formData.get("fullName"),
    lrn: formData.get("lrn"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const { fullName, lrn, password } = parsed.data;

  const student = await prisma.student.findUnique({ where: { lrn } });
  if (!student || !namesMatch(fullName, student.fullName)) {
    return { error: "No matching student found. Check your name and LRN." };
  }

  const passwordValid = await verifyPassword(password, student.passwordHash);
  if (!passwordValid) {
    return { error: "Incorrect password." };
  }

  await createStudentSession(student.id);
  redirect(student.mustChangePassword ? "/set-password" : "/card");
}

export async function setPassword(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const session = await getStudentSession();
  if (!session) {
    redirect("/login");
  }

  const parsed = setPasswordSchema.safeParse({
    newPassword: formData.get("newPassword"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const passwordHash = await hashPassword(parsed.data.newPassword);
  await prisma.student.update({
    where: { id: session.sub },
    data: { passwordHash, mustChangePassword: false, passwordSetAt: new Date() },
  });

  redirect("/card");
}
