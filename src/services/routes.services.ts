import {
  createRoutePayload,
  createRouteResponse,
  deleteRouteResponse,
  routesResponse,
  updateRoutePayload,
  updateRouteResponse,
} from "../types/routes.type";
import { doDelete, doGet, doPost, doPut } from "./requestHandler";
import {
  createRouteResponseSchema,
  deleteRouteResponseSchema,
  routesResponseSchema,
  updateRouteResponseSchema,
} from "../schemas/routes.schema";
import { any } from "zod";

export const createRouteReq = async (payload: createRoutePayload) => {
  return await doPost<createRouteResponse>(
    "/route/create",
    payload,
    createRouteResponseSchema.parse
  );
};

export const getRoutesReq = async (payload: any) => {
  return await doGet<routesResponse>("/routes", routesResponseSchema.parse, payload);
};

export const updateRouteReq = async (
  payload: updateRoutePayload,
  id: string | number
) => {
  return await doPut<updateRouteResponse>(
    `/route/update/${id}`,
    payload,
    updateRouteResponseSchema.parse
  );
};

export const deleteRouteReq = async (id: string | number) => {
  return await doDelete<deleteRouteResponse>(
    `route/delete/${id}`,
    deleteRouteResponseSchema.parse
  );
};

export const toggleRouteStatusReq = async (userId: string | number, status: string) => {
  return await doPut<any>(
    `/routes/toggle-status/${userId}`,
    { status },
    any as any
  );
};
