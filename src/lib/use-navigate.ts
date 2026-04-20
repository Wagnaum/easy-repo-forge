// Compat shim: emulates react-router-dom's useNavigate API on top of TanStack Router.
// Accepts: navigate("/path"), navigate(-1), navigate({ to, search, replace, ... })
import { useNavigate as useTanstackNavigate, useRouter } from "@tanstack/react-router";
import { useCallback } from "react";

type LegacyNavigateArg =
  | string
  | number
  | { to?: string; search?: Record<string, unknown>; replace?: boolean; params?: Record<string, unknown> };

type LegacyNavigateOpts = { replace?: boolean; state?: unknown };

export function useNavigate() {
  const tNavigate = useTanstackNavigate();
  const router = useRouter();

  return useCallback(
    (arg: LegacyNavigateArg, opts?: LegacyNavigateOpts) => {
      if (typeof arg === "number") {
        if (arg < 0) {
          for (let i = 0; i < Math.abs(arg); i++) router.history.back();
        } else if (arg > 0) {
          for (let i = 0; i < arg; i++) router.history.forward();
        }
        return;
      }
      if (typeof arg === "string") {
        return tNavigate({ to: arg, replace: opts?.replace } as never);
      }
      return tNavigate({ replace: opts?.replace, ...arg } as never);
    },
    [tNavigate, router],
  );
}
