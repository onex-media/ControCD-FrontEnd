import { doGet } from "./requestHandler";
import { citiesSelectResponse, citiesSelectResponseSchema } from "src/schemas/cities.schema";

export const getCitiesSelectReq = async () => {
    return await doGet<citiesSelectResponse>(
        "/cities/select",
        citiesSelectResponseSchema.parse
    );
};
