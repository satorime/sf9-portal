import { cookies } from "next/headers";
import {
  ADMIN_COOKIE,
  STUDENT_COOKIE,
  signSession,
  verifySessionToken,
  type SessionPayload,
} from "@/lib/jwt";

const COOKIE_BASE = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};

export async function createStudentSession(studentId: string) {
  const token = await signSession({ sub: studentId, role: "student" });
  const store = await cookies();
  store.set(STUDENT_COOKIE, token, {
    ...COOKIE_BASE,
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function createAdminSession(adminId: string) {
  const token = await signSession({ sub: adminId, role: "admin" });
  const store = await cookies();
  store.set(ADMIN_COOKIE, token, {
    ...COOKIE_BASE,
    maxAge: 60 * 60 * 24,
  });
}

export async function getStudentSession(): Promise<SessionPayload | null> {
  const store = await cookies();
  const session = await verifySessionToken(store.get(STUDENT_COOKIE)?.value);
  return session?.role === "student" ? session : null;
}

export async function getAdminSession(): Promise<SessionPayload | null> {
  const store = await cookies();
  const session = await verifySessionToken(store.get(ADMIN_COOKIE)?.value);
  return session?.role === "admin" ? session : null;
}

export async function clearStudentSession() {
  const store = await cookies();
  store.delete(STUDENT_COOKIE);
}

export async function clearAdminSession() {
  const store = await cookies();
  store.delete(ADMIN_COOKIE);
}
