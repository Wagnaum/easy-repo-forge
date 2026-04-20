import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toastStyle } from "@/utils/toast-style";
import {
  DocumentType,
  DocumentUploadType,
  needsVerseDocument,
  uploadOwemDocument,
} from "@/api/upload-owem-document";
import { Check, Loader2, Upload } from "lucide-react";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { parseError } from "@/lib/api";

interface DocumentsStatus {
  selfie: boolean;
  front: boolean;
  verse: boolean;
  needsVerse: boolean;
}

interface OwemDocumentUploadProps {
  accountId: string;
  initialDocumentsStatus?: DocumentsStatus;
  initialDocumentType?: string;
  onComplete: () => void;
}

const DOCUMENT_TYPE_OPTIONS: { value: DocumentType; label: string }[] = [
  { value: "RG", label: "RG (frente e verso)" },
  { value: "RG_FULL", label: "RG Aberto (documento único)" },
  { value: "CNH", label: "CNH (frente e verso)" },
  { value: "CNH_FULL", label: "CNH Aberta (documento único)" },
  { value: "CNH_DIGITAL", label: "CNH Digital (PDF)" },
  { value: "PASSPORT", label: "Passaporte" },
  { value: "RNE", label: "RNE (frente e verso)" },
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const ALLOWED_PDF_TYPES = ["application/pdf"];

export function OwemDocumentUpload({
  accountId,
  initialDocumentsStatus,
  initialDocumentType,
  onComplete,
}: OwemDocumentUploadProps) {
  const [documentType, setDocumentType] = useState<DocumentType | undefined>(
    initialDocumentType as DocumentType | undefined
  );
  const [documentsStatus, setDocumentsStatus] = useState<DocumentsStatus>(
    initialDocumentsStatus || {
      selfie: false,
      front: false,
      verse: false,
      needsVerse: true,
    }
  );
  const [isUploading, setIsUploading] = useState<DocumentUploadType | null>(null);

  const selfieInputRef = useRef<HTMLInputElement | null>(null);
  const frontInputRef = useRef<HTMLInputElement | null>(null);
  const verseInputRef = useRef<HTMLInputElement | null>(null);

  const needsVerse = documentType ? needsVerseDocument(documentType) : true;

  const isComplete = documentsStatus.selfie && documentsStatus.front && 
    (needsVerse ? documentsStatus.verse : true);

  function validateFile(file: File, type: DocumentUploadType): boolean {
    // Validar tamanho
    if (file.size > MAX_FILE_SIZE) {
      toast.error("O arquivo deve ter no máximo 10MB.", toastStyle.error);
      return false;
    }

    // Validar tipo
    const allowedTypes =
      documentType === "CNH_DIGITAL" && type === "FRONT"
        ? [...ALLOWED_IMAGE_TYPES, ...ALLOWED_PDF_TYPES]
        : ALLOWED_IMAGE_TYPES;

    if (!allowedTypes.includes(file.type)) {
      const allowedExtensions =
        documentType === "CNH_DIGITAL" && type === "FRONT"
          ? "JPG, PNG, WebP ou PDF"
          : "JPG, PNG ou WebP";
      toast.error(
        `Só é permitido arquivos do tipo ${allowedExtensions}.`,
        toastStyle.error
      );
      return false;
    }

    return true;
  }

  async function handleUpload(type: DocumentUploadType, file: File) {
    if (!validateFile(file, type)) {
      return;
    }

    // Para FRONT, precisa ter selecionado o tipo de documento
    if (type === "FRONT" && !documentType) {
      toast.error("Selecione o tipo de documento primeiro.", toastStyle.error);
      return;
    }

    try {
      setIsUploading(type);
      const response = await uploadOwemDocument({
        accountId,
        type,
        documentType: type === "FRONT" ? documentType : undefined,
        file,
      });

      setDocumentsStatus(response.documentsStatus);

      // Verificar se completou todos os uploads
      const uploadComplete =
        response.documentsStatus.selfie &&
        response.documentsStatus.front &&
        (response.documentsStatus.needsVerse
          ? response.documentsStatus.verse
          : true);

      if (uploadComplete) {
        toast.success("Documentos enviados com sucesso!", toastStyle.success);
        onComplete();
      } else {
        toast.success(`${getUploadTypeName(type)} enviado com sucesso!`, toastStyle.success);
      }
    } catch (err) {
      const error = parseError(err);
      toast.error(error.message, toastStyle.error);
    } finally {
      setIsUploading(null);
    }
  }

  function getUploadTypeName(type: DocumentUploadType): string {
    switch (type) {
      case "SELFIE":
        return "Selfie";
      case "FRONT":
        return "Frente do documento";
      case "VERSE":
        return "Verso do documento";
    }
  }

  function handleFileChange(
    type: DocumentUploadType,
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];
    if (file) {
      handleUpload(type, file);
    }
    // Limpar input para permitir selecionar o mesmo arquivo novamente
    event.target.value = "";
  }

  function renderUploadButton(
    type: DocumentUploadType,
    inputRef: React.RefObject<HTMLInputElement | null>,
    isCompleted: boolean,
    disabled: boolean = false
  ) {
    const isCurrentlyUploading = isUploading === type;
    const label = getUploadTypeName(type);

    return (
      <div className="flex items-center justify-between p-4 border rounded-lg">
        <div className="flex items-center gap-3">
          {isCompleted ? (
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
              <Check className="w-5 h-5 text-green-600" />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
              <Upload className="w-5 h-5 text-gray-500" />
            </div>
          )}
          <div>
            <p className="font-medium">{label}</p>
            <p className="text-sm text-gray-500">
              {isCompleted ? "Enviado" : "Pendente"}
            </p>
          </div>
        </div>
        <div>
          <input
            type="file"
            ref={inputRef}
            className="hidden"
            accept={
              documentType === "CNH_DIGITAL" && type === "FRONT"
                ? ".jpg,.jpeg,.png,.webp,.pdf"
                : ".jpg,.jpeg,.png,.webp"
            }
            onChange={(e) => handleFileChange(type, e)}
            disabled={disabled || isCurrentlyUploading}
          />
          <Button
            type="button"
            variant={isCompleted ? "outline" : "default"}
            size="sm"
            disabled={disabled || isCurrentlyUploading}
            onClick={() => inputRef.current?.click()}
          >
            {isCurrentlyUploading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Enviando...
              </>
            ) : isCompleted ? (
              "Reenviar"
            ) : (
              "Enviar"
            )}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Card className="mx-auto max-w-xl w-full">
      <CardHeader>
        <CardTitle className="text-xl">Envio de Documentos</CardTitle>
        <CardDescription>
          Envie os documentos abaixo para validar sua conta
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Seleção do tipo de documento */}
          <div className="space-y-2">
            <Label htmlFor="document-type">Tipo de documento</Label>
            <Select
              value={documentType}
              onValueChange={(value) => setDocumentType(value as DocumentType)}
              disabled={documentsStatus.front}
            >
              <SelectTrigger id="document-type">
                <SelectValue placeholder="Selecione o tipo de documento" />
              </SelectTrigger>
              <SelectContent>
                {DOCUMENT_TYPE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {documentsStatus.front && (
              <p className="text-xs text-gray-500">
                Tipo de documento já definido. Para alterar, entre em contato com o suporte.
              </p>
            )}
          </div>

          {/* Upload de Selfie */}
          <div className="space-y-2">
            <Label>1. Selfie</Label>
            {renderUploadButton("SELFIE", selfieInputRef, documentsStatus.selfie)}
          </div>

          {/* Upload da Frente */}
          <div className="space-y-2">
            <Label>2. Frente do documento</Label>
            {renderUploadButton(
              "FRONT",
              frontInputRef,
              documentsStatus.front,
              !documentType
            )}
            {!documentType && (
              <p className="text-xs text-amber-600">
                Selecione o tipo de documento primeiro
              </p>
            )}
          </div>

          {/* Upload do Verso (condicional) */}
          {needsVerse && (
            <div className="space-y-2">
              <Label>3. Verso do documento</Label>
              {renderUploadButton(
                "VERSE",
                verseInputRef,
                documentsStatus.verse,
                !documentsStatus.front
              )}
              {!documentsStatus.front && (
                <p className="text-xs text-amber-600">
                  Envie a frente do documento primeiro
                </p>
              )}
            </div>
          )}

          {/* Status geral */}
          <div className="pt-4 border-t">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Status do envio:</span>
              <span
                className={`font-medium ${
                  isComplete ? "text-green-600" : "text-amber-600"
                }`}
              >
                {isComplete
                  ? "Completo - Aguardando análise"
                  : `${
                      [
                        documentsStatus.selfie,
                        documentsStatus.front,
                        needsVerse ? documentsStatus.verse : null,
                      ].filter((v) => v === true).length
                    }/${needsVerse ? 3 : 2} documentos enviados`}
              </span>
            </div>
          </div>

          {/* Dicas */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm font-medium text-blue-900 mb-2">
              Dicas para um bom envio:
            </p>
            <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
              <li>Tire fotos em ambiente bem iluminado</li>
              <li>Evite reflexos e sombras</li>
              <li>Certifique-se que todas as informações estão legíveis</li>
              <li>Tamanho máximo: 10MB por arquivo</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
