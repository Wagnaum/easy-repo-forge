import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useSearchParams } from "@/lib/use-search-params";
import { z } from "zod";
import { useAuth } from "@/hooks/auth";
import { cn } from "@/lib/utils";
import { getUsers, GetUsersResponse } from "@/api/get-users";
import { UserTableFilters } from "./user-table-filters";
import { Pagination } from "@/components/pagination";
import { UserTableSkeleton } from "./user-table-skeleton";
import { UserTableRow } from "./user-table-row";
import { updateUser } from "@/api/update-user";
import { toastStyle } from "@/utils/toast-style";
import toast from "react-hot-toast";

export interface UpdateUserProps {
  id: string;
  status: string;
}

export function UsersPage() {
  const { user: userLogged } = useAuth();
  const queryClient = useQueryClient();

  const [searchParams, setSearchParams] = useSearchParams();
  const pageParam = searchParams.get("page");
  const pageIndex = Number.isFinite(Number(pageParam)) ? Number(pageParam) : 0;
  const filter = searchParams.get("filter");
  const status = searchParams.get("status");
  const role = searchParams.get("role");

  const {
    data: result,
    isLoading: isLoadingUsers,
    refetch,
  } = useQuery<GetUsersResponse>({
    queryKey: ["users:backoffice", pageIndex, filter, status, role],
    queryFn: () =>
      getUsers({
        pageIndex,
        filter,
        status: status === "all" ? null : status,
        role: role === "all" ? null : role,
      }),
    staleTime: 1000 * 30, // 30 seconds
    refetchInterval: 1000 * 60, // 1 minute
  });

  const { mutateAsync: updateUserFn, isPending } = useMutation({
    mutationFn: updateUser,
    onMutate({ id }) {
      const usersListCache = queryClient.getQueriesData<GetUsersResponse>({
        queryKey: ["users:backoffice"],
      });

      usersListCache.forEach(([cacheKey, cacheData]) => {
        if (!cacheData) {
          return;
        }

        queryClient.setQueryData(cacheKey, {
          ...cacheData,
          data: cacheData.data.map((user) => {
            if (user.id === id) {
              return { ...user, isLoading: true };
            }

            return user;
          }),
        });
      });
    },
    onSuccess(_, { id, status }) {
      const usersListCache = queryClient.getQueriesData<GetUsersResponse>({
        queryKey: ["users:backoffice"],
      });

      usersListCache.forEach(([cacheKey, cacheData]) => {
        if (!cacheData) {
          return;
        }

        queryClient.setQueryData(cacheKey, {
          ...cacheData,
          data: cacheData.data.map((user) => {
            if (user.id === id) {
              if (status === "FORCE_PRE_APPROVED") {
                return {
                  ...user,
                  isLoading: false,
                  status: "PRE_APPROVED",
                  internal_status: null,
                };
              } else {
                return {
                  ...user,
                  isLoading: false,
                  status: status,
                  internal_status: "ACCOUNT_CREATED",
                };
              }
            }

            return user;
          }),
        });
      });
    },
    onError(_, { id }) {
      const usersListCache = queryClient.getQueriesData<GetUsersResponse>({
        queryKey: ["users:backoffice"],
      });

      usersListCache.forEach(([cacheKey, cacheData]) => {
        if (!cacheData) {
          return;
        }

        queryClient.setQueryData(cacheKey, {
          ...cacheData,
          data: cacheData.data.map((user) => {
            if (user.id === id) {
              return { ...user, isLoading: false };
            }

            return user;
          }),
        });
      });
    },
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

  async function handleStatusChange(data: UpdateUserProps) {
    try {
      // data.status
      await updateUserFn({ id: data.id, status: 'IN_ANALYSIS' });
      toast.success("Usuário atualizado com sucesso!", toastStyle.success);
    } catch {
      toast.error(
        "Não foi possível executar a ação. Tente novamente mais tarde.",
        toastStyle.error
      );
    }
  }

  return (
    <>
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Usuários</h1>
        <p className="text-sm text-muted-foreground">Gerencie os usuários da plataforma</p>
      </div>
      <UserTableFilters refetch={refetch} />
      <div className="rounded-xl border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className={cn(isLoadingUsers && "hidden")}>
              <TableHead className="w-[130px]">Cadastrado há</TableHead>
              <TableHead className="w-[200px]">Nome</TableHead>
              <TableHead className="w-[140px]">CPF</TableHead>
              <TableHead className="w-[140px]">Tipo</TableHead>
              <TableHead className="w-[140px] text-center">Taxa</TableHead>
              <TableHead className="w-[200px]">Status</TableHead>
              <TableHead className="w-[90px]"></TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {result &&
              result?.data.map((user, idx) => {
                return (
                  <UserTableRow
                    key={user.id}
                    user={user}
                    permissionForcedPreApproved={
                      userLogged?.role === "SUPER_ADMIN"
                    }
                    onStatusChange={handleStatusChange}
                    isPending={user?.isLoading && isPending}
                    refetch={refetch}
                    index={idx}
                  />
                );
              })}
            {isLoadingUsers && <UserTableSkeleton />}
          </TableBody>
        </Table>
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
