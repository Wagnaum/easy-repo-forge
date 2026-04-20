import { api } from "@/lib/api";

interface GetUserByInviteIdQuery {
  inviteId: string;
}


export interface GetUserByInviteIdResponse {
  user: {
    id: string
    email: string
    document: string
    name: string
    emailVerifiedAt: boolean
    role: string
    fee: number
    status: 'PENDING' | 'WAITING_INDIVIDUAL' | 'WAITING_ADDRESS' | 'WAITING_DOCUMENT' | 'WAITING_ANALYSIS' | 'APPROVED' | 'REJECTED' | 'PRE_APPROVED' | 'RECEJECTED_KYC' | 'IN_ANALYSIS'
  }
}

export async function getUserByInviteId({ inviteId }: GetUserByInviteIdQuery) {
  const response = await api.get<GetUserByInviteIdResponse>(`/users/invite/${inviteId}`);

  return response.data
}


export interface GetAccountByInviteIdResponse {
  account: {
    id: string
    name: string
    document: string
    status: 'PENDING' | 'WAITING_INDIVIDUAL' | 'WAITING_ADDRESS' | 'WAITING_DOCUMENT' | 'WAITING_ANALYSIS' | 'APPROVED' | 'REJECTED' | 'PRE_APPROVED' | 'RECEJECTED_KYC' | 'IN_ANALYSIS'
    documentsStatus?: {
      selfie: boolean
      front: boolean
      verse: boolean
      needsVerse: boolean
    }
    documentType?: string
  }
}

export async function getAccountByInviteId({ inviteId }: GetUserByInviteIdQuery) {
  const response = await api.get<GetAccountByInviteIdResponse>(`/accounts/invite/${inviteId}`);

  return response.data
}