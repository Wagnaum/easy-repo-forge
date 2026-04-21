import { Outlet } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useCustomer } from "@/hooks/customer";
import loginImage from "@/assets/login-sports-betting.jpg";

export function LoginLayout() {
  const { customer } = useCustomer();

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background">
      {/* Imagem - metade esquerda (oculta no mobile) */}
      <div className="relative hidden w-1/2 overflow-hidden lg:block">
        <img
          src={loginImage}
          alt="Sistema de apostas esportivas e ganhos"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-transparent to-black/60" />
        <div className="absolute bottom-10 left-10 right-10 text-white">
          <h2 className="text-3xl font-bold leading-tight">
            Gestão inteligente para o seu negócio
          </h2>
          <p className="mt-2 text-sm text-white/80">
            Painel administrativo completo para acompanhar resultados em tempo real.
          </p>
        </div>
      </div>

      {/* Login - metade direita */}
      <div className="flex w-full items-center justify-center p-4 lg:w-1/2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          <div className="mb-8 flex flex-col items-center gap-3">
            <img
              src="/logo-trend-light.png"
              alt="Trend Finance"
              className="h-16 w-auto dark:hidden"
            />
            <img
              src="/logo-trend-dark.png"
              alt="Trend Finance"
              className="hidden h-16 w-auto dark:block"
            />
            <p className="text-sm text-muted-foreground">Painel Administrativo</p>
          </div>

          <Outlet />
        </motion.div>
      </div>
    </div>
  );
}
