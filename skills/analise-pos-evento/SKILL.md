---
name: analise-pos-evento
description: |
  Análise pós-evento do El Coyote pelo Raul. Use SEMPRE que o Jarbas convocar via handoff
  após Tomás fechar comissão (D+1 11h+), ou sob pull "analisa o [evento]", "como foi o
  [evento] de verdade", "pós-mortem do [evento]". Cruza PNE (lista, conversão, mix de
  aniversariante) × Bar Fácil (faturamento, ticket, mix de produto) × histórico de evento
  similar (memory/events.md filtrado por tag). Devolve "o que funcionou / não funcionou /
  hipótese pro próximo" pro Jarbas. NUNCA fala direto com Rodrigo — sempre via Jarbas.
---

# Análise Pós-Evento — Raul

Agente responsável: **Raul 🔍**. Skill convocada por handoff — não tem cron próprio.

## Quando disparo

- **Handoff Jarbas** após Tomás fechar comissão (cron Jarbas dispara em D+1, depois das 11h, **depois** que Tomás já marcou `comissoes_calculadas: true` em `memory/events.md`)
- **Pull via Jarbas** — Rodrigo perguntou "como foi o [evento] de verdade", "pós-mortem do Sertaneja de sábado"

## Pré-requisitos

- Evento já encerrado com check-in fechado no PNE
- Tomás já rodou `comissao-evento` (`comissoes_calculadas: true` em `memory/events.md`)
- Bar Fácil com dado consolidado do evento
- `memory/events.md` com pelo menos 1 evento anterior do mesmo tipo (mesma tag) — sem isso, devolve análise sem comparação

## Procedimento

### Fase 1 — Receber contexto do Jarbas

Jarbas passa: `event_id`, `event_name`, `event_date`, `tag` (ex: "Sertaneja Universitária"), `solicitante` (jarbas/rodrigo/gil).

Se faltou algum campo → flag pro Jarbas, não chuto.

### Fase 2 — Coletar dados do evento

Cruza 3 fontes:

**PNE** (skill `extrair-pne`):
- lista completa por promoter (`Inserido por`)
- conversão (CONVERTIDO vs NÃO CONVERTIDO)
- aniversariantes confirmados
- mesa/lounge se houver

**Bar Fácil** (skill `extrair-barfacil`):
- faturamento total do evento
- ticket médio
- top 5 produtos por valor
- top 3 atendentes

**`workspace/memory/events.md`**:
- linha do evento atual (já populada pelo Tomás)
- último evento mesmo tag (anterior)
- 3 últimos eventos mesmo tag (pra média base)

### Fase 3 — Calcular comparações

```
delta_faturamento_pct = (atual − anterior) / anterior × 100
delta_ticket_pct = idem
delta_conversao_pp = (taxa_atual − taxa_anterior) × 100   # em pontos percentuais
delta_publico_pct = (convertidos_atual − convertidos_anterior) / convertidos_anterior × 100

vs_media_3 = comparar com média dos últimos 3 eventos mesmo tag
```

### Fase 4 — Identificar "o que funcionou" e "o que não"

Critérios:

**Funcionou** (até 3 itens):
- Métrica acima de +10% vs anterior OU +15% vs média 3 eventos
- Padrão único positivo (ex: novo produto entrou no top 5, novo promoter forte)
- Conversão alta com lista cheia (não comum)

**Não funcionou** (até 3 itens):
- Métrica abaixo de -10% vs anterior OU -15% vs média 3 eventos
- Padrão único negativo (ex: ticket caiu mas público lotou)
- Comissão > 12% do faturamento (banda do Tomás)

Cada item vira: **padrão observado** + **dado quantificado**.

### Fase 5 — Hipótese pro próximo

Procurar em `memory/padroes.md` se padrões observados batem com regime conhecido. Se sim, hipótese vem da entrada de padrão (com nota "padrão recorrente").

Se não, hipótese é nova → marca como hipótese principal + alternativa, ambas marcadas como `confianca: baixa`. Append em `memory/padroes.md` pra acompanhar.

Hipótese sempre acionável: "se rolar de novo no próximo mesmo tipo, validar X". Não filosofar.

### Fase 6 — Persistir + devolver

1. Append em `agentes/intel/memory/relatorios.md`:
   ```yaml
   - ts: ISO8601
     tipo: pos_evento
     evento: "<nome>"
     evento_data: YYYY-MM-DD
     evento_tag: "<tag>"
     funcionou: ["..."]
     nao_funcionou: ["..."]
     hipotese: "..."
     entregue_a: jarbas
   ```

2. Se hipótese é nova OU contradiz padrão existente em `padroes.md`, adiciona entrada com `confianca: baixa` e `evento_origem: <id>`.

3. Devolve estrutura pro Jarbas:

```jsonc
{
  "evento": "Sertaneja Universitária 2026-05-08",
  "comparacao_anterior": "Sertaneja Universitária 2026-05-01",
  "funcionou": [
    {"padrao": "...", "dado": "+18% faturamento vs anterior"},
    ...
  ],
  "nao_funcionou": [
    {"padrao": "...", "dado": "-22% conversão vs média 3 eventos"},
    ...
  ],
  "hipotese": {
    "principal": "...",
    "alternativa": "...",
    "confianca": "baixa",
    "padrao_recorrente": false
  },
  "fonte": "PNE [data] + Bar Fácil [data] + memory/events.md (3 eventos base)"
}
```

## Formato em entrega via Jarbas (texto)

```
🔍 Pós-evento — [nome] em [data]

Vs [evento similar anterior]:
- Faturamento: [+/-X%]
- Conversão: [+/-pp]
- Ticket: [+/-X%]

O que funcionou:
- [padrão] ([dado])
- [padrão] ([dado])

O que não funcionou:
- [padrão] ([dado])
- [padrão] ([dado])

Hipótese pro próximo:
- Principal: [hipótese]
- Alternativa: [hipótese]
[se padrão recorrente: "(padrão já visto N vezes")]
```

Jarbas decide o que vira mensagem pro Rodrigo (geralmente o resumo curto + 1 destaque) e arquiva o resto em `memory/lessons.md` pra consulta.

## Quando NÃO disparar (escala silenciosa)

- **Sem evento anterior mesmo tag** → sai com nota "primeira vez deste tipo, sem comparação. Análise estática só com dados do evento."
- **Tomás ainda não fechou comissão** → flag pro Jarbas: "Aguardando Tomás fechar comissão. Re-tente em 1h."
- **PNE sem `Inserido por` em parte da lista** → relatório sai com lacuna explícita; análise por promoter fica parcial

## Limites

- **Não** julga decisão do Rodrigo (escolha de atração, preço de ingresso) — observa resultado, não a decisão
- **Não** sugere preço/desconto — isso é decisão do Rodrigo, com Tomás
- **Não** revela individual de promoter no relatório (vai pra `perfil-promoter` se Beto pedir via Jarbas)
- **Não** afirma causalidade (correlação ≠ causa) — sempre marca hipótese

## Fontes que esta skill toca

- **lê**: `workspace/memory/events.md`, `agentes/intel/memory/padroes.md`, `agentes/financeiro/memory/comissoes.md` (readonly, só pra checar razão comissão/fat)
- **escreve**: `agentes/intel/memory/relatorios.md`, `agentes/intel/memory/padroes.md`
- **chama**: `extrair-pne`, `extrair-barfacil`

## Erros comuns

| Sintoma | Causa | Ação |
|---------|-------|------|
| Comparação retorna 0% em tudo | Bug de leitura de `events.md` | Re-extrair último evento, não interpolar |
| 5+ itens em "não funcionou" | Provavelmente evento mal-categorizado (tag errada) | Verificar tag, comparar com tag mais ampla, reportar pro Jarbas |
| Hipótese principal e alternativa idênticas | Padrão simples demais — não vale 2 hipóteses | Devolve só uma, com `confianca: alta` se padrão recorrente |
| Tomás reportou comissão > 12% mas Raul não vê variação no faturamento | Promoter inflou base sem converter público | Destaque: "comissão alta sem público proporcional — checar critério meta" |
