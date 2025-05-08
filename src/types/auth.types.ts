import { loginResponse } from "@/schemas/auth.schema";
import { z } from "zod";

export type loginPayload = {
  email: string;
  password: string;
};

export interface UserInterface {
  id?: number;
  uuid?: string | null;
  name: string;
  email: string;
  email_verified_at?: string | null;
  dni?: string;
  phone?: string;
  address?: string;
  city_id?: number | null;
  parent_id?: number | null;
  role_id?: number;
  status?: string;
  deleted_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export type User = z.infer<typeof loginResponse>;
