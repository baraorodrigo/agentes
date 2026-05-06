# Rotina: Resumo Pós-Evento

- **Cron:** `0 11 * * *` (todo dia, 11h Brasília)
- **Agente:** Jarbas (admin)
- **Destino:** Chat privado Rodrigo + versão resumida pro grupo de promoters (via Beto)
- **Condição:** Só executa se teve evento ONTEM. Senão, completa silenciosamente.

## Prompt

Verifique se teve evento ontem. Se teve:
1. Acesse PNE → relatório do evento: inseridos, convertidos, taxa por promoter
2. Acesse Bar Fácil → relatório: faturamento, ticket médio, top produtos
3. Monte relatório completo para o Rodrigo
4. Monte versão resumida (só ranking, sem financeiro) para o grupo de promoters

## Formato Admin (Rodrigo)

```
📊 RESUMO: [Nome do evento] — [data]

📋 Lista (PNE):
- Inseridos: [X]
- Convertidos: [X] ([Y]%)
- Top promoter: [Nome] com [X] conversões

💰 Vendas (Bar Fácil):
- Faturamento: R$ [valor]
- Ticket médio: R$ [valor]
- Top produto: [nome]

🏆 Ranking completo + comissões:
[tabela com valores]
```

## Formato Promoters (grupo — SEM financeiro)

```
⚡ RESULTADO: [Nome do evento]
📋 Total convertidos: [X]
🥇 [Nome] — [X] conversões
🥈 [Nome] — [X] conversões
🥉 [Nome] — [X] conversões
Valeu galera! 💪
```
