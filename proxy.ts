import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE, STUDENT_COOKIE, verifySessionToken } from "@/lib/jwt";

const STUDENT_PROTECTED_PREFIXES = ["/card", "/set-password"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/staff-portal-x7k2") && pathname !== "/staff-portal-x7k2/login") {
    const token = request.cookies.get(ADMIN_COOKIE)?.value;
    const session = await verifySessionToken(token);
    if (session?.role !== "admin") {
      const loginUrl = new URL("/staff-portal-x7k2/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  if (STUDENT_PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    const token = request.cookies.get(STUDENT_COOKIE)?.value;
    const session = await verifySessionToken(token);
    if (session?.role !== "student") {
      const loginUrl = new URL("/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/staff-portal-x7k2/:path*", "/card/:path*", "/set-password/:path*"],
};
