import { z } from "zod";

import {
  NAME_MAX,
  NAME_MIN,
  PASSWORD_MIN,
} from "@/constants/limits";

// Mirrors `financial-planner-api/src/validations/fields.js`: a field more than
// one form collects is defined once, so it is held to the same rule and shows
// the same message on every form.

export const name = z
  .string()
  .trim()
  .min(NAME_MIN, `Name must be at least ${NAME_MIN} characters`)
  .max(NAME_MAX, `Name cannot exceed ${NAME_MAX} characters`);

export const email = z
  .string()
  .trim()
  .toLowerCase()
  .email("Invalid email address");

// A password being chosen: register, and the new one on a password change.
export const newPassword = z
  .string()
  .min(PASSWORD_MIN, `Password must be at least ${PASSWORD_MIN} characters`);

// An existing password being re-typed: login, the old one on a password
// change, and every saving-plan confirmation. Presence only — the API's
// bcrypt check is the verdict.
export const existingPassword = z
  .string()
  .min(1, "Password is required");
