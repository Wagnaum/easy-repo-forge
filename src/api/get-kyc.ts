import { api } from "@/lib/api"

export interface GetKycQuery {
  userId: string
}

export interface GetUserKycResponse {
  id: string
  email: string
  name: string
  document: string
  emailVerified: boolean
  role: string
  fee: number
  statusReason: string
  phone:string
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
  createdAt: string
}

export interface GetIndividualKycResponse {
  id: string
  userId: string
  birthDate: string
  documentNumber: string
  documentUf: string
  documentIssuing: string
  documentDateIssue: string
  documentExpiration: string
  motherName: string
  fatherName: string
  income: number
  publiclyExposedPerson: boolean
  nationality: string
  createdAt: string
  updated_at: string
}

export interface GetDocumentKycResponse {
  id: string
  userId: string
  type: string
  status: string
  filename: string
  ocr: object
  createdAt: string
  updatedAt: string
  url: string
}

export interface GetKycDataBasicResponse {
  id: string
  userId: string
  document: string
  name: string
  motherName: string
  documentStatus: string
  birthdate: string
  hasObitIndication: boolean | null
  emails: {
    Primary: {
      Type: string
      Domain: string
      UserName: string
      EmailAddress: string
      LastUpdateDate: string
    },
    Secondary: {
      Type: string
      Domain: string
      UserName: string
      EmailAddress: string
      LastUpdateDate: string
    }
  }
  addresses: {
    Primary: {
      City: string
      Type: string
      State: string
      Title: string
      Number: string
      Country: string
      ZipCode: string
      Typology: string
      Complement: string
      AddressMain: string
      Neighborhood: string
      ComplementType: string
      LastUpdateDate: string
    },
    Secondary: {
      City: string
      Type: string
      State: string
      Title: string
      Number: string
      Country: string
      ZipCode: string
      Typology: string
      Complement: string
      AddressMain: string
      Neighborhood: string
      ComplementType: string
      LastUpdateDate: string
    }
  }
  phones: {
    Primary: {
      Type: string
      Number: string
      AreaCode: string
      Complement: string
      CountryCode: string
      LastUpdateDate: string
      PhoneNumberOfEntities: number
    },
    Secondary: {
      Type: string
      Number: string
      AreaCode: string
      Complement: string
      CountryCode: string
      LastUpdateDate: string
      PhoneNumberOfEntities: number
    }
  }
  created_at: string
  updated_at: string
}

export interface GetKycProcessesResponse {
  id: string
  userId: string
  number: string
  type: string
  status: string
  mainSubject: string
  courtName: string
  judge?: string
  judgingBody: string
  otherSubjects: string[]
  parties: Party[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  updates: any[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  decisions: any[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  petitions: any[]
  inferredCNJ_subject_name: string
  inferredCNJ_subject_number: string
  inferredCNJ_procedure_type_name: string
  inferredBroad_CNJ_subject_name: string
  InferredBroad_CNJ_subject_number: number
  createdAt: string
  updatedAt: string
}

export interface Party {
  Doc?: string
  Name: string
  Type: string
  Polarity: string
  IsInference?: boolean
  PartyDetails: PartyDetails
  IsPartyActive: boolean
  LastCaptureDate: string
}

export interface PartyDetails {
  SpecificType: string
  OAB?: string
  State?: string
}

export interface GetKycAddressResponse {
  id: string;
  userId: string;
  street: string;
  number: string;
  complement: string | null;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  latitude: string | null;
  longitude: string | null;
  createdAt: Date;
  updatedAt: Date;
}


export interface GetKycResponse {
  user: GetUserKycResponse
  individual: GetIndividualKycResponse
  documents: GetDocumentKycResponse[]
  address: GetKycAddressResponse
  kycDataBasic: GetKycDataBasicResponse
  kycProcesses: GetKycProcessesResponse[]
}

export async function getKyc({ userId }: GetKycQuery) {
  const response = await api.get<GetKycResponse>(`/kyc/${userId}`)

  return response.data
}