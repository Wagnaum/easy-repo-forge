import { createFileRoute } from "@tanstack/react-router";
import { HomePage } from "@/page-modules/home";

export const Route = createFileRoute("/_app/")({
  head: () => ({ meta: [{ title: "Dashboard" }] }),
  component: HomePage,
});
