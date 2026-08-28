import { z } from "zod";

export const depositSavingPlanSchema = z.object({
  amount: z.coerce
    .number({ invalid_type_error: "Enter a valid amount" })
    .positive("Amount must be greater than 0"),
});