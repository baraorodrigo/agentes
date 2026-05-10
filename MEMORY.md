# MEMORY.md — Índice de Memória do Jarbas

> Última atualização: 2026-05-09

## Status

- **Fase:** Fase 3 (Jarbas) em curso + Fase 5 (Duda/Tomás/Gil/Raul) com 4/4 agentes local-prontos. Fase 4 (Lia) também local-pronta. Fase 1 e 2 ✅ concluídas.
- **Beto ⚡:** ✅ ONLINE em produção (VPS auto-gerenciada `nano.elcoyotepub.com`, OpenClaw 2026.5.4, modelo Haiku 4.5, WhatsApp pareado +5548991092404).
- **Jarbas 🐺:** rodando local (dev). Ainda não bind no WhatsApp privado do Rodrigo. Identidade e bootstrap files prontos.
- **Tomás 📊 / Raul 🔍 / Lia 💬 / Duda 🎸 / Gil 🎪 (todos 2026-05-09):** PLAYBOOK + skills + memória estruturada + rotinas (quando aplicável) + cron stub prontos. Falta pra todos: bootstrap files restantes (SOUL/AGENTS/USER/TOOLS/BOOT/HEARTBEAT/MEMORY copiados do Beto), deploy VPS (`/root/.openclaw/workspaces/<id>/`), pareamento de canal e primeiro ciclo real validado. Detalhes por agente em `PLANO-MULTIAGENTES.md` Fase 5.

## Arquivos de Memória

| Arquivo | Conteúdo | Status |
|---------|----------|--------|
| `memory/projects.md` | Projetos ativos | Atualizado 2026-05-08 |
| `memory/decisions.md` | Decisões do Rodrigo | Atualizado 2026-05-08 |
| `memory/lessons.md` | Lições aprendidas | Atualizado 2026-05-07 |
| `memory/people.md` | Promoters e contatos | Vazio (preencher quando rodar entrevistas) |
| `memory/events.md` | Histórico de eventos | Vazio (preencher pós-evento real) |
| `memory/pending.md` | Aguardando input | Atualizado 2026-05-08 |

## Contexto Ativo

- **Infra real:** VPS auto-gerenciada `nano.elcoyotepub.com` (não Hostinger gerenciada) rodando OpenClaw 2026.5.4, gateway loopback :18789. WhatsApp via plugin nativo `@openclaw/whatsapp` (Evolution API foi descartada).
- **Modelos:** default Haiku 4.5 pra agentes operacionais (validado em prod). Sonnet 4.6 fallback. Opus 4.7 banido como default — só via Trilha C (escalation manual pro Claude Code Max).
- **Trilha C de escalation:** ativa em Jarbas e Beto. Quando agente bate tarefa pesada, flagga `[CLAUDE-CODE]` pro Rodrigo, que cola no Claude Code Max (custo zero) e devolve.
- **Saldo Anthropic:** $30 carregado em 2026-05-08 após queima de $50 com defaults Sonnet/Opus.
- **Sistemas do bar:** PNE (pensanoevento.com.br) + Bar Fácil (bar.barfacil.com.br) — skills de extração em `skills/extrair-pne/SKILL.md` e `skills/extrair-barfacil/SKILL.md`.
- **Modelo de comissão atual:** R$80 fixo + R$30/aniversariante (sem gamificação ainda).
- **Bloco A (lapidação Jarbas) ✅ fechado:** A1 (PLANO v2.0), A2 (audit MAPA/MEMORY — sem drift real), A3 (`skills/orquestracao/SKILL.md`), A4 (este MEMORY), A5 (audit estrutura — dívida técnica resolvida 2026-05-08).
- **Skills no padrão canônico ✅** (2026-05-08): convertidas de `skills/<name>.md` flat pra `skills/<name>/SKILL.md` em pasta com YAML frontmatter. Padrão é o validado em prod do Beto (referência: skill `openclaw-agent-builder`).
- **IDENTITY dos 6 agentes lapidada ✅** (2026-05-08): modelo corrigido nos 5 stubs (estavam com Sonnet/Haiku errado) + Beto também (estava marcado Sonnet, mas roda Haiku 4.5 em prod). Estrutura dos stubs alinhada ao padrão Beto. `agentes/README.md` atualizado com status real e regra de modelo.

## Próximos Passos (Fase 3 — fechamento)

Bloco A concluído. Restante pra fechar Fase 3:

1. Bind do WhatsApp privado do Rodrigo no Jarbas
2. Cron de briefing diário 8h (Brasília UTC-3)
3. Resolver dívida técnica de skills (converter `skills/<name>.md` → `skills/<name>/SKILL.md`) antes de subir pra VPS

## Próximas Fases

- **Fase 3 (em curso):** Jarbas lapidado e bind no WhatsApp privado do Rodrigo + cron briefing diário 8h
- **Fase 4:** Lia (atendimento público) — número público pareado, base de conhecimento, escalonamento Lia → Gil/Rodrigo
- **Fase 5:** Duda + Tomás + Gil + Raul (canais + bootstrap + skills específicas)
