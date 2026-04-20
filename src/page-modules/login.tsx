import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/auth";
import { useCustomer } from "@/hooks/customer";
import { api, parseError } from "@/lib/api";
import { toastStyle } from "@/utils/toast-style";
import { Loader2 } from "lucide-react";
import { FormEvent, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "@tanstack/react-router";
import { useNavigate } from "@/lib/use-navigate";

export function LoginPage() {
  const { login } = useAuth();
  const navigation = useNavigate();
  const { customer } = useCustomer();
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [enable2fa, setEnable2fa] = useState(false);
  const [token, setToken] = useState("");

  const handlePreLogin = async (e: FormEvent) => {
    e.preventDefault();

    if (enable2fa && token) {
      handleLogin(e);
      return;
    }

    if (!email || !password) {
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.post("/users/pre-authenticate", {
        email,
        password,
      });

      if (data?.user?.isTwoFactorEnabled) {
        setEnable2fa(true);
      } else {
        handleLogin(e);
        return;
      }
    } catch (err) {
      const error = parseError(err);
      toast.error(error.message, toastStyle.error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      return;
    }
    setLoading(true);

    login(email, password, token)
      .then(() => {
        // navigation("/");
      })
      .catch((e) => {
        if (e.code === "user-not-verified") {
          toast.error(e.message, toastStyle.error);
          console.log("user-not-verified");
          setTimeout(
            () =>
              navigation(`/auth/register?inviteId=${e.id}`, {
                state: { email: email },
              }),
            800
          );
          return;
        } else {
          const message = parseError(e);
          toast.error(message.message, toastStyle.error);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Entrar</h1>
            <p className="text-balance text-muted-foreground">
              Insira seu e-mail abaixo para fazer login
            </p>
          </div>
          <form onSubmit={handlePreLogin}>
            <div className="grid gap-4">
              {!enable2fa && (
                <>
                  <div className="grid gap-2">
                    <Label htmlFor="email">E-mail</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <div className="flex items-center">
                      <Label htmlFor="password">Password</Label>
                      <Link
                        to={"/auth/forgot-password" as any}
                        className="ml-auto inline-block text-sm underline"
                      >
                        Esqueceu sua senha?
                      </Link>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </>
              )}

              {enable2fa && (
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="token">Duplo fator de autenticação</Label>
                  </div>
                  <Input
                    id="token"
                    type="text"
                    required
                    value={token}
                    autoComplete="off"
                    onChange={(e) => setToken(e.target.value)}
                  />
                </div>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="w-5 h-5 mr-2 animate-spin" />}
                Entrar
              </Button>

              {enable2fa && (
                <Button
                  variant="link"
                  type="button"
                  onClick={() => {
                    setEnable2fa(false);
                    setToken("");
                    setEmail("");
                    setPassword("");
                  }}
                >
                  Voltar para o login
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>
      <div
        className={`hidden h-screen lg:flex items-center justify-center`}
        style={{
          backgroundColor: customer.colors.loginBackground,
        }}
      >
        {customer.name === "Invest Ban" ? (
          <img src={customer.logo.login} alt="Image" className="h-60 w-auto" />
        ) : (
          <img
            src={customer.logo.dark}
            alt="Image"
            className="w-auto max-w-96"
          />
        )}
      </div>
    </div>
  );
}
