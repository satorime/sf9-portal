import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ConfirmForm } from "@/components/admin/ConfirmForm";
import { deleteStudent } from "@/app/actions/admin-students";

export default async function AdminStudentsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;

  const students = await prisma.student.findMany({
    where: q
      ? {
          OR: [
            { fullName: { contains: q, mode: "insensitive" } },
            { lrn: { contains: q } },
            { section: { contains: q, mode: "insensitive" } },
          ],
        }
      : undefined,
    orderBy: { fullName: "asc" },
    take: 200,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">Students</h1>
        <Link
          href="/staff-portal-x7k2/students/new"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          + Add Student
        </Link>
      </div>

      <form className="flex gap-2">
        <input
          type="text"
          name="q"
          defaultValue={q}
          placeholder="Search by name, LRN, or section"
          className="w-full max-w-sm rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
        />
        <button
          type="submit"
          className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-900"
        >
          Search
        </button>
      </form>

      <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-zinc-50 dark:bg-zinc-900">
            <tr className="text-left text-zinc-500 dark:text-zinc-400">
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">LRN</th>
              <th className="px-4 py-2">Grade</th>
              <th className="px-4 py-2">Section</th>
              <th className="px-4 py-2">Password</th>
              <th className="px-4 py-2" />
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id} className="border-t border-zinc-100 dark:border-zinc-900">
                <td className="px-4 py-2">
                  <Link
                    href={`/staff-portal-x7k2/students/${student.id}`}
                    className="font-medium text-blue-600 hover:underline"
                  >
                    {student.fullName}
                  </Link>
                </td>
                <td className="px-4 py-2 text-zinc-700 dark:text-zinc-300">{student.lrn}</td>
                <td className="px-4 py-2 text-zinc-700 dark:text-zinc-300">
                  {student.gradeLevel.replace("GRADE_", "")}
                </td>
                <td className="px-4 py-2 text-zinc-700 dark:text-zinc-300">{student.section}</td>
                <td className="px-4 py-2">
                  {student.mustChangePassword ? (
                    <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                      Pending
                    </span>
                  ) : (
                    <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-800 dark:bg-green-950 dark:text-green-300">
                      Set
                    </span>
                  )}
                </td>
                <td className="px-4 py-2 text-right">
                  <ConfirmForm
                    action={deleteStudent}
                    confirmMessage={`Delete ${student.fullName}? This permanently removes their grades, attendance, and values records. This cannot be undone.`}
                  >
                    <input type="hidden" name="studentId" value={student.id} />
                    <button type="submit" className="text-xs text-red-600 hover:underline">
                      Delete
                    </button>
                  </ConfirmForm>
                </td>
              </tr>
            ))}
            {students.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-zinc-400">
                  No students found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
