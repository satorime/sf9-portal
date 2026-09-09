"use server";

import { redirect } from "next/navigation";
import { clearAdminSession, clearStudentSession } from "@/lib/session";

export async function logoutStudent() {
  await clearStudentSession();
  redirect("/login");
}

export async function logoutAdmin() {
  await clearAdminSession();
  redirect("/staff-portal-x7k2/login");
}
