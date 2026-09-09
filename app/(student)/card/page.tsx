import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getStudentSession } from "@/lib/session";
import { getStudentCardData } from "@/lib/sf9";
import { logoutStudent } from "@/app/actions/logout";
import { CardTabs } from "@/components/sf9/CardTabs";

export default async function StudentCardPage() {
  const session = await getStudentSession();
  if (!session) redirect("/login");

  // Forced password reset is enforced here from the database, not just hidden
  // in the UI — a stale/valid session cookie can't bypass an incomplete reset.
  const student = await prisma.student.findUnique({
    where: { id: session.sub },
    select: { mustChangePassword: true },
  });
  if (!student) redirect("/login");
  if (student.mustChangePassword) redirect("/set-password");

  const data = await getStudentCardData(session.sub);
  if (!data) redirect("/login");

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8">
      <div className="mb-4 flex items-center justify-end">
        <form action={logoutStudent}>
          <button type="submit" className="text-sm text-zinc-500 hover:underline dark:text-zinc-400">
            Log out
          </button>
        </form>
      </div>
      <CardTabs data={data} />
    </div>
  );
}
