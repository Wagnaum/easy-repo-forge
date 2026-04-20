import { createFileRoute } from "@tanstack/react-router";
import { ZeroRatePage } from "@/page-modules/zero-rate";

export const Route = createFileRoute("/_app/zero-rate")({
  head: () => ({ meta: [{ title: "Taxa Zero" }] }),
  component: ZeroRatePage,
});
