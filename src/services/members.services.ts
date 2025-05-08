import {
  createMemberPayload,
  createMemberResponse,
  deleteMemberResponse,
  membersResponse,
  membersSelectResponse,
  updateMemberPayload,
  updateMemberResponse,
} from "src/types/members.types";
import { doDelete, doGet, doPost, doPut } from "./requestHandler";
import {
  createMemberResponseSchema,
  deleteMemberResponseSchema,
  membersResponseSchema,
  updateMemberResponseSchema,
  membersSelectResponseSchema,
} from "src/schemas/members.schema";
import { any } from "zod";

export const createMemberReq = async (payload: createMemberPayload) => {
  return await doPost<createMemberResponse>(
    "/user/create",
    payload,
    createMemberResponseSchema.parse
  );
};

export const getMembersReq = async (payload: any) => {
  const response = await doGet<membersResponse>("/users", membersResponseSchema.parse, payload);
  return response;
};

export const getMembersSelectReq = async () => {
  return await doGet<membersSelectResponse>(
    "/users/select",
    membersSelectResponseSchema.parse
  );
};

export const updateMemberReq = async (
  payload: updateMemberPayload,
  id: string | number
) => {
  return await doPut<updateMemberResponse>(
    `/user/update/${id}`,
    payload,
    updateMemberResponseSchema.parse
  );
};

export const deleteMemberReq = async (id: string | number) => {
  return await doDelete<deleteMemberResponse>(
    `user/delete/${id}`,
    deleteMemberResponseSchema.parse
  );
};

export const getUserReq = async (userId: string | number) => {
  const response = await doGet<membersResponse>(`/user/${userId}`, any as any);
  return response;
};

export const toggleMemberStatusReq = async (userId: string | number, status: string) => {
  return await doPut<any>(
    `/user/toggle-status/${userId}`,
    { status },
    any as any
  );
};
