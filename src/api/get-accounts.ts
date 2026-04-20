import { api } from "@/lib/api"

export interface GetAccountsQuery {
  pageIndex?: number | null
  filter?: string | null
  status?: string | null
}

export interface GetAccountResponse {
  id: string
  type: string
  balance: number
  number: string
  document: string
  name: string
  withdraw: number,
  withdrawFree: number,
  status: string
  kycLink: string
  rejectedReason: string
  trackName: string
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
  data: GetAccountResponse[]
  pagination: {
    totalItems: number
    currentPage: number
    itemsPerPage: number
    totalPages: number
  }
}

export async function getAccounts({ pageIndex, status, filter }: GetAccountsQuery) {
  const response = await api.get<GetAccountsResponse>('/accounts/list', {
    params: {
      page: pageIndex ?? 0,
      positiveBalance: status === 'positiveBalance' ? true : undefined,
      type: status !== 'positiveBalance' ? status : undefined,
      filter: filter ?? null,
    },
  })

  return response.data
}