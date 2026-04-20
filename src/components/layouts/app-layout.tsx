import { useAuth } from "@/hooks/auth";
import { Navigate, Outlet, useLocation, Link } from "@tanstack/react-router";
import { Menu, LogOut } from "lucide-react";
import { motion } from "framer-motion";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { FormatRole } from "@/utils/format-role";
import { cn } from "@/lib/utils";
import { useCustomer } from "@/hooks/customer";
import { ThemeToggle } from "@/components/theme-toggle";

const navItems = [
  { label: "Dashboard", path: "/" },
  { label: "Cadastros", path: "/users" },
  { label: "Contas", path: "/accounts" },
];

export function AppLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const { customer } = useCustomer();
  const path = location.pathname;

  if (!user) {
    return <Navigate to={"/auth/login" as any} />;
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
          {/* Logo */}
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

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => {
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path as any}
                  className={cn(
                    "relative px-4 py-2 text-sm font-medium transition-colors",
                    active
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {item.label}
                  {active && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right side */}
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

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="rounded-full focus:outline-none focus:ring-2 focus:ring-ring"
                    aria-label="Abrir menu do usuário"
                  >
                    <Avatar className="h-9 w-9">
                      <AvatarFallback
                        className="text-xs font-semibold text-white"
                        style={{ backgroundColor: "var(--brand-primary)" }}
                      >
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel className="flex flex-col gap-1">
                    <span className="text-sm font-medium">{user.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {FormatRole(user.role)}
                    </span>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => logout()}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Mobile menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72">
                <nav className="mt-6 flex flex-col gap-1">
                  {navItems.map((item) => {
                    const active = isActive(item.path);
                    return (
                      <Link
                        key={item.path}
                        to={item.path as any}
                        className={cn(
                          "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                          active
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        )}
                      >
                        {item.label}
                      </Link>
                    );
                  })}
                </nav>

                <div className="mt-6 flex items-center gap-3 border-t pt-4">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback
                      className="text-xs font-semibold text-white"
                      style={{ backgroundColor: "var(--brand-primary)" }}
                    >
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm font-medium leading-none">
                      {user.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {FormatRole(user.role)}
                    </p>
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
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <motion.main
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28, ease: "easeOut" }}
        className="mx-auto max-w-[1400px] px-4 py-6 lg:px-8"
      >
        <Outlet />
      </motion.main>
    </div>
  );
}
