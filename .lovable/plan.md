

## Diagnóstico: por que o preview não aparece em `/users`

A rota `/users` (e todo `_app/*`) depende de duas camadas de dados que estão falhando silenciosamente no ambiente de **preview do Lovable**:

### Causa raiz

1. **`CustomerProvider` retorna `null` enquanto não casa um cliente** (`src/context/customer.tsx`, linha 57). Ele procura em `customers.json` por um item cujo `host` esteja contido em `window.location.host`. No preview o host é `id-preview--67380fdf-...lovable.app` — nenhum cliente cadastrado tem esse host, então usa `customers[0]` (Trend Finance). Isso até funciona, mas...

2. **A API depende de autenticação real** (`src/lib/api.ts` + `src/context/auth.tsx`). No preview não há sessão válida, então `_app.tsx` redireciona para `/auth/login` ou as queries falham. A página `/users` exige login.

3. **`useIsOwem` perdeu o fallback de `localhost`** (último diff). Antes, em preview, alguns gates de UI assumiam comportamento "owem". Agora retorna sempre `false` no preview, o que pode esconder componentes ou interromper renderização condicional.

4. O log do dev-server mostra um aviso sobre `tailwind.config.ts` ausente — é apenas um warning interno do Lovable (Tailwind v4 usa `src/styles.css`). **Não é** a causa da tela em branco.

### Resumo

O preview não mostra `/users` porque essa rota é protegida e exige login. No preview você é redirecionado para `/auth/login`. Para visualizar conteúdo autenticado é preciso fazer login com credenciais válidas da API configurada em `src/lib/api.ts`.

### Plano de correção (a aplicar quando aprovado)

1. **Adicionar fallback de host de preview** em `src/context/customer.tsx` para garantir que `lovable.app` resolva para o cliente Trend Finance (já é o `customers[0]`, então funciona — apenas confirmar).
2. **Restaurar suporte a `localhost`/preview em `useIsOwem`** se algum componente depender disso para renderizar (avaliar caso a caso).
3. **Verificar `_app.tsx`**: confirmar para onde redireciona quando não há sessão e garantir que a tela de login carrega corretamente no preview.
4. **Testar fluxo de login** com credenciais reais da API, ou criar um modo "demo" que exiba dados mock no preview sem exigir login.

### Detalhes técnicos

- Arquivos envolvidos: `src/context/customer.tsx`, `src/context/auth.tsx`, `src/routes/_app.tsx`, `src/hooks/is-owem.tsx`, `src/lib/api.ts`.
- Nenhuma alteração de schema/backend é necessária.
- O warning do `tailwind.config.ts` pode ser ignorado (é apenas telemetria interna do Lovable, não afeta o build).

### Pergunta para você

Antes de eu aplicar correções, confirme:
- Você quer **fazer login no preview** (precisa das credenciais da API existente), ou
- Quer que eu adicione um **modo demo/mock** para mostrar a UI de `/users` sem autenticação?

