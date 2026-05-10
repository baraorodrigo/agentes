# Data Model — proposta v1 (resolve Task #41)

> Status: rascunho pra Rodrigo aceitar/redirecionar · 2026-05-10
> Não implementa nada — só desenha onde cada coisa vive.

## Princípio

Três mundos, três responsabilidades **não sobrepostas**:

```
WeSales (CRM)        → quem é o cliente, o que ele quer, em que estágio
Notion (knowledge)   → decisões grandes, briefings ricos, contratos
workspace/memory/    → estado do agente (não do cliente)
```

Quem mistura pena. Quem deixa cada coisa no seu lugar escala.

## 1 · Quem é o cliente / Conversas → **WeSales**

Toda informação **sobre uma pessoa específica** ou **sobre um negócio em andamento** vive na WeSales.

| Tipo | Onde | Por quê |
|------|------|---------|
| Contato (nome, telefone, email) | Contact | API nativa, dedup automático |
| Histórico de conversa (DM, WA) | Conversation + Messages | Já tá lá (612 conversas) |
| Tags de origem/interesse | Contact.tags | 17 tags já em uso, convenção `<categoria>_<valor>` |
| Custom fields (último evento, tipo, etc) | Contact.customFields | 5+ já existem |
| Status de venda (briefing → fechado) | Opportunity em Pipeline | **a criar** (Task #42) — pipelines hoje vazias |
| Workflows automáticos (ex: Geladeira 30D) | Workflow | Já tem 5, 1 publicada |
| Templates de resposta | Template | Vazio hoje — popular conforme rotinas |

**Quando o Cockpit lê:** sempre via API (com cache local invalidado por webhook).
**Quando o Cockpit escreve:** lead novo, novo briefing, mover oportunidade, disparar workflow.

## 2 · Decisões grandes / Briefings ricos / Contratos → **Notion**

Coisas que **não cabem** num custom field — texto longo, checklist, anexos, decisões com histórico.

| Tipo | Onde no Notion | Link no WeSales |
|------|---------------|-----------------|
| Briefing detalhado de evento | Database "Briefings de Evento" | URL do Notion no custom field `briefing_url` da Opportunity |
| Contrato assinado / minuta | Database "Contratos" | URL no custom field `contrato_url` |
| Decisões de negócio (ex: política de desconto, mudança de pacote) | Database "Decisões" | — (não amarra a contato) |
| Lições / aprendizados pós-evento | Database "Pós-evento" | URL na Opportunity (estágio "Realizado") |
| Documentação de fornecedores recorrentes (DJ, banda, decoração) | Database "Fornecedores" | — |
| Plano de ações de marketing trimestral | Database "Planning" | — |

**Quando o Cockpit lê:** página individual via Notion API quando o usuário clica num briefing/contrato.
**Quando o Cockpit escreve:** cria página no database certo quando uma Opportunity entra em estágio que requer (ex: "Briefing" → cria página em `Briefings de Evento`).

> ⚠️ **Bloqueador:** Notion ainda não pareado (`cockpit/lib/inbox.ts:42` confirma). Antes de Task #43, parear Notion via OpenClaw plugin ou MCP.

## 3 · Estado do agente / Identidade / Skills → **workspace/memory/** + **workspace/agentes/**

Tudo que **define como o agente se comporta**, não dados de cliente.

| Tipo | Onde | Por quê markdown |
|------|------|------------------|
| Identidade do agente (Beto, Lia, Duda, etc) | `agentes/<role>/IDENTITY.md` | Versionável no git, prompts caráter |
| Skills do agente (procedimentos) | `agentes/<role>/skills/<nome>/SKILL.md` | Editar com diff, review humano |
| Memória do projeto (decisões, lições, pessoas internas) | `memory/<topico>.md` | Frontmatter YAML + corpo MD, fácil ler/editar |
| Inbox interno do Cockpit (alertas pendentes) | `memory/inbox.fixture.json` (hoje fixture) | **transitar** pra Notion quando Notion pareado, OU pra database WeSales (?) |
| Activity log dos agentes | `agentes/<role>/activity.jsonl` | Hook do runtime escreve |
| Estado de cron jobs / heartbeat | `HEARTBEAT.md` | Texto simples |

**Quando o Cockpit lê:** local fs via Next.js server components (sem rede, rápido).
**Quando o Cockpit escreve:** raramente — fluxo correto é agente do OpenClaw escrever direto, Cockpit só visualiza.

## 4 · Decisão da inbox

A inbox do Cockpit hoje é fixture local. **Pra onde migrar quando Notion entrar?**

| Opção | Prós | Contras | Veredito |
|-------|------|---------|----------|
| Manter em `memory/inbox.json` | Rápido, sem dep externa | Não compartilha com agentes em outras VPS, não pesquisável | ❌ |
| **Mover pra Notion (database "Inbox")** | Editável de qualquer device, search nativo, history | Latência da API, dependência de pareamento | ✅ recomendado |
| Mover pra WeSales (custom object) | Já tá pareado, só uma fonte | Inbox não é de cliente — polui CRM | ❌ |

## 5 · Quem aprova mudança nesse modelo

| Mudança | Aprovador |
|---------|-----------|
| Criar/renomear Pipeline em WeSales | Rodrigo + Rafaela (admin) |
| Criar/renomear Database em Notion | Rodrigo |
| Criar/renomear arquivo em `memory/` ou `agentes/` | Jarbas (com nota no commit), reverte se Rodrigo discordar |
| Adicionar custom field em Contact | Rodrigo (custo de migrar 7.868 contatos) |
| Adicionar tag nova em WeSales | Jarbas (segue convenção `<categoria>_<valor>`) |

## 6 · Resumo em uma frase

> **Pessoa e negócio vão pra WeSales. Texto longo e decisão vão pro Notion. Comportamento de agente vai pro markdown.**

## 7 · O que falta pra Task #41 fechar

- [ ] Rodrigo aceita ou redireciona este modelo
- [ ] Decidir se inbox vai pra Notion (recomendado) ou continua local
- [ ] Notion pareado (pré-requisito pra qualquer coisa em §2)

Após o sim → destrava Task #42 (provisionar pipelines + fields) e Task #43 (bridge).
