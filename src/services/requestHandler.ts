import axios, { AxiosResponse } from "axios";
import { z } from "zod";
import axiosInstance from "./axios.config";
import { handleMessages } from "src/utils/notify";

export const errorSchema = z.object({
  code: z.string().min(1).or(z.number()),
  message: z.string().min(1),
});

type BaseError = z.infer<typeof errorSchema>;

type ErrorResponse<E = BaseError> = {
  code: "error";
  error: E;
};

type SuccessResponse<T = unknown> = {
  code: "success";
  data: T;
};

type RequestCallback = () => Promise<AxiosResponse>;
type RequestParseCallback<T = unknown> = (e: unknown) => T;
type RequestReturn<T = unknown> = Promise<SuccessResponse<T> | ErrorResponse>;

const doRequest = async <T>(
  request: RequestCallback,
  parser: RequestParseCallback<T>,
): RequestReturn<T> => {
  try {
    const response = await request();
    if (response.data.success === true) {
      return { code: "success", data: response.data };
    }
    const parsed = parser(response.data);

    return { code: "success", data: parsed };
  } catch (error: unknown) {
    let code: string | number = "unknown_error";
    let message = "An error has occurred!";

    if (axios.isAxiosError(error)) {
      const isValidError = errorSchema.safeParse(error.response?.data);

      if (isValidError.success) {
        code = isValidError.data.code;
        message = isValidError.data.message;
      }

      if (error?.response) {
        const { data, status } = error?.response as any;
        if (data && status !== 422) {
          const message = data?.message;
          const arrayMessages = Object.values(message);
          if (arrayMessages && arrayMessages.length > 0) {
            handleMessages({
              message: arrayMessages.shift() as string,
              color: "red",
              icon: "close",
            });
          }
        } else {
          const { data } = error?.response as any;
          if (data && data.message) {
            handleMessages({
              message: data.message,
              color: "red",
              icon: "close",
            });
          }
        }
      }
    }

    return {
      code: "error",
      error: { code, message },
    };
  }
};

export const doGet = async <T>(
  path: string,
  parser: RequestParseCallback<T>,
  payload?: any,
) => {
  const response = await doRequest(
    () => axiosInstance.get(path, { params: payload }),
    parser,
  );
  return response;
};

export const doPost = async <T>(
  path: string,
  body: FormData | Record<string, unknown>,
  parser: RequestParseCallback<T>,
) => {
  const config =
    body instanceof FormData
      ? { headers: { "Content-Type": "multipart/form-data" } }
      : {};

  return doRequest(() => axiosInstance.post(path, body, config), parser);
};

export const doRequestFormData = async <T>(
  axiosCall: () => Promise<AxiosResponse>,
  parser: RequestParseCallback<T>
): Promise<T> => {
  try {
    const response = await axiosCall();
    
   
    return parser(response.data);
  } catch (error) {
    // Manejo de errores
    if (axios.isAxiosError(error)) {
      const errorData = error.response?.data || error.message;
      throw new Error(errorData);
    }
    throw error;
  }
};

export const doPut = async <T>(
  path: string,
  body: FormData | Record<string, unknown>,
  parser: RequestParseCallback<T>,
) => {
  const config =
    body instanceof FormData
      ? { headers: { "Content-Type": "multipart/form-data" } }
      : {};

  return doRequest(
    () =>
      axiosInstance.post(path, body, {
        ...config,
        headers: {
          ...config.headers,
          "X-HTTP-Method-Override": "PUT",
        },
      }),
    parser,
  );
};

export const doPatch = async <T>(
  path: string,
  body: Record<string, unknown>,
  parser: RequestParseCallback<T>,
) => {
  return doRequest(() => axiosInstance.patch(path, body), parser);
};

export const doDelete = async <T>(
  path: string,
  parser: RequestParseCallback<T>,
) => {
  return doRequest(() => axiosInstance.delete(path), parser);
};
