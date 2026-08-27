import { z } from "zod";

export const createExpenseRecordSchema = z.object({
  expense_type_id: z
    .string()
    .min(1, "Please select an expense type"),

  date: z
    .string()
    .min(1, "Date is required"),
});