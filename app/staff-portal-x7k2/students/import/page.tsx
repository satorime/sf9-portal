"use client";

import { useState, type FormEvent } from "react";

type SkippedRow = { row: number; lrn?: string; errors: string[] };
type ImportResult = { importedCount: number; skippedRows: SkippedRow[] } | { error: string };

function UploadCard({
  title,
  description,
  endpoint,
  sampleColumns,
}: {
  title: string;
  description: string;
  endpoint: string;
  sampleColumns: string;
}) {
  const [result, setResult] = useState<ImportResult | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const fileInput = form.elements.namedItem("file") as HTMLInputElement;
    if (!fileInput.files?.[0]) return;

    const formData = new FormData();
    formData.set("file", fileInput.files[0]);

    setIsUploading(true);
    setResult(null);
    try {
      const response = await fetch(endpoint, { method: "POST", body: formData });
      const json = await response.json();
      setResult(json);
    } catch {
      setResult({ error: "Upload failed. Please try again." });
    } finally {
      setIsUploading(false);
      form.reset();
    }
  }

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
      <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">{title}</h2>
      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{description}</p>
      <p className="mt-2 overflow-x-auto rounded-md bg-zinc-50 px-3 py-2 font-mono text-xs whitespace-nowrap text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400">
        {sampleColumns}
      </p>

      <form onSubmit={handleSubmit} className="mt-4 flex items-center gap-3">
        <input type="file" name="file" accept=".csv" required className="text-sm" />
        <button
          type="submit"
          disabled={isUploading}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {isUploading ? "Uploading..." : "Upload"}
        </button>
      </form>

      {result && "error" in result && <p className="mt-3 text-sm text-red-600">{result.error}</p>}

      {result && "importedCount" in result && (
        <div className="mt-4 space-y-2">
          <p className="text-sm text-green-700 dark:text-green-400">
            Imported {result.importedCount} row(s).
          </p>
          {result.skippedRows.length > 0 && (
            <div className="overflow-x-auto rounded-md border border-amber-200 dark:border-amber-900">
              <table className="w-full border-collapse text-xs">
                <thead className="bg-amber-50 dark:bg-amber-950">
                  <tr className="text-left text-amber-800 dark:text-amber-300">
                    <th className="px-3 py-2">Row</th>
                    <th className="px-3 py-2">LRN</th>
                    <th className="px-3 py-2">Errors</th>
                  </tr>
                </thead>
                <tbody>
                  {result.skippedRows.map((skipped, index) => (
                    <tr key={index} className="border-t border-amber-100 dark:border-amber-900">
                      <td className="px-3 py-2">{skipped.row || "—"}</td>
                      <td className="px-3 py-2">{skipped.lrn ?? "—"}</td>
                      <td className="px-3 py-2">{skipped.errors.join("; ")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function AdminImportPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">Import Data</h1>
      <UploadCard
        title="Grades &amp; Roster"
        description="One row per student per subject. Creates students and subjects automatically. New students get their LRN as a temporary password."
        endpoint="/api/admin/students/import"
        sampleColumns="lrn,fullName,gradeLevel,section,subject,q1,q2,q3,q4"
      />
      <UploadCard
        title="Attendance"
        description="Requires students to already exist — import Grades & Roster first."
        endpoint="/api/admin/attendance/import"
        sampleColumns="lrn,quarter,schoolDaysTotal,daysPresent,daysAbsent,daysTardy"
      />
      <UploadCard
        title="Core Values Ratings"
        description="Requires students to already exist — import Grades & Roster first."
        endpoint="/api/admin/values/import"
        sampleColumns="lrn,coreValue,behaviorStatement,quarter,rating"
      />
    </div>
  );
}
