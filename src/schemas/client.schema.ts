import { z, any } from "zod";

const clientSchema = z.object({
    id: z.number(),
    name: z.string(),
    profile_photo: z.string().nullable(),
    gallery_photos: z.array(z.string()).nullable(),
    dni: z.string(),
    address: z.string(),
    geolocation: z.object({
        latitude: z.number(),
        longitude: z.number(),
    }),
    phone: z.string(),
    email: z.string().email().optional(),
    guarantorId: z.string().nullable().optional(),
});

const imageSchema = z.object({
    id: z.number(),
    path: z.string(),
    type: z.string(),
    client_id: z.number(),
    deleted_at: z.string().nullable(),
    created_at: z.string(),
    updated_at: z.string(),
});

const clientDataSchema = z.object({
    current_page: z.number(),
    data: z.array(clientSchema.extend({
        deleted_at: z.string().nullable(),
        created_at: z.string(),
        updated_at: z.string(),
        guarantors: z.array(z.any()),
        images: z.array(imageSchema),
    })),
    first_page_url: z.string(),
    from: z.number(),
    last_page: z.number(),
    last_page_url: z.string(),
    links: z.array(z.object({
        url: z.string().nullable(),
        label: z.string(),
        active: z.boolean(),
    })),
    next_page_url: z.string().nullable(),
    path: z.string(),
    per_page: z.number(),
    prev_page_url: z.string().nullable(),
    to: z.number(),
    total: z.number(),
});

export const clientResponseSchema = z.object({
    success: z.boolean(),
    message: z.string(),
    data: clientSchema,
});

export const clientGetSchema = z.object({
    code: z.string(),
    data: z.object({
        success: z.boolean(),
        message: z.string(),
        data: clientDataSchema,
    }),
});

export type clientResponse = z.infer<typeof clientResponseSchema>;
