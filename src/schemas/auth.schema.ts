import { z } from "zod";

export const loginResponse = z.object({
  access_token: z.string(),
  success: z.boolean(),
  token_type: z.string(),
  user: z.object({}),
});
