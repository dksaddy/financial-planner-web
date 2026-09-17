import { z } from "zod";

import {
  email,
  existingPassword,
  name,
  newPassword,
} from "./fields";
import {
  WORKING_DAYS_PER_MONTH_MAX,
  WORKING_DAYS_PER_MONTH_MIN,
  WORKING_DAYS_PER_WEEK_MAX,
  WORKING_DAYS_PER_WEEK_MIN,
} from "@/constants/limits";

const WORKING_DAYS_PER_MONTH_RANGE = `Working days per month must be between ${WORKING_DAYS_PER_MONTH_MIN} and ${WORKING_DAYS_PER_MONTH_MAX}`;
const WORKING_DAYS_PER_WEEK_RANGE = `Working days per week must be between ${WORKING_DAYS_PER_WEEK_MIN} and ${WORKING_DAYS_PER_WEEK_MAX}`;

// The API's updateProfileSchema marks every field optional (it accepts a
// partial patch), but the profile form always submits every field, so they are
// required here.
export const updateProfileSchema = z
  .object({
    name,

    email,

    salary: z.coerce
      .number()
      .min(0, "Salary cannot be negative"),

    working_days_per_month: z.coerce
      .number()
      .int("Working days per month must be a whole number")
      .min(WORKING_DAYS_PER_MONTH_MIN, WORKING_DAYS_PER_MONTH_RANGE)
      .max(WORKING_DAYS_PER_MONTH_MAX, WORKING_DAYS_PER_MONTH_RANGE),

    working_days_per_week: z.coerce
      .number()
      .int("Working days per week must be a whole number")
      .min(WORKING_DAYS_PER_WEEK_MIN, WORKING_DAYS_PER_WEEK_RANGE)
      .max(WORKING_DAYS_PER_WEEK_MAX, WORKING_DAYS_PER_WEEK_RANGE),
  })
  .refine(
    (data) => data.working_days_per_week <= data.working_days_per_month,
    {
      message: "Working days per week cannot exceed working days per month",
      path: ["working_days_per_week"],
    }
  );

// Mirrors the API's selectAvatarSchema. Nothing on the page types this — the
// name comes from a tile the user clicked — so it is a guard against a stale
// album entry rather than user input.
export const selectAvatarSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Photo is required")
    .refine(
      (value) =>
        !value.includes("/") &&
        !value.includes("\\") &&
        !value.includes(".."),
      { message: "Invalid image" }
    ),
});

export const changePasswordSchema = z
  .object({
    // Re-typed, so presence only; the API's bcrypt check is the verdict. The
    // confirmation only has to match the new one.
    oldPassword: existingPassword,

    newPassword,

    confirmPassword: z
      .string()
      .min(1, "Confirm password is required"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .refine((data) => data.newPassword !== data.oldPassword, {
    message: "New password must be different from the current password",
    path: ["newPassword"],
  });
