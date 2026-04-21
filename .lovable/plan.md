

## Plano: corrigir página de Detalhes da Conta

A página `/accounts/:id` abre, mas o overlay de erro aparece e a usabilidade quebra por causa de uso indevido do `AlertDialog` raiz envolvendo toda a tela.

### Bugs identificados

1. **`AlertDialog` raiz envolvendo a página inteira** (`src/page-modules/account-details/index.tsx`)
   - Hoje todo o JSX da página vive dentro de `<AlertDialog open={changePlayerModal} ...>`. Radix `AlertDialog` é desenhado para receber um trigger + content. Envolver a página toda atrapalha foco, eventos de clique e disparou o `vite-error-overlay` visto no session replay.
   - **Fix**: extrair o modal "Trocar Jogador" para um componente isolado (ou renderizar o `<AlertDialog>` somente em volta do seu próprio `Content`/`Footer`, fora do layout principal). Estrutura correta:
     ```
     <>
       <button onClick={handleBack}>...Voltar</button>
       <div className="grid ...">...sidebar + main...</div>

       <AlertDialog open={changePlayerModal} onOpenChange={setChangePlayerModal}>
         <AlertDialogContent>...</AlertDialogContent>
       </AlertDialog>
     </>
     ```

2. **Tratamento de erro da query ausente**
   - Se `getAccount({ id })` falhar (404, 401, 500), `data` fica `undefined` e a sidebar mostra só skeletons infinitamente, sem feedback.
   - **Fix**: ler `error` do `useQuery`, exibir mensagem amigável com botão "Tentar novamente" (`refetch()`) e botão "Voltar para contas".

3. **Warning React de key duplicada em `MyAccountsSidebar`** (`src/page-modules/account-details/sidebar/my-accounts.tsx`, linhas 91–116)
   - `<Fragment key={account.id}>` envolve `<li key={account.id}>` — a chave do `<li>` é redundante e causa o warning do console "Each child in a list should have a unique key prop".
   - **Fix**: remover `key` do `<li>`, mantendo só no `<Fragment>`.

4. **Tipagem do Link em `MyAccountsSidebar`**
   - `<Link to={`/accounts/${account.id}` as any}>` — ao invés do cast `as any`, usar a forma type-safe do TanStack Router:
     ```
     <Link to="/accounts/$id" params={{ id: account.id }}>
     ```

### Arquivos a editar

- `src/page-modules/account-details/index.tsx` — reestruturar JSX (mover `AlertDialog` para o final como sibling, não wrapper); adicionar bloco de erro com retry.
- `src/page-modules/account-details/sidebar/my-accounts.tsx` — remover `key` duplicada do `<li>`; trocar `to={...as any}` pela forma com `params`.

### O que NÃO muda

- Nenhuma rota, nenhuma API, nenhum hook.
- Visual: sidebar de 3 cards, tabs Transações/Transferir/Pagar QrCode, copy buttons, animação framer-motion — tudo preservado.
- Lógica de `canChangePlayer`, `handleChangePlayer`, `balance`, `refetch` — preservada.

### Como validar

1. Em `/accounts`, clicar em "Visualizar" em uma conta APPROVED → página abre limpa, sem overlay de erro.
2. Console sem warning de "unique key prop".
3. Sidebar carrega saldo, CPF, conta, chaves Pix e lista "Minhas últimas contas".
4. Clicar em "Acessar" em outra conta da sidebar → navega corretamente.
5. Como super admin: clicar em "Trocar Jogador" → modal abre, CPF formatado, cancela/confirma funcionam.
6. Forçar erro (mudar `id` na URL para algo inválido) → mensagem de erro com botão "Tentar novamente".

