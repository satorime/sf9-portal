import Link from "next/link";
import { AdminLoginForm } from "./AdminLoginForm";

export default function AdminLoginPage() {
  return (
    <div className="flex flex-1 items-center justify-center bg-zinc-50 px-4 py-12 dark:bg-black">
      <div className="w-full max-w-md rounded-xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">Admin Login</h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">SF9 Portal management</p>
        <AdminLoginForm />

        <div className="mt-6 border-t border-zinc-200 pt-4 text-center dark:border-zinc-800">
          <Link href="/login" className="text-xs text-zinc-500 hover:underline dark:text-zinc-400">
            ← Student login
          </Link>
        </div>
      </div>
    </div>
  );
}
