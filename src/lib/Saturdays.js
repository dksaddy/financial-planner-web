// Saturdays left from `from` (today counts if it is one) through the last day
// of `endMonth` in `endYear`. `endMonth` is 0-based, like Date.
export function saturdaysUntil(from = new Date(), endYear = 2027, endMonth = 6) {
  const start = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  const end = new Date(endYear, endMonth + 1, 0); // last day of the month

  if (start > end) return 0;

  // Jump to the first Saturday on/after `start` (getDay(): Sat = 6), then
  // every Saturday after it is exactly 7 days apart.
  const toFirst = (6 - start.getDay() + 7) % 7;
  const first = new Date(start);
  first.setDate(start.getDate() + toFirst);

  if (first > end) return 0;

  const days = Math.round((end - first) / 86400000);
  return Math.floor(days / 7) + 1;
}