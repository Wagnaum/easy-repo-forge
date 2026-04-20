import { cn } from "@/lib/utils";

const statusConfig: Record<string, { color: string; dot: string }> = {
  pendente: { color: "text-gray-600 dark:text-gray-400", dot: "bg-gray-400" },
  aprovado: { color: "text-emerald-600 dark:text-emerald-400", dot: "bg-emerald-500" },
  aprovada: { color: "text-emerald-600 dark:text-emerald-400", dot: "bg-emerald-500" },
  bloqueado: { color: "text-red-600 dark:text-red-400", dot: "bg-red-500" },
  bloqueada: { color: "text-red-600 dark:text-red-400", dot: "bg-red-500" },
  rejeitado: { color: "text-red-600 dark:text-red-400", dot: "bg-red-500" },
  aguardando_kyc: { color: "text-amber-600 dark:text-amber-400", dot: "bg-amber-500" },
  aguardando_documento: { color: "text-amber-600 dark:text-amber-400", dot: "bg-amber-500" },
  em_analise: { color: "text-blue-600 dark:text-blue-400", dot: "bg-blue-500" },
  pre_aprovado: { color: "text-indigo-600 dark:text-indigo-400", dot: "bg-indigo-500" },
};

const statusLabels: Record<string, string> = {
  pendente: "Pendente",
  aprovado: "Aprovado",
  aprovada: "Aprovada",
  bloqueado: "Bloqueado",
  bloqueada: "Bloqueada",
  rejeitado: "Rejeitado",
  aguardando_kyc: "Aguardando KYC",
  aguardando_documento: "Aguardando documentos",
  em_analise: "Em análise",
  pre_aprovado: "Pré-aprovado",
};

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status] || statusConfig.pendente;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-sm font-medium",
        config.color,
        className
      )}
    >
      <span className={cn("h-2 w-2 rounded-full", config.dot)} />
      {statusLabels[status] || status}
    </span>
  );
}

const roleColors: Record<string, string> = {
  SUPER_ADMIN: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  ADMIN: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  MANAGER: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300",
  OPERATOR: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
};

const roleLabels: Record<string, string> = {
  SUPER_ADMIN: "Super Admin",
  ADMIN: "Admin",
  MANAGER: "Gerente",
  OPERATOR: "Operador",
};

interface RoleBadgeProps {
  role: string;
  className?: string;
}

export function RoleBadge({ role, className }: RoleBadgeProps) {
  const color = roleColors[role] || roleColors.OPERATOR;
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
        color,
        className
      )}
    >
      {roleLabels[role] || role}
    </span>
  );
}

interface TransactionTypeBadgeProps {
  type: "credito" | "debito" | string;
}

export function TransactionTypeBadge({ type }: TransactionTypeBadgeProps) {
  const isCredit = type === "credito" || type === "CREDIT" || type === "IN";
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
        isCredit
          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300"
          : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
      )}
    >
      {isCredit ? "Crédito" : "Débito"}
    </span>
  );
}
