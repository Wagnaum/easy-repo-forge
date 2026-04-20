import { useSearchParams } from "react-router-dom";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Loader2,
  Plus,
  // Loader2, Plus,
  Search,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Format } from "@/components/input/format";
import { useState } from "react";
import toast from "react-hot-toast";
import { toastStyle } from "@/utils/toast-style";
import { api, parseError } from "@/lib/api";
import { useAuth } from "@/hooks/auth";
import { QueryObserverResult } from "@tanstack/react-query";
import { GetAccountsResponse } from "@/api/get-accounts";
import { Separator } from "@/components/ui/separator";
import { useIsOwem } from "@/hooks/is-owem";

const statusOptions: Partial<Record<string, string>> = {
  APPROVED: "Aprovado",
  REJECTED: "Rejeitado",
  PENDING: "Pendente",
  WAITING_INDIVIDUAL: "Aguardando análise individual",
  IN_ANALYSIS: "Em análise",
  WAITING_DOCUMENT: "Aguardando documentos",
  positiveBalance: "Saldo positivo",
} as const;

const userFiltersSchema = z.object({
  filter: z.string().optional(),
  status: z.string().optional(),
});

type UserFiltersSchema = z.infer<typeof userFiltersSchema>;

interface AccountTableFiltersProps {
  refetch: () => Promise<QueryObserverResult<GetAccountsResponse, Error>>;
}

export function AccountTableFilters({ refetch }: AccountTableFiltersProps) {
  const [searchParams, setSearchParams] = useSearchParams();

  const filter = searchParams.get("filter");
  const status = searchParams.get("status");

  const [documentNewAccount, setDocumentNewAccount] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [open, setOpen] = useState(false);

  const { user: userLogged } = useAuth();
  const isOwem = useIsOwem();

  const { register, handleSubmit, control, reset } = useForm<UserFiltersSchema>(
    {
      resolver: zodResolver(userFiltersSchema),
      defaultValues: {
        filter: filter ?? "",
        status: status ?? "all",
      },
    }
  );

  function handleFilter({ filter, status }: UserFiltersSchema) {
    setSearchParams((state) => {
      if (filter) {
        state.set("filter", filter);
      } else {
        state.delete("filter");
      }

      if (status) {
        state.set("status", status);
      } else {
        state.delete("status");
      }

      state.set("page", "0");

      return state;
    });
  }

  function handleClearFilters() {
    setSearchParams((state) => {
      state.delete("filter");
      state.delete("status");
      state.set("page", "0");

      return state;
    });

    reset({
      filter: "",
      status: "all",
    });
  }

  async function handleCreateAccount() {
    try {
      if (isUpdating) {
        return;
      }
      if (!documentNewAccount) {
        toast.error("O campo CPF é obrigatório.");
        return;
      }

      setIsUpdating(true);
      await api.post(`/accounts/${userLogged?.id}/user/bet`, {
        document: documentNewAccount.replace(/\D/g, ""),
        provider: isOwem ? "OWEM" : "PAGARE",
      });

      await refetch();
      toast.success("Conta criada com sucesso.");
      setDocumentNewAccount("");
      setOpen(false);
    } catch (err) {
      const error = parseError(err);
      toast.error(error.message, toastStyle.error);
    } finally {
      setIsUpdating(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit(handleFilter)}
      className="flex items-center gap-2"
    >
      <span className="text-sm font-semibold">Filtros:</span>
      <Input
        placeholder="Nome ou CPF"
        className="h-8 w-[320px]"
        {...register("filter")}
      />
      <Controller
        name="status"
        control={control}
        render={({ field: { name, onChange, value, disabled } }) => {
          return (
            <Select
              defaultValue="all"
              name={name}
              onValueChange={onChange}
              value={value}
              disabled={disabled}
            >
              <SelectTrigger className="h-8 w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as contas</SelectItem>
                {Object.entries(statusOptions).map(([key, value]) => (
                  <>
                    {key === "positiveBalance" && <Separator />}
                    <SelectItem value={key} key={key}>
                      {value}
                    </SelectItem>
                  </>
                ))}
              </SelectContent>
            </Select>
          );
        }}
      ></Controller>
      <Button variant="secondary" size="sm" type="submit">
        <Search className="mr-2 h-4 w-4" />
        Filtrar resultados
      </Button>
      <Button
        onClick={handleClearFilters}
        variant="outline"
        size="sm"
        type="button"
      >
        <X className="mr-2 h-4 w-4" />
        Remover filtros
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            onClick={handleClearFilters}
            size="sm"
            type="button"
            className="ml-auto"
            // variant="default"
          >
            <Plus className="mr-2 h-4 w-4" />
            Nova conta
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Criar nova conta</DialogTitle>
            <DialogDescription>
              Preencha os campos abaixo para criar uma nova conta.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="document" className="text-right">
                CPF
              </Label>
              <Input
                id="document"
                value={documentNewAccount}
                onChange={(e) =>
                  setDocumentNewAccount(Format.CPF(e.target.value))
                }
                className="col-span-3"
              />
            </div>

            <DialogFooter>
              <Button type="button" onClick={handleCreateAccount}>
                {isUpdating && <Loader2 className="animate-spin mr-2" />}
                Criar
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </form>
  );
}
