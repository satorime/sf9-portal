import { prisma } from "@/lib/prisma";

export async function getSchool() {
  return prisma.school.findFirst({ orderBy: { createdAt: "asc" } });
}
