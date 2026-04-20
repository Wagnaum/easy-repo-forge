import { api } from "@/lib/api"

export interface GetZeroRateQuery {
  pageIndex?: number | null
  type?: string | null
  status?: string | null
}

export interface GetZeroRateResponse {
  id: string
  amount: number
  type: string
  plataform: string
  login: string
  password: string
  justification: string
  status:
  | 'PENDING'
  | 'CANCELED'
  | 'WAITING_ANALYSIS'
  | 'PROCESSING'
  | 'APPROVED'
  | 'APPROVED_WITH_FEE'
  | 'REJECTED',
  account: {
    id: string
    name: string
    document: string
    user: {
      id: string
      name: string
      email: string
    }
  }
  createdAt: string
}

export interface GetZeroRatesResponse {
  data: GetZeroRateResponse[]
  pagination: {
    totalItems: number
    currentPage: number
    itemsPerPage: number
    totalPages: number
  }
}

export async function getZeroRate({ pageIndex, status, type }: GetZeroRateQuery) {
  const response = await api.get<GetZeroRatesResponse>('/accounts/withdraw-requests', {
    params: {
      page: pageIndex ?? 0,
      type: type ?? null,
      status: status ?? null,
    },
  })

  return response.data
}