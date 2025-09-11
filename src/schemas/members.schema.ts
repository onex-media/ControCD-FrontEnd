import { z } from "zod";

const memberSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  dni: z.number(),
  phone: z.number(),
  address: z.string(),
  updated_at: z.string().datetime(),
  created_at: z.string().datetime(),
  id: z.number(),
  parent_id: z.number(),
});

export const createMemberResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: memberSchema,
});

const singleMemberSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
  phone: z.string(),
  address: z.string(),
  dni: z.string(),
});

const linkSchema = z.object({
  url: z.string().nullable(),
  label: z.string(),
  active: z.boolean(),
});

const membersSelectSchema = z.array(
  z.object({
    id: z.number(),
    name: z.string(),
  })
);

const membersDataSchema = z.object({
  current_page: z.number(),
  data: z.array(singleMemberSchema),
  first_page_url: z.string(),
  from: z.number().nullable(),
  last_page: z.number(),
  last_page_url: z.string(),
  links: z.array(linkSchema),
  next_page_url: z.string().nullable(),
  path: z.string(),
  per_page: z.number(),
  prev_page_url: z.string().nullable(),
  to: z.number().nullable(),
  total: z.number(),
});

export const membersResponseSchema = z.object({
  success: z.boolean(),
  data: membersDataSchema,
});

export const membersSelectResponseSchema = z.object({
  success: z.boolean(),
  data: membersSelectSchema,
});

const memberDataSchema = z.object({
  id: z.number(),
  uuid: z.string().nullable(),
  name: z.string(),
  email: z.string().email(),
  email_verified_at: z.string().nullable(),
  dni: z.string(),
  phone: z.string(),
  address: z.string(),
  department_id: z.number().nullable(),
  city_id: z.number().nullable(),
  parent_id: z.number(),
  deleted_at: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const updateMemberResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: memberDataSchema,
});

export const deleteMemberResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});
