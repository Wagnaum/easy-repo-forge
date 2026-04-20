/**
 * Mapeia os status do HeroBank para as chaves visuais do StatusBadge.
 */
export function mapAccountStatus(status?: string): string {
  switch (status) {
    case "APPROVED":
      return "aprovada";
    case "REJECTED":
    case "REJECTED_KYC":
      return "rejeitado";
    case "BLOCKED":
      return "bloqueada";
    case "WAITING_DOCUMENT":
    case "WAITING_KYC":
      return "aguardando_kyc";
    case "WAITING_INDIVIDUAL":
    case "WAITING_ADDRESS":
    case "WAITING_ANALYSIS":
    case "IN_ANALYSIS":
      return "em_analise";
    case "PRE_APPROVED":
      return "pre_aprovado";
    case "PENDING":
    default:
      return "pendente";
  }
}

export function mapUserStatus(status?: string): string {
  switch (status) {
    case "APPROVED":
      return "aprovado";
    case "BLOCKED":
      return "bloqueado";
    case "REJECTED":
    case "REJECTED_KYC":
      return "rejeitado";
    case "PRE_APPROVED":
      return "pre_aprovado";
    case "WAITING_DOCUMENT":
    case "WAITING_KYC":
      return "aguardando_kyc";
    case "WAITING_INDIVIDUAL":
    case "WAITING_ADDRESS":
    case "WAITING_ANALYSIS":
    case "IN_ANALYSIS":
      return "em_analise";
    case "PENDING":
    default:
      return "pendente";
  }
}
