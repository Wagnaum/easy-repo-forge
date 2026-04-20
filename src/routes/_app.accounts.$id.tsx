import { createFileRoute } from "@tanstack/react-router";
import { AccountDetailsPage } from "@/page-modules/account-details";

export const Route = createFileRoute("/_app/accounts/$id")({
  head: () => ({ meta: [{ title: "Detalhes da conta" }] }),
  component: AccountDetailsPage,
});
