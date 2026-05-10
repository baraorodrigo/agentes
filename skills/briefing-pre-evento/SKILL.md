---
name: briefing-pre-evento
description: |
  Briefing pré-evento do El Coyote pelo Gil. Use SEMPRE que o cron diário 10h disparar
  (verifica se há evento em 7 dias) ou quando Rodrigo perguntar "como tá o [evento]",
  "tem evento essa semana?", "briefing do [evento]", "preview do próximo evento". Lê
  workspace/memory/events.md filtrando eventos com data entre hoje e hoje+7, monta
  briefing operacional (atração, contrato, rider, fornecedores, lista PNE, custo conhecido,
  pendentes críticas) e DM Rodrigo. Silencioso se sem evento próximo. NÃO toca em
  faturamento ou margem (isso é Tomás). NÃO promete cliente externo (Lia comunica).
---

# Briefing Pré-Evento — Gil

Agente responsável: **Gil 🎪**. Disparo: cron diário 10h Brasília, ou pull do Rodrigo.

## Quando disparo

- **Cron diário 10h** (`workspace/rotinas/briefing-pre-evento.md`)
- **Pull do Rodrigo** — "como tá o [evento]", "tem evento essa semana?", "briefing do próximo"

## Pré-requisitos

- `workspace/memory/events.md` populado com eventos planejados (data, nome, tipo, atração, status de contrato/fornecedor)
- `agentes/eventos/memory/fornecedores.md` lido pra cross-ref de status de fornecedor
- Skill `extrair-pne` operacional (Chrome logado) caso evento já tenha lista no PNE

## Procedimento

### Fase 1 — Janela e detecção

Cron 10h:

1. Calcula janela: `hoje` até `hoje + 7 dias`
2. Lê `workspace/memory/events.md`, filtra entradas com `data` na janela E `tipo: evento` (exclui dia operacional comum)
3. **Sem evento na janela** → sai silencioso (nada acontece, nem mensagem)
4. Tem 1+ eventos → segue Fase 2 pra cada um (1 mensagem por evento, em ordem cronológica)

Pull:

1. Parser do nome/data na pergunta do Rodrigo
2. Localiza evento em `memory/events.md`
3. Se não encontra → DM "Não tenho [evento] no events.md. Confirma o nome ou data?"

### Fase 2 — Coletar status do evento

Para cada evento na janela, montar dossiê:

**Da entrada em `memory/events.md`**:
- nome, data, horário, tipo (tag)
- atração (nome + status_contrato: pendente/assinado)
- cachê acertado (sim/não — sem revelar valor pra ninguém além do Rodrigo)
- rider recebido (sim/não)
- fornecedores envolvidos (lista de IDs)

**Da `agentes/eventos/memory/fornecedores.md`** (cross-ref pelos IDs):
- Cada fornecedor: nome, categoria, status (confirmado/pendente/recusou), reputação

**Do PNE** (skill `extrair-pne`, se evento já tem ID PNE setado):
- Inseridos totais
- Inseridos por promoter (top 3)
- Aniversariantes confirmados se houver
- **Não tenta puxar conversão se evento ainda não aconteceu** (não faz sentido)

### Fase 3 — Identificar pendentes críticas

Critério de "crítica":

- Atração não confirmada e evento em ≤ 3 dias
- Rider não recebido e evento em ≤ 5 dias
- Fornecedor de som/segurança não confirmado e evento em ≤ 3 dias
- Lista PNE com 0 inseridos e evento em ≤ 5 dias (alerta de divulgação)
- Aniversariante prometido pra confirmação que não confirmou em ≤ 2 dias

Cada pendente crítica entra na seção ⚠️ no topo da mensagem com ação concreta sugerida.

### Fase 4 — Montar mensagem + persistir

Template (do PLAYBOOK seção "10h — Briefing pré-evento"):

```
🎪 Evento em [N] dia(s): [nome] — [data] [horário]

Atração: [nome] — [status]
Contrato: [...] | Cachê: [...] | Rider: [...]

Fornecedores:
- Som: [...]
- Bar/estoque: [...]
- Segurança: [...]
- [outros]

Lista PNE: [N] inseridos
Top promoters: [nome] ([N]), [nome] ([N])

⚠️ Pendentes críticas:
- [item]

Próximos passos:
- [ação concreta]
```

Persistência:

1. Append em `workspace/memory/events.md` na entrada do evento: `ultimo_briefing_gil: ISO8601`
2. Se tinha pendente crítica nova (não estava no briefing anterior): append em `workspace/memory/pending.md` com `responsavel: gil` (ou `rodrigo` se ação é dele) — só pra acompanhamento

### Fase 5 — Update curto se nada mudou

Se já mandou briefing daquele evento ontem e nenhum status mudou (atração ainda pendente, fornecedor ainda pendente, mesma lista no PNE):

```
🎪 Briefing [evento] sem novidade. Pendentes seguem:
- [item]
```

Sem repetir tudo. Rodrigo já viu ontem.

## Formato de saída

Ver PLAYBOOK seção "10h — Briefing pré-evento". Obrigatório:

- Sempre identifica quantos dias faltam (`em N dia(s)`)
- Sempre lista status de contrato/cachê/rider da atração (3 campos visíveis, mesmo que "pendente")
- Sempre lista fornecedores envolvidos com status (confirmado/pendente)
- ⚠️ Pendentes críticas no topo se houver — não enterra
- Próximos passos como ações com responsável visível

## Casos especiais

| Caso | Como Gil trata |
|------|----------------|
| Evento sem ID PNE ainda | Pula seção "Lista PNE" e marca como pendência: "Criar evento no PNE" |
| Evento sem atração definida | "Atração: a definir" e marca como pendência crítica se ≤ 5 dias |
| Múltiplos eventos na janela | Mensagem separada pra cada, em ordem cronológica (mais próximo primeiro) |
| Atração já confirmou mas rider veio incompleto | Status "Rider: recebido (incompleto, falta [item])" |
| Fornecedor com `status: banido` no cadastro | Sinaliza como ⚠️ "Fornecedor X banido — substituir antes do evento" |
| Evento privado já fechado (vindo de `eventos-privados.md`) | Briefing usa dados do registro de privado + cliente; sem lista PNE (privado não usa lista pública) |

## Privacidade

- DM Rodrigo apenas. Briefing tem cachê e contato de fornecedor — não vai pra outro agente nem pra grupo.
- Se outro agente perguntar "tem evento essa semana?" — Gil responde só nome/data/atração (info pública), nunca cachê nem fornecedor nem custo.

## Erros comuns

| Sintoma | Causa | Ação |
|---------|-------|------|
| `events.md` retorna evento mas sem campo `tipo: evento` | Schema antigo ou entrada mal formada | Avisa: "Entrada de [evento] em events.md tá incompleta. Posso corrigir?" |
| PNE ID errado (cross-ref nome+data falha) | IDs do PNE e Bar Fácil divergem (regra do AGENTS.md) | Cross-ref por nome+data, não por ID. Se ainda falhar, pula seção PNE |
| Múltiplos eventos no mesmo dia | Festival ou estrutura nova | Mensagem agrupada com sub-seção por evento |
| Briefing repetido sem novidade 3 dias seguidos | Evento parado | Após 3 briefings sem mudança, sugere ação: "Tô mandando briefing diário sem novidade. Quer que eu pause até alguma coisa mexer?" |

## Fontes que esta skill toca

- **lê**: `workspace/memory/events.md`, `agentes/eventos/memory/fornecedores.md`, PNE via `extrair-pne`
- **escreve**: `workspace/memory/events.md` (campo `ultimo_briefing_gil`), `workspace/memory/pending.md` (append se nova pendente)
- **chama**: `extrair-pne` (opcional, só se evento já tem ID PNE)

## Limites

- **Não** lê faturamento estimado, margem ou ticket médio (Tomás)
- **Não** sugere preço de ingresso (Rodrigo decide com Tomás)
- **Não** envia briefing pra fornecedor ou atração — Gil faz operação interna, comunicação externa passa pelo Rodrigo aprovar
- **Não** confirma fornecedor/atração via mensagem — só registra status que **Rodrigo já confirmou**
