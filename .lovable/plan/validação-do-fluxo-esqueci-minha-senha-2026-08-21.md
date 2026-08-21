# Validação do fluxo "Esqueci minha senha"

O fluxo já existe em duas etapas na mesma rota `/auth/forgot-password`:

1. Sem `?token=` na URL: formulário de e-mail que chama `POST /users/send-forgot-password` (envia `email`, `name` do cliente e a `url` de retorno).
2. Com `?token=...`: formulário de nova senha + confirmação que chama `POST /users/forgot-password` e redireciona para `/auth/login`.

O que foi verificado no código: as duas chamadas de API estão corretas, o `token` é lido da query string, as senhas são comparadas antes do envio e os erros da API aparecem via toast. O link "Esqueci minha senha" na tela de login aponta para a rota certa.

## Problemas encontrados

1. **Textos errados**: o título é "Entrar" e o subtítulo "Insira seu e-mail abaixo para fazer login" — copiados da tela de login. Os dois passos usam o mesmo botão "Próximo".
2. **Sem confirmação depois do envio**: após o e-mail ser enviado, o formulário continua igual; só um toast avisa. O usuário não sabe que deve checar a caixa de entrada.
3. **Sem validação de senha**: aceita qualquer senha, inclusive 1 caractere. Nenhum mínimo de tamanho.
4. **Sem validação de e-mail além do `type="email"`** do navegador.
5. **Sem caminho de volta**: não existe link "Voltar ao login" em nenhuma das etapas.
6. **Sem tratamento de token inválido/expirado**: o erro da API aparece só como toast, sem orientar a pedir um novo link.
7. **Metadados da rota incompletos**: só `title`, sem `description`/Open Graph.

## Ajustes propostos

Somente em `src/page-modules/forgot-password.tsx` e `src/routes/auth.forgot-password.tsx` (frontend/apresentação):

- Título/subtítulo por etapa: "Esqueci minha senha" / "Definir nova senha", com botões "Enviar link" e "Redefinir senha".
- Estado de sucesso após o envio: mensagem "Enviamos um link para <e-mail>", com opção de reenviar.
- Validação com `zod` (já usado no arquivo): e-mail válido; senha com mínimo de 8 caracteres e confirmação igual, com mensagens abaixo dos campos em vez de só toast.
- Link "Voltar ao login" nas duas etapas.
- Em erro na etapa do token, exibir aviso de link inválido/expirado com atalho para solicitar novo link.
- Completar `head()` da rota com `description`, `og:title`, `og:description`, `og:type` e `twitter:card`.

Nenhuma mudança de API, backend ou regra de negócio.

## Validação depois de aplicar

- Abrir `/auth/forgot-password`, enviar um e-mail real e confirmar o estado de sucesso.
- Abrir `/auth/forgot-password?token=abc` e confirmar a etapa de nova senha, os erros de validação e a mensagem de token inválido.
