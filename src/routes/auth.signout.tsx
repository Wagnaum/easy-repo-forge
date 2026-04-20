import { createFileRoute } from "@tanstack/react-router";
import { SignOutPage } from "@/page-modules/signout";

export const Route = createFileRoute("/auth/signout")({
  head: () => ({ meta: [{ title: "Saindo..." }] }),
  component: SignOutPage,
});
