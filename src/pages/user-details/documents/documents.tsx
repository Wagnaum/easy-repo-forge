import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { UserStatusComponent } from "@/components/user-status";
import { ArrowRight, ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DocumentEmpty } from "./document-empty";
import { GetDocumentKycResponse, GetKycResponse } from "@/api/get-kyc";

interface UserBasicDataProps {
  data: GetKycResponse | undefined;
}

const DocumentStatus = {
  ACTIVE: "Aprovado",
  PENDING: "Pendente",
  REJECTED: "Rejeitado",
};

const DocumentType = {
  SELFIE: "Selfie",
  FRONT: "Frente",
  VERSE: "Verso",
};

export function Documents({ data }: UserBasicDataProps) {
  const navigate = useNavigate();
  const [document, setDocument] = useState<GetDocumentKycResponse | null>(null);

  function handleBack() {
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate("/users");
    }
  }

  function handleViewDocument(document: GetDocumentKycResponse) {
    setDocument(document);
  }

  return (
    <>
      {data && (
        <>
          <Sheet>
            <div className="flex items-center gap-4 mb-4 flex-col lg:flex-row">
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7"
                onClick={handleBack}
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Back</span>
              </Button>
              <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
                {data?.user.name}
              </h1>
              <div className="flex flex-1 justify-end">
                <Badge variant="outline">
                  <UserStatusComponent status={data?.user.status} />
                </Badge>
              </div>
            </div>
            <Separator />
            <div className="mt-4 w-full">
              {data?.documents.length === 0 ? (
                <DocumentEmpty />
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[130px]">Enviado há</TableHead>
                      <TableHead className="w-[200px]">Tipo</TableHead>
                      <TableHead className="w-[200px]">OCR</TableHead>
                      <TableHead className="w-[200px]">Status</TableHead>
                      <TableHead className="w-[200px]">Detalhes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data &&
                      data?.documents.map((document) => {
                        return (
                          <TableRow key={document.id}>
                            <TableCell className="text-muted-foreground">
                              {formatDistanceToNow(document.createdAt, {
                                locale: ptBR,
                                addSuffix: true,
                              })}
                            </TableCell>
                            <TableCell>
                              {
                                DocumentType[
                                  document.type as keyof typeof DocumentType
                                ]
                              }
                            </TableCell>
                            <TableCell>
                              {document?.ocr ? "Sim" : "Não"}
                            </TableCell>
                            <TableCell>
                              {
                                DocumentStatus[
                                  document.status as keyof typeof DocumentStatus
                                ]
                              }
                            </TableCell>
                            <TableCell>
                              <SheetTrigger
                                onClick={() => handleViewDocument(document)}
                              >
                                <Button variant="secondary" size="sm">
                                  Visualizar
                                  <ArrowRight className="ml-3 h-3 w-3" />
                                </Button>
                              </SheetTrigger>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              )}
            </div>

            <SheetContent className="w-full md:w-10/12 sm:max-w-full">
              {document && (
                <>
                  <SheetHeader>
                    <SheetTitle>
                      {DocumentType[document.type as keyof typeof DocumentType]}
                    </SheetTitle>
                    <SheetDescription>
                      <ScrollArea className="h-screen-minus-100px">
                        <div className="flex flex-row md:flex-row gap-6">
                          <div className="w-1/2">
                            {document.url?.includes(".pdf") ? (
                              <>
                                <iframe
                                  src={document.url}
                                  className="w-full h-[500px]"
                                />
                              </>
                            ) : (
                              <img src={document.url} className="w-full" />
                            )}
                          </div>
                          <div className="w-1/2">
                            <h2 className="text-base font-bold tracking-tight mb-4">
                              Dados extraídos do OCR
                            </h2>
                            <pre className="relative rounded  px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
                              {document.ocr
                                ? JSON.stringify(document.ocr, null, 2)
                                : "Nenhum dado extraído"}
                            </pre>
                          </div>
                        </div>
                      </ScrollArea>
                    </SheetDescription>
                  </SheetHeader>
                </>
              )}
            </SheetContent>
          </Sheet>
        </>
      )}
    </>
  );
}
