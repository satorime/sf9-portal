"use client";

import { useState } from "react";
import type { StudentCardData } from "@/lib/sf9";
import { CardFront } from "./CardFront";
import { CardBack } from "./CardBack";

export function CardTabs({ data }: { data: StudentCardData }) {
  const [side, setSide] = useState<"front" | "back">("front");

  return (
    <div className="rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex border-b border-zinc-200 dark:border-zinc-800">
        <button
          type="button"
          onClick={() => setSide("front")}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
            side === "front"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-400"
          }`}
        >
          Front — Grades
        </button>
        <button
          type="button"
          onClick={() => setSide("back")}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
            side === "back"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-400"
          }`}
        >
          Back — Attendance &amp; Values
        </button>
      </div>
      <div className="p-6">{side === "front" ? <CardFront data={data} /> : <CardBack data={data} />}</div>
    </div>
  );
}
