import { createFileRoute } from "@tanstack/react-router";
import { AccountRegisterPage } from "@/page-modules/account-register";

export const Route = createFileRoute("/auth/account/register")({
  head: () => ({ meta: [{ title: "Abertura de conta" }] }),
  component: AccountRegisterPage,
});
