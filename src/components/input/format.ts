export const Format = {
  CPFCNPJ: (value: string) => {
    const cleanedValue = value.replace(/\D/g, '');

    if (cleanedValue.length <= 11) {
      // CPF
      return cleanedValue
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})/, '$1-$2')
        .replace(/(-\d{2})\d+?$/, '$1');
    } else {
      // CNPJ
      return cleanedValue
        .replace(/(\d{2})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1/$2')
        .replace(/(\d{4})(\d)/, '$1-$2')
        .replace(/(-\d{2})\d+?$/, '$1');
    }
  },
  CPF: (value = '') => {
    const cleanedValue = value.replace(/\D/g, '');
    return cleanedValue
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  },
  CreditCardNumber: (value = '') => {
    return value
      .replace(/\D/g, '')
      .slice(0, 16)
      .replace(/(\d{4})(\d)/, '$1 $2')
      .replace(/(\d{4})(\d)/, '$1 $2')
      .replace(/(\d{4})(\d)/, '$1 $2');
  },
  CVV: (value = '') => {
    return value.replace(/\D/g, '').slice(0, 3);
  },
  CardExpiration: (value = '') => {
    return value
      .replace(/\D/g, '')
      .slice(0, 4)
      .replace(/(\d{2})(\d)/, '$1/$2');
  },
  Phone: (value = '') => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{4})(\d)/, '$1');
  },
  ZipCode: (value = '') => {
    return value.replace(/\D/g, '')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{3})\d+?$/, '$1');
  },
  Date: (value = '') => {
    return value
      .replace(/\D/g, '')
      .slice(0, 8)
      .replace(/(\d{2})(\d)/, '$1/$2')
      .replace(/(\d{2})(\d)/, '$1/$2');
  },
  DecimalNumber: (value = '') => {
    const cleanedValue = value.replace(/\D/g, ''); // Remove todos os caracteres não numéricos
    const intValue = parseInt(cleanedValue, 10) || 0; // Garante que seja um número inteiro válido, ou 0
    const stringValue = intValue.toString().padStart(3, '0'); // Adiciona zeros à esquerda para garantir ao menos 3 dígitos

    return stringValue
      .replace(/(\d+)(\d{2})$/, '$1,$2') // Insere a vírgula antes das últimas duas casas decimais
      .replace(/\B(?=(\d{3})+(?!\d))/g, '.'); // Adiciona os pontos de milhar
  }
};