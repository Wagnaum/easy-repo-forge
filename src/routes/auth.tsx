import { createFileRoute, redirect } from "@tanstack/react-router";
import { LoginLayout } from "@/components/layouts/login-layout";

function hasStoredToken() {
  if (typeof window === "undefined") {
    return false;
  }

  const token = window.localStorage.getItem("@herobank:token");
  return Boolean(token && token !== "undefined" && token !== "null");
}

export const Route = createFileRoute("/auth")({
  beforeLoad: ({ location }) => {
    if (location.pathname === "/auth/login" && hasStoredToken()) {
      throw redirect({ to: "/" });
    }
  },
  component: LoginLayout,
});
