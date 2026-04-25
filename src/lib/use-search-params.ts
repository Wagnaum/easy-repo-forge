// Compat shim: emulates react-router-dom's useSearchParams API on top of TanStack Router.
// Returns a tuple [URLSearchParams, setSearchParams].
import { useLocation, useNavigate } from "@tanstack/react-router";
import { useCallback, useMemo } from "react";

type SetParamsArg =
  | URLSearchParams
  | Record<string, string>
  | ((prev: URLSearchParams) => URLSearchParams | Record<string, string>);

export function useSearchParams(): [URLSearchParams, (next: SetParamsArg) => void] {
  const location = useLocation();
  const navigate = useNavigate();

  const search = useMemo(() => {
    // location.searchStr is the raw "?a=1&b=2" string in TanStack Router
    const raw = (location as unknown as { searchStr?: string }).searchStr ?? "";
    return new URLSearchParams(raw.startsWith("?") ? raw.slice(1) : raw);
  }, [location]);

  const setSearchParams = useCallback(
    (next: SetParamsArg) => {
      let resolved: URLSearchParams | Record<string, string>;
      if (typeof next === "function") {
        resolved = next(new URLSearchParams(search.toString()));
      } else {
        resolved = next;
      }
      const params =
        resolved instanceof URLSearchParams
          ? resolved
          : new URLSearchParams(resolved as Record<string, string>);

      const obj: Record<string, string> = {};
      params.forEach((v, k) => {
        if (v !== "" && v != null) obj[k] = v;
      });

      const nextSearch = new URLSearchParams(obj).toString();
      const currentSearch = search.toString();

      if (nextSearch === currentSearch) {
        return;
      }

      // Bypass TanStack Router's JSON-encoded search serialization
      // (which would turn { page: "1" } into ?page=%221%22) and write
      // a clean URLSearchParams string directly to history. We then
      // dispatch popstate so the router/useLocation re-reads the URL.
      if (typeof window !== "undefined") {
        const url = nextSearch
          ? `${location.pathname}?${nextSearch}`
          : location.pathname;
        window.history.pushState({}, "", url);
        window.dispatchEvent(new PopStateEvent("popstate"));
      } else {
        navigate({ to: location.pathname, search: obj, replace: false });
      }
    },
    [navigate, location.pathname, search],
  );

  return [search, setSearchParams];
}
