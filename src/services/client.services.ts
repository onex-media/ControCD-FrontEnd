import { doGet, doPost,doPut } from "./requestHandler";
import { clientResponseSchema, clientGetSchema } from 'src/schemas/client.schema';
import { any } from "zod";
import { ClientGetResponse } from 'src/types/clients.types';

export const createClientReq = async (payload: any) => {
    return await doPost(
        "/client/create",
        payload,
        (response) => clientResponseSchema.parse(response)
    );
};

export const updateClientReq = async (
    id: string | number,
    payload: any,
  ) => {
    return await doPut<ClientGetResponse>(
      `/client/update/${id}`,
      payload,
      clientGetSchema.parse
    );
  };

export const getClientReq = async () => {
    const response = await doGet<ClientGetResponse>("/clients", clientGetSchema.parse);
    return response;
};

