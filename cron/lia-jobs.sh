#!/usr/bin/env bash
# lia-jobs.sh — crons da Lia 💬 (atendimento público)
#
# Lia é PURAMENTE REATIVA: responde mensagem do cliente no WhatsApp público.
# Não tem cron próprio (sem push, sem briefing, sem lembrete agendado).
# Este stub existe pra:
#   1. Padronizar o contrato de cron com os outros agentes (tomas-jobs.sh,
#      raul-jobs.sh, etc)
#   2. Reservar o ponto de entrada caso, no futuro, Rodrigo aprove alguma
#      tarefa agendada (ex: arquivar reservas antigas, reset de FAQ)
#
# Como instalar na VPS:
#   Hoje: NÃO INSTALAR. Lia não tem entrada no crontab.
#   Se Rodrigo aprovar job futuro, descomenta a linha relevante e converte
#   pra UTC (a VPS roda em UTC; horários do header estão em UTC-3).
#
# Possíveis jobs futuros (NÃO ATIVOS — exigem aprovação Rodrigo):
#   - arquivar_reservas_antigas: 1x por mês, move entradas > 90d pra arquivo
#   - heartbeat_canal: 1x por hora em horário comercial, checa se WhatsApp
#     público tá conectado (Evolution API healthcheck) e avisa Jarbas se cair
#
# Stub: este arquivo é template, igual `tomas-jobs.sh`. O comando
# `openclaw cron run` real só vai existir quando o deploy VPS for feito
# (ver PLANO-MULTIAGENTES.md Fase 5).

set -euo pipefail

JOB="${1:-help}"
AGENT_ID="lia"

case "$JOB" in
  arquivar_reservas_antigas)
    # PROPOSTA — não ativo. Aprovação Rodrigo pendente.
    # Frequência sugerida: 1x por mês, dia 1, 03h Brasília
    # Skill: nenhuma específica (manipula memory/reservas.md direto)
    # Output: move entradas com status final há > 90d pra
    #         memory/reservas-arquivo-YYYY.md. Sem mensagem.
    echo "[lia] arquivar_reservas_antigas: $(date -Iseconds)"
    echo "[lia] AVISO: job não ativo — exige aprovação Rodrigo"
    exit 1
    # openclaw cron run "${AGENT_ID}:arquivar-reservas-antigas"
    ;;

  heartbeat_canal)
    # PROPOSTA — não ativo. Aprovação Rodrigo pendente.
    # Frequência sugerida: 1x por hora, das 10h às 02h Brasília
    # Skill: nenhuma específica (checa Evolution API healthcheck)
    # Output: se canal cair, DM Jarbas: "WhatsApp público desconectado".
    #         Em horário comercial e canal saudável, sem mensagem.
    echo "[lia] heartbeat_canal: $(date -Iseconds)"
    echo "[lia] AVISO: job não ativo — exige aprovação Rodrigo"
    exit 1
    # openclaw cron run "${AGENT_ID}:heartbeat-canal"
    ;;

  help|*)
    cat <<EOF
Uso: $0 <job>

Lia é PURAMENTE REATIVA — não tem cron ativo hoje.

Jobs propostos (não ativos, exigem aprovação Rodrigo):
  arquivar_reservas_antigas      1x/mês — manutenção de memory/reservas.md
  heartbeat_canal                1x/hora — checa WhatsApp público vivo

Pra ativar qualquer um:
  1. Rodrigo aprova explicitamente
  2. Descomentar a linha 'openclaw cron run' do job no case
  3. Adicionar entrada no crontab da VPS (UTC, converter dos comentários)
  4. Registrar decisão em memory/decisions.md (a criar quando rolar)

Logs: cada execução escreverá em workspace/agentes/atendimento/activity.jsonl
EOF
    exit 1
    ;;
esac
