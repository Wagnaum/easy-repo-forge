import { createFileRoute } from "@tanstack/react-router";
import { UserDetailsPage } from "@/page-modules/user-details";

export const Route = createFileRoute("/_app/users/$id")({
  head: () => ({ meta: [{ title: "Detalhes do cadastro" }] }),
  component: UserDetailsPage,
});
