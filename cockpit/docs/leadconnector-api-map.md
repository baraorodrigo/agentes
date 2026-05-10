# LeadConnector API → Cockpit · mapa de uso

> Status: rascunho v1 — 2026-05-10 · resolve Task #40
> Fonte: `workspace/brand/BRIEFING.md` (seção WeSales) + checklist Tasks #41-43

## 1 · IDs canônicos (já confirmados)

```yaml
locationId:  QQujnkMxKvJJWSahf5b0
brandId:     9873Q9xL2LeJLJEXL2JY
companyId:   V9n74ao2srzj0EnvdoDd
```

Token PIT: validado em Task #39 — escopos suficientes pra contacts, conversations, customFields, tags, pipelines, workflows, locations.

## 2 · Estado atual da conta (snapshot pré-bridge)

| Recurso | Quantidade | Observação |
|--------|-----------:|------------|
| Contatos | 7.868 | volume relevante — paginar sempre |
| Conversas | 612 | já tem histórico de DM/WA |
| Tags | 17 | convenção `<categoria>_<valor>` (ex: `interesse_casamento`) |
| Custom fields | 5+ | `Último Evento`, `Primeiro Evento`, `Tipo do Evento` (RADIO), `conversionSource`, `Tempo de Montagem` |
| Workflows | 5 | 4 em rascunho, 1 publicado: "Geladeira 30D, 60D, 90D" |
| Forms | 1 | "Formulario Eventos" |
| **Pipelines** | **0** | **vazio — Task #42 vai criar** |
| Templates | 0 | preencher quando definir comunicação outbound |
| Users | 2 | Rafaela Santos (admin) + Rodrigo Silva Santos |

## 3 · Endpoints relevantes pro Cockpit

Base: `https://services.leadconnectorhq.com` · header `Version: 2021-07-28` · `Authorization: Bearer <PIT>`

### 3.1 — Leitura (Cockpit consome)

| Recurso | Endpoint | Para que serve no Cockpit |
|--------|---------|---------------------------|
| Listar contatos | `GET /contacts/?locationId={id}&limit=100&query=...` | Buscar contato no header do Cockpit · `lib/contacts.ts` (a criar) |
| Detalhar contato | `GET /contacts/{contactId}` | Modal de contexto do contato |
| Listar conversas | `GET /conversations/search?locationId={id}&contactId=...` | Inbox do Cockpit puxar threads |
| Mensagens da conversa | `GET /conversations/{conversationId}/messages` | Render thread |
| Pipelines | `GET /opportunities/pipelines?locationId={id}` | Header de cada coluna (kanban) |
| Oportunidades | `GET /opportunities/search?location_id={id}&pipeline_id=...` | Cards do kanban |
| Custom fields | `GET /locations/{id}/customFields` | Form de criação de oportunidade · validar enums |
| Tags | `GET /locations/{id}/tags` | Sugestão de tags ao salvar contato |
| Calendars | `GET /calendars/?locationId={id}` | Sincronizar agenda de eventos com Cockpit |
| Workflows | `GET /workflows/?locationId={id}` | Listar pra dispará-los do Cockpit |

### 3.2 — Escrita (Cockpit produz)

| Ação | Endpoint | Quando o Cockpit chama |
|------|---------|------------------------|
| Criar contato | `POST /contacts/` | Lead novo manual no Cockpit |
| Atualizar contato | `PUT /contacts/{id}` | Salvar custom field, tag, NAP |
| Criar oportunidade | `POST /opportunities/` | Mover briefing pra pipeline (Lia → Beto/Gil) |
| Mover oportunidade | `PUT /opportunities/{id}` | Drag & drop no kanban |
| Enviar mensagem | `POST /conversations/messages` | Reply do Cockpit (com aprovação Rodrigo) |
| Adicionar tag | `POST /contacts/{id}/tags` | Auto-tagear por origem |
| Disparar workflow | `POST /workflows/{id}/contact/{contactId}` | "Mandar pro Geladeira 30D" |
| Webhook inbound | (configurar no painel) | Cockpit recebe nova conversa em tempo real |

### 3.3 — Webhooks que o Cockpit precisa receber

Configurar em LeadConnector Settings → Webhooks → endpoint `https://nano.elcoyotepub.com/api/leadconnector/webhook`:

- `ContactCreate` / `ContactUpdate` — sincroniza local cache
- `ConversationUnread` / `InboundMessage` — popula Inbox do Cockpit
- `OpportunityCreate` / `OpportunityStageUpdate` / `OpportunityStatusUpdate` — kanban realtime
- `OutboundMessage` — confirma que reply saiu

## 4 · Custom fields atuais → modelo Cockpit

Mapeamento dos campos que **já existem** na conta Rafaela pra os tipos do Cockpit:

| Field WeSales | Tipo WS | Modelo Cockpit | Notas |
|---------------|---------|----------------|-------|
| `Último Evento` | TEXT | `last_event: string` | nome livre, não enum |
| `Primeiro Evento` | TEXT | `first_event: string` | mesmo |
| `Tipo do Evento` | RADIO | `event_type: 'casamento_aniversario' \| 'corporativo_confraternizacao' \| 'formatura' \| 'comercial_ingressos'` | enum forte — validar no Cockpit |
| `conversionSource` | TEXT | `conversion_source: string` | normalizar pra `origem_*` tags |
| `Tempo de Montagem da decoração` | TEXT/NUM | `decor_setup_hours?: number` | parsear "3h", "meio-dia" |

**Faltando (Task #42 cria):**
- `evento_data` (DATE) — quando vai rolar
- `evento_status` (RADIO: briefing / proposta / sinal_pago / confirmado / realizado / perdido)
- `valor_proposto` (CURRENCY)
- `valor_fechado` (CURRENCY)
- `pacote` (RADIO: ter-qui / sex-sab / dom — ver `project_pricing.md`)
- `desconto_aplicado` (NUMBER %) — pra rastrear filosofia de negociação atual

## 5 · Tags atuais → eixos do Cockpit

Convenção `<categoria>_<valor>` que já existe:

- **interesse_*** — `interesse_casamento`, `interesse_corporativo`, `interesse_aniversario_pub`, `interesse_show`, `interesse_gastronomia`
- **origem_*** — `origem_instagram`, `origem_whatsapp`, `origem_indicacao`, `origem_site`, `origem_importado`
- **status** — `cliente`, `cliente el coyote`, `pub`, `fa`, `perdido`
- **operacional** — `campanha de whatsapp`, `eventos`

**Padrão a manter no Cockpit:** ao criar contato/lead, sempre setar uma tag de `origem_*` e uma de `interesse_*`.

## 6 · Pipelines a criar (Task #42)

Dois pipelines distintos — não misturar B2B com B2C:

### Pipeline A — Eventos Privados (B2B/B2C alto valor)
```
[Briefing] → [Proposta] → [Sinal pago] → [Confirmado] → [Realizado]
                                                        ↓
                                                    [Perdido]
```
Custom fields obrigatórios na entrada: `event_type`, `evento_data`, `valor_proposto`.

### Pipeline B — Pub Regular (alto volume, low-touch)
```
[Lead novo] → [Conversa ativa] → [Compareceu] → [Recorrente]
                                ↓
                            [Esfriou — workflow Geladeira 30/60/90]
```
Faz sentido o workflow "Geladeira 30D, 60D, 90D" que já existe rodar dentro deste.

## 7 · Decisões pendentes (bloqueiam Task #41)

- **O que vive no WeSales** vs **Notion** vs **`.md` em `workspace/memory`**?
  - Sugestão: WeSales = pessoas + conversas + pipelines (CRM). Notion = decisões grandes + briefings de evento (knowledge). `memory/` = estado do agente (não cliente).
- **Notion ainda não pareado** (`lib/inbox.ts:42` confirma) — primeiro pareia, depois define data model.
- **Cockpit é proxy ou cache?** — cada GET vai a LeadConnector, ou Cockpit mantém sync local em SQLite? Para 7.868 contatos + 612 conversas, recomendo **cache + webhook invalidation** (não proxy direto).

## 8 · Próximos passos (encadeamento)

```
[#40 (este doc)] → [#41 data model decision] → [#42 pipelines + fields] → [#43 bridge implementation]
```

Antes de Task #43:
- [ ] Confirmar que `Authorization: Bearer <PIT>` funciona contra os endpoints listados (smoke test)
- [ ] Decidir cache layer: SQLite local? Postgres no nano.elcoyotepub.com?
- [ ] Definir webhook receiver no Cockpit (Next.js API route `app/api/leadconnector/webhook/route.ts`)
- [ ] Rate limit awareness: 100 req/10s por location na API LeadConnector
