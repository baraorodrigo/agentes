# Rotina: Lembrete Pré-Evento

- **Cron:** `0 10 * * *` (todo dia, 10h Brasília)
- **Agente:** Beto (promoters)
- **Destino:** WhatsApp Grupo Promoters
- **Condição:** Só executa se tem evento nos próximos 3 dias. Senão, completa silenciosamente.

## Prompt

Verifique no Google Calendar/PNE se tem evento nos próximos 3 dias. Se tiver, mande lembrete com nome do evento, data/horário, link da lista do PNE e incentivo para divulgar. Se não tiver, não envie nada.

## Formato esperado

```
⚡ LEMBRETE: [Nome do evento] em [X] dias!
📅 [data] às [horário]
📋 Link da lista: [link]
Bora lotar! Compartilha com a galera 💪
```
