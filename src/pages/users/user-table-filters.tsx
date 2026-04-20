import { useSearchParams } from "react-router-dom";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus, Search, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserStatus } from "./types";
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
import { useState } from "react";
import { Format } from "@/components/input/format";
import { api, parseError } from "@/lib/api";
import { QueryObserverResult } from "@tanstack/react-query";
import { GetUsersResponse } from "@/api/get-users";
import { useAuth } from "@/hooks/auth";
import { toastStyle } from "@/utils/toast-style";
import toast from "react-hot-toast";

const statusOptions: Partial<Record<UserStatus, string>> = {
  APPROVED: "Aprovado",
  PENDING: "Pendente",
  REJECTED: "Rejeitado",
  WAITING_ADDRESS: "Aguardando endereço",
  WAITING_ANALYSIS: "Aguardando análise",
  WAITING_DOCUMENT: "Aguardando documentos",
  WAITING_INDIVIDUAL: "Aguardando dados individuais",
  PRE_APPROVED: "Pré-aprovado",
  REJECTED_KYC: "Rejeitado KYC",
} as const;

const userFiltersSchema = z.object({
  filter: z.string().optional(),
  status: z.string().optional(),
  role: z.string().optional(),
});

type UserFiltersSchema = z.infer<typeof userFiltersSchema>;

interface UserTableFiltersProps {
  refetch: () => Promise<QueryObserverResult<GetUsersResponse, Error>>;
}

export function UserTableFilters({ refetch }: UserTableFiltersProps) {
  const [searchParams, setSearchParams] = useSearchParams();

  const filter = searchParams.get("filter");
  const status = searchParams.get("status");
  const role = searchParams.get("role");

  const [name, setName] = useState("");
  const [document, setDocument] = useState("");
  const [email, setEmail] = useState("");
  const [fee, setFee] = useState("");
  // const [role, setRole] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [open, setOpen] = useState(false);

  const { user: userLogged } = useAuth();

  // function handleRoleChange(role: string) {
  //   setRole(role);
  // }

  function convertToNumber(value: string): number {
    // Substitui a vírgula por ponto e converte para número
    const cleanedValue = value.replace(",", ".");

    // Converte para número e retorna
    return parseFloat(cleanedValue);
  }

  async function handleCreateUser() {
    if (isUpdating) {
      return;
    }

    const feeNumber = convertToNumber(fee);

    if (!name || !document || !email || !fee) {
      toast.error("Preencha todos os campos", toastStyle.error);
      return;
    }

    try {
      setIsUpdating(true);
      await api.post("/users/invite", {
        name,
        document: document.replace(/\D/g, ""),
        email,
        fee: feeNumber,
      });

      setOpen(false);
      await refetch();
      toast.success("Usuário cadastrado com sucesso", toastStyle.success);
    } catch (err) {
      const error = parseError(err);
      toast.error(error.message, toastStyle.error);
    } finally {
      setIsUpdating(false);
    }
  }

  const { register, handleSubmit, control, reset } = useForm<UserFiltersSchema>(
    {
      resolver: zodResolver(userFiltersSchema),
      defaultValues: {
        filter: filter ?? "",
        status: status ?? "all",
        role: role ?? "all",
      },
    }
  );

  function handleFilter({ filter, status, role }: UserFiltersSchema) {
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

      if (role) {
        state.set("role", role);
      } else {
        state.delete("role");
      }

      state.set("page", "0");

      return state;
    });
  }

  function handleClearFilters() {
    setSearchParams((state) => {
      state.delete("filter");
      state.delete("status");
      state.delete("role");
      state.set("page", "0");

      return state;
    });

    reset({
      filter: "",
      status: "all",
      role: "all",
    });
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
                <SelectItem value="all">Todos status</SelectItem>
                {Object.entries(statusOptions).map(([key, value]) => (
                  <SelectItem value={key} key={key}>
                    {value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          );
        }}
      ></Controller>

      {userLogged?.role !== "OPERATOR" && userLogged?.role !== "MANAGER" && (
        <Controller
          name="role"
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
                  <SelectItem value="all">Todos status</SelectItem>
                  {userLogged?.role === "SUPER_ADMIN" && (
                    <>
                      <SelectItem value="SUPER_ADMIN" key="SUPER_ADMIN">
                        Super Admin
                      </SelectItem>
                      <SelectItem value="ADMIN" key="ADMIN">
                        Admin
                      </SelectItem>
                    </>
                  )}

                  {(userLogged?.role === "SUPER_ADMIN" ||
                    userLogged?.role === "ADMIN") && (
                    <SelectItem value="MANAGER" key="MANAGER">
                      Gerente
                    </SelectItem>
                  )}

                  {(userLogged?.role === "SUPER_ADMIN" ||
                    userLogged?.role === "ADMIN" ||
                    userLogged?.role === "MANAGER") && (
                    <SelectItem value="OPERATOR" key="OPERATOR">
                      Operador
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            );
          }}
        ></Controller>
      )}

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

      {userLogged?.role !== "OPERATOR" && (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={handleClearFilters}
              size="sm"
              type="button"
              className="ml-auto"
            >
              <Plus className="mr-2 h-4 w-4" />
              Novo usuário
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Novo usuário</DialogTitle>
              <DialogDescription>Cadastre um novo usuário</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Nome
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="document" className="text-right">
                  CPF
                </Label>
                <Input
                  id="document"
                  value={document}
                  onChange={(e) => setDocument(Format.CPF(e.target.value))}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  E-mail
                </Label>
                <Input
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="porcent" className="text-right">
                  Taxa
                </Label>
                <Input
                  id="percent"
                  value={fee}
                  onChange={(e) => setFee(Format.DecimalNumber(e.target.value))}
                  className="col-span-3"
                />
              </div>
              {/* <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">
                Tipo de usuário
              </Label>
              <div className="w-full col-span-3">
                <Select onValueChange={handleRoleChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Jogador" />
                  </SelectTrigger>
                  <SelectContent className="w-full">
                    <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                    <SelectItem value="ADMIN">Admin</SelectItem>
                    <SelectItem value="MANAGER">Gerente</SelectItem>
                    <SelectItem value="OPERATOR">Jogador</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div> */}
              <DialogFooter>
                <Button type="button" onClick={handleCreateUser}>
                  {isUpdating && <Loader2 className="animate-spin mr-2" />}
                  Cadastrar
                </Button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </form>
  );
}
