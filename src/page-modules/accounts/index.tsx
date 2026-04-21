import { useQuery } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useSearchParams } from "@/lib/use-search-params";
import { Pagination } from "@/components/pagination";
import { getAccounts, GetAccountsResponse } from "@/api/get-accounts";
import { AccountTableRow } from "./account-table-row";
import { AccountTableFilters } from "./account-table-filters";
import { LottieLoader } from "@/components/shared/lottie-loader";

export interface UpdateUserProps {
  id: string;
  status: string;
}

export function AccountsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const pageParam = searchParams.get("page");
  const pageIndex = Number.isFinite(Number(pageParam)) ? Number(pageParam) : 0;
  const status = searchParams.get("status");
  const filter = searchParams.get("filter");

  const {
    data: result,
    isLoading,
    refetch,
  } = useQuery<GetAccountsResponse>({
    queryKey: ["accounts:backoffice", pageIndex, status, filter],
    queryFn: () =>
      getAccounts({
        pageIndex,
        status: status === "all" ? null : status,
        filter,
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
    <>
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Contas</h1>
        <p className="text-sm text-muted-foreground">Gerencie todas as contas da plataforma</p>
      </div>
      <AccountTableFilters refetch={refetch} />
      <div className="rounded-xl border bg-card overflow-hidden">
        {isLoading ? (
          <LottieLoader inline size={120} label="Carregando contas..." />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[130px]">Criada há</TableHead>
                <TableHead className="w-[200px]">Nome</TableHead>
                <TableHead className="w-[140px]">CPF</TableHead>
                <TableHead className="w-[140px] text-center">Taxa</TableHead>
                <TableHead className="w-[140px] text-center">Saldo</TableHead>
                <TableHead className="w-[100px]">Status</TableHead>
                <TableHead className="w-[90px]"></TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {result?.data.map((account, idx) => (
                <AccountTableRow key={account.id} account={account} refetch={refetch} index={idx} />
              ))}
            </TableBody>
          </Table>
        )}
      </div>

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
