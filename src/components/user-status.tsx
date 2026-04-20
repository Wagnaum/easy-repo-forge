import { UserStatus } from "@/pages/users/types";

interface UserStatusProps {
  status: UserStatus;
}

const UserStatusMap: Partial<Record<UserStatus, string>> = {
  APPROVED: "Aprovado",
  PENDING: "Pendente",
  REJECTED: "Rejeitado",
  WAITING_ADDRESS: "Aguardando endereço",
  WAITING_ANALYSIS: "Aguardando análise",
  WAITING_DOCUMENT: "Aguardando documentos",
  WAITING_INDIVIDUAL: "Aguardando dados individuais",
  PRE_APPROVED: "Pré-aprovado",
  REJECTED_KYC: "Rejeitado KYC",
  BLOCKED: "Bloqueado",
  IN_ANALYSIS: "Em análise",
} as const;

export function UserStatusComponent({ status }: UserStatusProps) {
  return (
    <div className="flex items-center gap-2">
      {status === "APPROVED" && (
        <span
          data-testid="badge"
          className="h-2 w-2 rounded-full bg-green-500"
        />
      )}

      {status === "PRE_APPROVED" && (
        <span
          data-testid="badge"
          className="h-2 w-2 rounded-full bg-emerald-500"
        />
      )}

      {/* {status === "BLOCKED" && (
        <span
          data-testid="badge"
          className="h-2 w-2 rounded-full bg-rose-500"
        />
      )} */}

      {["WAITING_ANALYSYS"].includes(status) && (
        <span
          data-testid="badge"
          className="h-2 w-2 rounded-full bg-blue-700"
        />
      )}

      {["REJECTED", "REJECTED_KYC", "BLOCKED"].includes(status) && (
        <span
          data-testid="badge"
          className="h-2 w-2 rounded-full bg-rose-500"
        />
      )}

      {![
        "APPROVED",
        "IN_ANALYSIS",
        "WAITING_ANALYSYS",
        "PRE_APPROVED",
        "REJECTED",
        "REJECTED_KYC",
        "RESEND_DOCUMENTS",
        "BLOCKED",
      ].includes(status) && (
        <span
          data-testid="badge"
          className="h-2 w-2 rounded-full bg-gray-500"
        />
      )}

      {[UserStatusMap[status]]}
    </div>
  );
}
