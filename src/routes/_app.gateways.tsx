import { createFileRoute } from "@tanstack/react-router";
import { GatewaysPage } from "@/page-modules/gateways";

export const Route = createFileRoute("/_app/gateways")({
  head: () => ({ meta: [{ title: "Gateways" }] }),
  component: GatewaysPage,
});
