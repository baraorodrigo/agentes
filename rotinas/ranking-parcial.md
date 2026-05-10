# Rotina: Ranking Parcial

- **Cron:** `0 15 * * 3-6` (qua-sáb, 15h Brasília)
- **Agente:** Beto
- **Destino:** WhatsApp Grupo Promoters
- **Condição:** Só executa se há evento na semana. Senão, completa silenciosamente.
- **Skills usadas:** `skills/extrair-pne/SKILL.md`, `skills/montar-ranking/SKILL.md`

## Prompt

Puxar conversões do PNE (Relatórios → Conversões Por Membro, período = semana atual). Montar top 5 e postar no grupo. **Sem valores financeiros** — só posição e resultado.

## Formato esperado

Ver `agentes/promoters/PLAYBOOK.md` § 15h — Ranking parcial.
