

## Plano: portar visual completo do StricBet (Digital Account Hub) pra cá

Escopo confirmado: **só visual** (layout, cores, animações, componentes shared), mantendo TanStack Router e todos os hooks/APIs/contextos atuais (`useAuth`, `useCustomer`, `useQuery`, endpoints HeroBank). Nenhuma rota nova, nenhuma troca de roteador, nenhuma mudança de fluxo de dados.

### Componentes shared a criar/atualizar

Replicar 1:1 a partir de `Digital Account Hub/src/components/shared/`:

- `src/components/shared/kpi-card.tsx` — substituir o atual pela versão StricBet (variants `cardVariants`, `motion.div custom={index}`, ícone em quadrado com `--brand-primary-light`, valor em `text-3xl font-bold tracking-tight`, suporte a `subtitle` e `trend`).
- `src/components/shared/badges.tsx` — novo, com `StatusBadge` (dot colorido + label PT-BR), `RoleBadge` e `TransactionTypeBadge` (crédito verde / débito vermelho). Mapear status da API HeroBank (`APPROVED`, `PENDING`, `REPROVED`, etc.) para as chaves do StricBet via wrapper que normaliza.
- `src/components/shared/copy-button.tsx` — novo, botão de copy com check animado (usado em chave Pix, número de conta).
- `src/components/shared/pagination-controls.tsx` — novo, paginação estilizada do StricBet (substitui visualmente a atual mas reaproveita `usePaginationParams`).

### Header / Layout

`src/components/layouts/app-layout.tsx`:
- Substituir o JSX do header pelo do `Navbar.tsx` do StricBet: logo com fade, `motion.div layoutId="navbar-indicator"` no link ativo, animação do toggle de tema (rotate 90°), Avatar com fallback colorido, mobile sheet com `AnimatePresence` (height auto).
- Manter integralmente: `useAuth` (logout, user), `useCustomer` (brand), `useLocation` direto (sem useState), `Link` do TanStack Router (não react-router-dom), `ThemeToggle`/`useTheme` atuais, dropdown de usuário existente.
- `<main>` continua como `motion.main` único, sem `AnimatePresence` por path (já corrigido).

`src/components/layouts/login-layout.tsx`:
- Aplicar o visual do `LoginPage.tsx` (split-layout com gradiente navy à esquerda + form à direita), mantendo `useAuth` e `<Outlet/>`.

### Páginas (re-skin, mesma lógica)

Para cada uma, manter 100% das `useQuery`, mutations, handlers, validações e navegação atuais. Trocar apenas markup/classes/wrappers `motion.*`:

1. **`src/page-modules/home/index.tsx` (Dashboard)**
   - Header "Dashboard" + subtítulo + botão "Download relatório de split" (decorativo se não houver endpoint).
   - Filtros de data com inputs + botão Aplicar (mesma lógica do Popover atual).
   - Grid de 3 KPICards (Contas / Aprovadas / Pendentes) com porcentagem em `subtitle`.
   - Charts: BarChart "Cadastro de contas" (substitui `ChartAccount`) + Donut "Total de contas" (substitui `TotalAccounts`) usando `var(--brand-primary)` e `var(--brand-accent)`.
   - Seção Super Admin condicional (`user.role` admin): 4 KPIs de valores (`numberToCurrent`) + 2 tabelas (Maiores transações / Últimas transações) com `TransactionTypeBadge`.

2. **`src/page-modules/accounts/index.tsx` + `account-table-row.tsx` + `account-table-filters.tsx`**
   - Header com título + contagem.
   - Filtros em barra horizontal estilizada (busca + selects de status).
   - `Card` envolvendo a tabela; `motion.tr` com stagger (`delay: i * 0.04`).
   - Coluna status usando `StatusBadge`. Botão "Visualizar" com `Button asChild` + `Link` (já corrigido).
   - `PaginationControls` novo no rodapé.

3. **`src/page-modules/users/index.tsx` + `user-table-row.tsx` + `user-table-filters.tsx`**
   - Mesmo tratamento da página de Accounts. `RoleBadge` na coluna Perfil.

4. **`src/page-modules/account-details/index.tsx`** (`/accounts/:id`)
   - Layout 2 colunas: principal (Tabs Transações/Transferir/Pagar QrCode) + sidebar.
   - Sidebar com 3 cards `rounded-xl border bg-card`: Saldo (font mono, número da conta + `CopyButton`), Chaves Pix, Minhas contas.
   - Animar entrada dos cards da sidebar com stagger.
   - `motion.tr` no extrato + `TransactionTypeBadge` na coluna tipo.
   - Cards de Transferir/QrCode reestilizados (input destacado, botão primary navy).

5. **`src/page-modules/user-details/index.tsx`** (`/users/:id`)
   - Header com Avatar grande + nome + `RoleBadge` + `StatusBadge`.
   - Tabs reestilizadas, cards `rounded-xl border bg-card`, animação de entrada.

6. **`src/page-modules/login.tsx`**
   - Card branco com sombra, inputs grandes, botão primary navy full-width, link "Esqueci senha". Visual idêntico ao StricBet.

### Tema e tokens

`src/styles.css`:
- Já tem as variáveis `--brand-primary`, `--brand-accent`, etc. Manter.
- Ajustar valores oklch do navy/verde se necessário pra bater com o StricBet (HSL `220 70% 18%` e `150 100% 42%`).
- Garantir `font-mono-account` utility.

### Mapeamento de status HeroBank → StatusBadge

Criar helper `src/utils/status-map.ts`:
```
APPROVED → "aprovado"
PENDING → "pendente"
REPROVED/BLOCKED → "bloqueado"
WAITING_KYC → "aguardando_kyc"
```
`StatusBadge` recebe a chave normalizada.

### O que NÃO vai mudar

- Nenhuma rota (`src/routes/*.tsx`) — apenas re-skin dos `page-modules`.
- Nenhum hook (`useAuth`, `useCustomer`, `useTheme`, `useNavigate`).
- Nenhuma chamada de API (`src/api/*`), nenhum `useQuery`, nenhuma mutation.
- TanStack Router permanece. Nada de react-router-dom, zustand ou supabase do projeto fonte.
- Lógica de 2FA, login pre-authenticate, fluxo Pix (chaves info → payment), QR code, paginação por params da URL.

### Ordem de execução

1. Tokens de tema (ajuste fino) + utilities.
2. Componentes shared (KPICard atualizado, Badges, CopyButton, PaginationControls).
3. AppLayout (header novo) + LoginLayout (split novo).
4. Login page.
5. Dashboard (home).
6. Accounts list + AccountDetails.
7. Users list + UserDetails.
8. QA visual no preview (você navega já logado), ajustes finos.

