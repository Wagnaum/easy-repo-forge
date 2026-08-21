import { createFileRoute } from "@tanstack/react-router";
import { ForgotPasswordPage } from "@/page-modules/forgot-password";

export const Route = createFileRoute("/auth/forgot-password")({
  head: () => ({
    meta: [
      { title: "Esqueci minha senha — Trend Finance" },
      {
        name: "description",
        content:
          "Redefina a senha da sua conta Trend Finance: informe seu e-mail e receba um link seguro de redefinição.",
      },
      { property: "og:title", content: "Esqueci minha senha — Trend Finance" },
      {
        property: "og:description",
        content:
          "Redefina a senha da sua conta Trend Finance com um link seguro enviado por e-mail.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ForgotPasswordPage,
});
