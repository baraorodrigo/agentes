# Rotina: Alerta de Variação (auxiliar)

- **Cron:** nenhum próprio. Disparada **apenas** pela skill `fechamento-diario` durante o cron 04h.
- **Agente:** Tomás 📊 (financeiro)
- **Destino:** integrada na mensagem das 09h. Nunca dispara mensagem sozinha.
- **Skill orquestrada:** `alerta-variacao`

## Por que existe esta rotina sem cron

Documenta o comportamento de detecção de anomalia pra que:
1. Quem revisar o sistema saiba que essa lógica existe e onde mora (skill `alerta-variacao`)
2. Auditoria das hipóteses padrão fique acessível fora do código da skill
3. Rodrigo possa pedir "checa variação dos últimos 7 dias" e Tomás responda direto via skill em modo pull

## Modo push (dentro do cron 04h)

Skill `fechamento-diario` chama `alerta-variacao` automaticamente:

1. Calcula média móvel 7d (faturamento, ticket, itens)
2. Calcula deltas vs média
3. Para cada eixo fora da banda, anexa hipótese padrão
4. Devolve estrutura `{ alertas: [], info: [] }` pra `fechamento-diario`
5. `fechamento-diario` integra na mensagem das 09h se houver alertas

## Modo pull (Rodrigo pede)

Triggers: "checa variação", "tem anomalia", "tá tudo dentro da banda?"

Tomás:
1. Roda skill `alerta-variacao` direto sobre os últimos 7 dias de `memory/events.md`
2. Devolve formato pull do PLAYBOOK:

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

## Bandas atuais

| Eixo | Banda | Severidade |
|------|-------|-----------|
| Faturamento dia | ±20% vs média 7d | alta |
| Faturamento evento | ±20% vs último similar | alta |
| Ticket médio | ±15% vs média 7d | média |
| Custo de bebida | +10% vs média mensal | alta |
| Comissão / faturamento | absoluto > 12% | média |
| Itens vendidos | ±25% vs média 7d | baixa (info) |

## Hipóteses padrão (não decidem causa, só sugerem)

| Padrão | Hipótese |
|--------|----------|
| Faturamento ↓ + ticket ↑ | "Público pequeno (problema de divulgação?)" |
| Faturamento ↓ + ticket ↓ | "Público OK mas consumo fraco (mix errado?)" |
| Faturamento ↑ + ticket ↓ | "Muita gente comprando barato (promoção informal?)" |
| Faturamento ↑ + ticket ↑ | "Mês forte — vale validar se foi sazonal" |
| Custo ↑ | "Fornecedor reajustou ou estoque vazando" |
| Comissão/fat alta | "Evento com muito promoter zerado contado na base?" |

## Recalibração

Se um threshold dispara todo dia (banda apertada demais pra natureza do bar):
- Tomás registra em `decisions.md` (`tipo: decisao_regra`)
- DM Rodrigo: "A banda de [eixo] tá apertada — disparou X dias seguidos. Recalibrar pra ±Y%?"
- Aguarda OK antes de mudar threshold

## NÃO faz

- Não decide causa
- Não propõe ação corretiva (isso é Raul, sob aprovação)
- Não dispara mensagem sozinha
- Não alerta em primeira semana (sem base de 7d)
