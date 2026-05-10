# memory/pending.md — Pendências

> Atualizado: 2026-05-08

---

## Aguardando Rodrigo

- [ ] Colar token real do Notion em `openclaw.json` (campo `skills.entries.notion.apiKey`) — se ainda fizer sentido
- [ ] Deletar 4 páginas antigas do Notion marcadas com "❌ [DELETAR]"
- [ ] Rodar `git push origin main` no workspace (commit Beto v2 pendente)
- [ ] Testar Beto enviando mensagens reais no grupo de promoters (cron jobs pendentes)

## Bloco A — Lapidação Jarbas (em curso)

- [x] A1 — Atualizar PLANO-MULTIAGENTES.md (v2.0 ✅)
- [x] A2 — Resolver drift MEMORY.md vs MAPA.md (auditado, MAPA estava só desatualizado, sem drift real) ✅
- [x] A3 — Criar skill de orquestração Jarbas (skills/orquestracao/SKILL.md criado com matriz dos 6 sub-agentes) ✅
- [x] A4 — Atualizar MEMORY do Jarbas com realidade atual ✅
- [x] A5 — Auditar estrutura local vs padrão validado do Beto ✅ (divergência identificada, virou dívida — ver abaixo)

## Dívida técnica identificada (A5) — ✅ RESOLVIDA 2026-05-08

- [x] **Converter skills do Jarbas pro padrão Beto** ✅ — todas as 4 skills migradas pra `skills/<name>/SKILL.md` em pasta. `montar-ranking` e `orquestracao` ganharam frontmatter (não tinham). Cross-refs atualizadas em README, AGENTS, MEMORY, agentes/promoters/IDENTITY e 5 rotinas.
- [x] **IDENTITY dos 6 agentes lapidada** ✅ (2026-05-08) — modelo corrigido (Haiku 4.5 pra operacional, Sonnet 4.6 pra analítico, Beto inclusive). Estrutura dos 5 stubs alinhada ao padrão Beto: Missão / Regra de ouro / Nunca faço / Sempre faço / Ferramentas/Funções placeholder / Onde detalhar. `agentes/README.md` reescrito.

## Pendente pra Fases 4 e 5 (PLAYBOOKs e operacional dos 5 sub-agentes)

Cada sub-agente tem IDENTITY, mas ainda falta:

- [ ] **Lia (Fase 4):** PLAYBOOK + base de FAQ (endereço, horário, line-up, regra de mesa) + fluxo de escalonamento concreto + número público pareado
- [ ] **Duda (Fase 5):** PLAYBOOK + calendário editorial + gabaritos visuais + Telegram Topic configurado
- [ ] **Tomás (Fase 5):** PLAYBOOK + formato de fechamento diário + tabela de comissões evolutiva + DM Rodrigo (chat separado) configurado
- [ ] **Gil (Fase 5):** PLAYBOOK + templates de checklist (pré/dia/pós) + base de fornecedores e riders + DM Rodrigo configurado
- [ ] **Raul (Fase 5):** PLAYBOOK + métricas-base + cadência de relatório + integração como sub-agente do Jarbas (não tem canal próprio)

## Crons pendentes (Beto)

- [ ] Segunda 9h — Aniversariantes da semana → mensagem personalizada
- [ ] 3 dias antes do evento — Lembrete + link de divulgação PNE
- [ ] 18h dia do evento — Briefing final (nomes na lista, meta)
- [ ] D+1 11h — Ranking pós-evento + parabéns top 3
- [ ] Domingo — Ranking semanal acumulado

## Fase 3 (em curso) — Jarbas online

- [ ] Bind WhatsApp privado Rodrigo → Jarbas
- [ ] Skill de orquestração (item A3 do Bloco A)
- [ ] Cron de briefing diário 8h Brasília

## Fase 4 — Lia (atendimento público)

- [ ] Pareamento de número público de WhatsApp
- [ ] Bootstrap files com tom acolhedor + privacidade dura
- [ ] Base de conhecimento (eventos, endereço, aniversário)
- [ ] Fluxo de escalonamento Lia → Gil (eventos privados) / Lia → Rodrigo

## Fase 5 — Duda + Tomás + Gil + Raul

- [ ] Pareamento dos canais (Telegram pra Duda, DM Rodrigo pros financeiro/eventos)
- [ ] Bootstrap files
- [ ] Skills específicas (calendário editorial, calculadora de comissão, briefing de evento)
- [ ] Raul como sub-agent do Jarbas (sem canal próprio)
