import { TableCell, TableRow } from "@/components/ui/table";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { ArrowRight, Copy } from "lucide-react";
import { formatDocument, numberToCurrent } from "@/utils/format";
import { Link } from "@tanstack/react-router";
import { GetAccountResponse } from "@/api/get-accounts";
import { FormatAccountStatus } from "@/utils/format-role";
import CopyToClipboard from "react-copy-to-clipboard";
import toast from "react-hot-toast";
import { toastStyle } from "@/utils/toast-style";
import { api } from "@/lib/api";

interface AccountTableRowProps {
  account: GetAccountResponse;
  refetch: () => void;
}

export function AccountTableRow({ account, refetch }: AccountTableRowProps) {
  async function handleRetry(id: string) {
    console.log("oldId", id);
    await api
      .post(`/accounts/${id}/retry`)
      .then(() => {
        toast.success("Conta resetada com sucesso.", toastStyle.success);
        refetch();
      })
      .catch(() => {
        toast.error("Erro ao resear a conta.", toastStyle.error);
      });
  }

  return (
    <TableRow className="">
      <TableCell className="text-muted-foreground">
        {formatDistanceToNow(account.createdAt, {
          locale: ptBR,
          addSuffix: true,
        })}
      </TableCell>
      <TableCell>
        <div className="flex flex-col gap-1 truncate">
          <span className="font-semibold">
            {account?.name}
            {account.trackName && (
              <span className="text-xs text-muted-foreground">
                - {account.trackName}
              </span>
            )}
          </span>
          <span className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {account?.user?.name}
            </span>
            {/* <div className="flex items-center ">
              {account.type === "BET" ? (
                <span
                  data-testid="badge"
                  className="h-2 w-2 rounded-full bg-green-600"
                />
              ) : (
                <span
                  data-testid="badge"
                  className="h-2 w-2 rounded-full bg-yellow-600"
                />
              )}
            </div> */}
          </span>
          {/* <div className="text-muted-foreground text-xs">
            {account.type === "BET" ? (
              <span className="text-green-800">Bet</span>
            ) : (
              <span className="text-yellow-600">Normal</span>
            )}
          </div> */}
        </div>
      </TableCell>
      <TableCell>
        <span>{formatDocument(account.document)}</span>
      </TableCell>
      <TableCell className="text-center">
        {numberToCurrent(account.user.fee)}
      </TableCell>
      <TableCell className="text-center">
        {account.id === "1fff7d44-7a88-4e9a-aca4-2340c86cae6f" ? (
          <span>{numberToCurrent(account.balance / 2)}</span>
        ) : (
          <span>{numberToCurrent(account.balance)}</span>
        )}
      </TableCell>
      {/* <TableCell className="text-center">
        {account.type === "BET" ? (
          <span>{numberToCurrent(account.withdrawFree)}</span>
        ) : (
          "-"
        )}
      </TableCell> */}
      {/* <TableCell className="text-center">
        <span>{account.countAccounts > 0 ? account.countAccounts : "-"}</span>
      </TableCell> */}
      <TableCell className="">
        <span>{FormatAccountStatus(account.status)}</span>
        <div className="text-muted-foreground text-xs">
          <span className="text-yellow-600">{account.rejectedReason}</span>
          {account.status === "REJECTED" && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleRetry(account.id)}
            >
              <span>Refazer</span>
            </Button>
          )}

          {account.status === "WAITING_DOCUMENT" && !account.kycLink && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleRetry(account.id)}
            >
              <span>Resetar</span>
            </Button>
          )}
        </div>
      </TableCell>
      <TableCell>
        <Button variant="ghost" size="sm">
          {account.status === "APPROVED" && (
            <Link
              to={`/accounts/${account.id}`}
              className="flex items-center text-sm"
            >
              <ArrowRight className="mr-2 h-3 w-3" />
              Visualizar
            </Link>
          )}

          {account.status !== "APPROVED" && (
            <span>
              <CopyToClipboard
                text={`${window.location.protocol}//${window.location.host}/auth/account/register?inviteId=${account.id}`}
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
        </Button>
      </TableCell>
    </TableRow>
  );
}
