# Rotina: Briefing Diário

- **Cron:** `0 9 * * 1-6` (seg a sáb, 9h Brasília)
- **Agente:** Jarbas (admin)
- **Destino:** Chat privado Rodrigo

## Prompt

Bom dia Rodrigo! Monte o briefing do dia:
1. Consulte o Google Calendar para compromissos de hoje
2. Se tiver evento hoje, puxe os dados atuais de lista do PNE (quantos nomes inseridos até agora)
3. Liste pendências conhecidas
4. Envie resumo formatado

## Formato esperado

```
🐺 Bom dia Rodrigo! [dia da semana], [data].
📅 Hoje: [compromissos ou "agenda livre"]
🎪 Evento: [nome do evento + total na lista, ou "sem evento hoje"]
⚠️ Pendências: [lista ou "nada urgente"]
```
