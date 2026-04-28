## Testar fluxo de consulta de chave Pix e listagem de transações

Quero validar o fluxo de ponta a ponta na conta atualmente aberta (`/accounts/184e9421-c7d4-417a-b741-e4ddfaad15ec`) usando a automação do browser, sem disparar pagamentos reais.

### Escopo do teste

1. **Aba Transações** (`TransactionsAccount`)
   - Verificar se a lista carrega via `GET /accounts/{id}/transactions`.
   - Testar paginação (Primeira / Anterior / Próxima / Última) — confirmando que a correção recente do `useSearchParams` funciona aqui também.
   - Verificar formatação de valores, tipo, status e data.

2. **Sidebar "Minhas chaves Pix"** (`GetAccountKeysSidebar`)
   - Verificar carregamento via `GET /accounts/{id}/keys`.
   - Testar botão "Copiar" da chave.
   - **Não** vou criar nem deletar chaves (ações destrutivas/persistentes).

3. **Aba Transferir → Consulta de chave Pix** (`TransferPixOutSidebar`)
   - Inserir uma chave Pix de teste no campo e clicar em "Continuar".
   - Validar que `POST /accounts/{id}/keys/info` retorna nome, documento, conta e PSP do recebedor.
   - **Parar antes do botão "Pagar"** — não vou executar pagamento real.
   - Caso o usuário queira, posso testar com erro (chave inválida) para ver o toast.

### O que preciso de você

Como esse fluxo exige sessão autenticada no preview e uma chave Pix válida para consulta:

- **Login**: você precisa estar logado no preview do Lovable antes de eu rodar o teste (a sessão é compartilhada com o browser).
- **Chave Pix de teste**: me informe uma chave (CPF/EVP/email/telefone) que eu possa usar só para o `keys/info`. Sugestão segura: usar uma das suas próprias chaves listadas no sidebar dessa conta.

### Restrições

- **Não vou clicar em "Pagar"** nem em "Deletar chave" — só ações de leitura/consulta.
- Se a consulta retornar erro, vou reportar a mensagem e o status da request, sem alterar código.
- Se encontrar bug real (ex.: paginação quebrada, parser de resposta), eu paro e reporto antes de propor correção.

### Entregáveis

Relatório com:
- Status de cada etapa (✅/❌)
- Screenshots das telas-chave (lista de transações, dados do recebedor após consulta de chave)
- Requests/responses observados na aba network
- Qualquer bug encontrado com sugestão de correção (em plano separado)
