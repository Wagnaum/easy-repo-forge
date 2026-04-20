export function FormatRole(role: string): string {
  switch (role) {
    case 'SUPER_ADMIN':
      return 'Super Admin';
    case 'ADMIN':
      return 'Admin';
    case 'MANAGER':
      return 'Gerente';
    case 'OPERATOR':
      return 'Jogador';
    default:
      return role;
  }
}


export function FormatAccountStatus(status: string): string {
  switch (status) {
    case 'PENDING':
      return 'Pendente';
    case 'WAITING_DOCUMENT':
      return 'Aguardando documentos/kyc';
    case 'WAITING_ADDRESS':
      return 'Aguardando endereço';
    case 'WAITING_INDIVIDUAL':
      return 'Aguardando dados pessoais';
    case 'APPROVED':
      return 'Aprovada';
    case 'REJECTED':
      return 'Conta Rejeitada';
    case 'IN_ANALYSIS':
      return 'Em análise';
    case 'upload_error':
      return 'Documento inválido';
    default:
      return status;
  }
}


export function FormatZeroRateStatus(status: string | undefined): string {
  switch (status) {
    case 'PENDING':
      return 'Pendente';
    case 'CANCELED':
      return 'Cancelado';
    case 'WAITING_ANALYSIS':
      return 'Aguardando análise';
    case 'PROCESSING':
      return 'Processando';
    case 'APPROVED':
      return 'Concluído';
    case 'APPROVED_WITH_FEE':
      return 'Concluído';
    case 'REJECTED':
      return 'Rejeitado';
    case 'WAITING_PROCESSING':
      return 'Aguardando processamento';
    default:
      return status ?? '';
  }
}



