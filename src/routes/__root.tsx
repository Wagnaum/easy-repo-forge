import {
  Outlet,
  Link,
  createRootRouteWithContext,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster as ToasterSonner } from "sonner";
import { Toaster as ToasterHot } from "react-hot-toast";
import { CustomerProvider } from "@/context/customer";
import { AuthContextProvider } from "@/context/auth";
import { ThemeProvider } from "@/components/theme-provider";
import { RouteTransitionLoader } from "@/components/shared/route-transition-loader";

import appCss from "../styles.css?url";

interface RouterContext {
  queryClient: QueryClient;
}

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">
          Página não encontrada
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          A página que você procura não existe ou foi movida.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Voltar ao início
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<RouterContext>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Plataforma" },
      { name: "description", content: "Plataforma de gestão" },
      { property: "og:title", content: "Plataforma" },
      { name: "twitter:title", content: "Plataforma" },
      { property: "og:description", content: "Plataforma de gestão" },
      { name: "twitter:description", content: "Plataforma de gestão" },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/8be01f14-96c2-40ee-ab89-47080fd78b7e/id-preview-95db2504--00a44e06-a99e-4a10-8340-e2fbd9e7d4ff.lovable.app-1776709331365.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/8be01f14-96c2-40ee-ab89-47080fd78b7e/id-preview-95db2504--00a44e06-a99e-4a10-8340-e2fbd9e7d4ff.lovable.app-1776709331365.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <CustomerProvider>
          <AuthContextProvider>
            <Outlet />
            <RouteTransitionLoader />
            <ToasterSonner position="top-right" richColors closeButton />
            <ToasterHot position="top-right" />
          </AuthContextProvider>
        </CustomerProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
