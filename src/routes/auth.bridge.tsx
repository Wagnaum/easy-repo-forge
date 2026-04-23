import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { api } from "@/lib/api";

export const Route = createFileRoute("/auth/bridge")({
  validateSearch: (search: Record<string, unknown>) => ({
    token: (search.token as string) || "",
    redirect: (search.redirect as string) || "/",
  }),
  component: BridgePage,
});

function BridgePage() {
  const { token, redirect } = Route.useSearch();
  const navigate = useNavigate();
  const [manualToken, setManualToken] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    try {
      window.localStorage.setItem("@herobank:token", token);
      api.defaults.headers.common.Authorization = `Bearer ${token}`;
      // hard reload so AuthContext re-reads token from storage
      window.location.href = redirect || "/";
    } catch (e) {
      setError("Não foi possível salvar o token no navegador.");
    }
  }, [token, redirect]);

  if (token && !error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex items-center gap-3 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Aplicando sessão...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <div className="w-full max-w-md space-y-4 rounded-xl border bg-card p-6 shadow-sm">
        <div>
          <h1 className="text-xl font-semibold">Bridge de sessão</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Cole o token copiado do app publicado para replicar a sessão neste
            preview.
          </p>
        </div>

        {error && (
          <div className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <textarea
          value={manualToken}
          onChange={(e) => setManualToken(e.target.value.trim())}
          placeholder="Cole o token aqui..."
          className="h-32 w-full resize-none rounded-md border bg-background p-3 font-mono text-xs"
        />

        <button
          disabled={!manualToken}
          onClick={() => {
            navigate({
              to: "/auth/bridge",
              search: { token: manualToken, redirect: "/" },
            });
          }}
          className="w-full rounded-md bg-[var(--brand-primary)] px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          Aplicar sessão
        </button>

        <details className="text-xs text-muted-foreground">
          <summary className="cursor-pointer">Como obter o token?</summary>
          <ol className="mt-2 list-decimal space-y-1 pl-4">
            <li>Faça login normalmente em https://trendbet.lovable.app</li>
            <li>Abra o DevTools (F12) → Application → Local Storage</li>
            <li>
              Copie o valor da chave <code>@herobank:token</code>
            </li>
            <li>Cole aqui e clique em "Aplicar sessão"</li>
          </ol>
          <p className="mt-2">
            Ou clique no botão "Abrir no editor" no canto superior direito do
            app publicado.
          </p>
        </details>
      </div>
    </div>
  );
}
