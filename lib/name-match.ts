function normalizeName(name: string): string[] {
  return name
    .toLowerCase()
    .replace(/[.,]/g, "")
    .split(/\s+/)
    .filter(Boolean)
    .sort();
}

// Flexible, order-independent name matching: a student may type "Juan Dela Cruz"
// while the roster stores "Dela Cruz Juan A." (whatever order/middle initial the
// admin imported). Every word the student typed must appear in the stored name,
// and at least two words must match so a single shared first name isn't enough.
export function namesMatch(input: string, stored: string): boolean {
  const inputWords = normalizeName(input);
  const storedWords = normalizeName(stored);
  if (inputWords.length < 2) return false;

  const matchedCount = inputWords.filter((word) => storedWords.includes(word)).length;
  return matchedCount === inputWords.length;
}
