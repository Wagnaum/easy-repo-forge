

## Plano: corrigir página de Detalhes do Usuário (`/users/:id`)

### Bug raiz

Mesma arquitetura quebrada que já corrigimos em `/accounts`:

- `src/routes/_app.users.tsx` define `component: UsersPage` (a lista de cadastros).
- `src/routes/_app.users.$id.tsx` é filho dessa rota no roteamento flat do TanStack.
- Como `UsersPage` não renderiza `<Outlet />`, ao acessar `/users/f4752704-...` o router monta o componente pai (lista) e o filho (`UserDetailsPage`) nunca aparece — daí o usuário vê a página de listagem ou tela em branco em vez dos detalhes.

A correção espelha o que foi feito em `_app.accounts.tsx` + `_app.accounts.index.tsx`.

### Mudanças

1. **`src/routes/_app.users.tsx`** — transformar em layout puro com `<Outlet />`:
   ```tsx
   import { Outlet, createFileRoute } from "@tanstack/react-router";

   export const Route = createFileRoute("/_app/users")({
     component: UsersLayout,
   });

   function UsersLayout() {
     return <Outlet />;
   }
   ```

2. **Criar `src/routes/_app.users.index.tsx`** — hospeda a lista:
   ```tsx
   import { createFileRoute } from "@tanstack/react-router";
   import { UsersPage } from "@/page-modules/users";

   export const Route = createFileRoute("/_app/users/")({
     head: () => ({ meta: [{ title: "Cadastros" }] }),
     component: UsersPage,
   });
   ```

3. **`src/page-modules/users/user-table-row.tsx`** — trocar o `<Link to={`/users/${user.id}` as any}>` (cast `as any`) pela forma type-safe:
   ```tsx
   <Link to="/users/$id" params={{ id: user.id }}>
   ```
   Remove o cast `as any` e garante que o link use a rota tipada correta.

4. **Sanidade no `pageIndex` da listagem (se aplicável)** — auditar `src/page-modules/users/index.tsx` e aplicar o mesmo guard usado em `accounts/index.tsx`:
   ```ts
   const pageIndex = Number.isFinite(Number(pageParam)) ? Number(pageParam) : 0;
   ```
   para evitar `NaN` no paginador.

### Como validar

1. Abrir `/users` → lista de cadastros carrega normal.
2. Clicar em "Detalhes" de um usuário → vai para `/users/<id>` e renderiza `UserDetailsPage` com as 3 tabs (Dados Básicos, Documentos, KYC).
3. Tab Dados Básicos → mostra usuário, individual, endereço.
4. Tab Documentos → lista documentos e abre o Sheet de visualização.
5. Tab KYC → mostra sub-tabs Dados Básicos / Processos.
6. Botão voltar (`ChevronLeft`) retorna para `/users`.
7. Console limpo (sem `Maximum update depth`, sem warnings novos).

### Arquivos

- editar: `src/routes/_app.users.tsx`
- criar: `src/routes/_app.users.index.tsx`
- editar: `src/page-modules/users/user-table-row.tsx`
- editar (se necessário): `src/page-modules/users/index.tsx`

### O que NÃO muda

- API `getKyc`, hooks de auth, conteúdo das tabs, UI dos cards e tabelas — tudo preservado.
- Nenhuma regra de negócio ou permissão é alterada.

