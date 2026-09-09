import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboardPage() {
  const [studentCount, gradeCount] = await Promise.all([
    prisma.student.count(),
    prisma.grade.count(),
  ]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">Dashboard</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Students</p>
          <p className="mt-1 text-3xl font-semibold text-zinc-900 dark:text-zinc-50">{studentCount}</p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Grades Recorded</p>
          <p className="mt-1 text-3xl font-semibold text-zinc-900 dark:text-zinc-50">{gradeCount}</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-3">
        <Link
          href="/staff-portal-x7k2/students"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Manage Students
        </Link>
        <Link
          href="/staff-portal-x7k2/students/new"
          className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-900"
        >
          Add Student
        </Link>
        <Link
          href="/staff-portal-x7k2/students/import"
          className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-900"
        >
          Import CSV
        </Link>
        <Link
          href="/staff-portal-x7k2/profile"
          className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-900"
        >
          Profile
        </Link>
      </div>
    </div>
  );
}
