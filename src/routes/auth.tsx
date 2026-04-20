import { createFileRoute } from "@tanstack/react-router";
import { LoginLayout } from "@/components/layouts/login-layout";

export const Route = createFileRoute("/auth")({
  component: LoginLayout,
});
