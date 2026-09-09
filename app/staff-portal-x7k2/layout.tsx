import Link from "next/link";
import { getAdminSession } from "@/lib/session";
import { logoutAdmin } from "@/app/actions/logout";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getAdminSession();

  // No session means this is /staff-portal-x7k2/login (the only route under this
  // section the proxy lets through unauthenticated) — render it without the admin chrome.
  if (!session) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <nav className="flex items-center gap-4 text-sm">
            <Link href="/staff-portal-x7k2" className="font-semibold text-zinc-900 dark:text-zinc-50">
              SF9 Admin
            </Link>
            <Link
              href="/staff-portal-x7k2/students"
              className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
            >
              Students
            </Link>
            <Link
              href="/staff-portal-x7k2/students/import"
              className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
            >
              Import
            </Link>
            <Link
              href="/staff-portal-x7k2/profile"
              className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
            >
              Profile
            </Link>
          </nav>
          <form action={logoutAdmin}>
            <button type="submit" className="text-sm text-zinc-500 hover:underline dark:text-zinc-400">
              Log out
            </button>
          </form>
        </div>
      </header>
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">{children}</main>
    </div>
  );
}
