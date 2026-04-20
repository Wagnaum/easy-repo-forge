import { createFileRoute } from "@tanstack/react-router";
import { ForgotPasswordPage } from "@/page-modules/forgot-password";

export const Route = createFileRoute("/auth/forgot-password")({
  head: () => ({ meta: [{ title: "Esqueci minha senha" }] }),
  component: ForgotPasswordPage,
});
