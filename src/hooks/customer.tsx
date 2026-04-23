import { useContext } from "react";
import { CustomerContext } from "../context/customer";

export function useCustomer() {
  const context = useContext(CustomerContext);
  return context;
}
