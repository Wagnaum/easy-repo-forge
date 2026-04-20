import { TableCell } from "@/components/ui/table";
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
import { motion } from "framer-motion";

interface AccountTableRowProps {
  account: GetAccountResponse;
  refetch: () => void;
  index?: number;
}

export function AccountTableRow({ account, refetch, index = 0 }: AccountTableRowProps) {
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
    <motion.tr
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03, duration: 0.2 }}
      className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
    >
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
          </span>
        </div>
      </TableCell>
      <TableCell>
        <span className="font-mono text-xs">{formatDocument(account.document)}</span>
      </TableCell>
      <TableCell className="text-center">
        {numberToCurrent(account.user.fee)}
      </TableCell>
      <TableCell className="text-center font-medium">
        {account.id === "1fff7d44-7a88-4e9a-aca4-2340c86cae6f" ? (
          <span>{numberToCurrent(account.balance / 2)}</span>
        ) : (
          <span>{numberToCurrent(account.balance)}</span>
        )}
      </TableCell>
      <TableCell>
        <span>{FormatAccountStatus(account.status)}</span>
        <div className="text-muted-foreground text-xs">
          <span className="text-amber-600 dark:text-amber-400">{account.rejectedReason}</span>
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
        {account.status === "APPROVED" && (
          <Button asChild variant="ghost" size="sm">
            <Link
              to={`/accounts/${account.id}` as any}
              className="flex items-center text-sm"
            >
              <ArrowRight className="mr-2 h-3 w-3" />
              Visualizar
            </Link>
          </Button>
        )}

        {account.status !== "APPROVED" && (
          <CopyToClipboard
            text={`${window.location.protocol}//${window.location.host}/auth/account/register?inviteId=${account.id}`}
            onCopy={() => {
              toast.success(
                "Link do convite copiado com sucesso.",
                toastStyle.success
              );
            }}
          >
            <Button variant="ghost" size="sm" aria-label="Copiar link de convite">
              <Copy className="w-4 h-4" />
            </Button>
          </CopyToClipboard>
        )}
      </TableCell>
    </motion.tr>
  );
}
