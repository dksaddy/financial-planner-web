import { z } from "zod";

// `toISOString()` converts to UTC before slicing, which reports "yesterday"
// for part of the day whenever the browser's zone is ahead of UTC (Asia/Dhaka,
// +6, for the first six hours after local midnight). Build the string from the
// local year, month and day instead, so "today" always means the day on the
// user's own clock.
export const todayDateString = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export const createExpenseRecordSchema = z.object({
  expense_type_id: z
    .string()
    .min(1, "Please select an expense type"),

  date: z
    .string()
    .min(1, "Date is required")
    // A record says what was spent, so it is never dated ahead. The date field
    // carries the same day as its `max`, which stops a picker from offering
    // one; this catches a date typed straight into the field, which `max` does
    // not. The API refuses a future date too, with a day of slack for the zone
    // it cannot know — here the clock is the user's own, so it is exact.
    .refine(
      (value) => value <= todayDateString(),
      "An expense record cannot be dated in the future"
    ),
});
