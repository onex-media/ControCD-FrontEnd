import { loginResponse } from "@/schemas/auth.schema";
import { z } from "zod";

export type loginPayload = {
  email: string;
  password: string;
};

export type User = z.infer<typeof loginResponse>;
