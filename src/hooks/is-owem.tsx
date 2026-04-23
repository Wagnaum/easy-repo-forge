import { useMemo } from "react";

export function useIsOwem(): boolean {
  return useMemo(() => {
    if (typeof window === "undefined") {
      return false;
    }

    const hostname = window.location.hostname;
    if (hostname.includes("distritopay.com")) return true;
    // Preview/local fallback so UI gates dependent on "owem" still render
    if (
      hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      hostname.includes("lovable.app") ||
      hostname.includes("lovableproject.com")
    ) {
      return true;
    }
    return false;
  }, []);
}
