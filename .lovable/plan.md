

## Remover botão "Abrir no editor"

Removo o botão de bridge do header e mantenho apenas o login direto pelo formulário do Lovable (`/auth/login`) no preview.

### Alterações

1. **`src/components/layouts/app-layout.tsx`**: remover o botão "Abrir no editor", o import do ícone `ExternalLink` e a lógica de geração do link da bridge.
2. **`src/routes/auth.bridge.tsx`**: manter o arquivo (é inofensivo e não aparece na UI), caso você queira reativar no futuro. Se preferir, removo também — me diga.

### Resultado

No preview do Lovable você usa o formulário normal de login (`/auth/login`) com suas credenciais reais. Nenhum botão extra aparece no app publicado.

