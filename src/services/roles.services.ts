import { doGet } from "./requestHandler";
import { rolesRespondeSchema, rolesResponse } from "src/schemas/roles.schema";

export const getRoles = async () => {
    return await doGet<rolesResponse>(
        "/roles",
        rolesRespondeSchema.parse
    );
};
