import {
  getTransactions,
  GetTransactionsResponse,
} from "@/api/get-transactions";
import { Pagination } from "@/components/pagination";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { numberToCurrent } from "@/utils/format";
import { useQuery } from "@tanstack/react-query";
import { formatDate } from "date-fns";
import { useSearchParams } from "@/lib/use-search-params";
import { TransactionsSkeleton } from "./transactions-skeleton";

interface TransactionsAccountProps {
  accountId: string;
}

export function TransactionsAccount({ accountId }: TransactionsAccountProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const pageParam = searchParams.get("page");
  const pageIndex = Number.isFinite(Number(pageParam)) ? Number(pageParam) : 0;

  const { data: result, isLoading } = useQuery<GetTransactionsResponse>({
    queryKey: ["accounts:transactions", accountId, pageIndex],
    queryFn: () =>
      getTransactions({
        accountId,
        pageIndex,
      }),
    staleTime: 1000 * 30, // 30 seconds
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

  return (
    <Card>
      <CardHeader className="px-7">
        <CardTitle>Transações</CardTitle>
        <CardDescription>
          Últimas transações realizadas na conta
        </CardDescription>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className={cn(isLoading && "hidden")}>
                <TableHead className="hidden sm:table-cell">Data</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead className="hidden sm:table-cell">Tipo</TableHead>
                <TableHead className="text-right">Valor</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {result?.data?.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="hidden sm:table-cell text-muted-foreground">
                    <div>
                      {formatDate(
                        new Date(transaction.createdAt),
                        "dd/MM/yyyy HH:mm"
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="truncate items-center flex flex-row gap-1 lg:pt-2 lg:pb-2">
                      {transaction.description}
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {transaction.credit ? (
                      <Badge className="text-xs" variant={"secondary"}>
                        Crédito
                      </Badge>
                    ) : (
                      <Badge className="text-xs" variant={"secondary"}>
                        Débito
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell
                    className={cn(
                      "text-right",
                      transaction.credit ? "text-green-600" : "text-red-600"
                    )}
                  >
                    {transaction.credit ? "+" : "-"}{" "}
                    {numberToCurrent(transaction.amount)}
                  </TableCell>
                </TableRow>
              ))}

              {isLoading && <TransactionsSkeleton />}

              {result?.data.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    <div className="pt-2 pb-2">
                      Não há transações para exibir
                    </div>
                  </TableCell>
                </TableRow>
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
        </CardContent>
      </CardHeader>
    </Card>
  );
}
