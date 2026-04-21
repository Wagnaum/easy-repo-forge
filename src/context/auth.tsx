import { useState, createContext, useEffect, ReactNode } from "react";
import { api } from "@/lib/api";
import { Loader } from "lucide-react";
import { queryClient } from "@/lib/react-query";

export interface UserProps {
  id: string;
  email: string;
  name: string;
  credits: number;
  emailVerified: boolean;
  status: string;
  role: string;
  isTwoFactorEnabled: boolean;
}

export interface AuthContextProps {
  user: UserProps | null;
  login: (email: string, password: string, token?: string) => Promise<void>;
  logout: () => Promise<void>;
  loginWithToken: (token: string, user: UserProps) => Promise<void>;
  loginWithGoogle: () => Promise<string>;
  validateGoogle: (code: string) => Promise<void>;
  refreshUser: () => Promise<void>;
  setCredits: (credits: number) => Promise<void>;
}

export const AuthContext = createContext<AuthContextProps>(
  {} as AuthContextProps
);

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProps | null>(null);
  const [isLoading, setLoading] = useState(true);

  const login = async (email: string, password: string, token = "") => {
    const { data } = await api.post("/users/authenticate", {
      email,
      password,
      token: token ?? undefined,
    });

    // for this particular app we need the user to verify their email before login
    if (data.user.status !== "APPROVED")
      throw {
        id: data.user.id,
        message: "Seu cadastro ainda não foi verificado.",
        code: "user-not-verified",
      };

    localStorage.setItem("@herobank:token", data.token);
    api.defaults.headers.common.Authorization = `Bearer ${data.token}`;
    setUser(data.user);
  };

  const logout = async () => {
    localStorage.removeItem("@herobank:token");
    api.defaults.headers.common.Authorization = "";
    setUser(null);
    await queryClient.invalidateQueries();
    queryClient.clear();
  };

  // this is used to login user after email validation
  const loginWithToken = async (token: string, user: UserProps) => {
    localStorage.setItem("@herobank:token", token);
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
    setUser(user);
  };

  const loginWithGoogle = async () => {
    const { data } = await api.get("/oauth2/google/login");

    return data.url;
  };

  const validateGoogle = async (code: string) => {
    const { data } = await api.post("/oauth2/google/login", {
      code,
    });
    localStorage.setItem("@herobank:token", data.token);
    api.defaults.headers.common.Authorization = `Bearer ${data.token}`;
    setUser(data.user);
  };

  //
  // 🙋‍♂️🔄 Refresh user info
  const refreshUser = async () => {
    try {
      const { data } = await api.get("/users");
      setUser(data.user);
    } catch {
      localStorage.removeItem("@herobank:token");
      api.defaults.headers.common.Authorization = "";
      setUser(null);
    }
  };

  //
  //  Set credit balance (used after sone AI action is performed)
  const setCredits = async (credits: number) => {
    if (user) setUser({ ...user, credits });
  };

  // 🧩🔎 Check for token
  useEffect(() => {
    const checkToken = async () => {
      const token: string | null = localStorage.getItem("@herobank:token");
      if (token && token != "undefined" && token != "null") {
        api.defaults.headers.common.Authorization = `Bearer ${token}`;
        await refreshUser();
      } else {
        setUser(null);
      }
      setLoading(false);
    };
    checkToken();
  }, []);

  // refreshUser at every 1 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      if (user) refreshUser();
    }, 60000);

    return () => clearInterval(interval);
  }, [user]);

  if (isLoading)
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader className="animate-spin ml-2 w-8 h-8 text-brand-500" />
      </div>
    );

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        loginWithToken,
        loginWithGoogle,
        validateGoogle,
        refreshUser,
        setCredits,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
