import { z, any } from "zod";

const creditSchema = z.object({
  id: z.number(),
  creditValue: z.number(),
  interestRate: z.number(),
  installmentCount: z.number(),
  paymentFrequency: z.string(),
  excludedDays: z.array(z.string()),
  microInsurancePercentage: z.number(),
  microInsuranceAmount: z.number(),
  firstInstallmentDate: z.string(),
  creditId: z.number(),
  gallery_photos: z.array(z.string()).nullable(),
});

const imageSchema = z.object({
  id: z.number(),
  path: z.string(),
  type: z.string(),
  credit_id: z.number(),
  deleted_at: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
});

const creditDataSchema = z.object({
  current_page: z.number(),
  data: z.array(
    creditSchema.extend({
      deleted_at: z.string().nullable(),
      created_at: z.string(),
      updated_at: z.string(),
      guarantors: z.array(z.any()),
      images: z.array(imageSchema),
    }),
  ),
  first_page_url: z.string(),
  from: z.number(),
  last_page: z.number(),
  last_page_url: z.string(),
  links: z.array(
    z.object({
      url: z.string().nullable(),
      label: z.string(),
      active: z.boolean(),
    }),
  ),
  next_page_url: z.string().nullable(),
  path: z.string(),
  per_page: z.number(),
  prev_page_url: z.string().nullable(),
  to: z.number(),
  total: z.number(),
});

export const creditResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: creditSchema,
});

export const creditGetSchema = z.object({
  code: z.string(),
  data: z.object({
    success: z.boolean(),
    message: z.string(),
    data: creditDataSchema,
  }),
});

export type creditResponse = z.infer<typeof creditResponseSchema>;
