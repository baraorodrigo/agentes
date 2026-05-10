#!/usr/bin/env bash
# tomas-jobs.sh — crons do Tomás 📊 (financeiro)
#
# Este script é o contrato de cron do Tomás. Cada linha que vai pro crontab
# da VPS chama este arquivo com um job específico. Mantém os horários em UTC-3
# (Brasília); a VPS roda em UTC, então a conversão acontece no crontab da VPS,
# NÃO aqui dentro.
#
# Como instalar na VPS:
#   crontab -e
#   # Brasília 04h = UTC 07h:
#   0 7  * * *   /root/.openclaw/workspaces/tomas/cron/tomas-jobs.sh fechamento_extracao
#   0 12 * * *   /root/.openclaw/workspaces/tomas/cron/tomas-jobs.sh fechamento_push
#   0 14 * * *   /root/.openclaw/workspaces/tomas/cron/tomas-jobs.sh comissao_evento
#   0 12 1,15 * * /root/.openclaw/workspaces/tomas/cron/tomas-jobs.sh lembrete_pagamento
#   0 21 28-31 * * /root/.openclaw/workspaces/tomas/cron/tomas-jobs.sh resumo_mensal_se_ultimo_util
#
# Cada `openclaw cron run <jobId>` dispara o agente Tomás com um prompt específico
# resolvido a partir de `workspace/rotinas/<rotina>.md`. O runtime cuida de:
#   - load do contexto do agente (IDENTITY/PLAYBOOK/skills/memory)
#   - chamada ao modelo (Sonnet 4.6)
#   - persistência em activity.jsonl
#
# Stub: este arquivo é template. O comando `openclaw cron run` real só vai
# existir quando o deploy VPS for feito (ver PLANO-MULTIAGENTES.md Fase 5).

set -euo pipefail

JOB="${1:-help}"
AGENT_ID="tomas"

case "$JOB" in
  fechamento_extracao)
    # 04h Brasília — extração silenciosa do Bar Fácil
    # Skill: fechamento-diario (Fase 1)
    # Output: append em memory/events.md, sem mensagem
    echo "[tomas] fechamento_extracao: $(date -Iseconds)"
    openclaw cron run "${AGENT_ID}:fechamento-extracao"
    ;;

  fechamento_push)
    # 09h Brasília — push DM Rodrigo com fechamento de ontem
    # Skill: fechamento-diario (Fase 2)
    # Output: DM Rodrigo (template "Fechamento de [data]" do PLAYBOOK)
    echo "[tomas] fechamento_push: $(date -Iseconds)"
    openclaw cron run "${AGENT_ID}:fechamento-push"
    ;;

  comissao_evento)
    # 11h Brasília — comissão D+1 (silencioso se não teve evento ontem)
    # Skill: comissao-evento (todas as fases)
    # Output: DM Rodrigo (template "11h em D+1 de evento")
    echo "[tomas] comissao_evento: $(date -Iseconds)"
    openclaw cron run "${AGENT_ID}:comissao-evento"
    ;;

  lembrete_pagamento)
    # Dia 1 e 15, 09h Brasília — pendências vencendo em 7d
    # Skill: nenhuma específica (lê memory/pendencias.md direto)
    # Output: DM Rodrigo (template "Pagamentos a vencer" do PLAYBOOK)
    echo "[tomas] lembrete_pagamento: $(date -Iseconds)"
    openclaw cron run "${AGENT_ID}:lembrete-pagamento"
    ;;

  resumo_mensal_se_ultimo_util)
    # Roda dia 28-31 às 18h Brasília. Tomás verifica internamente se HOJE é o
    # último dia útil do mês — se não for, sai silencioso.
    # Skill: nenhuma específica (agrega memory/events.md)
    # Output: DM Rodrigo (template "Resumo de [mês/ano]")
    echo "[tomas] resumo_mensal_se_ultimo_util: $(date -Iseconds)"
    openclaw cron run "${AGENT_ID}:resumo-mensal"
    ;;

  help|*)
    cat <<EOF
Uso: $0 <job>

Jobs disponíveis:
  fechamento_extracao            04h diário (silencioso)
  fechamento_push                09h diário (push DM Rodrigo)
  comissao_evento                11h diário (silencioso se sem evento)
  lembrete_pagamento             09h dia 1 e 15
  resumo_mensal_se_ultimo_util   18h dias 28-31 (roda só se for o último útil)

Horários no comentário do header estão em UTC-3 (Brasília). Crontab da VPS
deve estar em UTC — converta lá.

Logs: cada execução escreve em workspace/agentes/financeiro/activity.jsonl
EOF
    exit 1
    ;;
esac
