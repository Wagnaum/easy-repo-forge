import { api } from "@/lib/api"

export interface GetUsersQuery {
  pageIndex?: number | null
  filter?: string | null
  status?: string | null
  role?: string | null
}

export interface GetUserResponse {
  id: string
  email: string
  name: string
  document: string
  emailVerified: boolean,
  role: string
  fee: number,
  status:
  | 'PENDING'
  | 'WAITING_INDIVIDUAL'
  | 'WAITING_ADDRESS'
  | 'WAITING_DOCUMENT'
  | 'WAITING_ANALYSIS'
  | 'IN_ANALYSIS'
  | 'APPROVED'
  | 'REJECTED'
  | 'PRE_APPROVED'
  | 'REJECTED_KYC'
  | 'BLOCKED'
  createdAt: string
  isLoading: boolean
}

export interface GetUsersResponse {
  data: GetUserResponse[]
  pagination: {
    totalItems: number
    currentPage: number
    itemsPerPage: number
    totalPages: number
  }
}

export async function getUsers({ pageIndex, filter, status, role }: GetUsersQuery) {
  const response = await api.get<GetUsersResponse>('/users/list', {
    params: {
      page: pageIndex ?? 0,
      filter: filter ?? null,
      status: status ?? null,
      type: role ?? null
    },
  })

  return response.data
}