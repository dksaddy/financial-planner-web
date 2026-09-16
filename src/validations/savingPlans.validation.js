import { z } from "zod";

import { existingPassword, name } from "./fields";

export const createSavingPlanSchema = z.object({
  name,

  amount: z.coerce
    .number({ invalid_type_error: "Enter a valid amount" })
    .positive("Amount must be greater than 0"),

  frequency: z.coerce
    .number({ invalid_type_error: "Enter a valid frequency" })
    .int("Frequency must be a whole number of days")
    .positive("Frequency must be greater than 0"),

  months: z.coerce
    .number({ invalid_type_error: "Enter a valid duration" })
    .int("Months must be a whole number")
    .positive("Months must be greater than 0"),

  depositAmount: z.coerce
    .number({ invalid_type_error: "Enter a valid deposit amount" })
    .min(0, "Deposit amount can't be negative"),

  depositFrequency: z.coerce
    .number({ invalid_type_error: "Enter a valid deposit frequency" })
    .int("Deposit frequency must be a whole number of days")
    .positive("Deposit frequency must be greater than 0"),

  withdrawalAmount: z.coerce
    .number({ invalid_type_error: "Enter a valid withdrawal amount" })
    .min(0, "Withdrawal amount can't be negative"),
});

export const depositSavingPlanSchema = z.object({
  amount: z.coerce
    .number({ invalid_type_error: "Enter a valid amount" })
    .positive("Amount must be greater than 0"),
});

// Mirrors the API's `confirmationPassword`: presence only. The password being
// re-typed is an existing one, so the register schema's rules do not apply —
// and the only verdict that counts is the API's, which answers 403.
//
// The password is not part of the schemas above even though it travels in the
// same request body: the plan form and the confirmation are two separate
// forms in two separate modals, and validating each on its own is what lets
// the confirmation reopen with an error without disturbing the plan form.
export const confirmPasswordSchema = z.object({
  password: existingPassword,
});