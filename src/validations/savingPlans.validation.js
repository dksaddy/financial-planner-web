import { z } from "zod";

export const createSavingPlanSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(100, "Name cannot exceed 100 characters"),

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