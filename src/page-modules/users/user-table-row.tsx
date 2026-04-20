import { TableCell } from "@/components/ui/table";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { RoleBadge, StatusBadge } from "@/components/shared/badges";
import { mapUserStatus } from "@/utils/status-map";
import {
  ArrowRight,
  Blocks,
  Check,
  Copy,
  Edit,
  Loader2,
  X,
} from "lucide-react";
import { formatDocument, numberToCurrent } from "@/utils/format";
import { Skeleton } from "@/components/ui/skeleton";
import { UpdateUserProps } from ".";
import { GetUserResponse, GetUsersResponse } from "@/api/get-users";

import { CopyToClipboard } from "react-copy-to-clipboard";
import toast from "react-hot-toast";

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
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { api, parseError } from "@/lib/api";
// import { toast } from "sonner";
import { QueryObserverResult } from "@tanstack/react-query";
import { toastStyle } from "@/utils/toast-style";
import { useAuth } from "@/hooks/auth";
import { Link } from "@tanstack/react-router";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Format } from "@/components/input/format";

interface UserTableRowProps {
  user: GetUserResponse;
  isPending?: boolean;
  onStatusChange: (data: UpdateUserProps) => void;
  permissionForcedPreApproved: boolean;
  refetch: () => Promise<QueryObserverResult<GetUsersResponse, Error>>;
  index?: number;
}

export function UserTableRow({
  user,
  permissionForcedPreApproved,
  onStatusChange,
  isPending,
  refetch,
  index = 0,
}: UserTableRowProps) {
  const [fee, setFee] = useState<string>(
    user.fee ? Format.DecimalNumber(String(user.fee * 100)) : "0,00"
  );
  const [isUpdating, setIsUpdating] = useState(false);

  const { user: userLogged } = useAuth();

  function convertToNumber(value: string): number {
    // Substitui a vírgula por ponto e converte para número
    const cleanedValue = value.replace(",", ".");

    // Converte para número e retorna
    return parseFloat(cleanedValue);
  }

  async function handleUpdateUser(userId: string, fee: string) {
    try {
      setIsUpdating(true);

      // Converte para número
      const feeNumber = convertToNumber(fee);

      // if (feeNumber < 0 || feeNumber > 100) {
      //   toast.error(
      //     "A porcentagem deve ser um número entre 0 e 100",
      //     toastStyle.error
      //   );
      //   return;
      // }

      await api.put(`/users/update/${userId}/fee`, { fee: feeNumber });
      toast.success("Valor atualizado com sucesso", toastStyle.success);
      await refetch();
    } catch (err) {
      const error = parseError(err);
      toast.error(error.message, toastStyle.error);
    } finally {
      setIsUpdating(false);
    }
  }

  return (
    <motion.tr
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03, duration: 0.2 }}
      className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
    >
      <TableCell className="text-muted-foreground">
        {formatDistanceToNow(user.createdAt, {
          locale: ptBR,
          addSuffix: true,
        })}
      </TableCell>
      <TableCell>
        <div className="flex flex-row gap-1 truncate items-center">
          <span>{user?.name}</span>
          {user.status === "PENDING" && (
            <span>
              <CopyToClipboard
                text={`${window.location.protocol}//${window.location.host}/auth/register?inviteId=${user.id}`}
                onCopy={() => {
                  toast.success(
                    "Link do convite copiado com sucesso.",
                    toastStyle.success
                  );
                }}
              >
                <Copy className="w-4 h-4 cursor-pointer" />
              </CopyToClipboard>
            </span>
          )}
        </div>
      </TableCell>
      <TableCell>
        <span>{formatDocument(user.document)}</span>
      </TableCell>
      <TableCell>
        <RoleBadge role={user.role} />
      </TableCell>
      <TableCell className="text-center">
        {user.role !== "SUPER_ADMIN" ? (
          <span>{numberToCurrent(user.fee)}</span>
        ) : (
          <span>-</span>
        )}
      </TableCell>
      <TableCell>
        <StatusBadge status={mapUserStatus(user.status)} />
        {user.status === "PRE_APPROVED" && (
          <div className="flex gap-4 mt-2">
            {!isPending ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  onStatusChange({ id: user.id, status: "APPROVED" })
                }
              >
                <span className="cursor-pointer flex items-center text-emerald-500">
                  <Check className="mr-2 h-3 w-3" />
                  Aprovar
                </span>
              </Button>
            ) : (
              <Skeleton className="h-8 w-1/3" />
            )}

            {!isPending ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  onStatusChange({ id: user.id, status: "REJECTED" })
                }
              >
                <span className="cursor-pointer flex items-center text-destructive">
                  <X className="mr-2 h-3 w-3" />
                  Reprovar
                </span>
              </Button>
            ) : (
              <Skeleton className="h-8 w-1/3" />
            )}
          </div>
        )}

        {permissionForcedPreApproved && user.status === "REJECTED_KYC" && (
          <>
            <div className="flex gap-4 mt-2">
              {!isPending ? (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    onStatusChange({
                      id: user.id,
                      status: "FORCE_PRE_APPROVED",
                    })
                  }
                >
                  <span className="cursor-pointer flex items-center text-orange-500">
                    <Check className="mr-2 h-3 w-3" />
                    Forçar pré-aprovação
                  </span>
                </Button>
              ) : (
                <Skeleton className="h-8 w-1/3" />
              )}
            </div>
          </>
        )}
      </TableCell>
      <TableCell>
        <div className="flex gap-2">
          {userLogged?.role !== "OPERATOR" && (
            <>
              <Dialog>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="default">
                      <Edit className="mr-2 h-3 w-3" />
                      Ações
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="default">
                          <Edit className="mr-2 h-3 w-3" />
                          Editar
                        </Button>
                      </DialogTrigger>
                    </DropdownMenuItem>

                    {userLogged?.role === "SUPER_ADMIN" && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <>
                            {user.status === "APPROVED" && (
                              <Button
                                variant="destructive"
                                size="default"
                                onClick={() => {
                                  onStatusChange({
                                    id: user.id,
                                    status: "BLOCKED",
                                  });
                                }}
                              >
                                <Blocks className="mr-2 h-3 w-3" />
                                Bloquear
                              </Button>
                            )}

                            {user.status === "BLOCKED" && (
                              <Button
                                variant="default"
                                size="default"
                                onClick={() => {
                                  onStatusChange({
                                    id: user.id,
                                    status: "APPROVED",
                                  });
                                }}
                              >
                                <Blocks className="mr-2 h-3 w-3" />
                                Desbloquear
                              </Button>
                            )}
                          </>
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* <DialogTrigger asChild>
                  <Button variant="ghost" size="default">
                    <Edit className="mr-2 h-3 w-3" />
                    Editar
                  </Button>
                </DialogTrigger> */}
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Atualização</DialogTitle>
                    <DialogDescription>
                      Atualize a taxa do usuário em reais
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right">
                        Name
                      </Label>
                      <Input
                        id="name"
                        value={user.name}
                        className="col-span-3"
                        disabled
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="email" className="text-right">
                        E-mail
                      </Label>
                      <Input
                        id="email"
                        value={user.email}
                        className="col-span-3"
                        disabled
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="fee" className="text-right">
                        Taxa
                      </Label>
                      <Input
                        id="fee"
                        type="text"
                        step={1}
                        value={fee}
                        onChange={(e) => {
                          setFee(Format.DecimalNumber(e.target.value));
                        }}
                        className="col-span-3"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      type="button"
                      onClick={() => handleUpdateUser(user.id, fee)}
                    >
                      {isUpdating && <Loader2 className="animate-spin mr-2" />}
                      Salvar
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {userLogged?.role === "SUPER_ADMIN" && (
                <Link to={`/users/${user.id}` as any}>
                  <Button variant="ghost" size="default">
                    <ArrowRight className="mr-2 h-3 w-3" />
                    Detalhes
                  </Button>
                </Link>
              )}
            </>
          )}
        </div>
      </TableCell>
    </motion.tr>
  );
}
