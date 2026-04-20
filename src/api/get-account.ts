import { api } from "@/lib/api"

export interface GetAccountQuery {
  id: string
}

export interface GetAccountResponse {
  id: string
  userId: string
  type: string
  balance: number
  number: string
  document: string
  name: string
  withdraw: number,
  withdrawFree: number,
  status: string
  createdAt: string
  countAccounts: number
  user: {
    id: string
    name: string
    email: string
    fee: number
  }
}

export interface GetAccountsResponse {
  account: GetAccountResponse
  main: GetAccountResponse
  allAccounts: GetAccountResponse[]
}

export async function getAccount({ id }: GetAccountQuery) {
  const response = await api.get<GetAccountsResponse>(`/accounts/${id}`, {
    params: {
      page: 0,
    },
  })

  return response.data
}