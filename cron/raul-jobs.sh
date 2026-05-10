#!/usr/bin/env bash
# raul-jobs.sh — crons do Raul 🔍 (intel/análise)
#
# Raul é sub-agent do Jarbas. Não tem canal próprio. A maioria do trabalho dele
# é convocação por handoff (Jarbas / Beto via Jarbas) — sem cron. O único cron
# é o relatório semanal de segunda 09h Brasília.
#
# Como instalar na VPS:
#   crontab -e
#   # Brasília 09h segunda = UTC 12h segunda:
#   0 12 * * 1   /root/.openclaw/workspaces/raul/cron/raul-jobs.sh relatorio_semanal
#
# Cada `openclaw cron run` dispara o agente Raul como sub-agent do Jarbas
# (via `sessions_spawn` configurado no openclaw.json — Raul não tem session
# própria de canal, recebe contexto do Jarbas e devolve estrutura).

set -euo pipefail

JOB="${1:-help}"
AGENT_ID="raul"

case "$JOB" in
  relatorio_semanal)
    # Segunda 09h Brasília — relatório de tendência da semana anterior
    # Skill: relatorio-semanal-intel
    # Output: estrutura JSON entregue ao Jarbas (que decide se repassa pro Rodrigo)
    echo "[raul] relatorio_semanal: $(date -Iseconds)"
    openclaw cron run "${AGENT_ID}:relatorio-semanal-intel"
    ;;

  help|*)
    cat <<EOF
Uso: $0 <job>

Jobs disponíveis:
  relatorio_semanal     Segunda 09h Brasília (entrega ao Jarbas)

Outras 2 skills do Raul (analise-pos-evento, perfil-promoter) não têm cron —
são convocadas via handoff:
  - analise-pos-evento  → Jarbas convoca após Tomás fechar comissão (D+1)
  - perfil-promoter     → Beto convoca via Jarbas

Horário no comentário do header em UTC-3 (Brasília). Crontab da VPS roda em UTC.

Logs: cada execução escreve em workspace/agentes/intel/activity.jsonl
EOF
    exit 1
    ;;
esac
