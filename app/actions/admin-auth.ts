"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/auth";
import { createAdminSession } from "@/lib/session";
import { adminLoginSchema } from "@/lib/validation/auth-schemas";
import type { ActionState } from "@/lib/action-state";

export async function loginAdmin(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const parsed = adminLoginSchema.safeParse({
    username: formData.get("username"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const { username, password } = parsed.data;

  const admin = await prisma.admin.findUnique({ where: { username } });
  if (!admin) {
    return { error: "Invalid username or password." };
  }

  const passwordValid = await verifyPassword(password, admin.passwordHash);
  if (!passwordValid) {
    return { error: "Invalid username or password." };
  }

  await createAdminSession(admin.id);
  redirect("/staff-portal-x7k2");
}
