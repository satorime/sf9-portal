import { redirect } from "next/navigation";
import { getStudentSession } from "@/lib/session";
import { SetPasswordForm } from "./SetPasswordForm";

export default async function SetPasswordPage() {
  const session = await getStudentSession();
  if (!session) redirect("/login");

  return (
    <div className="flex flex-1 items-center justify-center bg-zinc-50 px-4 py-12 dark:bg-black">
      <div className="w-full max-w-md rounded-xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">Set Your Password</h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          For security, please choose a permanent password to replace your LRN.
        </p>
        <SetPasswordForm />
      </div>
    </div>
  );
}
