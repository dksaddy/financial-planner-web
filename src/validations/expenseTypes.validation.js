import { z } from "zod";

// A number input hands back a string, and the edit form resets with the
// numbers the API returned, so both arrive here. `z.coerce.number()` is not
// enough on its own: it turns "" into 0, so a blank Amount used to sail
// through and save a category worth nothing. Blank becomes undefined instead,
// which trips the required check; unparseable text is left as a string so it
// reports as a bad number rather than as missing.
const toAmount = (value) => {
  if (typeof value !== "string") return value;

  const trimmed = value.trim();

  if (trimmed === "") return undefined;

  const parsed = Number(trimmed);

  return Number.isNaN(parsed) ? trimmed : parsed;
};

const categorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Required"),

  amount: z.preprocess(
    toAmount,
    z
      .number({
        error: (issue) =>
          issue.input === undefined ? "Required" : "Enter a valid amount",
      })
      .positive("Must be greater than 0"),
  ),
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

// Same fields as create. The API additionally rejects the update when the
// categories no longer add up to the type's original total; the edit form
// blocks that before it is sent.
export const updateExpenseTypeSchema = createExpenseTypeSchema;