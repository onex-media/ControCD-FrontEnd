import { loginPayload, User } from "src/types/auth.types";
import { doPost } from "./requestHandler";
import { loginResponse } from "src/schemas/auth.schema";

export const loginReq = (payload: loginPayload) => {
  return doPost<User>("/login", payload, loginResponse.parse);
};
