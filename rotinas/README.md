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
| Calendário editorial semanal | `0 10 * * 1` | Duda | `calendario-editorial-semanal.md` |
| Lembrete stories pré-evento | `0 18 * * *` | Duda | `lembrete-stories-pre-evento.md` |
| Fechamento diário (extração) | `0 4 * * *` | Tomás | `fechamento-diario.md` |
| Fechamento diário (push DM) | `0 9 * * *` | Tomás | `fechamento-diario.md` |
| Comissão pós-evento | `0 11 * * *` | Tomás | `comissao-pos-evento.md` |
| Alerta de variação | (sem cron — auxiliar) | Tomás | `alerta-variacao.md` |
| Relatório semanal intel | `0 9 * * 1` | Raul | `relatorio-semanal-intel.md` |
| Análise pós-evento | (sem cron — handoff Jarbas) | Raul | `agentes/intel/PLAYBOOK.md` |
| Perfil de promoter | (sem cron — handoff Beto via Jarbas) | Raul | `agentes/intel/PLAYBOOK.md` |
| Briefing pré-evento | `0 10 * * *` | Gil | `briefing-pre-evento.md` |
| Checklist dia-do-evento | `0 14 * * *` | Gil | `checklist-dia-evento.md` |
| Lições pós-evento | `0 14 * * *` | Gil | `pos-evento-licoes.md` |
| Atendimento público (reativo) | (sem cron) | Lia | `agentes/atendimento/PLAYBOOK.md` |
| Orçamento evento privado | (sem cron — handoff Lia) | Gil | `agentes/eventos/PLAYBOOK.md` |

## Regras
- Horários escritos em Brasília (UTC-3). Na VPS, converter pra UTC ao configurar cron
- Rotinas que checam "se tem evento" completam silenciosamente se não houver
- Nenhuma rotina executa pagamento sem aprovação explícita do Rodrigo
