import { getSchool } from "@/lib/school";
import { LoginForm } from "./LoginForm";

export default async function StudentLoginPage() {
  const school = await getSchool();

  return (
    <div className="flex flex-1 items-center justify-center bg-zinc-100 px-4 py-8 dark:bg-black">
      <div className="grid w-full max-w-4xl overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:grid-cols-2">
        <div className="flex flex-col items-center justify-center gap-4 bg-blue-950 px-8 py-12 text-center text-white">
          {school?.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={school.logoUrl}
              alt="School logo"
              className="h-24 w-24 rounded-full bg-white object-contain p-1"
            />
          ) : (
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white/10 text-3xl font-bold">
              {(school?.name ?? "SF9").charAt(0)}
            </div>
          )}
          <div>
            <h1 className="text-xl font-bold tracking-wide uppercase">
              {school?.name ?? "SF9 Portal"}
            </h1>
            <p className="mt-2 text-sm text-blue-100">Online Learner&apos;s Performance Report</p>
            {school?.schoolYear && (
              <p className="mt-1 text-xs text-blue-200">School Year {school.schoolYear}</p>
            )}
          </div>
        </div>

        <div className="px-8 py-10">
          {school?.logoUrl && (
            <div className="mb-3 flex items-center gap-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={school.logoUrl} alt="" aria-hidden="true" className="h-8 w-8 rounded-full object-contain" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={school.logoUrl} alt="" aria-hidden="true" className="h-8 w-8 rounded-full object-contain" />
            </div>
          )}

          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">Welcome, Student</h2>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Access your Learner&apos;s Performance Report (SF9)
          </p>

          <div className="mt-6">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}
