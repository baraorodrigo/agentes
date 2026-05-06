# Rotinas — Sub-mapa

Heartbeats e crons que fazem os agentes acordar e executar tarefas automaticamente. Horários em UTC-3 (Brasília).

| Rotina | Cron | Agente | Arquivo |
|--------|------|--------|---------|
| Briefing diário | `0 9 * * 1-6` | Jarbas | `briefing-diario.md` |
| Aniversariantes da semana | `0 10 * * 1` | Beto | `aniversariantes-semana.md` |
| Lembrete pré-evento | `0 10 * * *` | Beto | `lembrete-pre-evento.md` |
| Briefing dia do evento | `0 18 * * *` | Beto | `briefing-evento.md` |
| Resumo pós-evento | `0 11 * * *` | Jarbas | `resumo-pos-evento.md` |
| Ranking semanal | `0 11 * * 0` | Beto | `ranking-semanal.md` |
| Lembrete pagamento | `0 9 1,15 * *` | Jarbas | `lembrete-pagamento.md` |
| Sugestão conteúdo | `0 10 * * 1` | Duda | `sugestao-conteudo.md` |

## Regras
- Horários escritos em Brasília (UTC-3). Na VPS, converter pra UTC ao configurar cron
- Rotinas que checam "se tem evento" completam silenciosamente se não houver
- Nenhuma rotina executa pagamento sem aprovação explícita do Rodrigo
