import { createFileRoute } from "@tanstack/react-router";
import { SignOutPage } from "@/page-modules/signout";

export const Route = createFileRoute("/_app/signout")({
  head: () => ({ meta: [{ title: "Saindo..." }] }),
  component: SignOutPage,
});
