import { createFileRoute } from "@tanstack/react-router";
import { OpenAccountRegisterPage } from "@/page-modules/open-account-register";

export const Route = createFileRoute("/auth/account/open-register")({
  head: () => ({ meta: [{ title: "Abertura de conta" }] }),
  component: OpenAccountRegisterPage,
});
