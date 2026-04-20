
## Plano: Migrar projeto React/Vite do GitHub para o Lovable

### 1. Você cola o link do repo no próximo chat
Assim que você mandar a URL pública do GitHub, eu:
- Exploro a estrutura do projeto (rotas, componentes, estilos, dependências)
- Identifico o que é compatível direto e o que precisa adaptar
- Listo as chamadas à API externa (endpoints, auth, headers)

### 2. Adaptação para a stack daqui
O Lovable roda **React 19 + TanStack Start + Tailwind v4 + shadcn/ui**. Vou converter:
- **Roteamento** → de React Router / Next.js routes para `src/routes/` (file-based do TanStack)
- **Estilos** → manter Tailwind, ajustando para v4 (tokens em `src/styles.css`)
- **Componentes UI** → reaproveitar shadcn já instalado quando equivalente
- **Assets** (imagens, fontes, ícones) → copiar para `src/assets/`
- **Variáveis de ambiente** → migrar para Secrets do Lovable Cloud (sem expor chaves no client)

### 3. Migração em fases (porque é grande)
Pra não quebrar nada de uma vez, vou fazer assim:
1. **Fase 1 — Esqueleto**: layout raiz, navegação, tema, dependências, tokens de design
2. **Fase 2 — Telas principais**: home + 2-3 páginas mais importantes (você escolhe quais priorizar depois de eu mapear)
3. **Fase 3 — Telas secundárias**: o resto das páginas
4. **Fase 4 — Integração com API externa**: criar um cliente HTTP central (`src/lib/api.ts`), tipos compartilhados, hooks com TanStack Query, tratamento de erro/loading
5. **Fase 5 — Polish**: estados de erro, 404, responsividade, SEO por rota (title/description/og)

### 4. Backend externo
Como a API fica fora, vou:
- Criar um wrapper de fetch tipado em `src/lib/api.ts` com base URL configurável
- Usar **TanStack Query** para cache, loading e refetch
- Guardar URL base e qualquer chave pública em variáveis de ambiente (`VITE_API_URL` etc.)
- Se houver auth via token, criar um contexto/provider e interceptor

### 5. Sincronização com GitHub (opcional, recomendado)
Depois que estiver rodando aqui, posso te orientar a conectar este projeto Lovable a um **novo repo no seu GitHub** (via Connectors → GitHub). Aí qualquer mudança aqui vai automaticamente pro seu GitHub e vice-versa.

### O que você precisa fazer agora
👉 **Mandar o link público do repositório no próximo chat.** Se for privado, você precisa torná-lo público temporariamente ou copiar os arquivos manualmente, porque eu não tenho acesso autenticado ao seu GitHub.

Depois disso eu mapeio tudo e a gente começa pela Fase 1.
