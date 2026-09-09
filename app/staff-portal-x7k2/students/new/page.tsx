import Link from "next/link";
import { NewStudentForm } from "./NewStudentForm";

export default function NewStudentPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/staff-portal-x7k2/students"
          className="text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
        >
          ← Students
        </Link>
      </div>
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">Add Student</h1>
      <div className="max-w-2xl rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
        <NewStudentForm />
      </div>
    </div>
  );
}
