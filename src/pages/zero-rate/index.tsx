import {
  getZeroRate,
  GetZeroRateResponse,
  GetZeroRatesResponse,
} from "@/api/get-zero-rate";
import { Pagination } from "@/components/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { formatDocument, numberToCurrent } from "@/utils/format";
import { FormatZeroRateStatus } from "@/utils/format-role";
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { z } from "zod";
import IntlCurrencyInput from "@/components/react-intl-currency-input/intl-currency-input";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader2 } from "lucide-react";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";
import { toastStyle } from "@/utils/toast-style";
import { api, parseError } from "@/lib/api";

export function ZeroRatePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const pageIndex = z.coerce.number().parse(searchParams.get("page") ?? 0);
  const type = searchParams.get("filter") ?? "FREE";
  const status = searchParams.get("status") ?? "WAITING_ANALYSIS";

  const [sheetData, setSheetData] = useState<GetZeroRateResponse | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [fee, setFee] = useState(0);
  const [feeType, setFeeType] = useState<"WITH_FEE" | "WITHOUT_FEE">(
    "WITHOUT_FEE"
  );

  const [isLoadingApproveWithFee, setIsLoadingApproveWithFee] = useState(false);
  const [isLoadingApprove, setIsLoadingApprove] = useState(false);
  const [isLoadingReject, setIsLoadingReject] = useState(false);

  const {
    data: result,
    isLoading,
    refetch,
  } = useQuery<GetZeroRatesResponse>({
    queryKey: ["zerorate:backoffice", pageIndex, type, status],
    queryFn: () =>
      getZeroRate({
        pageIndex,
        type,
        status: status === "all" ? null : status,
      }),
    refetchInterval: 1000 * 60, // 1 minute
  });

  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function handlePage(page: number) {
    setSearchParams((prev) => {
      prev.set("page", page.toString());
      scrollToTop();
      return prev;
    });
  }

  useEffect(() => {
    setSearchParams((prev) => {
      prev.set("type", "FREE");
      prev.set("status", "WAITING_ANALYSIS");
      return prev;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleOpen(withdraw: GetZeroRateResponse) {
    setSheetData(withdraw);
  }

  function handleOpenChange(isOpen: boolean) {
    if (!isOpen) {
      setSheetData(null);
    }

    setSheetOpen(isOpen);
  }

  async function handleApproveWithFee() {
    if (isLoadingApproveWithFee) {
      return;
    }

    if (fee <= 0) {
      toast.error("A taxa deve ser maior que zero.", toastStyle.error);
      return;
    }

    try {
      setIsLoadingApproveWithFee(true);
      await api.put(`/accounts/withdraw-requests/${sheetData?.id}/approve`, {
        fee: fee,
      });
      await refetch();
      setSheetOpen(false);
      toast.success("Saque aprovado com sucesso", toastStyle.success);
    } catch (err) {
      const error = parseError(err);
      toast.error(error.message, toastStyle.error);
    } finally {
      setIsLoadingApproveWithFee(false);
    }
  }

  async function handleApprove() {
    setFeeType("WITHOUT_FEE");

    if (isLoadingApprove) {
      return;
    }

    try {
      setIsLoadingApprove(true);
      await api.put(`/accounts/withdraw-requests/${sheetData?.id}/approve`, {
        fee: 0,
      });
      await refetch();
      setSheetOpen(false);
      toast.success("Saque aprovado com sucesso", toastStyle.success);
    } catch (err) {
      const error = parseError(err);
      toast.error(error.message, toastStyle.error);
    } finally {
      setIsLoadingApprove(false);
    }
  }

  async function handleReject() {
    if (isLoadingReject) {
      return;
    }

    try {
      setIsLoadingReject(true);
      await api.put(`/accounts/withdraw-requests/${sheetData?.id}/reject`);
      await refetch();
      setSheetOpen(false);
      toast.success("Saque rejeitado com sucesso", toastStyle.success);
    } catch (err) {
      const error = parseError(err);
      toast.error(error.message, toastStyle.error);
    } finally {
      setIsLoadingReject(false);
    }
  }

  // async function handleWithFee() {
  //   setFeeType("WITH_FEE");
  // }

  return (
    <>
      <Sheet onOpenChange={handleOpenChange} open={sheetOpen}>
        <h1>Gateways</h1>
        <Table>
          <TableHeader>
            <TableRow className={cn(isLoading && "hidden")}>
              <TableHead className="">Data</TableHead>
              <TableHead className="w-">Requisitado por</TableHead>
              <TableHead className="w-">Conta</TableHead>
              <TableHead className="w-">Valor</TableHead>
              <TableHead className="w-">Status</TableHead>
              <TableHead className="w-">Detalhes</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {result &&
              result?.data.map((withdraw) => {
                return (
                  <TableRow key={withdraw.id}>
                    <TableCell className="text-muted-foreground">
                      {formatDistanceToNow(withdraw.createdAt, {
                        locale: ptBR,
                        addSuffix: true,
                      })}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-row gap-1 truncate items-center pt-2 pb-2">
                        <span>{withdraw?.account.user.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1 truncate">
                        <div>
                          <span>{withdraw?.account.name}</span>
                        </div>
                        <div className="text-muted-foreground">
                          <span>
                            {formatDocument(withdraw?.account.document)}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span>{numberToCurrent(withdraw.amount)}</span>
                    </TableCell>
                    <TableCell>
                      <span>{FormatZeroRateStatus(withdraw.status)}</span>
                    </TableCell>
                    <TableCell>
                      <SheetTrigger asChild>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleOpen(withdraw)}
                        >
                          Detalhes
                          <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                      </SheetTrigger>
                    </TableCell>
                  </TableRow>
                );
              })}
            {isLoading && (
              <>
                {Array.from({ length: 10 }).map((_, i) => {
                  return (
                    <TableRow key={i}>
                      <TableCell>
                        <Skeleton className="h-6 w-[130px]" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-6 w-[400px]" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-6 w-[140px]" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-6 w-[140px]" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-6 w-[140px]" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-6 w-[140px]" />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </>
            )}
          </TableBody>
        </Table>

        {result && result?.pagination?.totalPages > 1 && (
          <Pagination
            pageIndex={pageIndex}
            perPage={10}
            totalCount={result?.pagination.totalItems}
            onPageChange={handlePage}
          />
        )}

        <SheetContent className="w-full sm:max-w-full md:w-6/12">
          <SheetHeader>
            <SheetTitle>Análise de Saque</SheetTitle>
            <SheetDescription>
              Análise detalhada do saque solicitado
            </SheetDescription>
          </SheetHeader>
          <ScrollArea className="h-screen-minus-100px mt-4 text-base">
            <div className="flex flex-row gap-1">
              <span className="text-muted-foreground">Requisitado por:</span>
              <span>{sheetData?.account.user.name}</span>
            </div>
            <div className="flex flex-row gap-1">
              <span className="text-muted-foreground">Conta:</span>
              <span>{sheetData?.account.name}</span>
            </div>
            <div className="flex flex-row gap-1">
              <span className="text-muted-foreground">Valor:</span>
              <span>{numberToCurrent(sheetData?.amount)}</span>
            </div>
            <div className="flex flex-row gap-1">
              <span className="text-muted-foreground">Status:</span>
              <span>{FormatZeroRateStatus(sheetData?.status)}</span>
            </div>
            <Separator className="my-4" />
            <div className="flex flex-row gap-1">
              <span className="text-muted-foreground">Casa de Aposta: </span>
              <span>{sheetData?.plataform}</span>
            </div>

            <div className="flex flex-row gap-1">
              <span className="text-muted-foreground">Login: </span>
              <span>{sheetData?.login}</span>
            </div>

            <div className="flex flex-row gap-1">
              <span className="text-muted-foreground">Senha: </span>
              <span>{sheetData?.password}</span>
            </div>

            {sheetData?.justification && (
              <div className="flex flex-row gap-1">
                <span className="text-muted-foreground">Informações: </span>
                <span>{sheetData?.justification}</span>
              </div>
            )}

            <Separator className="my-4" />
          </ScrollArea>
          <SheetFooter>
            <div>
              <div className="flex gap-4">
                {/* <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button type="button">
                      {isLoadingApprove && feeType === "WITHOUT_FEE" && (
                        <Loader2 className="animate-spin mr-2" />
                      )}
                      Aprovar
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={handleApprove}>
                      Sem Taxa
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleWithFee}>
                      Com Taxa
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu> */}

                <Button type="button" variant="default" onClick={handleApprove}>
                  {isLoadingApprove && (
                    <Loader2 className="animate-spin mr-2" />
                  )}
                  Aprovar
                </Button>

                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleReject}
                >
                  {isLoadingReject && <Loader2 className="animate-spin mr-2" />}
                  Rejeitar
                </Button>
              </div>
              {feeType === "WITH_FEE" && (
                <div className="mt-2">
                  <Label htmlFor="fee">Taxa</Label>
                  <IntlCurrencyInput
                    id="fee"
                    value={fee}
                    onChange={(_, rawValue) => {
                      setFee(rawValue);
                    }}
                  />
                  <Button
                    type="button"
                    variant="default"
                    className="mt-2"
                    onClick={handleApproveWithFee}
                  >
                    {isLoadingApproveWithFee && (
                      <Loader2 className="animate-spin mr-2" />
                    )}
                    Confirmar
                  </Button>
                </div>
              )}
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
}
