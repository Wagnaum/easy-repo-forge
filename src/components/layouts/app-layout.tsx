import { useAuth } from "@/hooks/auth";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { CircleUser, Menu } from "lucide-react";
import { Link } from "react-router-dom";

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
import { FormatRole } from "@/utils/format-role";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useCustomer } from "@/hooks/customer";
// import { Badge } from "../ui/badge";
// import { useQuery } from "@tanstack/react-query";
// import { getZeroRate, GetZeroRatesResponse } from "@/api/get-zero-rate";

export function AppLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const [path, setPath] = useState<string>(location.pathname);

  const { customer } = useCustomer();

  useEffect(() => {
    setPath(location.pathname);
  }, [location]);

  // const canFetchZeroRates = user?.role === "SUPER_ADMIN" || false;

  // const { data } = useQuery<GetZeroRatesResponse>({
  //   queryKey: ["zerorate:backoffice"],
  //   enabled: canFetchZeroRates,
  //   queryFn: () =>
  //     getZeroRate({
  //       pageIndex: 0,
  //       type: "FREE",
  //       status: "WAITING_ANALYSIS",
  //     }),
  //   refetchInterval: 1000 * 30, // 30 seconds
  // });

  // This layout is used in protected routes
  if (!user) {
    return <Navigate to="/auth/login" />;
  }

  // const hasPendingZeroRatesLess10 =
  //   data?.data?.length && data.data.length > 0 && data.data.length < 10;

  // const hasPendingZeroRatesMore10 =
  //   data?.data?.length && data.data.length >= 10;

  function handleLogout() {
    logout();
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 flex h-20 items-center gap-4 border-b bg-background px-4 md:px-6">
        <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6 w-full">
          <Link
            to="#"
            className="flex items-center gap-2 text-lg font-semibold md:text-base"
          >
            {customer.name === "Invest Ban" ? (
              <img
                className="mx-auto"
                src={customer.logo.dark}
                alt={customer.name}
                width={190}
              />
            ) : (
              <>
                {customer.name === "PG Bank" ? (
                  <img
                    className="mx-auto"
                    src={customer.logo.dark}
                    alt={customer.name}
                    width={200}
                  />
                ) : (
                  <img
                    className="mx-auto h-16 w-auto"
                    src={customer.logo.dark}
                    alt={customer.name}
                  />
                )}
              </>
            )}
            <span className="sr-only">Hero Bank</span>
          </Link>
          <Link
            to="/"
            className={cn(
              "transition-colors hover:text-foreground",
              path === "/" ? "text-foreground" : "text-muted-foreground"
            )}
          >
            Dashboard
          </Link>
          <Link
            to="/users"
            className={cn(
              "transition-colors hover:text-foreground",
              path.includes("/users")
                ? "text-foreground"
                : "text-muted-foreground"
            )}
          >
            Cadastros
          </Link>
          <Link
            to="/accounts"
            className={cn(
              "transition-colors hover:text-foreground",
              path.includes("/accounts")
                ? "text-foreground"
                : "text-muted-foreground"
            )}
          >
            Contas
          </Link>
          {/* {user.role === "SUPER_ADMIN" && (
            <Link
              to="/zero-rate"
              className={cn(
                "transition-colors hover:text-foreground",
                path.includes("/zero-rate")
                  ? "text-foreground"
                  : "text-muted-foreground"
              )}
            >
              Taxa Zero
              {hasPendingZeroRatesLess10 ? (
                <Badge variant="notification">{data?.data?.length}</Badge>
              ) : null}
              {hasPendingZeroRatesMore10 ? (
                <Badge variant="notification" className="w-6 h-6">
                  9+
                </Badge>
              ) : null}
            </Link>
          )} */}
          {/* <Link
            to="/gateways"
            className={cn(
              "transition-colors hover:text-foreground",
              path.includes("/gateways")
                ? "text-foreground"
                : "text-muted-foreground"
            )}
          >
            Gateways
          </Link> */}
          {/* <Link
            to="#"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Configurações
          </Link> */}
        </nav>
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="shrink-0 md:hidden"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <nav className="grid gap-6 text-lg font-medium">
              <Link
                to="/"
                className="flex items-center gap-2 text-lg font-semibold"
              >
                <img
                  className="h-16 w-auto"
                  src={customer.logo.dark}
                  alt="Hero Bank"
                />
                <span className="sr-only">Hero Bank</span>
              </Link>
              <Link
                to="/"
                className={cn(
                  "transition-colors hover:text-foreground",
                  path === "/" ? "text-foreground" : "text-muted-foreground"
                )}
              >
                Dashboard
              </Link>
              <Link
                to="/users"
                className={cn(
                  "transition-colors hover:text-foreground",
                  path.includes("/users")
                    ? "text-foreground"
                    : "text-muted-foreground"
                )}
              >
                Cadastros
              </Link>
              <Link
                to="/accounts"
                className={cn(
                  "transition-colors hover:text-foreground",
                  path.includes("/accounts")
                    ? "text-foreground"
                    : "text-muted-foreground"
                )}
              >
                Contas
              </Link>
              {/* {user.role === "SUPER_ADMIN" && (
                <Link
                  to="/zero-rate"
                  className={cn(
                    "transition-colors hover:text-foreground",
                    path.includes("/zero-rate")
                      ? "text-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  Taxa Zero
                  {hasPendingZeroRatesLess10 ? (
                    <Badge variant="notification">{data?.data?.length}</Badge>
                  ) : null}
                  {hasPendingZeroRatesMore10 ? (
                    <Badge variant="notification" className="w-6 h-6">
                      9+
                    </Badge>
                  ) : null}
                </Link>
              )} */}
              {/* <Link
                to="/gateways"
                className={cn(
                  "transition-colors hover:text-foreground",
                  path.includes("/gateways")
                    ? "text-foreground"
                    : "text-muted-foreground"
                )}
              >
                Gateways
              </Link> */}
            </nav>
          </SheetContent>
        </Sheet>
        <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
          <div className="ml-auto flex-1 sm:flex-initial">
            {/* <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search products..."
                className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
              />
            </div> */}
          </div>
          <div />
          <div className="flex flex-col">
            <span className="text-sm">{user.name?.split(" ")[0]}</span>
            <span className="text-muted-foreground text-xs">
              {FormatRole(user.role)}
            </span>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <CircleUser className="h-5 w-5" />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel className="flex flex-col gap-1">
                <span className="text-sm font-medium">{user.name}</span>
                <span className="text-xs text-muted-foreground">
                  {FormatRole(user.role)}
                </span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {/* <DropdownMenuItem>Settings</DropdownMenuItem> */}
              {/* <DropdownMenuItem>Support</DropdownMenuItem> */}
              {/* <DropdownMenuSeparator /> */}
              <DropdownMenuItem onClick={handleLogout}>Sair</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Outlet />
      </main>
    </div>
  );
}
