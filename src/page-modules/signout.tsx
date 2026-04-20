// import { useAuth } from "@/hooks/auth";
import { api } from "@/lib/api";
import { toastStyle } from "@/utils/toast-style";
import { useEffect } from "react";
import toast from "react-hot-toast";

export function SignOutPage() {
  // const { logout } = useAuth();

  useEffect(() => {
    toast.error("Sua sessão expirou. Faça o Login novamente.", {
      id: "signout",
      ...toastStyle.error,
    });
    localStorage.removeItem("@herobank:token");
    api.defaults.headers.common.Authorization = "";
    // logout();
  }, []);

  return null;
}
