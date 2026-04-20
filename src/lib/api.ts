import axios, { isAxiosError, HeadersDefaults } from "axios";

export interface CommonHeaderProperties extends HeadersDefaults {
  Authorization: string;
  account: string;
  client: string;
}

export type ErrorType = {
  code: string;
  friend: string;
};

interface ResponseError {
  code: string;
  message: string;
}

export function parseError(err: unknown): ResponseError {
  if (isAxiosError(err)) {
    return {
      code: err.response?.data?.code,
      message: err.response?.data?.message,
    };
  }

  return {
    code: "unexpected",
    message: "Unexpected error",
  };
}

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "https://production.herobank.com.br",
});
