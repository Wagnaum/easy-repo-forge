import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCustomer } from "@/hooks/customer";
import { api, parseError } from "@/lib/api";
import { toastStyle } from "@/utils/toast-style";
import { Loader2 } from "lucide-react";
import { FormEvent, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "@/lib/use-navigate";
import { useSearchParams } from "@/lib/use-search-params";
import { z } from "zod";

export function ForgotPasswordPage() {
  const navigate = useNavigate();
  const { customer } = useCustomer();
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState("");

  const [searchParams] = useSearchParams();
  const token = z.string().parse(searchParams.get("token") ?? "");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSendForgot = async (e: FormEvent) => {
    e.preventDefault();
    if (!email) {
      return;
    }

    try {
      setLoading(true);
      await api.post("/users/send-forgot-password", {
        email,
        name: customer.name,
        url: `${window.location.protocol}//${window.location.host}/auth/forgot-password`,
      });

      toast.success(
        "Foi enviado um e-mail para redefinição de senha.",
        toastStyle.success
      );
    } catch (err) {
      const error = parseError(err);
      toast.error(error.message, toastStyle.error);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: FormEvent) => {
    e.preventDefault();
    if (!password || !confirmPassword) {
      return;
    }

    if (password !== confirmPassword) {
      toast.error("As senhas não coincidem", toastStyle.error);
      return;
    }

    try {
      setLoading(true);
      await api.post("/users/forgot-password", {
        token,
        password,
      });

      toast.success("Senha alterada com sucesso", toastStyle.success);
      navigate("/auth/login");
    } catch (err) {
      const error = parseError(err);
      toast.error(error.message, toastStyle.error);
    } finally {
      setLoading(false);
    }
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
          {!token && (
            <form onSubmit={handleSendForgot}>
              <div className="grid gap-4">
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
                </>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading && <Loader2 className="w-5 h-5 mr-2 animate-spin" />}
                  Próximo
                </Button>
              </div>
            </form>
          )}

          {token && (
            <form onSubmit={handleResetPassword}>
              <div className="grid gap-4">
                <>
                  <div className="grid gap-2">
                    <Label htmlFor="password">Senha</Label>
                    <Input
                      id="password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="password">Confirme sua senha</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                </>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading && <Loader2 className="w-5 h-5 mr-2 animate-spin" />}
                  Próximo
                </Button>
              </div>
            </form>
          )}
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
