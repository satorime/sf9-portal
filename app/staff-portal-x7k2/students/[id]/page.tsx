import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getStudentCardData } from "@/lib/sf9";
import { CardFront } from "@/components/sf9/CardFront";
import { CardBack } from "@/components/sf9/CardBack";
import { ConfirmForm } from "@/components/admin/ConfirmForm";
import { deleteStudent, resetStudentPassword } from "@/app/actions/admin-students";
import { EditStudentForm } from "./EditStudentForm";

export default async function AdminStudentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const student = await prisma.student.findUnique({ where: { id } });
  if (!student) notFound();

  const cardData = await getStudentCardData(id);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">{student.fullName}</h1>
        <div className="flex gap-2">
          <ConfirmForm
            action={resetStudentPassword}
            confirmMessage={`Reset ${student.fullName}'s password back to their LRN? They will be required to set a new password on next login.`}
          >
            <input type="hidden" name="studentId" value={student.id} />
            <button
              type="submit"
              className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-900"
            >
              Reset Password to LRN
            </button>
          </ConfirmForm>
          <ConfirmForm
            action={deleteStudent}
            confirmMessage={`Delete ${student.fullName}? This permanently removes their grades, attendance, and values records. This cannot be undone.`}
          >
            <input type="hidden" name="studentId" value={student.id} />
            <button
              type="submit"
              className="rounded-md border border-red-300 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-950"
            >
              Delete
            </button>
          </ConfirmForm>
        </div>
      </div>

      {student.mustChangePassword && (
        <p className="rounded-md bg-amber-50 px-4 py-2 text-sm text-amber-800 dark:bg-amber-950 dark:text-amber-300">
          This student has not set a permanent password yet — they log in with their LRN as the password.
        </p>
      )}

      <section className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
        <h2 className="mb-4 text-sm font-semibold text-zinc-900 dark:text-zinc-50">Edit Details</h2>
        <EditStudentForm student={student} />
      </section>

      {cardData && (
        <section className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
          <h2 className="mb-4 text-sm font-semibold text-zinc-900 dark:text-zinc-50">SF9 Preview</h2>
          <div className="space-y-8">
            <CardFront data={cardData} />
            <CardBack data={cardData} />
          </div>
        </section>
      )}
    </div>
  );
}
