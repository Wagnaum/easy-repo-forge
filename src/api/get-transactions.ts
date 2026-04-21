import { api } from "@/lib/api"

export interface GetTransactionsQuery {
  accountId: string
  pageIndex?: number | null
}

export interface GetTransactionResponse {
  id: string
  credit: boolean
  amount: number
  type: string
  status: string
  description: string
  beneficiaryName: string
  beneficiaryDocument: string
  beneficiaryBankName: string
  beneficiaryBankCode: string
  beneficiaryBranch: string
  beneficiaryAccount: string
  beneficiaryAccountType: string
  consignorName: string
  consignorDocument: string
  consignorBankName: string
  consignorBankCode: string
  consignorBranch: string
  consignorAccount: string
  consignorAccountType: string
  createdAt: string
}

export interface GetTransactionsResponse {
  data: GetTransactionResponse[]
  pagination: {
    totalItems: number
    currentPage: number
    itemsPerPage: number
    totalPages: number
  }
}

export async function getTransactions({ accountId, pageIndex }: GetTransactionsQuery) {
  const response = await api.get<GetTransactionsResponse>(`/accounts/${accountId}/transactions`, {
    params: {
      page: pageIndex ?? 0,
    },
  })

  return response.data
}

export interface GetGlobalTransactionsQuery {
  limit?: number
  orderBy?: "createdAt" | "amount"
  order?: "asc" | "desc"
  startAt?: string | Date
  endAt?: string | Date
}

export async function getGlobalTransactions({
  limit = 5,
  orderBy = "createdAt",
  order = "desc",
  startAt,
  endAt,
}: GetGlobalTransactionsQuery = {}) {
  const response = await api.get<{ data: GetTransactionResponse[] }>(`/transactions`, {
    params: { limit, orderBy, order, startAt, endAt },
  })

  return response.data
}
