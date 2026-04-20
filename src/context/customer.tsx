import { createContext, ReactNode, useEffect, useState } from "react";
import { customers } from "@/config/customers.json";
import { api } from "@/lib/api";

export type Customer = {
  id: string;
  name: string;
  ref: string;
  host: string;
  logo: {
    dark: string;
    white: string;
    login: string;
  };
  colors: {
    loginBackground: string;
    buttonBackground: string;
  }
};

type CustomerContextData = {
  customer: Customer;
};

type AuthProviderProps = {
  children: ReactNode;
};

export const CustomerContext = createContext({} as CustomerContextData);

export function CustomerProvider({ children }: AuthProviderProps) {
  const [customer, setCustomer] = useState<Customer>({} as Customer);
  useEffect(() => {
    const configCustomer =
      customers.find((c) => window.location.host.includes(c.host)) ||
      customers[0];

    setCustomer({
      id: configCustomer.id,
      name: configCustomer.name,
      host: configCustomer.host,
      ref: configCustomer.ref,
      logo: {
        dark: configCustomer.logo.dark,
        white: configCustomer.logo.white,
        login: configCustomer.logo.login,
      },
      colors: {
        loginBackground: configCustomer.colors.loginBackground,
        buttonBackground: configCustomer.colors.buttonBackground,
      },
    });

    api.defaults.headers.common.customer = configCustomer.id;
  }, []);

  if (!customer?.name) {
    return null;
  }

  return (
    <CustomerContext.Provider value={{ customer }}>
      {children}
    </CustomerContext.Provider>
  );
}
