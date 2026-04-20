import { api } from "@/lib/api";

export type DocumentUploadType = "SELFIE" | "FRONT" | "VERSE";

export type DocumentType =
  | "RG"
  | "RG_FULL"
  | "CNH"
  | "CNH_FULL"
  | "CNH_DIGITAL"
  | "PASSPORT"
  | "RNE";

export interface UploadOwemDocumentParams {
  accountId: string;
  type: DocumentUploadType;
  documentType?: DocumentType;
  file: File;
}

export interface UploadOwemDocumentResponse {
  accountStatus: string;
  documentsStatus: {
    selfie: boolean;
    front: boolean;
    verse: boolean;
    needsVerse: boolean;
  };
  documentType?: string;
}

export async function uploadOwemDocument({
  accountId,
  type,
  documentType,
  file,
}: UploadOwemDocumentParams): Promise<UploadOwemDocumentResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const params = new URLSearchParams();
  params.append("type", type);
  if (documentType) {
    params.append("documentType", documentType);
  }

  const response = await api.post<UploadOwemDocumentResponse>(
    `/accounts/${accountId}/owem/documents?${params.toString()}`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );

  return response.data;
}

// Tipos de documento que NÃO precisam do verso
export const SINGLE_PAGE_DOCUMENTS: DocumentType[] = [
  "RG_FULL",
  "CNH_FULL",
  "CNH_DIGITAL",
  "PASSPORT",
];

export function needsVerseDocument(documentType: DocumentType): boolean {
  return !SINGLE_PAGE_DOCUMENTS.includes(documentType);
}
