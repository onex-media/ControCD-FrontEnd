import { doPost, doPut } from "./requestHandler";
import {
  creditGetSchema,
  creditResponseSchema,
} from "../schemas/credit.schema";
import { clientResponseSchema } from "src/schemas/client.schema";
import { CreditGetResponse } from "@/types/credits.types";
import { ClientGetResponse } from "@/types/clients.types";

export const createMemberReq = async (payload: ClientGetResponse) => {
  const createCreditPost = async (payload: ClientGetResponse) => {
    return await doPost<any>(
      "/user/create",
      payload,
      clientResponseSchema.parse,
    );
  };

  return {
    createCreditPost,
  };
};

export const createCreditReq = async (payload: any) => {
  return await doPost("/credit/create", payload, (response) =>
    clientResponseSchema.parse(response),
  );
};

export const updateCreditReq = async (id: string | number, payload: any) => {
  return await doPut<any>(`/credits/${id}`, payload, creditGetSchema.parse);
};
