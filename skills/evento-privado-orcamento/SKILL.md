---
name: evento-privado-orcamento
description: |
  Orçamento de evento privado pelo Gil. Use SEMPRE que Lia fizer handoff via Jarbas com
  demanda de cliente ("cliente quer fechar privado pra [data]"), ou quando Rodrigo
  perguntar "tem privado em proposta?", "como tá o privado do [cliente]?". Coleta
  requisitos do cliente (via Lia), monta briefing operacional, faz handoff pro Tomás
  precificar, consolida proposta final, DM Rodrigo pra aprovar. Só após aprovação,
  Gil devolve pro Jarbas que entrega pra Lia comunicar com cliente. Gil NUNCA fala
  direto com cliente. Gil NUNCA define preço (Tomás). Gil NUNCA aprova proposta (Rodrigo).
---

# Orçamento de Evento Privado — Gil

Agente responsável: **Gil 🎪**. Disparo: handoff Lia → Jarbas → Gil. Sob demanda — sem cron próprio.

## Quando disparo

- **Handoff Lia** via Jarbas: "Cliente X quer fechar privado em data Y" (com pacote de coleta inicial)
- **Pull Rodrigo** — "como tá o privado do [cliente]?", "tem orçamento em aberto?"
- **Pull Lia via Jarbas** — "cliente do privado mandou contraproposta" (volta pra Fase 3 do fluxo)

## Pré-requisitos

- Lia já fez coleta inicial e empacotou os 5 campos mínimos (ver Fase 1)
- `agentes/eventos/memory/templates-evento.md` populado com template do tipo de evento (aniversário, corporativo, despedida, etc.)
- `agentes/eventos/memory/fornecedores.md` populado com fornecedores ativos
- Tomás disponível pra handoff de precificação

## Procedimento

### Fase 1 — Receber pacote da Lia

Lia entrega via Jarbas com 5 campos mínimos:

```yaml
cliente_nome: "..."
cliente_contato: "..."             # WhatsApp ou e-mail
data_pretendida: YYYY-MM-DD
publico_estimado: N
ocasiao: "aniversário | empresa | despedida | outro"
expectativa_cliente: "1-2 linhas livres"   # tom, vibe, exigências
```

Validação:

- Algum campo vazio → Gil flag pra Lia via Jarbas: "Coleta incompleta. Falta [campo]. Pode confirmar com cliente?"
- Lia volta a falar com cliente, completa, devolve
- Se cliente desistiu nesse meio tempo → Lia avisa, Gil arquiva como `status: cliente_desistiu_pre_briefing` em `eventos-privados.md`

### Fase 2 — Briefing operacional

Cria entrada nova em `agentes/eventos/memory/eventos-privados.md`:

```yaml
- id: ep-XXX                       # incremental
  cliente_nome: "..."
  cliente_contato: "..."
  data_pretendida: YYYY-MM-DD
  publico_estimado: N
  ocasiao: "..."
  status: aguardando_briefing
  recebido_em: ISO8601
  expectativa_cliente: "..."
  briefing: null                   # vai preencher
  preco_tomas: null
  proposta_consolidada: null
  decisao_rodrigo: null
  resposta_cliente: null
```

Lê template aplicável de `templates-evento.md` baseado em `ocasiao`. Se template não existe → cria entrada nova no template (ver skill `pos-evento-licoes` que pode contribuir, ou Gil cria manualmente).

Monta briefing preenchendo:

- **Espaço necessário**: capacidade da casa vs `publico_estimado`. Se exceder, sinaliza limitação.
- **Atração**: DJ próprio (R$ baixo), banda contratada (lista 2-3 opções com cachê estimado de `memory/people.md`), sem música ao vivo (R$ zero). Sugere baseado em `expectativa_cliente`.
- **Fornecedores envolvidos**: som (sempre), bar reforçado (se público > 80), segurança (sempre), decoração (se ocasião pede), gelo extra (se público > 100).
- **Equipe operacional extra**: garçons/bartenders adicionais baseado em público.
- **Riders ou pedidos especiais**: capturado de `expectativa_cliente`.
- **Janela de horário**: chegada do cliente, encerramento (define horário de operação fora do padrão).
- **Custo direto conhecido por Gil** (BRL): soma de cachê de atração (se Gil tem o número de contrato) + cota estimada de fornecedor + equipe extra. **Sem markup, sem margem, sem preço final.**

Atualiza entrada em `eventos-privados.md`:

```yaml
status: aguardando_tomas
briefing:
  espaco: "..."
  atracao: "..."
  fornecedores: [...]
  equipe_extra: "..."
  janela: "..."
  riders: "..."
  custo_direto_conhecido_brl: 0.00
```

### Fase 3 — Handoff pro Tomás

Via Jarbas, Gil entrega pacote pro Tomás:

```yaml
tarefa: precificar_evento_privado
evento_privado_id: "ep-XXX"
briefing_resumo: "<2-3 linhas>"
custo_direto_conhecido_brl: 0.00
publico_estimado: N
data: YYYY-MM-DD
prazo: "<ex: cliente pediu retorno em 48h>"
formato_esperado: "preço sugerido + margem alvo + breakdown de custo conhecido"
```

Tomás devolve em até 24h:

```yaml
preco_sugerido_brl: 0.00
margem_alvo_pct: X
breakdown:
  custo_direto_brl: 0.00
  custo_overhead_estimado_brl: 0.00     # operação base do bar pro horário do privado
  margem_alvo_brl: 0.00
  preco_final_brl: 0.00
notas: "..."                            # ex: "considera consumo mínimo + couvert"
```

Se Tomás demora > 24h → Gil flag pro Jarbas: "Aguardando Tomás precificar [ep-XXX]. Cliente esperando." Jarbas escala se preciso.

### Fase 4 — Consolidar proposta + DM Rodrigo

Atualiza `eventos-privados.md`:

```yaml
status: aguardando_aprovacao_rodrigo
preco_tomas:
  preco_sugerido_brl: 0.00
  margem_alvo_pct: X
  breakdown: {...}
proposta_consolidada: "<texto da proposta>"
```

Monta proposta final (template do PLAYBOOK seção "Fase 4 — Consolidar proposta"):

```
🎟️ Proposta — Evento privado [cliente] em [data]

Ocasião: [...]
Público estimado: [N]
Janela: [chegada]–[encerramento]

Operacional:
- Espaço: [...]
- Atração: [...]
- Fornecedores: [lista]
- Equipe extra: [...]

Preço sugerido (Tomás): R$ [valor]
Margem alvo: [X]%

Aprovas, ajustas ou recuso?
```

DM Rodrigo. Aguarda resposta.

### Fase 5 — Tratamento da resposta do Rodrigo

| Resposta | Ação Gil |
|----------|----------|
| "Aprovo" / "OK" | Atualiza `status: aprovado_aguardando_cliente`. Handoff pra Lia via Jarbas com pacote (preço final, condições, tom sugerido) |
| "Aprovo mas baixa pra R$ X" | Volta pra Fase 3 com nova target. Tomás recalcula margem (handoff curto). Gil re-confirma com Rodrigo se margem ficou aceitável. Depois → Fase 5 normal. |
| "Recuso" + motivo | Atualiza `status: recusado_rodrigo`. Handoff pra Lia comunicar com tom adequado (Lia escolhe palavras, Gil só passa motivo) |
| Silêncio > 24h | DM lembrete: "Proposta [cliente] aguardando OK. Cliente esperando há [X] horas." |

### Fase 6 — Lia comunica + acompanha

Pacote handoff Gil → Jarbas → Lia (apenas após aprovação Rodrigo):

```yaml
acao_lia: comunicar_proposta_aprovada
ep_id: "ep-XXX"
preco_final_brl: 0.00
condicoes: "<ex: 50% sinal, 50% no dia | consumação mínima | etc>"
janela: "<horário>"
o_que_inclui: "<lista breve operacional>"
o_que_nao_inclui: "<lista breve>"
tom_sugerido: "acolhedor | direto | premium"
prazo_resposta_cliente: "<ex: 48h>"
```

Lia comunica cliente. Atualiza `eventos-privados.md` com resposta:

| Resposta cliente | Ação |
|------------------|------|
| Aceitou | `status: fechado`. Migra evento pra `workspace/memory/events.md` pra entrar no fluxo normal de pré-evento. Cron 10h passa a cobrir. |
| Recusou | `status: cliente_recusou` + motivo (se cliente disse) |
| Contraproposta | `status: contraproposta`. Volta pra Fase 3 com Tomás. **Limite: 2 rodadas de contraproposta.** Depois disso, Rodrigo decide se vale insistir. |
| Silêncio > prazo | Lia faz follow-up educado. Após 2 follow-ups sem resposta → `status: cliente_silencio` |

## Formato de saída

Saída principal: proposta consolidada DM pro Rodrigo (Fase 4). Saída secundária: pacote handoff pra Lia (Fase 6).

Ambos sem revelar margem específica pra Lia (margem é interna). Lia recebe **preço final** e condições — não vê estrutura de custo.

## Casos especiais

| Caso | Como Gil trata |
|------|----------------|
| Cliente pede data que conflita com evento público | Sinaliza pro Rodrigo: "Privado pedido em [data] conflita com [evento público]. Realocar privado, recusar ou ajustar evento público?" |
| Cliente pede atração específica que Gil não conhece | Marca `atracao: "a cotar — pesquisa pendente"`. Pesquisa via canais conhecidos OU sinaliza pro Rodrigo: "Cliente quer [artista]. Não tenho contato. Conhece?" |
| Cliente cancela depois de aprovado | Lia avisa Gil. Gil atualiza `status: fechado_depois_cancelado` + motivo. Se houve cobrança de sinal, Tomás trata o estorno. |
| Cliente com histórico ruim (já cancelou antes) | Gil consulta `memory/people.md` se cliente já consta. Se sim, sinaliza pro Rodrigo no DM da Fase 4: "Cliente já cancelou um privado em [data]. Atenção." |
| Briefing exige fornecedor banido | Sugere alternativa de `fornecedores.md`. Se não tem alternativa boa, sinaliza pro Rodrigo. |

## Privacidade

- **Gil nunca fala direto com cliente.** Lia é interface pública.
- **Gil nunca expõe margem ou breakdown de custo pra Lia.** Lia recebe só preço final + condições.
- **Tomás nunca fala com Lia direto.** Margem não sai do canal Tomás → Rodrigo → Gil → Lia (e mesmo assim filtrada).
- Pipeline de privados em `eventos-privados.md` — leitura: Gil + Rodrigo. Não acessível a outros agentes (recusa silenciosa).

## Erros comuns

| Sintoma | Causa | Ação |
|---------|-------|------|
| Lia entregou pacote sem campos obrigatórios | Cliente não respondeu tudo | Gil flag pra Lia, Lia completa antes de Gil seguir |
| Tomás devolve preço com margem < 30% | Custo direto alto vs público estimado | Gil avisa Rodrigo: "Margem ficaria em [X]%, abaixo do alvo. Quer ajustar público mínimo, atração mais barata, ou recusar?" |
| Cliente faz contraproposta absurda (-50% do preço) | Cliente não aceita estrutura | Gil marca `confianca_fechamento: baixa` e avisa Rodrigo: "Cliente quer R$ X (vs proposta R$ Y). Topa ou recuso?" |
| Mesma cliente pede 2 privados em janelas próximas | Possível VIP | Gil sinaliza pro Rodrigo, sugere tratamento diferenciado (desconto fidelidade ou condição especial) |

## Fontes que esta skill toca

- **lê**: `agentes/eventos/memory/templates-evento.md`, `agentes/eventos/memory/fornecedores.md`, `workspace/memory/people.md`, `workspace/memory/events.md`
- **escreve**: `agentes/eventos/memory/eventos-privados.md` (cada fase atualiza status), `workspace/memory/events.md` (na Fase 6 quando cliente aceita, migra entrada pro fluxo geral)
- **chama**: handoff Tomás (Fase 3), handoff Lia (Fase 6)

## Limites

- **Não** define preço — Tomás define
- **Não** aprova proposta — Rodrigo aprova
- **Não** comunica cliente — Lia comunica
- **Não** assina contrato — Rodrigo assina
- **Não** cobra sinal — Rodrigo cobra (Tomás registra entrada quando rolar)
- **Não** mostra margem ou breakdown pra Lia/cliente
- **Não** segue privado fechado em loop de proposta — após 2 rodadas de contraproposta, escala pro Rodrigo decidir
