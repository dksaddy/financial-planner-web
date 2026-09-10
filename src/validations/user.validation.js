import { z } from "zod";

// The API's updateProfileSchema marks every field optional (it accepts a
// partial patch), but the profile form always submits all three, so they are
// required here.
export const updateProfileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name cannot exceed 100 characters"),

  email: z
    .string()
    .email("Invalid email address"),

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
      { message: "Invalid photo" }
    ),
});

export const changePasswordSchema = z
  .object({
    oldPassword: z
      .string()
      .min(8, "Old password must be at least 8 characters"),

    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters"),

    confirmPassword: z
      .string()
      .min(8, "Confirm password must be at least 8 characters"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
