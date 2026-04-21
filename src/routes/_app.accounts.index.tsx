import { createFileRoute } from "@tanstack/react-router";
import { AccountsPage } from "@/page-modules/accounts";

export const Route = createFileRoute("/_app/accounts/")({
  head: () => ({ meta: [{ title: "Contas" }] }),
  component: AccountsPage,
});
