# MAPA.md — Índice Geral do El Coyote OS

> Leia este arquivo primeiro. Ele é o mapa de tudo.
> Atualizado: 2026-05-09

---

## O que é isso

Este repositório é o **cérebro operacional do El Coyote Rock N Bar**.
Contém as identidades, regras, skills e memória de todos os agentes de IA que gerenciam o bar.

**Agente principal:** Jarbas 🐺 (Hub/CEO)
**Dono:** Rodrigo Barão
**Bar:** El Coyote Rock N Bar — Imbituba/SC

---

## Status (snapshot)

- **Beto ⚡** ✅ ONLINE em produção (VPS auto-gerenciada `nano.elcoyotepub.com`, Haiku 4.5)
- **Jarbas 🐺** local dev, lapidação Bloco A em curso
- **Tomás 📊** local dev (PLAYBOOK + 3 skills + memória + rotinas prontos) — falta deploy VPS + pareamento DM
- **Raul 🔍** local dev (PLAYBOOK + 3 skills + memória + 1 rotina pronto) — sub-agent do Jarbas, sem canal próprio; falta deploy VPS
- **Lia 💬** local dev (PLAYBOOK + 4 skills + memória pronta) — reativa, sem cron próprio; falta deploy VPS + pareamento WhatsApp público
- **Duda 🎸** local dev (PLAYBOOK + 3 skills + memória + 2 rotinas pronto) — falta deploy VPS + Telegram topic Marketing
- **Gil 🎪** local dev (PLAYBOOK + 4 skills + memória + 3 rotinas pronto) — falta deploy VPS + pareamento DM
- Detalhes vivos: `MEMORY.md` + `memory/projects.md`

---

## Arquivos raiz

| Arquivo | O que é |
|---------|---------|
| `SOUL.md` | Personalidade e valores do Jarbas |
| `USER.md` | Perfil completo do Rodrigo |
| `IDENTITY.md` | Dados concretos do Jarbas (nome, emoji, background) |
| `AGENTS.md` | Regras operacionais, segurança, sistemas, Trilha C de escalation |
| `BOOT.md` | Checklist de inicialização de cada sessão |
| `HEARTBEAT.md` | Sinal de vida (estado mínimo entre sessões) |
| `TOOLS.md` | Lista de tools disponíveis pra esta sessão |
| `MEMORY.md` | Índice da memória (aponta pros arquivos em `memory/`) |
| `PLANO-MULTIAGENTES.md` | Plano vivo das 5 fases do El Coyote OS (v2.0) |

---

## Pastas

| Pasta | Conteúdo |
|-------|---------|
| `agentes/` | Personalidade e instruções de cada agente especializado (Beto/Duda/Lia/Tomás/Gil/Raul) |
| `skills/` | Procedimentos de extração de dados (PNE, Bar Fácil) e operações |
| `rotinas/` | Scripts das tarefas agendadas (crons — briefing, ranking, lembretes) |
| `memory/` | Memória persistente: projetos, decisões, lições, pessoas, eventos, pendências |
| `memoria/` | ⚠️ DEPRECATED — substituída por `memory/`. Stub redirecionando |

---

## Os 7 Agentes

| # | Nome | Papel | Canal | Modelo | Status |
|---|------|-------|-------|--------|--------|
| 1 | Jarbas 🐺 | Hub/CEO | WhatsApp privado Rodrigo | Haiku → Trilha C | Local dev |
| 2 | Beto ⚡ | Promoters | WhatsApp +5548991092404 | Haiku 4.5 | ✅ ONLINE |
| 3 | Duda 🎸 | Marketing | Telegram Topic | Haiku | Local dev |
| 4 | Lia 💬 | Atendimento | WhatsApp Público | Haiku | Local dev |
| 5 | Tomás 📊 | Financeiro | DM Rodrigo | Sonnet 4.6 | Local dev |
| 6 | Gil 🎪 | Eventos | DM Rodrigo | Haiku | Local dev |
| 7 | Raul 🔍 | Intel/Análise | Background (sub-agente Jarbas) | Sonnet 4.6 | Local dev |

---

## Regra de ouro

**Se importa, tá escrito aqui. O que não tá escrito, não existe.**
