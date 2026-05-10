#!/usr/bin/env bash
# duda-jobs.sh — crons da Duda 🎸 (marketing)
#
# Este script é o contrato de cron da Duda. Cada linha que vai pro crontab
# da VPS chama este arquivo com um job específico. Mantém os horários em UTC-3
# (Brasília); a VPS roda em UTC, então a conversão acontece no crontab da VPS,
# NÃO aqui dentro.
#
# Como instalar na VPS:
#   crontab -e
#   # Brasília 10h seg = UTC 13h seg:
#   0 13 * * 1   /root/.openclaw/workspaces/duda/cron/duda-jobs.sh calendario_semanal
#   # Brasília 18h diário = UTC 21h diário:
#   0 21 * * *   /root/.openclaw/workspaces/duda/cron/duda-jobs.sh lembrete_stories
#
# Cada `openclaw cron run <jobId>` dispara o agente Duda com um prompt específico
# resolvido a partir de `workspace/rotinas/<rotina>.md`. O runtime cuida de:
#   - load do contexto do agente (IDENTITY/PLAYBOOK/skills/memory)
#   - chamada ao modelo (Haiku 4.5)
#   - persistência em activity.jsonl
#
# Stub: este arquivo é template. O comando `openclaw cron run` real só vai
# existir quando o deploy VPS for feito (ver PLANO-MULTIAGENTES.md Fase 5).

set -euo pipefail

JOB="${1:-help}"
AGENT_ID="duda"

case "$JOB" in
  calendario_semanal)
    # Segunda 10h Brasília — calendário editorial da semana (qua-dom)
    # Skill: calendario-editorial-semanal (todas as fases)
    # Output: rascunho no Telegram topic Marketing pro Rodrigo aprovar
    echo "[duda] calendario_semanal: $(date -Iseconds)"
    openclaw cron run "${AGENT_ID}:calendario-editorial-semanal"
    ;;

  lembrete_stories)
    # Diário 18h Brasília — lembrete de story pré-evento
    # Silencioso se sem evento em D+1.
    # Skill: lembrete-stories (todas as fases)
    # Output: 1 lembrete + 1 frase pronta no Telegram topic Marketing
    echo "[duda] lembrete_stories: $(date -Iseconds)"
    openclaw cron run "${AGENT_ID}:lembrete-stories-pre-evento"
    ;;

  help|*)
    cat <<EOF
Uso: $0 <job>

Jobs disponíveis:
  calendario_semanal       10h segunda (push Telegram topic Marketing)
  lembrete_stories         18h diário (silencioso se sem evento amanhã)

Horários no comentário do header estão em UTC-3 (Brasília). Crontab da VPS
deve estar em UTC — converta lá.

Logs: cada execução escreve em workspace/agentes/marketing/activity.jsonl
EOF
    exit 1
    ;;
esac
