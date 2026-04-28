## Adequar fluxo de Pix à API oficial da Stric

A doc oficial mostra que o backend mudou de assinatura. O código atual usa endpoints/payloads/respostas antigos, e isso provavelmente é a causa das falhas no fluxo de consulta + pagamento.

### Diferenças encontradas

#### 1. Consultar chave Pix

| Campo | Código atual | Doc Stric |
|---|---|---|
| Endpoint | `POST /accounts/{id}/keys/info` | `POST /accounts/{id}/pix/key-info` |
| Header | — | `x-tenant-id` obrigatório |
| Resposta (raiz) | `{ info: { ... } }` | `{ key: { ... } }` |
| Campos retornados | `id, key, type, document, name, agency, accountNumber, accountType, personType, pspName` | `id, key, ispb, document, name, bankName, bankCode, endToEndId` |

#### 2. Realizar pagamento Pix

| Campo | Código atual | Doc Stric |
|---|---|---|
| Body | `{ id, key, amount }` | `{ keyInfoId, amount, pin }` |
| Resposta | `responsePaymentQrCode` (genérico) | `{ transaction: { id, amount, status, ... } }` |

O código atual **não envia `pin`**, que agora é obrigatório.

### Alterações propostas

**`src/page-modules/account-details/transfer-pix-out.tsx`**
- Trocar URL para `/accounts/{accountId}/pix/key-info`.
- Atualizar tipo `ValidatePixInfoResponse` para `{ key: { id, key, ispb, document, name, bankName, bankCode, endToEndId } }`.
- Atualizar a UI do recebedor:
  - "Banco": `bankName` (ao invés de `pspName`).
  - Remover campos inexistentes (`accountNumber`, `pspName` formatado como documento — estava errado).
  - Mostrar `bankName` + `bankCode` no lugar de "Conta".
- Pagamento:
  - Body: `{ keyInfoId: pixInfoData.key.id, amount: value, pin }`.
  - Adicionar campo de **PIN transacional** no formulário (input password, 4–6 dígitos).
  - Validar PIN antes de submeter.
- Mensagem de erro: a doc retorna `{ code, error, message }` — o `parseError` atual já lê `message`, então funciona.

**`src/lib/api.ts`** (verificar)
- Confirmar se o axios já injeta `x-tenant-id`. Se não, adicionar via interceptor (precisa saber de onde vem o tenant — provavelmente já está, já que outros endpoints funcionam).

### Fora de escopo (manter como está)

- Cadastro/listagem/remoção de chaves no sidebar — não faz parte dessa página de doc, manter intocado por ora.
- Endpoint de transações — a doc desse fluxo só cobre key-info e payment.

### Risco

- Se o backend ainda aceitar o endpoint antigo `/keys/info` em paralelo, o app continua funcionando depois da mudança. Se não aceitar, a mudança **conserta** o fluxo quebrado.
- O campo `pin` é novo: se o usuário não tiver PIN cadastrado, o pagamento vai falhar com erro do backend — vou propagar a mensagem no toast.

### Pergunta

Você quer que eu também já atualize o cadastro/remoção de chaves para os endpoints novos (`/pix/keys` se for o caso), ou foco só na consulta + pagamento agora? Posso buscar a doc dessas rotas também antes de mexer.
