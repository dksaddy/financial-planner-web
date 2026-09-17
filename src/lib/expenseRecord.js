import { getUser } from "@/lib/auth";

// A week holds one expense record per working day, counted Saturday to Friday
// — the API refuses the one past that. The rule is enforced there, where the
// week can actually be counted; this only states it under the date field, so
// it is not learned from a rejected submission.
//
// The figure comes from the cached user, which carries `working_days_per_week`
// from login onwards. A cookie written by an older version may not, and the
// note is dropped rather than shown with a guess.
export const weeklyRecordRule = () => {
  const days = getUser()?.working_days_per_week;

  if (!days) return null;

  return `Up to ${days} records a week (Sat–Fri) — your working days`;
};
