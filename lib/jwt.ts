import { SignJWT, jwtVerify } from "jose";

export const STUDENT_COOKIE = "sf9_student_session";
export const ADMIN_COOKIE = "sf9_admin_session";

const STUDENT_SESSION_TTL = "7d";
const ADMIN_SESSION_TTL = "1d";

export type SessionRole = "admin" | "student";

export type SessionPayload = {
  sub: string;
  role: SessionRole;
};

function getSecretKey() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error("SESSION_SECRET environment variable is not set");
  }
  return new TextEncoder().encode(secret);
}

export async function signSession(
  payload: SessionPayload,
  ttl: string = payload.role === "admin" ? ADMIN_SESSION_TTL : STUDENT_SESSION_TTL
): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(ttl)
    .sign(getSecretKey());
}

export async function verifySessionToken(
  token: string | undefined
): Promise<SessionPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    if (
      typeof payload.sub === "string" &&
      (payload.role === "admin" || payload.role === "student")
    ) {
      return { sub: payload.sub, role: payload.role };
    }
    return null;
  } catch {
    return null;
  }
}
