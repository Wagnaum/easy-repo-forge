import { api } from "@/lib/api"

export interface GetAccountKeysQuery {
  accountId: string
}

export interface GetAccountKeysResponse {
  accountId: string
  id: string
  key: string
  type: string
}

export interface GetAccountsResponse {
  data: GetAccountKeysResponse[]
  pagination: {
    totalItems: number
    currentPage: number
    itemsPerPage: number
    totalPages: number
  }
}

export async function getAccountKeys({ accountId }: GetAccountKeysQuery) {
  const response = await api.get<GetAccountsResponse>(`/accounts/${accountId}/keys`, {
    params: {
      page: 0,
    },
  })

  return response.data
}