# Rotina: Briefing Dia do Evento

- **Cron:** `0 18 * * *` (todo dia, 18h Brasília)
- **Agente:** Beto (promoters)
- **Destino:** WhatsApp Grupo Promoters
- **Condição:** Só executa se tem evento HOJE. Senão, completa silenciosamente.

## Prompt

Verifique se tem evento HOJE. Se tiver, mande o briefing final com status da lista (consultar PNE), horário de abertura e motivação. Se não tiver, não envie nada.

## Formato esperado

```
⚡ É HOJE! [Nome do evento] 🔥
📋 Lista atual: [X] nomes
🕐 Abertura: [horário]
Bora fazer história! 💪
```
