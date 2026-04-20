import { createFileRoute } from "@tanstack/react-router";
import { LoginPage } from "@/page-modules/login";

export const Route = createFileRoute("/auth/login")({
  head: () => ({ meta: [{ title: "Login" }] }),
  component: LoginPage,
});
