import { motion } from "framer-motion";
import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useQuery } from "@tanstack/react-query";
import {
  getGlobalTransactions,
  GetTransactionResponse,
} from "@/api/get-transactions";
import { Skeleton } from "@/components/ui/skeleton";
import { numberToCurrent } from "@/utils/format";
import { cn } from "@/lib/utils";

interface TransactionsCardProps {
  title: string;
  subtitle: string;
  orderBy: "createdAt" | "amount";
  startAt?: Date;
  endAt?: Date;
  index?: number;
}

export function TransactionsCard({
  title,
  subtitle,
  orderBy,
  startAt,
  endAt,
  index = 0,
}: TransactionsCardProps) {
  const { data, isLoading } = useQuery({
    queryKey: ["transactions:dashboard", orderBy, startAt, endAt],
    queryFn: () =>
      getGlobalTransactions({ limit: 5, orderBy, order: "desc", startAt, endAt }),
    enabled: !!startAt && !!endAt,
  });

  const transactions: GetTransactionResponse[] = data?.data ?? [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className="rounded-xl border bg-card p-6"
    >
      <div className="mb-4">
        <h3 className="text-base font-semibold tracking-tight">{title}</h3>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full rounded-md" />
          ))}
        </div>
      ) : transactions.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">
          Nenhuma transação no período
        </p>
      ) : (
        <ul className="divide-y divide-border">
          {transactions.map((tx) => {
            const isCredit = tx.credit;
            const counterpartName = isCredit
              ? tx.consignorName
              : tx.beneficiaryName;
            return (
              <li key={tx.id} className="flex items-center gap-3 py-3">
                <div
                  className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
                    isCredit
                      ? "bg-emerald-500/10 text-emerald-600"
                      : "bg-destructive/10 text-destructive"
                  )}
                >
                  {isCredit ? (
                    <ArrowDownLeft className="h-4 w-4" />
                  ) : (
                    <ArrowUpRight className="h-4 w-4" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">
                    {counterpartName || tx.description || tx.type}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(tx.createdAt), {
                      locale: ptBR,
                      addSuffix: true,
                    })}
                  </p>
                </div>
                <div
                  className={cn(
                    "shrink-0 text-sm font-semibold tabular-nums",
                    isCredit ? "text-emerald-600" : "text-foreground"
                  )}
                >
                  {isCredit ? "+" : "-"}
                  {numberToCurrent(tx.amount)}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </motion.div>
  );
}
