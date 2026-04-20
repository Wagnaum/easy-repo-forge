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
    }
  }

  return {
    code: "unexpected",
    message: "Unexpected error",
  };
}

export const api = axios.create({
  // baseURL: "http://localhost:3000",
  baseURL: "https://production.herobank.com.br",
});


// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (axios.isAxiosError(error)) {
//       // console.log(error.response?.data)
//       // console.log(error.config?.headers)
//       // console.log(error.config?.url)
//       // console.log(error.response?.status)

//       // if (error?.response?.config?.method === 'get' && error?.response?.status === 401) {
//       //   window.location.href = '/signout'
//       //   return Promise.resolve()
//       // }

//       // if (error?.response?.config?.method === 'post' && error.response?.config?.url !== '/users/pre-authenticate' && error.response?.config?.url !== '/users/uthenticate') {
//       //   window.location.href = '/signout'
//       //   return Promise.resolve()
//       // }


//       // if (error.response?.config?.url !== '/users/pre-authenticate' && error.response?.config?.url !== '/users/uthenticate') {
//       //   if (error.response?.status === 401) {
//       //     window.location.href = '/signout'
//       //     return Promise.resolve()
//       //   }
//       // }


//     }
//     return Promise.reject(error)
//   },
// )