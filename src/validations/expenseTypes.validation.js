import { z } from "zod";

const categorySchema = z.object({
  name: z
    .string()
    .min(1, "Required"),

  amount: z.coerce
    .number({ invalid_type_error: "Enter a valid amount" })
    .nonnegative("Cannot be negative"),
});

export const createExpenseTypeSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(100, "Name cannot exceed 100 characters"),

  categories: z
    .array(categorySchema)
    .min(1, "Add at least one category"),
});