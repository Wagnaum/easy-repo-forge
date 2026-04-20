import { getGateways, GetGatewaysResponse } from "@/api/get-gateways";
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
import { formatDocument } from "@/utils/format";
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useSearchParams } from "react-router-dom";
import { z } from "zod";

export function GatewaysPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const pageIndex = z.coerce.number().parse(searchParams.get("page") ?? 0);
  const filter = searchParams.get("filter");
  const status = searchParams.get("status");

  const { data: result, isLoading } = useQuery<GetGatewaysResponse>({
    queryKey: ["gateways:backoffice", pageIndex, filter, status],
    queryFn: () =>
      getGateways({
        pageIndex,
        filter,
        status: status === "all" ? null : status,
      }),
    // staleTime: 1000 * 30, // 30 seconds
    // refetchInterval: 1000 * 60, // 1 minute
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

  return (
    <>
      <h1>Gateways</h1>
      <Table>
        <TableHeader>
          <TableRow className={cn(isLoading && "hidden")}>
            <TableHead className="">Cadastrado há</TableHead>
            <TableHead className="w-">Nome</TableHead>
            <TableHead className="w-">CNPJ</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {result &&
            result?.data.map((gateway) => {
              return (
                <TableRow key={gateway.id}>
                  <TableCell className="text-muted-foreground">
                    {formatDistanceToNow(gateway.createdAt, {
                      locale: ptBR,
                      addSuffix: true,
                    })}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-row gap-1 truncate items-center pt-2 pb-2">
                      <span>{gateway?.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span>{formatDocument(gateway.document)}</span>
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
    </>
  );
}
