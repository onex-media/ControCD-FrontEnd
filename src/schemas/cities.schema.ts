import { z } from "zod";

export const citySchema = z.object({
    id: z.number(),
    name: z.string(),
    country_id: z.number(),
    created_at: z.string(),
    updated_at: z.string(),
    country: z.object({
        id: z.number(),
        name: z.string()
    }).optional()
});

export const citiesSelectResponseSchema = z.object({
    success: z.boolean(),
    data: z.array(
        citySchema.pick({ id: true, name: true })
    )
});

export const cityResponseSchema = z.object({
    success: z.boolean(),
    message: z.string(),
    data: citySchema
});

const clientDataSchema = z.object({
    current_page: z.number(),
    data: z.array(citySchema.extend({
        created_at: z.string(),
        updated_at: z.string(),
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

export const citytGetSchema = z.object({
    code: z.string(),
    data: z.object({
        success: z.boolean(),
        message: z.string(),
        data: clientDataSchema,
    }),
});

export const cityGetSchema = z.object({
    code: z.string(),
    data: z.object({
        success: z.boolean(),
        message: z.string(),
        data: z.object({
            current_page: z.number(),
            data: z.array(citySchema),
            first_page_url: z.string(),
            from: z.number(),
            last_page: z.number(),
            last_page_url: z.string(),
            links: z.array(
                z.object({
                    url: z.string().nullable(),
                    label: z.string(),
                    active: z.boolean()
                })
            ),
            next_page_url: z.string().nullable(),
            path: z.string(),
            per_page: z.number(),
            prev_page_url: z.string().nullable(),
            to: z.number(),
            total: z.number()
        })
    })
});

export type CitytData = {
    current_page: number;
    data: Array<{
        id: number;
        name: string;
        country_id: number;
        country: {
            id: number;
            name: string;
        } | null;
      
    }>;
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
};

export type CitytGetResponse = {
    code: string;
    data: {
        success: boolean;
        message: string;
        data: CitytData;
    };
};

export type CitiesSelectResponse = z.infer<typeof citiesSelectResponseSchema>;
export type CityResponse = z.infer<typeof cityResponseSchema>;
export type CityGetResponse = z.infer<typeof cityGetSchema>;