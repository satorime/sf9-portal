"use server";

import { prisma } from "@/lib/prisma";
import { hashPassword, verifyPassword } from "@/lib/auth";
import { getAdminSession } from "@/lib/session";
import { changePasswordSchema } from "@/lib/validation/admin-schema";
import type { ActionState } from "@/lib/action-state";

export async function changeAdminPassword(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const session = await getAdminSession();
  if (!session) {
    return { error: "Not authorized." };
  }

  const parsed = changePasswordSchema.safeParse({
    currentPassword: formData.get("currentPassword"),
    newPassword: formData.get("newPassword"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const admin = await prisma.admin.findUnique({ where: { id: session.sub } });
  if (!admin) {
    return { error: "Not authorized." };
  }

  const currentValid = await verifyPassword(parsed.data.currentPassword, admin.passwordHash);
  if (!currentValid) {
    return { fieldErrors: { currentPassword: ["Current password is incorrect"] } };
  }

  const passwordHash = await hashPassword(parsed.data.newPassword);
  await prisma.admin.update({ where: { id: admin.id }, data: { passwordHash } });

  return { success: "Password updated successfully." };
}
