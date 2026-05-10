# 🐺 El Coyote OS — Plano de Multi-Agentes

> Versão: 2.3 | Atualizado: 2026-05-09 | Autor: Jarbas

---

## Visão Geral

O El Coyote vai rodar **7 agentes de IA especializados** operando no WhatsApp e Telegram, conectados ao PNE e ao Bar Fácil, formando um sistema operacional completo do bar. Sem apps extras, sem planilhas manuais — tudo automatizado.

A base técnica é o **OpenClaw** (runtime multi-agente), rodando na **VPS auto-gerenciada `nano.elcoyotepub.com`**, com adapter WhatsApp nativo do OpenClaw (`@openclaw/whatsapp` plugin) — sem Evolution API, sem Hostinger gerenciado.

---

## Os 7 Agentes

| # | Nome | Papel | Canal | Status |
|---|------|-------|-------|--------|
| 1 | **Jarbas 🐺** | Hub/CEO — braço direito do Rodrigo | WhatsApp privado Rodrigo | local rodando, falta lapidação + canal vivo |
| 2 | **Beto ⚡** | Promoters — ranking, cobrança, motivação | WhatsApp grupo promoters + DM individuais | ✅ deployed VPS 2026-05-07 |
| 3 | **Duda 🎸** | Marketing — calendário, copy, posts | Telegram (topic dedicado) | local rodando — falta deploy VPS + Telegram topic |
| 4 | **Lia 💬** | Atendimento público — clientes, reservas | WhatsApp público do bar | local rodando — falta deploy VPS + WhatsApp público |
| 5 | **Tomás 📊** | Financeiro — comissões, fluxo, alertas | DM Rodrigo | local rodando — falta deploy VPS + pareamento DM |
| 6 | **Gil 🎪** | Eventos — produção, fornecedores, briefings | DM Rodrigo | local rodando — falta deploy VPS + pareamento DM |
| 7 | **Raul 🔍** | Intel/Análise — pesquisa, dados, relatórios | Background sub-agent | local rodando — falta deploy VPS |

---

### 🐺 Jarbas — Hub/CEO

**Papel:** maestro do sistema, único agente que fala diretamente com o Rodrigo no WhatsApp privado.

**O que faz:**
- Briefing diário (agenda + pendências + eventos próximos)
- "Como foi ontem?" → puxa PNE + Bar Fácil e devolve relatório
- Delegação pros outros 6 agentes via `sessions_send` / `sessions_spawn`
- Aprovação/desaprovação de qualquer ação externa proposta por sub-agente
- Memória central do estado do bar (decisões, pessoas, eventos)

---

### ⚡ Beto — Promoters

**Canal:** grupo de promoters + DMs individuais (Natan, Rafaela, etc).
**Papel:** gestor de equipe. Motivador. Cobrador. Ranking-keeper.

**Capacidades verificadas (2026-05-07):**
- Responde reativo no DM e no grupo (com `requireMention` configurado)
- **Inicia conversa cold** (DM novo) — habilitado via `tools.alsoAllow: ["message"]`
- Cross-session visibility (`tools.sessions.visibility: "agent"`) — vê DM e grupo do mesmo agente
- Skills próprias: `awareness-grupo`, `memoria-promoter`, `whatsapp-conduta`

**Crons (planejados):**
| Quando | O que acontece |
|--------|---------------|
| Segunda 9h | Aniversariantes da semana → mensagem personalizada |
| 3 dias antes do evento | Lembrete + link de divulgação PNE |
| 18h dia do evento | Briefing final: nomes na lista, meta |
| D+1, 11h | Ranking pós-evento + parabéns top 3 |
| Domingo | Ranking semanal acumulado |

> ✅ PNE já trackeia automático "Inserido por [Promoter]". Beto só lê e organiza.

---

### 🎸 Duda — Marketing

**Canal:** Telegram (topic dedicado, separa de outras conversas).
**Papel:** assistente de marketing — propõe, Rodrigo aprova.

**O que vai fazer:**
- Calendário editorial da semana (toda segunda)
- Copy baseado em dados reais ("Lotamos com 312 pessoas sexta!")
- Sugestão de legenda + hashtags + horário de post
- Lembrete de stories antes do evento
- Toda postagem → confirma com Rodrigo antes

---

### 💬 Lia — Atendimento

**Canal:** número público do bar.
**Papel:** recepcionista digital 24/7.

**O que vai fazer:**
- "Quando é o próximo evento?" → resposta com dados reais do PNE
- Link de lista/ingresso
- Aniversário no bar (benefícios, processo)
- Reserva de mesa (coleta nome/data/qtd → notifica Rodrigo)
- Horário, endereço, contato
- Eventos privados → coleta briefing → escalonamento pra Gil

**O que NÃO faz:** revelar dados internos, prometer desconto, fechar contrato sozinha.

---

### 📊 Tomás — Financeiro

**Canal:** DM Rodrigo (chat separado do Jarbas).
**Papel:** comissões, fluxo, alertas financeiros.

**O que vai fazer:**
- Calcula comissão de promoter por evento (PNE × tabela do bar)
- Fluxo de caixa via Bar Fácil
- Alerta de pagamento pendente (fornecedor, promoter)
- Relatório mensal de margem

**Privacidade dura:** R$ não sai dele pra ninguém que não seja Rodrigo.

---

### 🎪 Gil — Eventos

**Canal:** DM Rodrigo.
**Papel:** produção e logística de eventos.

**O que vai fazer:**
- Brief pré-evento (data, atração, contrato, custo)
- Checklist operacional (som, bar, segurança, lista)
- Pós-evento: lições + ajustes pro próximo
- Eventos privados (encaminhados pela Lia) → orçamento + briefing

---

### 🔍 Raul — Intel

**Canal:** background, sub-agente do Jarbas.
**Papel:** pesquisa e análise pesada.

**O que vai fazer:**
- Análise de concorrência (outras casas em Imbituba/SC)
- Pesquisa de tendência (música, formato de evento)
- Cruzamento de dados PNE × Bar Fácil (qual perfil de promoter converte mais)
- Não fala direto — entrega relatório pro Jarbas que filtra pro Rodrigo.

---

## Arquitetura Técnica

```
┌─────────────────────────────────────────────────────────┐
│           VPS auto-gerenciada (nano.elcoyotepub.com)    │
│           Versão runtime: 2026.5.4                       │
│                                                          │
│  ┌────────────────────────────────────────────────────┐ │
│  │              OpenClaw Gateway                       │ │
│  │              :18789 (loopback)                      │ │
│  │                                                      │ │
│  │  Agentes: Jarbas / Beto / Duda / Lia /              │ │
│  │           Tomás / Gil / Raul                        │ │
│  │                                                      │ │
│  │  Bindings → channels → JIDs                         │ │
│  └────────────┬────────────────────────────────────────┘ │
│               │                                           │
│  ┌────────────▼─────────────┐  ┌──────────────────────┐ │
│  │  @openclaw/whatsapp       │  │  Plugin Telegram     │ │
│  │  (plugin nativo)          │  │  (a configurar)      │ │
│  │  → WhatsApp pessoal       │  │                      │ │
│  │    +5548991092404 (Beto)  │  │                      │ │
│  └───────────────────────────┘  └──────────────────────┘ │
│                                                          │
│  ┌────────────────────────────────────────────────────┐ │
│  │              Skills / Integrações                   │ │
│  │                                                      │ │
│  │  🔵 Pensa no Evento (PNE)                           │ │
│  │     → Listas, aniversariantes, conversões           │ │
│  │     → Links de evento por promoter                  │ │
│  │                                                      │ │
│  │  🟠 Bar Fácil                                       │ │
│  │     → Faturamento, ticket médio, vendas             │ │
│  └────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

---

## Stack Técnica

| Componente | Ferramenta | Custo |
|-----------|-----------|-------|
| Runtime | OpenClaw 2026.5.4 (auto-managed) | — |
| WhatsApp adapter | `@openclaw/whatsapp` (nativo) | — |
| Telegram adapter | OpenClaw nativo | — |
| Servidor | VPS auto-gerenciada Hostinger | ~R$60/mês |
| Modelos | Sonnet 4.6 (operacional) + Opus 4.7 (Jarbas) + Haiku (cron) | $5–25/mês uso real |
| PNE | Já assinado | — |
| Bar Fácil | Já assinado | — |

---

## Roadmap (5 fases)

### Fase 1 — Infra ✅
- [x] VPS provisionada (nano.elcoyotepub.com)
- [x] OpenClaw 2026.5.4 instalado
- [x] WhatsApp plugin pareado (Beto: +5548991092404)
- [x] `openclaw.json` canônico configurado
- [x] Auth profiles + `tools.profile=coding` + `alsoAllow=[message]` + `sessions.visibility=agent`

### Fase 2 — Beto online ✅ (concluído 2026-05-07)
- [x] Bootstrap files (IDENTITY/SOUL/AGENTS/USER/TOOLS/BOOT/HEARTBEAT/MEMORY) em PT-BR
- [x] Skills locais (`awareness-grupo`, `memoria-promoter`, `whatsapp-conduta`)
- [x] Memória estruturada (`memory/groups/`, `memory/promoters/`)
- [x] Cross-session visibility (DM ↔ grupo)
- [x] Cold outbound habilitado
- [ ] Cron jobs ativos (briefing/ranking/aniversários)
- [ ] Push pro GitHub (config + workspace versionado)

### Fase 3 — Jarbas online (em curso)
- [ ] Bindings WhatsApp privado Rodrigo → Jarbas
- [ ] Lapidação dos bootstrap files (já existem, falta polir)
- [ ] Skill de orquestração (delegação pros outros 6)
- [ ] Memória do estado real (não mais "Phase 0")
- [ ] Cron de briefing diário 8h

### Fase 3.5 — Cockpit (operator UX) — adicionada 2026-05-08

Painel web local em `127.0.0.1:3030` pra Rodrigo operar o sistema sem depender só de WhatsApp/Telegram. Spec completo em `workspace/COCKPIT.md`. **Por que entra agora:** sem operator UX, escalar pra Fase 4/5 fica caótico — ver feedback memory `feedback_operator_ux`.

Slices em ordem (cada slice é entregável e testável sozinho):

- [ ] **Slice 1 — Tela Estrutura** (organograma + ficha 6 campos editável inline). Base de tudo: cockpit lê/escreve nos `.md` dos agentes.
- [ ] **Slice 2 — Tela Hoje** (4 stat cards + Inbox de decisão via Notion + Acontecendo agora via `activity.jsonl`). A tela que abre 20× por dia.
- [ ] **Slice 3 — Tela Cabine** (chat interno via Anthropic API direta + disparo manual + edição de cron via `.md`).
- [ ] **Slice 4 — Tela Semana** (calendário 7×horas com filtros persistentes).
- [ ] **Slice 5 — Tela Pipeline** (3 kanbans empilhados: Eventos / Propostas / Saúde financeira).
- [ ] **Slice 6 — Tela Logs** (perguntas pré-formuladas sobre `activity.jsonl` agregado).

**Pré-requisitos da Fase 3.5:**
- [ ] Skill `inbox` em `workspace/skills/inbox/SKILL.md` (cria item no Notion via API)
- [ ] Hook interno `activity-log` (escreve `workspace/agentes/<role>/activity.jsonl` em todo evento cross-fronteira)
- [ ] Frontmatter `cockpit:` + `health:` adicionado nos 7 IDENTITY + USER.md

### Fase 4 — Lia (atendimento público)
- [ ] Número público pareado
- [ ] Bootstrap files com tom acolhedor + privacidade dura
- [ ] Base de conhecimento (eventos, endereço, aniversário)
- [ ] Fluxo de escalonamento Lia → Gil (eventos privados) / Lia → Rodrigo

### Fase 5 — Duda + Tomás + Gil + Raul

**Tomás 📊 — local pronto (2026-05-09):**
- [x] IDENTITY.md (Sonnet 4.6, tom técnico, regra de ouro)
- [x] PLAYBOOK.md (3 modos: push/pull/alerta + rotina diária + tabela comissões + FAQ silencioso)
- [x] Skills: `fechamento-diario`, `comissao-evento`, `alerta-variacao`
- [x] Memória estruturada (`comissoes.md`, `events.md`, `decisions.md`, `pendencias.md`)
- [x] Rotinas: `fechamento-diario.md` (cron 04h+09h), `comissao-pos-evento.md` (cron 11h), `alerta-variacao.md` (auxiliar)
- [ ] Bootstrap files restantes (SOUL/AGENTS/USER/TOOLS/BOOT/HEARTBEAT/MEMORY) — copiar do Beto e adaptar
- [ ] Confirmar tabela de comissão com Rodrigo (R$ 80 base + R$ 30/aniversariante)
- [ ] Deploy VPS (sync `agentes/financeiro/` → `/root/.openclaw/workspaces/tomas/`)
- [ ] Pareamento DM Rodrigo (segundo canal, separado do Jarbas)
- [ ] Cron jobs ativos na VPS (`cron/tomas-jobs.sh`)
- [ ] Primeiro fechamento real validado

**Raul 🔍 — local pronto (2026-05-09):**
- [x] IDENTITY.md (Sonnet 4.6, sub-agent do Jarbas, sem canal próprio)
- [x] PLAYBOOK.md (3 modos: cron semanal / handoff sob demanda / pull via Jarbas + métricas-base + FAQ silencioso)
- [x] Skills: `relatorio-semanal-intel`, `analise-pos-evento`, `perfil-promoter`
- [x] Memória própria (`padroes.md`, `relatorios.md`)
- [x] Rotina: `relatorio-semanal-intel.md` (cron seg 09h)
- [ ] Bootstrap files restantes (SOUL/AGENTS/USER/TOOLS/BOOT/HEARTBEAT/MEMORY) — copiar do Beto e adaptar
- [ ] Deploy VPS (sync `agentes/intel/` → `/root/.openclaw/workspaces/raul/`)
- [ ] Configurar como sub-agent do Jarbas (sem canal próprio — convocação via `sessions_spawn`)
- [ ] Cron seg 09h ativo na VPS (`cron/raul-jobs.sh`)
- [ ] Primeiro relatório semanal real validado (depende de 14 dias mínimos de série)

**Lia 💬 — local pronto (2026-05-09):**
- [x] IDENTITY.md (Haiku, tom acolhedor, privacidade dura, frontmatter cockpit)
- [x] PLAYBOOK.md (modos reativo: pull cliente / handoff Gil em privado / escalation Rodrigo)
- [x] Skills: `atendimento-cliente`, `reserva-mesa`, `info-evento-publico`, `evento-privado-coleta`
- [x] Memória estruturada (`respostas-prontas.md` com aprovação Rodrigo pendente, `reservas.md`, `topicos-permitidos.md`)
- [x] Cron stub `cron/lia-jobs.sh` (sem job ativo — Lia é reativa; 2 jobs propostos comentados)
- [ ] Bootstrap files restantes (SOUL/AGENTS/USER/TOOLS/BOOT/HEARTBEAT/MEMORY) — copiar do Beto e adaptar
- [ ] Aprovar conteúdo de `respostas-prontas.md` (endereço, horário, idade, dress code, couvert, wifi, estacionamento, handle Insta)
- [ ] Validar `topicos-permitidos.md` (cada item de "Pode dizer" vira política pública)
- [ ] Confirmar cutoff de 25 pessoas pra escalação `evento-privado-coleta` → Gil
- [ ] Deploy VPS (sync `agentes/atendimento/` → `/root/.openclaw/workspaces/lia/`)
- [ ] Pareamento WhatsApp público do bar (canal terceiro, separado de Beto e Jarbas)
- [ ] Primeiro atendimento real validado

**Duda 🎸 — local pronto (2026-05-09):**
- [x] IDENTITY.md (Haiku, tom criativo+pop, frontmatter cockpit)
- [x] PLAYBOOK.md (modos: cron seg 10h calendário / cron diário 18h lembrete stories / pull copy on-demand)
- [x] Skills: `calendario-editorial-semanal`, `gerar-copy-evento`, `lembrete-stories`
- [x] Memória estruturada (`templates-copy.md`, `posts-aprovados.md`, `preferencias-tom.md`)
- [x] Rotinas: `calendario-editorial-semanal.md` (cron seg 10h), `lembrete-stories-pre-evento.md` (cron diário 18h)
- [x] Cron stub `cron/duda-jobs.sh`
- [ ] Bootstrap files restantes (SOUL/AGENTS/USER/TOOLS/BOOT/HEARTBEAT/MEMORY) — copiar do Beto e adaptar
- [ ] Confirmar semana operacional qua-dom + tamanhos máximos de copy (80/200/100 chars)
- [ ] Adicionar coluna `tag` em `workspace/memory/events.md` pra cross-reference de evento similar funcionar
- [ ] Deploy VPS (sync `agentes/marketing/` → `/root/.openclaw/workspaces/duda/`)
- [ ] Configurar Telegram topic Marketing (Evolution API/Telegram Bot)
- [ ] Cron jobs ativos na VPS (`cron/duda-jobs.sh`)
- [ ] Primeiro calendário real validado

**Gil 🎪 — local pronto (2026-05-09):**
- [x] IDENTITY.md (Haiku, tom pragmático, frontmatter cockpit com 4 rotinas)
- [x] PLAYBOOK.md (4 modos: briefing pré / checklist dia / pós-evento / orçamento privado)
- [x] Skills: `briefing-pre-evento`, `checklist-operacional-dia`, `evento-privado-orcamento`, `pos-evento-licoes`
- [x] Memória estruturada (`fornecedores.md` com gradação automática, `templates-evento.md` com 5 tipos, `eventos-privados.md` com pipeline 5 estados)
- [x] Rotinas: `briefing-pre-evento.md` (cron 10h), `checklist-dia-evento.md` (cron 14h), `pos-evento-licoes.md` (cron D+2 14h)
- [x] Cron stub `cron/gil-jobs.sh` (3 jobs)
- [ ] Bootstrap files restantes (SOUL/AGENTS/USER/TOOLS/BOOT/HEARTBEAT/MEMORY) — copiar do Beto e adaptar
- [ ] Cadastrar primeiro fornecedor real em `fornecedores.md`
- [ ] Validar defaults conservadores nos 5 templates (público estimado, equipe extra, cachê estimado)
- [ ] Deploy VPS (sync `agentes/eventos/` → `/root/.openclaw/workspaces/gil/`)
- [ ] Pareamento DM Rodrigo (quarto canal, separado de Jarbas/Tomás)
- [ ] Cron jobs ativos na VPS (`cron/gil-jobs.sh`)
- [ ] Primeiro briefing pré-evento real validado

---

## Regras de Ouro

1. **Nenhum agente posta/envia mensagem externa sem aprovação do Rodrigo** (cron jobs autorizados são exceção — a entrada do job é o consentimento)
2. **Dados financeiros circulam só entre Tomás/Jarbas e Rodrigo** — nunca pros promoters/clientes
3. **Promoter vê só os próprios dados** — nunca dados de outro promoter
4. **Se o dado não veio do PNE ou Bar Fácil, o agente não inventa**
5. **Pagamento ou compromisso financeiro = aprovação explícita obrigatória**
6. **Nada de chute em campo de config** — validar em source (`/usr/lib/node_modules/openclaw/dist/plugin-sdk/src/config/types.*.d.ts`) antes de aplicar

---

## Próximo Passo Imediato

→ **Bloco A: lapidar Jarbas** (resolver drift MEMORY/MAPA, criar skill de orquestração, atualizar memória real, auditar estrutura). Em curso 2026-05-07.

---

*El Coyote OS — construído pra rodar no automático. 🐺🔥*
