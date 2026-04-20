export function formatDocument(document?: string) {
  if (!document) {
    return ''
  }

  const documentTrim = document.replace(/[/,.,-]/g, '')

  if (documentTrim.length === 11) {
    return documentTrim.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
  }
  if (documentTrim.length === 14) {
    return documentTrim.replace(
      /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
      '$1.$2.$3/$4-$5',
    )
  }
  return documentTrim
}

export function formatPhone(phoneNumber: string): string {
  if (!phoneNumber) {
    return '';
  }

  const phone = phoneNumber.replace('+55', '');

  return phone.replace(/\D/g, '')
    .replace('+55', '')
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2')
    .replace(/(-\d{4})\d+?$/, '$1')
}

export function numberToCurrent(number: number | undefined) {
  if (!number) {
    return 'R$ 0,00'
  }

  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(number)
}

export function formatAccountNumber(inputString = '') {
  if (typeof inputString !== 'string' || inputString.length < 2) {
    return inputString
  }

  const penultimateIndex = inputString.length
  const modifiedString =
    inputString.slice(0, penultimateIndex - 1) +
    '-' +
    inputString.slice(penultimateIndex - 1)

  return modifiedString
}

export const FormatCompliance = {
  date: (date: string) => {
    if (date === undefined || date === null || date === "")
      return "Não Identificada";
  
    if (/^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/.test(date))
      return date;
  
    // date = date.split("T")[0];
  
    const auxDate = new Date(date);
    const newDate = new Date(auxDate.setHours(auxDate.getHours() + 5));
  
    const year = newDate.getFullYear();
  
    if (year <= 1000 || year >= 3000) return "Não Identificada";
  
    return newDate.toLocaleDateString("pt-BR");
  },
  phone: (phone = '') => {
    return phone.length === 9
    ? [phone.slice(0, 5), "-", phone.slice(5)].join("")
    : [phone.slice(0, 4), "-", phone.slice(4)].join("");
  },
  name: (name: string) => {
    name = name.toLowerCase();
  let nameArray = name.split(" ");
  nameArray = nameArray.map((item: string): string => {
    if (["dos", "do", "das", "da", "de"].includes(item)) return item;

    return item.charAt(0).toUpperCase() + item.slice(1);
  });
  return nameArray.join(" ");
  },
  document: (document = '') => {
    return formatDocument(document);
  }
};