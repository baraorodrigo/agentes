# memory/projects.md — Projetos Ativos

> Atualizado: 2026-05-08

---

## Projeto: El Coyote OS — Multi-Agentes

**Status:** Fase 3 — Jarbas em lapidação. Fase 1 (infra) e Fase 2 (Beto) ✅ concluídas.
**Prioridade:** Alta
**Responsável:** Rodrigo Barão

### Resumo
7 agentes de IA especializados rodando no OpenClaw 2026.5.4 sobre VPS auto-gerenciada `nano.elcoyotepub.com`, WhatsApp via plugin nativo `@openclaw/whatsapp` (não Evolution API), modelo default Haiku 4.5 com escalation Trilha C pro Claude Code Max.

### Agentes

| # | Agente | Canal | Modelo | Status |
|---|--------|-------|--------|--------|
| 1 | Jarbas 🐺 (Hub/CEO) | WhatsApp privado Rodrigo | (Haiku → escala via [CLAUDE-CODE]) | Local rodando, lapidação Bloco A em curso |
| 2 | Beto ⚡ (Promoters) | WhatsApp +5548991092404 | Haiku 4.5 | ✅ ONLINE em produção (validado 2026-05-08) |
| 3 | Duda 🎸 (Marketing) | Telegram Topic | Haiku (pendente) | Stub — IDENTITY pronta |
| 4 | Lia 💬 (Atendimento) | WhatsApp Público | Haiku (pendente) | Stub — IDENTITY pronta |
| 5 | Tomás 📊 (Financeiro) | DM Rodrigo | Sonnet 4.6 (analítico) | Stub — IDENTITY pronta |
| 6 | Gil 🎪 (Eventos) | DM Rodrigo | Haiku (pendente) | Stub — IDENTITY pronta |
| 7 | Raul 🔍 (Intel) | Background (sub-agente Jarbas) | Sonnet 4.6 (analítico) | Stub — IDENTITY pronta |

### Capacidades verificadas do Beto (2026-05-07/08)

- Responde reativo no DM e no grupo (com `requireMention`)
- Inicia conversa cold (`tools.alsoAllow: ["message"]`)
- Cross-session visibility (`tools.sessions.visibility: "agent"`) — DM ↔ grupo
- Escalation Trilha C ativa (regra no `AGENTS.md`)
- Skills locais: `awareness-grupo`, `memoria-promoter`, `whatsapp-conduta`

### Stack atual

- **Runtime:** OpenClaw 2026.5.4 (auto-managed, npm `openclaw`)
- **VPS:** `nano.elcoyotepub.com` (auto-gerenciada, ~R$60/mês)
- **WhatsApp:** plugin nativo `@openclaw/whatsapp` (Evolution API descartada)
- **Telegram:** plugin nativo OpenClaw (a configurar pra Duda)
- **Modelos:** Haiku 4.5 (default operacional) + Sonnet 4.6 (fallback/analítico) + Opus 4.7 via Trilha C
- **Skills:** PNE e Bar Fácil prontas
- **API:** Anthropic via api_key, saldo $30 (2026-05-08)

### Próximo passo

Bloco A — lapidação Jarbas: A2 (drift MEMORY/MAPA), A3 (skill orquestração), A5 (audit estrutura). Depois Fase 3 fecha (Jarbas live no WhatsApp privado + cron briefing diário 8h).
