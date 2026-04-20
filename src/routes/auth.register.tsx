import { createFileRoute } from "@tanstack/react-router";
import { RegisterPage } from "@/page-modules/register";

export const Route = createFileRoute("/auth/register")({
  head: () => ({ meta: [{ title: "Cadastro" }] }),
  component: RegisterPage,
});
