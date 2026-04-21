import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/auth";
import { useCustomer } from "@/hooks/customer";
import { api, parseError } from "@/lib/api";
import { toastStyle } from "@/utils/toast-style";
import { Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "@tanstack/react-router";
import { useNavigate } from "@/lib/use-navigate";
import { AnimatePresence, motion } from "framer-motion";
import { LottieLoader } from "@/components/shared/lottie-loader";

export function LoginPage() {
  const { login } = useAuth();
  const navigation = useNavigate();
  const { customer } = useCustomer();
  const [loading, setLoading] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [enable2fa, setEnable2fa] = useState(false);
  const [token, setToken] = useState("");

  // overlay de tela cheia quando o loading passa de 400ms
  useEffect(() => {
    if (!loading) {
      setShowOverlay(false);
      return;
    }
    const t = setTimeout(() => setShowOverlay(true), 400);
    return () => clearTimeout(t);
  }, [loading]);

  const handlePreLogin = async (e: FormEvent) => {
    e.preventDefault();

    if (enable2fa && token) {
      handleLogin(e);
      return;
    }

    if (!email || !password) return;
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
    if (!email || !password) return;
    setLoading(true);

    login(email, password, token)
      .then(() => {
        // mantém o loading ativo durante a navegação
        navigation("/", { replace: true });
      })
      .catch((e) => {
        if (e.code === "user-not-verified") {
          toast.error(e.message, toastStyle.error);
          setTimeout(
            () =>
              navigation(`/auth/register?inviteId=${e.id}`, {
                state: { email: email },
              }),
            800
          );
          return;
        }

        const message = parseError(e);
        toast.error(message.message, toastStyle.error);
        setLoading(false);
      });
  };

  return (
    <>
      <AnimatePresence>
        {showOverlay && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-3 bg-background/80 backdrop-blur-sm"
            role="status"
            aria-live="polite"
          >
            <LottieLoader
              size={128}
              label={enable2fa ? "Validando código..." : "Autenticando..."}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handlePreLogin} className="space-y-4">
            {!enable2fa && (
              <>
                <div className="space-y-1.5">
                  <Label htmlFor="email">E-mail</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      required
                      placeholder="seu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Senha</Label>
                    <Link
                      to={"/auth/forgot-password" as any}
                      className="text-xs text-muted-foreground hover:text-foreground underline"
                    >
                      Esqueceu sua senha?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                      aria-label="Mostrar/ocultar senha"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              </>
            )}

            {enable2fa && (
              <div className="space-y-1.5">
                <Label htmlFor="token">Duplo fator de autenticação</Label>
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

            <Button
              type="submit"
              disabled={loading}
              className="w-full text-white"
              style={{ backgroundColor: "var(--brand-primary)" }}
            >
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Entrar
            </Button>

            {enable2fa && (
              <Button
                variant="link"
                type="button"
                className="w-full"
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
          </form>
        </CardContent>
      </Card>

      <p className="mt-6 text-center text-xs text-muted-foreground">
        {customer?.name ?? "Trend Finance"} — Painel Administrativo
      </p>
      </motion.div>
    </>
  );
}
