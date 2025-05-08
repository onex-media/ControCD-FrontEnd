import { z } from "zod";

const citySchema = z.object({
    id: z.number(),
    name: z.string(),
});

export const citiesSelectResponseSchema = z.object({
    success: z.boolean(),
    data: z.array(citySchema),
});

export type citiesSelectResponse = z.infer<typeof citiesSelectResponseSchema>;
