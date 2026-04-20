import { api } from "@/lib/api"

export interface GetStatisticsQuery {
  startAt?: string | Date
  endAt?: string | Date
}

export interface GetAccountStatisticsResponse {
  accounts: {
    numberOfAccounts: number,
    start: string
    end: string
    statistics: {
      date: string
      numberOfAccounts: number;
    }[]
  }
}

export interface GetWithdrawStatisticsResponse {
  withdraw: {
    start: string
    end: string
    totalGeneralAmount: number
    totalFreeAmount: number
    totalNormalAmount: number
    statistics: {
      date: string
      totalAmount: number
      freeAmount: number
      normalAmount: number
    }[]
  }
}

export async function getAccountStatistics({ startAt, endAt }: GetStatisticsQuery) {
  const response = await api.get<GetAccountStatisticsResponse>('/statistics', {
    params: {
      startAt: startAt,
      endAt: endAt,
      type: 'accounts'
    },
  })

  return response.data
}

export async function getWithdrawStatistics({ startAt, endAt }: GetStatisticsQuery) {
  const response = await api.get<GetWithdrawStatisticsResponse>('/statistics', {
    params: {
      startAt: startAt,
      endAt: endAt,
      type: 'withdraw'
    },
  })

  return response.data
}