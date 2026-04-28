# Ajustar payload do Pix e remover PIN

## Mudanças em `src/page-modules/account-details/transfer-pix-out.tsx`

1. **Payload do `/pix/payment`**: trocar `keyInfoId` por `id` e remover `pin`.
   ```ts
   await api.post(`/accounts/${data?.account?.id}/pix/payment`, {
     id: pixInfoData.info.id,
     amount: value,
   });
   ```

2. **Remover toda a lógica de PIN**:
   - Remover state `const [pin, setPin] = useState<string>("")`.
   - Remover validação `if (!pin || pin.length < 4) { ... }` em `handlePaymentPix`.
   - Remover `setPin("")` em `handlePaymentPix` e em `handleResetKey`.
   - Remover o bloco JSX do campo "PIN transacional" (Label + Input com `id="pin"`).

Nenhuma outra alteração necessária — `pay-qrcode.tsx` já usa `id` e não envia PIN.
