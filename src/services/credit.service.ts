import { doPost } from "./requestHandler";
import { createCreditResponseSchema } from "../schemas/credit.schema";
import { clientResponseSchema } from "@/schemas/client.schema";
import { ClientGetResponse } from "@/types/clients.types";

export const createMemberReq = async (payload: ClientGetResponse) => {
  const createCreditPost = async (payload: ClientGetResponse) => {
    return await doPost<any>(
      "/user/create",
      payload,
      clientResponseSchema.parse
    );
  };

  return {
    createCreditPost,
  };
};
