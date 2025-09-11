import { doGet, doPost, doPut } from "./requestHandler";
import {
    CitiesSelectResponse,
    CityGetResponse,
    CityResponse,
    citiesSelectResponseSchema,
    cityResponseSchema,
    cityGetSchema
} from "src/schemas/cities.schema";

export const getCitiesSelectReq = async () => {
    return await doGet<CitiesSelectResponse>(
        "/cities/select",
        citiesSelectResponseSchema.parse 
    );
};

export const createCityReq = async (payload: { 
    name: string; 
    country_id: number 
}) => {
    return await doPost<CityResponse>(
        "/cities",
        payload,
        cityResponseSchema.parse 
    );
};

export const updateCityReq = async (
    id: string | number, 
    payload: { name: string; country_id: number }
) => {
    return await doPut<CityGetResponse>(
        `/cities/${id}`,
        payload,
        cityGetSchema.parse 
    );
};