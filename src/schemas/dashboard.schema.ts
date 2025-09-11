import { z, any } from "zod";

const counterSchema = z.object({
  credits: z.number(),
  members: z.number(),
  routes: z.number(),
});

export const counterResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: counterSchema,
});
