import { z } from "zod";

const routeSchema = z.object({
  id: z.number(),
  name: z.string(),
  sector: z.string(),
  status: z.string(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export const createRouteResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: routeSchema,
});

const singleRouteSchema = z.object({
  id: z.number(),
  name: z.string(),
  sector: z.string(),
  status: z.string(),
  total_credits: z.number(),
  user_routes: z.array(
    z.object({
      user: z.object({
        id: z.number(),
        name: z.string(),
      }),
    })
  ),
});

const linkSchema = z.object({
  url: z.string().nullable(),
  label: z.string(),
  active: z.boolean(),
});

const dataSchema = z.object({
  current_page: z.number(),
  data: z.array(singleRouteSchema),
  first_page_url: z.string(),
  from: z.number().nullable(),
  last_page: z.number(),
  last_page_url: z.string(),
  links: z.array(linkSchema),
  next_page_url: z.string().nullable(),
});

export const routesResponseSchema = z.object({
  success: z.boolean(),
  data: dataSchema,
});

const routeDataSchema = z.object({
  id: z.number(),
  uuid: z.string().nullable(),
  name: z.string(),
  sector: z.string(),
  status: z.string(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export const updateRouteResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: routeDataSchema,
});

export const deleteRouteResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});
