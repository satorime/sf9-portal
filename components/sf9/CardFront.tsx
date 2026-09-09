import type { StudentCardData } from "@/lib/sf9";

const QUARTERS = ["Q1", "Q2", "Q3", "Q4"] as const;

export function CardFront({ data }: { data: StudentCardData }) {
  return (
    <div className="space-y-6">
      <header className="flex items-center gap-4 border-b border-zinc-200 pb-4 dark:border-zinc-800">
        {data.school?.logoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={data.school.logoUrl} alt="School logo" className="h-14 w-14 object-contain" />
        ) : null}
        <div>
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            {data.school?.name ?? "School"}
          </h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">{data.school?.address}</p>
          {data.school?.schoolYear && (
            <p className="text-xs text-zinc-500 dark:text-zinc-500">
              School Year {data.school.schoolYear}
            </p>
          )}
        </div>
      </header>

      <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm sm:grid-cols-4">
        <div>
          <dt className="text-zinc-500 dark:text-zinc-400">Name</dt>
          <dd className="font-medium text-zinc-900 dark:text-zinc-50">{data.student.fullName}</dd>
        </div>
        <div>
          <dt className="text-zinc-500 dark:text-zinc-400">LRN</dt>
          <dd className="font-medium text-zinc-900 dark:text-zinc-50">{data.student.lrn}</dd>
        </div>
        <div>
          <dt className="text-zinc-500 dark:text-zinc-400">Grade Level</dt>
          <dd className="font-medium text-zinc-900 dark:text-zinc-50">
            {data.student.gradeLevel.replace("GRADE_", "Grade ")}
          </dd>
        </div>
        <div>
          <dt className="text-zinc-500 dark:text-zinc-400">Section</dt>
          <dd className="font-medium text-zinc-900 dark:text-zinc-50">{data.student.section}</dd>
        </div>
      </dl>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-zinc-200 text-left text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
              <th className="py-2 pr-4">Subject</th>
              {QUARTERS.map((quarter) => (
                <th key={quarter} className="px-2 py-2 text-center">
                  {quarter}
                </th>
              ))}
              <th className="py-2 pl-4 text-center">Final</th>
            </tr>
          </thead>
          <tbody>
            {data.subjects.map((subject) => (
              <tr key={subject.subjectName} className="border-b border-zinc-100 dark:border-zinc-900">
                <td className="py-2 pr-4 text-zinc-900 dark:text-zinc-50">{subject.subjectName}</td>
                {QUARTERS.map((quarter) => (
                  <td key={quarter} className="px-2 py-2 text-center text-zinc-700 dark:text-zinc-300">
                    {subject.scores[quarter] ?? "—"}
                  </td>
                ))}
                <td className="py-2 pl-4 text-center font-medium text-zinc-900 dark:text-zinc-50">
                  {subject.finalAverage ?? "—"}
                </td>
              </tr>
            ))}
            {data.subjects.length === 0 && (
              <tr>
                <td colSpan={6} className="py-6 text-center text-zinc-400">
                  No grades recorded yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between rounded-md bg-blue-50 px-4 py-3 dark:bg-blue-950">
        <span className="text-sm font-medium text-blue-900 dark:text-blue-200">General Average</span>
        <span className="text-lg font-semibold text-blue-900 dark:text-blue-100">
          {data.generalAverage ?? "—"}
        </span>
      </div>
    </div>
  );
}
