import { z } from "zod";

import { name } from "./fields";

export const createTargetSchema = z.object({
  name,

  target_amount: z.coerce
    .number({ invalid_type_error: "Enter a valid amount" })
    .positive("Amount must be greater than 0"),
});

export const updateTargetSchema = z.object({
  name,

  target_amount: z.coerce
    .number({ invalid_type_error: "Enter a valid amount" })
    .positive("Amount must be greater than 0"),
});