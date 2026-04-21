import { useAuth } from "@/hooks/auth";
import { Outlet, useLocation, Link, useNavigate } from "@tanstack/react-router";
import { Menu, X, LogOut, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { FormatRole } from "@/utils/format-role";
import { useCustomer } from "@/hooks/customer";
import { ThemeToggle } from "@/components/theme-toggle";


const navItems = [
  { label: "Dashboard", path: "/" },
  { label: "Usuários", path: "/users" },
  { label: "Contas", path: "/accounts" },
];

export function AppLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { customer } = useCustomer();
  const path = location.pathname;
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!user && typeof window !== "undefined") {
      const token = window.localStorage.getItem("@herobank:token");
      if (!token || token === "undefined" || token === "null") {
        navigate({ to: "/auth/login" });
      }
    }
  }, [user, navigate]);

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const initials = (user.name ?? "U")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const isActive = (p: string) =>
    p === "/" ? path === "/" : path.startsWith(p);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-4 lg:px-8">
          <Link to="/" className="flex items-center gap-2">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-lg text-sm font-bold text-white"
              style={{ backgroundColor: "var(--brand-primary)" }}
            >
              {customer?.name?.charAt(0) ?? "P"}
            </div>
            <span className="text-lg font-bold text-foreground">
              {customer?.name ?? "Plataforma"}
            </span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => {
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path as any}
                  className="relative px-4 py-2 text-sm font-medium transition-colors duration-200"
                  style={{ color: active ? "var(--brand-primary)" : undefined }}
                >
                  {item.label}
                  {active && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5"
                      style={{ backgroundColor: "var(--brand-primary)" }}
                      transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <ThemeToggle />

            <div className="hidden items-center gap-2 md:flex">
              <div className="text-right">
                <p className="text-sm font-medium leading-none text-foreground">
                  {user.name?.split(" ")[0]}
                </p>
                <p className="text-xs text-muted-foreground">
                  {FormatRole(user.role)}
                </p>
              </div>
              <Avatar className="h-9 w-9">
                <AvatarFallback
                  className="text-xs font-semibold text-white"
                  style={{ backgroundColor: "var(--brand-primary)" }}
                >
                  {initials}
                </AvatarFallback>
              </Avatar>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => logout()}
                aria-label="Sair"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Abrir menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden border-t md:hidden"
            >
              <nav className="flex flex-col gap-1 p-4">
                {navItems.map((item) => {
                  const active = isActive(item.path);
                  return (
                    <Link
                      key={item.path}
                      to={item.path as any}
                      onClick={() => setMobileOpen(false)}
                      className="rounded-lg px-4 py-2 text-sm font-medium transition-colors"
                      style={{
                        color: active ? "var(--brand-primary)" : undefined,
                        backgroundColor: active ? "var(--brand-primary-light)" : undefined,
                      }}
                    >
                      {item.label}
                    </Link>
                  );
                })}
                <div className="mt-2 flex items-center gap-2 border-t pt-3">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback
                      className="text-xs font-semibold text-white"
                      style={{ backgroundColor: "var(--brand-primary)" }}
                    >
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm font-medium leading-none">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{FormatRole(user.role)}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => logout()}
                    aria-label="Sair"
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="mx-auto max-w-[1400px] space-y-6 px-4 py-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}
