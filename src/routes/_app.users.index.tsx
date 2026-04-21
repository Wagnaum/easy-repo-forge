import { createFileRoute } from "@tanstack/react-router";
import { UsersPage } from "@/page-modules/users";

export const Route = createFileRoute("/_app/users/")({
  head: () => ({ meta: [{ title: "Cadastros" }] }),
  component: UsersPage,
});
