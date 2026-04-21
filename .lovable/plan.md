

## Plano: corrigir definitivamente a página de Detalhes da Conta

A correção anterior consertou só o `AlertDialog` raiz do `index.tsx`. O mesmo bug ainda existe em `GetAccountKeysSidebar` (sidebar de chaves Pix), o que mantém a página quebrada / com overlay de erro.

### Bug raiz (ainda presente)

**`src/page-modules/account-details/sidebar/get-keys.tsx`** — todo o JSX do componente vive dentro de `<AlertDialog open={open} ...>` (linhas 110–226). O `<dl>`, o seletor de "Nova chave Pix" e até o botão "Criar" estão envolvidos pelo Radix `AlertDialog`. Isso:
- Faz o Radix tentar gerenciar foco/portal de toda a sidebar.
- Dispara o `vite-error-overlay` ao montar/clicar.
- Reproduz exatamente o sintoma "página não funciona" que o usuário reporta.

### Correção

1. **`get-keys.tsx`** — reestruturar o JSX assim:
   ```
   <>
     <dl className="grid gap-3"> ...lista de chaves... </dl>

     {userLogged?.id === account?.user?.id && (
       <> ...seletor + botão Criar... </>
     )}

     <AlertDialog open={open} onOpenChange={setOpen}>
       <AlertDialogContent> ...confirmação de delete... </AlertDialogContent>
     </AlertDialog>
   </>
   ```
   O `<AlertDialog>` deixa de ser wrapper e vira sibling, igual ao que foi feito em `index.tsx`.

2. **HTML semântica** — trocar os `<div key={key.id}>` filhos de `<dl>` por estrutura válida (manter o key no fragment ou usar `<div>` fora do `<dl>`). Remover o segundo `<dd>` órfão (botão de delete) ou agrupar com o primeiro.

3. **Warning de "unique key prop"** — o erro do console aponta `Controller` (react-hook-form) renderizando filhos sem key. Vou auditar `account-table-filters.tsx` e `user-table-filters.tsx` (são os únicos com Controller no fluxo atual) e adicionar keys onde estiver faltando, ou remover wrappers `<>...</>` problemáticos dentro do `render` do Controller.

### Como validar

1. Abrir `/accounts/:id` de uma conta APPROVED → página renderiza limpa, sem overlay vermelho do Vite.
2. Sidebar "Minhas chaves Pix" carrega: lista de chaves + (se for o dono) seletor "Nova chave Pix" + botão Criar.
3. Clicar no ícone 🗑️ de uma chave → modal de confirmação abre normalmente; cancelar fecha; deletar funciona.
4. Console limpo (sem warning de "unique key prop").
5. Trocar Jogador (super admin), Tabs Transações/Transferir/Pagar QrCode, Acessar outra conta — tudo continua funcional.

### Arquivos a editar

- `src/page-modules/account-details/sidebar/get-keys.tsx` (reestruturação principal)
- `src/page-modules/accounts/account-table-filters.tsx` (auditar Controller keys)
- `src/page-modules/users/user-table-filters.tsx` (auditar Controller keys)

### O que NÃO muda

- Nenhuma rota, API, hook ou regra de negócio.
- Visual da sidebar, dos cards, das tabs — preservado.
- Lógica de criar/deletar chave Pix, copy-to-clipboard, paginação de transações — preservada.

