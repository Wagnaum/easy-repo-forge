import { api } from "@/lib/api"

export interface GetGatewaysQuery {
  pageIndex?: number | null
  filter?: string | null
  status?: string | null
}

export interface GetGatewayResponse {
  id: string
  document: string
  name: string
  description: string
  isActive: boolean
  createdAt: string
  updatedAt: string

}

export interface GetGatewaysResponse {
  data: GetGatewayResponse[]
  pagination: {
    totalItems: number
    currentPage: number
    itemsPerPage: number
    totalPages: number
  }
}

export async function getGateways({ pageIndex, status, filter }: GetGatewaysQuery) {
  const response = await api.get<GetGatewaysResponse>('/gateways', {
    params: {
      page: pageIndex ?? 0,
      type: status ?? null,
      filter: filter ?? null,
    },
  })

  return response.data
}