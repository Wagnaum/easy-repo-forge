import { api } from "@/lib/api"

export interface GetWithdrawRequestsQuery {
  accountId: string
  pageIndex?: number | null
  filter?: string | null
  status?: string | null
}

export interface GetWithdrawRequestResponse {
  id: string
  type: string
  status: string
  justification: string
  plataform: string | null
  login: string | null
  password: string | null
  amount: number
  receivedAmount: number | null
  createdAt: string
  withdrawRequestPartial: {
    id: string
    amount: number
    status: string
    createdAt: string
    updatedAt: string
  }[]
}

// export interface GetWithdrawRequestsResponse {
//   data: GetWithdrawRequestResponse[]
//   pagination: {
//     totalItems: number
//     currentPage: number
//     itemsPerPage: number
//     totalPages: number
//   }
// }

export interface GetWithdrawRequestsResponse {
  withdrawRequest: GetWithdrawRequestResponse[]
}

export async function getWithdrawRequests({
  accountId,
  pageIndex,
  status,
  filter }: GetWithdrawRequestsQuery) {
  const response = await api.get<GetWithdrawRequestsResponse>(`/accounts/${accountId}/withdraw-request`, {
    params: {
      page: pageIndex ?? 0,
      type: status ?? null,
      filter: filter ?? null,
    },
  })

  return response.data
}