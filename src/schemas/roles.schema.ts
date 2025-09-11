import { z } from "zod";

const rolesSchema = z.object({
    id: z.number(),
    name: z.string(),
    guard_name: z.string(),
});

export const rolesRespondeSchema = z.object({
    success: z.boolean(),
    data: z.array(rolesSchema),
});

export type rolesResponse = z.infer<typeof rolesRespondeSchema>;
