
## Plano: Aplicar o design de outro projeto (mantendo as funcionalidades atuais)

### O que muda e o que NÃO muda
**NÃO muda** (preservado 100%):
- Rotas (`src/routes/`), APIs (`src/api/`), contexts (`auth`, `customer`), hooks, lógica de negócio, integração com `https://production.herobank.com.br`, formulários, fluxos de KYC, contas, transações, etc.

**Muda** (camada visual):
- Tokens de cor (claro + escuro) em `src/styles.css`
- Fontes e escalas tipográficas
- Visual dos componentes shadcn (`button`, `input`, `card`, `badge`, `table`, etc.)
- Layout shell: `app-layout.tsx` (sidebar + header) e `login-layout.tsx`

### Passo 1 — Inspecionar o projeto de referência
Assim que você me disser qual projeto é, eu leio:
- `src/styles.css` → copio tokens oklch (claro/escuro), radius, fontes
- `index.html` → fontes carregadas (Google Fonts, etc.)
- `src/components/ui/*` → variantes customizadas (ex: button com gradient, card com sombra própria)
- Layout/sidebar → estrutura visual (largura, cabeçalho, agrupamento de itens, toggle de tema)

### Passo 2 — Aplicar tokens
Substituo as variáveis `--background`, `--foreground`, `--primary`, `--sidebar-*`, `--chart-*`, etc. em `src/styles.css` (`:root` e `.dark`) pelas do projeto de referência. Atualizo `--font-sans` / `--font-mono` e adiciono `<link>` das fontes em `index.html` se necessário.

### Passo 3 — Atualizar componentes shadcn
Para cada componente em `src/components/ui/` que tiver visual diferente no projeto de referência, copio as `cva` variants/classes (ex: `button.tsx` com novo `default`/`outline`, `card.tsx` com nova sombra/borda). Mantenho a API (props) intacta pra não quebrar nada que já consome.

### Passo 4 — Refazer os layouts
- `src/components/layouts/app-layout.tsx`: aplico a nova estrutura de sidebar (provavelmente migrando para `shadcn/ui sidebar` se o projeto referência usar), header, espaçamentos, cores. **Mantenho exatamente os mesmos itens de menu e rotas atuais** (`/`, `/users`, `/accounts`, `/gateways`, `/zero-rate`, signout).
- `src/components/layouts/login-layout.tsx`: aplica o visual de tela de auth do referência (split screen, hero, etc.) preservando o `<Outlet />` das rotas `auth.*`.

### Passo 5 — Toggle de tema
Adiciono um `ThemeProvider` simples (classe `.dark` no `<html>`) + botão de toggle no header do `app-layout`. Se o projeto referência já tiver, copio igual.

### Passo 6 — Logos
Deixo placeholders nos lugares atuais (`public/logos/...`). Quando você mandar os novos, eu substituo.

### Verificação final
- Navegar `/auth/login` → `/` → `/users` → `/users/:id` → `/accounts` → `/accounts/:id` conferindo se todos os fluxos seguem funcionando com o novo visual.
- Testar toggle de tema em todas as telas principais.
- Conferir mobile (sidebar colapsada).

### O que preciso de você agora
👉 **Me diga o nome do projeto de referência** (ou use `@nome-do-projeto` no chat). Sem isso eu não consigo ler os tokens e componentes dele.
