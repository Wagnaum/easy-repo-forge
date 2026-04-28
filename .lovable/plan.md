## Objetivo

Confirmar que o fix aplicado em `IntlCurrencyInput` (mover `component = "input"` para o destructuring dos parâmetros) também resolve o erro "Element type is invalid" no fluxo de pagamento via QR Code (`pay-qrcode.tsx`).

## Análise do código

- `src/page-modules/account-details/pay-qrcode.tsx` (linha 171) usa `<IntlCurrencyInput value={...} onChange={...} />` **sem** passar a prop `component`, exatamente igual ao `transfer-pix-out.tsx`.
- O fix anterior em `src/components/react-intl-currency-input/intl-currency-input.tsx` já garante o default `component: InputComponent = "input"` direto na assinatura da função (não mais via `defaultProps`, que React 19 ignora em function components).
- Portanto, **nenhuma mudança de código adicional é necessária** — o mesmo fix cobre os dois fluxos.

## Limpeza opcional (recomendada)

O arquivo `intl-currency-input.tsx` ainda mantém os blocos legados `IntlCurrencyInput.propTypes` e `IntlCurrencyInput.defaultProps`. Eles não causam mais o bug (porque os defaults agora vêm do destructuring), mas:

1. `defaultProps` em function components emite warning no console em React 18+ e é totalmente ignorado em React 19.
2. `propTypes` adiciona dependência desnecessária em `prop-types`.

Proposta:
- Remover os blocos `IntlCurrencyInput.propTypes = {...}` e `IntlCurrencyInput.defaultProps = {...}`.
- Remover o import de `prop-types` e a função `checkCurrentPropType`.
- Manter toda a lógica de runtime intacta (só limpeza de código morto).

## Passos de validação (após aprovar o plano)

1. Aplicar a limpeza opcional em `intl-currency-input.tsx`.
2. Abrir o preview em `/accounts/<id>` → aba "Pagar QR Code".
3. Colar um código Copia-e-Cola válido e clicar em "Continuar".
4. Confirmar que:
   - Os dados do recebedor aparecem.
   - O campo "Valor" (IntlCurrencyInput) renderiza sem o erro "Element type is invalid".
   - "Algo deu errado" não aparece mais.
5. Reportar o resultado.

## Arquivos afetados

- `src/components/react-intl-currency-input/intl-currency-input.tsx` (limpeza opcional de `propTypes`/`defaultProps`)

Nenhuma mudança em `pay-qrcode.tsx` ou `transfer-pix-out.tsx`.
