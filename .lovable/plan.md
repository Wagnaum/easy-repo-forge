

## Objetivo

Permitir que você faça login no preview do Lovable com sua conta real (mesmas credenciais da produção) e veja/edite a aplicação com os dados reais carregados — exatamente como aparece no domínio publicado.

## Diagnóstico atual

Hoje o preview chama a API em `https://production.herobank.com.br` (definido em `src/lib/api.ts`), mas o login falha silenciosamente no preview porque:

1. **CORS**: o backend `production.herobank.com.br` provavelmente só aceita requisições dos hosts cadastrados (`trendbet.com.br`, `trendbet.lovable.app`). O host de preview (`id-preview--67380fdf...lovable.app`) não está na allowlist, então as chamadas de `/users/authenticate` são bloqueadas.
2. **Token não compartilhado**: mesmo se você logar no domínio publicado, o `localStorage` é por origem — o preview não enxerga o token salvo no domínio publicado.
3. **Customer config**: `customers.json` casa por host. No preview, cai no fallback Trend Finance (já corrigido), então essa parte está ok.

## Plano de implementação

### 1. Confirmar/configurar a base URL da API no preview
Verificar se `VITE_API_URL` está definida. Se a API de produção aceitar o host de preview via CORS, basta usar a mesma URL. Se não aceitar, você precisa:
- **Opção A (recomendada)**: liberar no backend o host `*.lovable.app` no CORS allowlist.
- **Opção B**: usar um proxy reverso no Vite (`server.proxy` em `vite.config.ts`) para que as chamadas saiam do mesmo domínio do preview e contornem CORS em dev.

### 2. Adicionar "Bridge de Token" para replicar a sessão publicada
Criar uma rota utilitária `/auth/bridge` que aceita um token via query string (`?token=...`) e o salva no `localStorage` do preview, redirecionando depois para `/`. Fluxo:
1. Você faz login normalmente em `https://trendbet.lovable.app`.
2. Copia o valor de `@herobank:token` do localStorage (ou clica em um botão "Abrir no preview" que mostraremos no app publicado).
3. Cola no preview via `https://id-preview--...lovable.app/auth/bridge?token=COLE_AQUI`.
4. O preview salva o token e passa a se comportar como logado, replicando exatamente os dados da conta.

### 3. (Opcional) Botão "Abrir no editor" no app publicado
Adicionar no `app-layout` (visível apenas quando `host` é o domínio publicado) um botão que copia o token atual e abre o preview já com o token na URL.

### 4. Garantir que o login direto no preview também funcione
Se o CORS for liberado (passo 1), você pode simplesmente logar pelo formulário `/auth/login` do preview com email/senha — sem precisar do bridge.

## Arquivos afetados

- `src/lib/api.ts` — confirmar baseURL.
- `vite.config.ts` — (opcional) adicionar proxy.
- `src/routes/auth.bridge.tsx` — nova rota de bridge de token.
- `src/components/layouts/app-layout.tsx` — (opcional) botão "Abrir no editor".

## Pergunta antes de implementar

Você consegue **liberar o CORS no backend** (`production.herobank.com.br`) para aceitar `*.lovable.app`? A resposta muda o caminho:

- **Sim** → faço apenas a bridge de token + login direto funciona no preview.
- **Não / Não sei** → faço a bridge de token (você loga no publicado e cola no preview) — funciona sem mudanças no backend, mas é menos prático.
- **Quero proxy** → configuro `vite.config.ts` para fazer proxy reverso (funciona no dev, mas não no preview hospedado do Lovable, então tem limitações).

