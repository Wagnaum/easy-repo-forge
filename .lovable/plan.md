## Diagnóstico

A paginação na página **/accounts** (e em todas as outras: usuários, gateways, zero-rate) está quebrada por causa de um bug no shim `src/lib/use-search-params.ts`.

### Sintoma observável

URL atual: `/accounts?page=%221%22` — o valor está com **aspas codificadas** (`"1"` em vez de `1`). Isso quebra a leitura:

```ts
const pageParam = searchParams.get("page"); // retorna `"1"` (string com aspas literais)
const pageIndex = Number.isFinite(Number(pageParam)) ? Number(pageParam) : 0;
// Number('"1"') === NaN → cai no fallback 0
```

Resultado: clicar "Próxima página" muda a URL mas `pageIndex` sempre volta para `0`, então a tabela nunca avança de página.

### Causa raiz

Em `src/lib/use-search-params.ts` (linha 46-50), o shim chama:

```ts
navigate({ to: location.pathname, search: obj, replace: false });
```

O TanStack Router por padrão **stringifica cada valor de search com `JSON.stringify`**. Como `obj` tem `{ page: "1" }`, o valor `"1"` (string) é serializado como `"\"1\""` e a URL fica `?page=%221%22`. Na próxima leitura via `URLSearchParams`, o valor vem como `"1"` literal com aspas → `Number()` falha.

Além disso, há uma inconsistência menor: `pageIndex` é 0-based no front, mas o componente `Pagination` mostra "Página `pageIndex + 1`". Com a URL refletindo o índice 0-based, fica confuso (`page=0` = "Página 1"). Vou manter 0-based para não quebrar a API (que recebe `page: pageIndex ?? 0`), mas corrigir a serialização.

## Correção

### 1. `src/lib/use-search-params.ts` — usar `window.history` em vez de `navigate()`

Substituir o `navigate()` do TanStack (que faz JSON-encode) por uma atualização direta da URL via `window.history.pushState` + um `dispatchEvent` para o TanStack Router reagir. Alternativamente, usar `router.navigate` com search já como string crua não é suportado pelo TanStack.

Abordagem mais limpa e compatível: **codificar manualmente a query string com `URLSearchParams.toString()` e usar `window.history.pushState`**, então notificar o router via um evento de popstate sintético para que `useLocation` reaja.

```ts
const qs = new URLSearchParams(obj).toString();
const url = qs ? `${location.pathname}?${qs}` : location.pathname;
window.history.pushState({}, "", url);
window.dispatchEvent(new PopStateEvent("popstate"));
```

Isso mantém a API compatível com `react-router-dom` (que é o objetivo do shim) e produz URLs limpas: `?page=1&filter=joao`.

### 2. Verificar leitura

Após a correção, `searchParams.get("page")` retornará `"1"` (sem aspas), `Number("1") === 1`, e a paginação funciona em **todas** as páginas que usam o shim (accounts, users, gateways, zero-rate, transactions, register, etc.) sem precisar tocar em cada uma.

### 3. Sem mudanças em arquivos de página

Os componentes `AccountsPage`, `UsersPage`, etc. já estão corretos — o bug é puramente no shim.

## Resultado esperado

- URL fica `?page=1` em vez de `?page=%221%22`
- Botões "Próxima/Anterior/Primeira/Última" funcionam em /accounts
- Filtros (status, filter) também passam a serializar como strings limpas
- Correção propaga automaticamente para /users, /gateways, /zero-rate

## Arquivos alterados

- `src/lib/use-search-params.ts` (única mudança)
