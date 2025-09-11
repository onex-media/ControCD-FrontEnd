import {
  deleteMemberResponseSchema,
  updateMemberResponseSchema,
} from "./../schemas/members.schema";
import {
  createMemberResponseSchema,
  membersResponseSchema,
  membersSelectResponseSchema,
} from "@/schemas/members.schema";
import { z } from "zod";

export type createMemberPayload = {
  name: string;
  email: string;
  dni: number;
  phone: number | null;
  address: string;
  city_id: number | null;
  password: string | undefined;
  routes: number[];
  department?: string;
  role_id: number | null;
};

export type updateMemberPayload = {
  name?: string;
  email?: string;
  dni?: number;
  city_id?: number | null;
  phone?: number | null;
  address?: string;
  password?: string | undefined;
  routes?: number[];
  role_id?: number | null;
};

interface MemberForm {
  name: string;
  email: string;
  identification: number | null;
  address: string;
  password: string | undefined;
  role_id: number | null;
  phone: number | null;
  routes: number[];
  active?: boolean;
  department?: string;
  city_id: number | null;
  status?: any;
}
interface DataMembers {
  current_page: number;
  data: {
    id: number;
    name: string;
    email: string;
    phone: string;
    address: string;
    dni: string;
  }[];
  first_page_url: string;
  from: number | null;
  last_page: number;
  last_page_url: string;
  links: {
    url: string | null;
    label: string;
    active: boolean;
  }[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number | null;
  total: number;
}

export type createMemberResponse = z.infer<typeof createMemberResponseSchema>;
export type membersResponse = {
  success: boolean;
  data: DataMembers;
};
export type updateMemberResponse = z.infer<typeof updateMemberResponseSchema>;
export type deleteMemberResponse = z.infer<typeof deleteMemberResponseSchema>;
export type membersSelectResponse = z.infer<typeof membersSelectResponseSchema>;

export type { MemberForm, DataMembers };
