#!/usr/bin/env bash
# gil-jobs.sh — crons do Gil 🎪 (eventos)
#
# Este script é o contrato de cron do Gil. Cada linha que vai pro crontab da
# VPS chama este arquivo com um job específico. Mantém os horários em UTC-3
# (Brasília); a VPS roda em UTC, então a conversão acontece no crontab da VPS,
# NÃO aqui dentro.
#
# Como instalar na VPS:
#   crontab -e
#   # Brasília 10h = UTC 13h:
#   0 13 * * *   /root/.openclaw/workspaces/gil/cron/gil-jobs.sh briefing_pre_evento
#   # Brasília 14h = UTC 17h (cobre os 2 jobs distintos do dia 14h):
#   0 17 * * *   /root/.openclaw/workspaces/gil/cron/gil-jobs.sh checklist_dia_evento
#   0 17 * * *   /root/.openclaw/workspaces/gil/cron/gil-jobs.sh pos_evento_licoes
#
# Cada `openclaw cron run <jobId>` dispara o agente Gil com um prompt específico
# resolvido a partir de `workspace/rotinas/<rotina>.md`. O runtime cuida de:
#   - load do contexto do agente (IDENTITY/PLAYBOOK/skills/memory)
#   - chamada ao modelo (Haiku 4.5)
#   - persistência em activity.jsonl
#
# Os 2 jobs das 14h convivem porque cada um tem detecção independente:
#   - checklist_dia_evento dispara só se hoje é dia de evento
#   - pos_evento_licoes dispara só se há evento de 2 dias atrás com Tomás+Raul prontos
# Ambos podem rodar silenciosos no mesmo dia sem conflito.
#
# Stub: este arquivo é template. O comando `openclaw cron run` real só vai
# existir quando o deploy VPS for feito (ver PLANO-MULTIAGENTES.md Fase 5).

set -euo pipefail

JOB="${1:-help}"
AGENT_ID="gil"

case "$JOB" in
  briefing_pre_evento)
    # 10h Brasília — briefing de eventos em janela 7d (silencioso se sem evento próximo)
    # Skill: briefing-pre-evento
    # Output: DM Rodrigo (1 mensagem por evento na janela)
    echo "[gil] briefing_pre_evento: $(date -Iseconds)"
    openclaw cron run "${AGENT_ID}:briefing-pre-evento"
    ;;

  checklist_dia_evento)
    # 14h Brasília — checklist do dia se hoje é dia de evento (silencioso se não)
    # Skill: checklist-operacional-dia
    # Output: DM Rodrigo (template "14h — Checklist operacional" do PLAYBOOK)
    echo "[gil] checklist_dia_evento: $(date -Iseconds)"
    openclaw cron run "${AGENT_ID}:checklist-operacional-dia"
    ;;

  pos_evento_licoes)
    # 14h Brasília — lições D+2 (silencioso se não tem evento de 2 dias atrás
    # OU se Tomás/Raul ainda não fecharam). Re-tenta D+3, D+4, D+5.
    # Skill: pos-evento-licoes
    # Output: DM Rodrigo (resumo curto) + escrita em workspace/memory/lessons.md
    echo "[gil] pos_evento_licoes: $(date -Iseconds)"
    openclaw cron run "${AGENT_ID}:pos-evento-licoes"
    ;;

  help|*)
    cat <<EOF
Uso: $0 <job>

Jobs disponíveis:
  briefing_pre_evento     10h diário (silencioso se sem evento em 7d)
  checklist_dia_evento    14h diário (silencioso se hoje não é evento)
  pos_evento_licoes       14h diário (silencioso se sem evento D-2 OU Tomás/Raul não prontos)

Outras 1 skill do Gil (evento-privado-orcamento) não tem cron — é convocada
via handoff:
  - evento-privado-orcamento  → Lia entrega via Jarbas quando cliente pede privado;
                               Gil monta briefing + handoff Tomás + proposta
                               consolidada DM Rodrigo

Horários no comentário do header em UTC-3 (Brasília). Crontab da VPS deve
estar em UTC — converta lá.

Logs: cada execução escreve em workspace/agentes/eventos/activity.jsonl
EOF
    exit 1
    ;;
esac
