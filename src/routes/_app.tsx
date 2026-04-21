import { createFileRoute, redirect } from "@tanstack/react-router";
import { AppLayout } from "@/components/layouts/app-layout";

function hasStoredToken() {
  if (typeof window === "undefined") {
    return true;
  }

  const token = window.localStorage.getItem("@herobank:token");
  return Boolean(token && token !== "undefined" && token !== "null");
}

export const Route = createFileRoute("/_app")({
  beforeLoad: () => {
    if (!hasStoredToken()) {
      throw redirect({ to: "/auth/login" });
    }
  },
  component: AppLayout,
});
