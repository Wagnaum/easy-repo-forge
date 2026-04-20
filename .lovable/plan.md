

## Plano: revisar trilha completa Login → Dashboard → Conta → PIX/Chaves/Saldo/Extrato e corrigir os bugs encontrados

Fiz uma auditoria de todo o fluxo. A boa notícia: a lógica de negócio (APIs, queries, fluxos PIX/chaves/saldo/extrato) está intacta e correta. Os bugs estão na camada visual nova que adicionei nas etapas anteriores.

### Trilha mapeada (o que cada passo faz hoje)

```text
1. /auth/login (LoginPage)
   ├─ POST /users/pre-authenticate     → detecta se tem 2FA
   ├─ POST /users/authenticate         → recebe token + user
   ├─ Salva token em localStorage @herobank:token
   └─ AuthContext.setUser → LoginLayout faz <Navigate to="/" />

2. / (HomePage / dashboard)
   ├─ KPICards (Contas / Pagas / Não pagas)
   ├─ ChartAccount + TotalAccounts
   └─ Filtro por período (Popover)

3. /accounts (AccountsPage)
   ├─ GET /accounts (lista) com filtros
   └─ Botão "Visualizar" → Link to=/accounts/{id}

4. /accounts/:id (AccountDetailsPage)
   ├─ GET /accounts/{id} → conta + main + allAccounts
   ├─ Sidebar:
   │   ├─ Saldo + número da conta + tipo (Bet/Normal)
   │   ├─ Minhas chaves Pix (GetAccountKeysSidebar)
   │   │   ├─ GET  /accounts/{id}/keys
   │   │   ├─ POST /accounts/{id}/keys (nova chave EVP/CPF)
   │   │   └─ DELETE /accounts/{id}/keys/{keyId}
   │   └─ Minhas últimas contas (MyAccountsSidebar)
   └─ Tabs principais:
       ├─ Transações  → GET /transactions?accountId=  (extrato paginado)
       ├─ Transferir  → POST /accounts/{id}/keys/info + /pix/payment
       └─ Pagar QrCode → POST /accounts/{id}/read-qrcode + /pix/payment
```

A trilha funcional está toda lá. O que está atrapalhando é o que segue.

### Bugs encontrados nesta auditoria

1. **Loop infinito no AppLayout (causa do "Maximum update depth exceeded")**
   - `app-layout.tsx` faz `useState(location.pathname)` + `useEffect(() => setPath(location.pathname), [location])`. O objeto `location` muda de referência em todo render do TanStack Router → setState → render → setState → loop.
   - **Fix**: remover o `useState` + `useEffect`, usar `location.pathname` direto.

2. **Remount agressivo do Outlet quebra a página de detalhes**
   - `<AnimatePresence mode="wait">` com `<motion.main key={location.pathname}>` envolvendo o `<Outlet/>` desmonta toda a árvore a cada navegação. Isso recria as `useQuery` (perde dados em cache imediato), perde estado dos Tabs, e em conjunto com o loop do item 1 deixa `/accounts/:id` instável (tela em branco / piscando).
   - **Fix**: animar apenas a entrada do conteúdo (sem `key` por path / sem `AnimatePresence`), ou aplicar a animação dentro de cada página, não no shell.

3. **KPIs do dashboard mostram número cru em vez de moeda**
   - `KPICard value={withdraw?.withdraw?.totalGeneralAmount ?? 0}` exibe `203` em vez de `R$ 203,00`.
   - **Fix**: passar `numberToCurrent(...)` nos três KPICards de valor monetário.

4. **`MyAccountsSidebar`: `<Link><Button>...</Button></Link>` gera HTML inválido** (`<a>` envolvendo `<button>`) — mesmo padrão que já corrigi na lista de contas. Pode atrapalhar o clique em "Acessar" entre contas.
   - **Fix**: usar `<Button asChild><Link>...</Link></Button>`.

5. **Warning: "Each child in a list should have a unique key prop"** vindo de Controller (provavelmente no `Calendar/Popover` do dashboard) — registrado no console. Não bloqueia, mas vou conferir se é num `.map()` recente sem key.

### O que vou fazer (mudanças mínimas, só correção)

**Arquivos a alterar:**

- `src/components/layouts/app-layout.tsx`
  - Remover `useState`/`useEffect` de `path`. Usar `const path = location.pathname` direto.
  - Remover `<AnimatePresence>` + `key={location.pathname}` envolvendo o `Outlet`. Manter `<main>` simples (ou `motion.main` sem `key` por path, só com `initial/animate` montado uma vez).

- `src/page-modules/home/index.tsx`
  - Trocar valores dos 3 `KPICard` por `numberToCurrent(withdraw?.withdraw?.totalGeneralAmount ?? 0)` etc.

- `src/page-modules/account-details/sidebar/my-accounts.tsx`
  - Trocar `<Link><Button>Acessar</Button></Link>` por `<Button asChild variant="ghost"><Link to=...>Acessar <ArrowRightIcon/></Link></Button>`.

- (Se confirmado no inspect) corrigir o `key` faltante no map suspeito do dashboard.

### Verificação pós-fix (manual, no preview já logado)

1. `/` carrega dashboard, KPIs aparecem como `R$ 203,00`, sem erro no console.
2. Clicar em **Contas** → lista renderiza com animação stagger.
3. Clicar em **Visualizar** numa conta APROVADA → `/accounts/:id` abre sem tela branca.
4. Sidebar mostra Saldo + Conta + Chaves Pix listadas.
5. Tab **Transações** → extrato paginado aparece.
6. Tab **Transferir** → digitar chave Pix → "Continuar" mostra dados do recebedor.
7. Criar uma chave EVP nova na sidebar → aparece na lista.
8. Trocar entre contas pelo "Acessar" em "Minhas últimas contas".
9. Toggle de tema funciona em todas as telas.
10. Console limpo (sem "Maximum update depth").

### O que NÃO muda
- Nenhuma rota, API, hook, contexto ou regra de negócio.
- Tema StricBet (navy + verde), tipografia Inter, layout do header e KPI cards continuam exatamente como estão.

