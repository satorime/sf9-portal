import { parse } from "csv-parse/sync";

export async function parseCsvFile(file: File): Promise<Record<string, string>[]> {
  const text = await file.text();
  return parse(text, {
    columns: true,
    trim: true,
    skip_empty_lines: true,
  }) as Record<string, string>[];
}
