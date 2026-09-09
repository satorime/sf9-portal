import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/session";
import { ProfileForm } from "./ProfileForm";

export default async function AdminProfilePage() {
  const session = await getAdminSession();
  if (!session) redirect("/staff-portal-x7k2/login");

  const admin = await prisma.admin.findUnique({ where: { id: session.sub } });
  if (!admin) redirect("/staff-portal-x7k2/login");

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">Profile</h1>

      <div className="max-w-lg space-y-6">
        <section className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
          <h2 className="mb-1 text-sm font-semibold text-zinc-900 dark:text-zinc-50">Account</h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Signed in as <span className="font-medium text-zinc-900 dark:text-zinc-50">{admin.username}</span>
          </p>
        </section>

        <section className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
          <h2 className="mb-4 text-sm font-semibold text-zinc-900 dark:text-zinc-50">Change Password</h2>
          <ProfileForm />
        </section>
      </div>
    </div>
  );
}
