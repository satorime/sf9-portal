import type { StudentCardData } from "@/lib/sf9";

const QUARTERS = ["Q1", "Q2", "Q3", "Q4"] as const;

export function CardBack({ data }: { data: StudentCardData }) {
  return (
    <div className="space-y-8">
      <section>
        <h3 className="mb-3 text-sm font-semibold text-zinc-900 dark:text-zinc-50">Attendance</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-zinc-200 text-left text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
                <th className="py-2 pr-4">Quarter</th>
                <th className="px-2 py-2 text-center">School Days</th>
                <th className="px-2 py-2 text-center">Present</th>
                <th className="px-2 py-2 text-center">Absent</th>
                <th className="px-2 py-2 text-center">Tardy</th>
              </tr>
            </thead>
            <tbody>
              {data.attendance.map((entry) => (
                <tr key={entry.quarter} className="border-b border-zinc-100 dark:border-zinc-900">
                  <td className="py-2 pr-4 text-zinc-900 dark:text-zinc-50">{entry.quarter}</td>
                  <td className="px-2 py-2 text-center text-zinc-700 dark:text-zinc-300">
                    {entry.schoolDaysTotal}
                  </td>
                  <td className="px-2 py-2 text-center text-zinc-700 dark:text-zinc-300">
                    {entry.daysPresent}
                  </td>
                  <td className="px-2 py-2 text-center text-zinc-700 dark:text-zinc-300">
                    {entry.daysAbsent}
                  </td>
                  <td className="px-2 py-2 text-center text-zinc-700 dark:text-zinc-300">
                    {entry.daysTardy}
                  </td>
                </tr>
              ))}
              {data.attendance.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-zinc-400">
                    No attendance recorded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h3 className="mb-3 text-sm font-semibold text-zinc-900 dark:text-zinc-50">Core Values</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-zinc-200 text-left text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
                <th className="py-2 pr-4">Core Value</th>
                <th className="py-2 pr-4">Behavior Statement</th>
                {QUARTERS.map((quarter) => (
                  <th key={quarter} className="px-2 py-2 text-center">
                    {quarter}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.values.map((entry) => (
                <tr
                  key={`${entry.coreValue}-${entry.behaviorStatement}`}
                  className="border-b border-zinc-100 dark:border-zinc-900"
                >
                  <td className="py-2 pr-4 text-zinc-900 dark:text-zinc-50">{entry.coreValue}</td>
                  <td className="py-2 pr-4 text-zinc-700 dark:text-zinc-300">{entry.behaviorStatement}</td>
                  {QUARTERS.map((quarter) => (
                    <td key={quarter} className="px-2 py-2 text-center text-zinc-700 dark:text-zinc-300">
                      {entry.ratingsByQuarter[quarter] ?? "—"}
                    </td>
                  ))}
                </tr>
              ))}
              {data.values.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-zinc-400">
                    No values ratings recorded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h3 className="mb-3 text-sm font-semibold text-zinc-900 dark:text-zinc-50">Remarks</h3>
        {data.remarks.length === 0 ? (
          <p className="text-sm text-zinc-400">No remarks recorded.</p>
        ) : (
          <ul className="space-y-2 text-sm">
            {data.remarks.map((remark, index) => (
              <li key={index} className="rounded-md bg-zinc-50 px-3 py-2 dark:bg-zinc-900">
                <span className="font-medium text-zinc-700 dark:text-zinc-300">
                  {remark.quarter ?? "General"}:
                </span>{" "}
                <span className="text-zinc-600 dark:text-zinc-400">{remark.text}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
