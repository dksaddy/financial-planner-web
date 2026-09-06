// Postgres `date` columns serialize as date-only ISO strings (e.g.
// "2026-09-06"). `new Date("2026-09-06")` parses that as UTC midnight,
// which then renders as the previous day in any timezone behind UTC —
// the classic "date is one day off" bug. Reading the Y/M/D components
// directly and building a local Date from them sidesteps that shift.
export function parseLocalDate(date) {
  if (!date) return null;

  const datePart = String(date).slice(0, 10);
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(datePart);

  if (!match) {
    const fallback = new Date(date);
    return Number.isNaN(fallback.getTime()) ? null : fallback;
  }

  const [, year, month, day] = match;

  return new Date(Number(year), Number(month) - 1, Number(day));
}

// `new Date().toISOString()` converts to UTC first, so in any timezone
// ahead of UTC (e.g. Bangladesh, UTC+6) the early hours of a local day
// serialize as the previous day. Reading the local Y/M/D straight off
// the Date object avoids that shift for "today" defaults.
export function todayLocalDateString() {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}