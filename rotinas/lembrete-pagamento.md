# Rotina: Lembrete de Pagamento de Promoters

- **Cron:** `0 9 1,15 * *` (dia 1 e 15, 9h Brasília)
- **Agente:** Jarbas (admin)
- **Destino:** Chat privado Rodrigo

## Prompt

Lembre o Rodrigo de acertar os promoters:
1. Liste os eventos do período (quinzena)
2. Para cada promoter, calcule: (eventos × R$80) + (aniversários × R$30)
3. Formate como lista de pagamento
4. Envie para aprovação — NUNCA execute pagamento automaticamente

## Formato esperado

```
💰 PAGAMENTO PROMOTERS — [quinzena]

[Nome]: [X] eventos + [Y] aniversários = R$ [valor]
[Nome]: [X] eventos + [Y] aniversários = R$ [valor]
...

Total: R$ [valor]
Confirma pra eu registrar? 👊
```
