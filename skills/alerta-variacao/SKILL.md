---
name: alerta-variacao
description: |
  Detecção de variação anormal nos números financeiros do El Coyote. Use durante a extração
  noturna (skill fechamento-diario fase 1) ou sob pull "tem alguma anomalia?", "checa variação",
  "tá tudo dentro da banda?". Compara faturamento, ticket médio, custo de produto e razão
  comissão/faturamento contra média móvel 7 dias e contra evento similar histórico. Para cada
  eixo fora da banda, anexa hipótese padrão (sem afirmar causa). Saída é integrada na mensagem
  de fechamento das 09h — esta skill nunca dispara mensagem sozinha.
---

# Alerta de Variação — Tomás

Agente responsável: **Tomás 📊**. Skill auxiliar — não tem cron próprio. É chamada pelo `fechamento-diario` e por pulls do Rodrigo.

## Quando disparo

- Dentro do `fechamento-diario` Fase 1 (toda extração noturna passa por aqui)
- Pull do Rodrigo: "tem variação", "checa anomalia", "tá tudo certo?"

## Pré-requisitos

- `memory/events.md` com pelo menos 7 entradas (pra média móvel ter base)
- Dado fresco do Bar Fácil (já extraído)

## Eixos monitorados

| Eixo | Comparação | Threshold | Severidade |
|------|------------|-----------|------------|
| Faturamento dia | vs média móvel 7d | ±20% | alta |
| Faturamento evento | vs último evento mesmo tipo | ±20% | alta |
| Ticket médio | vs média 7d | ±15% | média |
| Custo de bebida (se Bar Fácil expõe campo "Custo") | vs média mensal | +10% | alta |
| Razão comissão / faturamento (eventos) | absoluto | > 12% | média |
| Itens vendidos | vs média 7d | ±25% | baixa (info, não alerta) |

## Procedimento

### Fase 1 — Calcular médias

Lê últimas 7 linhas de `memory/events.md` (apenas dias operacionais — pula domingo se for dia parado pelo padrão da casa). Calcula:

- `media_fat_7d = avg(faturamento_total[-7:])`
- `media_ticket_7d = avg(ticket_medio[-7:])`
- `media_itens_7d = avg(itens_vendidos[-7:])`

Pra eixos de evento: filtra `memory/events.md` por tag (`Sertaneja Universitária`, `Rock Night`, etc) e pega o último.

Pra custo: agrega mês corrente e mês anterior do mesmo produto (se Bar Fácil expôs).

### Fase 2 — Calcular deltas

Para cada eixo:
```
delta_pct = (valor_atual − referencia) / referencia × 100
```

### Fase 3 — Classificar

Para cada eixo, determina:
- `dentro_banda` se `|delta_pct| < threshold`
- `alerta` se `|delta_pct| >= threshold`

Coleta todos os alertas em uma lista.

### Fase 4 — Anexar hipótese

Cada alerta vem com hipótese padrão. Tomás **não decide a causa**, só sugere:

| Padrão observado | Hipótese padrão |
|------------------|-----------------|
| Faturamento ↓ + ticket ↑ | "Público pequeno (problema de divulgação?)" |
| Faturamento ↓ + ticket ↓ | "Público OK mas consumo fraco (mix de público errado?)" |
| Faturamento ↑ + ticket ↓ | "Muita gente comprando barato (promoção informal?)" |
| Faturamento ↑ + ticket ↑ | "Mês forte — vale validar se foi sazonal" (alerta positivo) |
| Custo de bebida ↑ | "Fornecedor reajustou ou estoque vazando" |
| Comissão/fat alta | "Pode ter rolado evento com muito promoter zerado contado na base" |
| Itens ↓ + faturamento estável | "Menos gente, mas gastando bem (mix de classe?)" |

### Fase 5 — Devolver estrutura

Não envia mensagem. Devolve pra `fechamento-diario` ou pro pull:

```jsonc
{
  "alertas": [
    {
      "eixo": "faturamento",
      "valor": 6840.00,
      "referencia": 9120.00,
      "delta_pct": -25.0,
      "severidade": "alta",
      "hipotese": "Público pequeno (problema de divulgação?)"
    }
  ],
  "info": [
    { "eixo": "ticket_medio", "valor": 71.20, "referencia": 67.40, "delta_pct": +5.6 }
  ]
}
```

`fechamento-diario` integra isso no template "Fechamento — ⚠️ atenção" do PLAYBOOK. Pull do Rodrigo: Tomás devolve direto formatado.

## Formato em pull (Rodrigo)

```
🔍 Variações últimos 7 dias

Faturamento médio: R$ [valor] (banda 80–120% = R$ [min]–[max])
Ticket médio: R$ [valor] (banda 85–115%)

Hoje fora da banda:
- Faturamento: R$ [valor] ([+/-X]%) — [hipótese]

Tudo certo:
- Ticket médio
- Itens vendidos
- Custo de bebida (se disponível)
```

## Quando NÃO disparar alerta

- **Primeira semana** após reforma / mudança de cardápio / show grande extra → contextualizar com Rodrigo antes
- **Dia chuvoso** ou **feriado atípico** → opcional pular, mas Tomás não tem dado de clima/feriado integrado ainda. Default: avisa mesmo assim, hipótese inclui "pode ser clima/feriado"
- **Evento privado** dentro do operacional → faturamento misturado distorce — Tomás separa via etiqueta, **se** Rodrigo etiquetou em `memory/events.md`

## Limites

- **Não** decide a causa, só anexa hipótese
- **Não** propõe ação corretiva — isso é Raul (intel)
- **Não** dispara mensagem sozinha — sempre via `fechamento-diario` ou pull
- **Não** alerta em `delta_pct = NaN` (primeira semana sem base) — pula silenciosamente

## Fontes que esta skill toca

- **lê**: `memory/events.md`
- **escreve**: nada (devolve estrutura em memória, quem persiste é o caller)
- **chama**: nenhuma skill (recebe dado já extraído como input)

## Erros comuns

| Sintoma | Causa | Ação |
|---------|-------|------|
| Banda sem base (média = 0) | Menos de 7 dias de histórico | Pula alerta, devolve `alertas: []` |
| Threshold disparando todo dia | Banda muito apertada pra natureza do bar (oscila bastante) | Sugerir ao Rodrigo recalibrar threshold; registrar em `memory/decisions.md` |
| Hipótese genérica que confunde | Padrão fora dos 7 mapeados | Devolve sem hipótese, marca `hipotese: "padrão atípico — quer que o Raul investigue?"` |
