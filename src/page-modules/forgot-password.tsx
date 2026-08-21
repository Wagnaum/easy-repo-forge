import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCustomer } from "@/hooks/customer";
import { api, parseError } from "@/lib/api";
import { toastStyle } from "@/utils/toast-style";
import { ArrowLeft, Loader2, MailCheck } from "lucide-react";
import { FormEvent, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "@tanstack/react-router";
import { useNavigate } from "@/lib/use-navigate";
import { useSearchParams } from "@/lib/use-search-params";
import { z } from "zod";

const emailSchema = z
  .string()
  .trim()
  .min(1, "Informe seu e-mail")
  .email("Informe um e-mail válido")
  .max(255, "E-mail muito longo");

const passwordSchema = z
  .string()
  .min(8, "A senha deve ter pelo menos 8 caracteres")
  .max(72, "A senha deve ter no máximo 72 caracteres");

export function ForgotPasswordPage() {
  const navigate = useNavigate();
  const { customer } = useCustomer();
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [sentTo, setSentTo] = useState<string | null>(null);

  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmError, setConfirmError] = useState<string | null>(null);
  const [tokenInvalid, setTokenInvalid] = useState(false);

  const handleSendForgot = async (e: FormEvent) => {
    e.preventDefault();

    const parsed = emailSchema.safeParse(email);
    if (!parsed.success) {
      setEmailError(parsed.error.issues[0]?.message ?? "E-mail inválido");
      return;
    }
    setEmailError(null);

    try {
      setLoading(true);
      await api.post("/users/send-forgot-password", {
        email: parsed.data,
        name: customer.name,
        url: `${window.location.protocol}//${window.location.host}/auth/forgot-password`,
      });

      setSentTo(parsed.data);
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

    const parsed = passwordSchema.safeParse(password);
    if (!parsed.success) {
      setPasswordError(parsed.error.issues[0]?.message ?? "Senha inválida");
      return;
    }
    setPasswordError(null);

    if (password !== confirmPassword) {
      setConfirmError("As senhas não coincidem");
      return;
    }
    setConfirmError(null);

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
      setTokenInvalid(true);
      toast.error(error.message, toastStyle.error);
    } finally {
      setLoading(false);
    }
  };

  const backToLogin = (
    <Link
      to={"/auth/login" as never}
      className="inline-flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground"
    >
      <ArrowLeft className="h-4 w-4" />
      Voltar ao login
    </Link>
  );

  return (
    <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">
              {token ? "Definir nova senha" : "Esqueci minha senha"}
            </h1>
            <p className="text-balance text-muted-foreground">
              {token
                ? "Escolha uma nova senha para acessar sua conta"
                : "Informe seu e-mail e enviaremos um link de redefinição"}
            </p>
          </div>

          {!token && sentTo && (
            <div className="grid gap-4">
              <div className="flex items-start gap-3 rounded-md border border-border bg-muted/50 p-4">
                <MailCheck className="mt-0.5 h-5 w-5 text-accent" />
                <div className="text-sm">
                  <p className="font-medium text-foreground">
                    Enviamos um link para {sentTo}
                  </p>
                  <p className="mt-1 text-muted-foreground">
                    Verifique sua caixa de entrada e o spam. O link expira após
                    algum tempo.
                  </p>
                </div>
              </div>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                disabled={loading}
                onClick={() => setSentTo(null)}
              >
                Enviar para outro e-mail
              </Button>
              <div className="text-center">{backToLogin}</div>
            </div>
          )}

          {!token && !sentTo && (
            <form onSubmit={handleSendForgot}>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (emailError) setEmailError(null);
                    }}
                    aria-invalid={!!emailError}
                  />
                  {emailError && (
                    <p className="text-sm text-destructive">{emailError}</p>
                  )}
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading && <Loader2 className="w-5 h-5 mr-2 animate-spin" />}
                  Enviar link
                </Button>

                <div className="text-center">{backToLogin}</div>
              </div>
            </form>
          )}

          {token && (
            <form onSubmit={handleResetPassword}>
              <div className="grid gap-4">
                {tokenInvalid && (
                  <div className="rounded-md border border-destructive/40 bg-destructive/10 p-4 text-sm">
                    <p className="font-medium text-foreground">
                      Link inválido ou expirado
                    </p>
                    <p className="mt-1 text-muted-foreground">
                      Solicite um novo link de redefinição para continuar.
                    </p>
                    <Link
                      to={"/auth/forgot-password" as never}
                      className="mt-2 inline-block font-medium underline"
                      onClick={() => setTokenInvalid(false)}
                    >
                      Solicitar novo link
                    </Link>
                  </div>
                )}

                <div className="grid gap-2">
                  <Label htmlFor="password">Nova senha</Label>
                  <Input
                    id="password"
                    type="password"
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (passwordError) setPasswordError(null);
                    }}
                    aria-invalid={!!passwordError}
                  />
                  {passwordError ? (
                    <p className="text-sm text-destructive">{passwordError}</p>
                  ) : (
                    <p className="text-xs text-muted-foreground">
                      Mínimo de 8 caracteres.
                    </p>
                  )}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="confirm-password">Confirme sua senha</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (confirmError) setConfirmError(null);
                    }}
                    aria-invalid={!!confirmError}
                  />
                  {confirmError && (
                    <p className="text-sm text-destructive">{confirmError}</p>
                  )}
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading && <Loader2 className="w-5 h-5 mr-2 animate-spin" />}
                  Redefinir senha
                </Button>

                <div className="text-center">{backToLogin}</div>
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
