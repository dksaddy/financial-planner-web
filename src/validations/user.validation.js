import { z } from "zod";

import {
  email,
  existingPassword,
  name,
  newPassword,
} from "./fields";

// The API's updateProfileSchema marks every field optional (it accepts a
// partial patch), but the profile form always submits all three, so they are
// required here.
export const updateProfileSchema = z.object({
  name,

  email,

  salary: z.coerce
    .number()
    .min(0, "Salary cannot be negative"),
});

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
  });
