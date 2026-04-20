import { useAuth } from "@/hooks/auth";
import { Navigate, Outlet } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useCustomer } from "@/hooks/customer";

export function LoginLayout() {
  const { user } = useAuth();
  const { customer } = useCustomer();

  if (user) {
    return <Navigate to="/" />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <div className="mb-8 flex flex-col items-center gap-2">
          <div
            className="flex h-14 w-14 items-center justify-center rounded-2xl text-2xl font-bold text-white"
            style={{ backgroundColor: "var(--brand-primary)" }}
          >
            {customer?.name?.charAt(0) ?? "P"}
          </div>
          <h1 className="text-2xl font-bold text-foreground">
            {customer?.name ?? "Plataforma"}
          </h1>
          <p className="text-sm text-muted-foreground">Painel Administrativo</p>
        </div>

        <Outlet />
      </motion.div>
    </div>
  );
}
