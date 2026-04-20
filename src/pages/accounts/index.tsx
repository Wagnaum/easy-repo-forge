import { useQuery } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useSearchParams } from "react-router-dom";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { Pagination } from "@/components/pagination";
import { getAccounts, GetAccountsResponse } from "@/api/get-accounts";
import { AccountTableRow } from "./account-table-row";
import { AccountTableFilters } from "./account-table-filters";
import { AccountTableSkeleton } from "./account-table-skeleton";

export interface UpdateUserProps {
  id: string;
  status: string;
}

export function AccountsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const pageIndex = z.coerce.number().parse(searchParams.get("page") ?? 0);
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
      <h1>Contas</h1>
      <AccountTableFilters refetch={refetch} />
      {/* <Separator /> */}
      <Table>
        <TableHeader>
          <TableRow className={cn(isLoading && "hidden")}>
            <TableHead className="w-[130px]">Criada há</TableHead>
            <TableHead className="w-[200px]">Nome</TableHead>
            <TableHead className="w-[140px]">CPF</TableHead>
            <TableHead className="w-[140px] text-center">Taxa</TableHead>
            <TableHead className="w-[140px] text-center">Saldo</TableHead>
            {/* <TableHead className="w-[140px] text-center">
              Saque Taxa Zero
            </TableHead> */}
            {/* <TableHead className="w-[140px] text-center">
              Contas Abertas
            </TableHead> */}
            <TableHead className="w-[100px]">Status</TableHead>
            <TableHead className="w-[90px]"></TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {result &&
            result?.data.map((account) => {
              return <AccountTableRow key={account.id} account={account} refetch={refetch} />;
            })}
          {isLoading && <AccountTableSkeleton />}
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
