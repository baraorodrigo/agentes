---
name: relatorio-semanal-intel
description: |
  Relatório semanal de tendência operacional do El Coyote pelo Raul. Use SEMPRE no cron
  segunda 09h, ou sob pull "como foi a semana", "tem padrão na semana", "relatório semanal".
  Cruza últimos 7 dias de memory/events.md com 4 semanas anteriores (mesmo dia da semana,
  mesmo tipo de dia operacional/evento), identifica 3 destaques + 1 ponto de atenção, devolve
  estrutura pro Jarbas (que decide se repassa pro Rodrigo). NUNCA dispara mensagem direto —
  sempre via Jarbas.
---

# Relatório Semanal Intel — Raul

Agente responsável: **Raul 🔍**. Skill principal — cron semanal seg 09h. Também atende pull via Jarbas ("como foi a semana?").

## Quando disparo

- **Cron seg 09h** (`workspace/rotinas/relatorio-semanal-intel.md`)
- **Pull via Jarbas** — "relatório da semana", "tem padrão", "como fechou a semana"

## Pré-requisitos

- `workspace/memory/events.md` com pelo menos 14 dias (1 semana atual + 1 anterior pra base mínima de comparação)
- Skill `extrair-pne` e `extrair-barfacil` operacionais (caso falte dado de algum dia, re-extrai)
- Acesso a `memory/relatorios.md` (escrita) e `memory/padroes.md` (leitura/escrita)

## Procedimento

### Fase 1 — Definir janela

- Janela atual: últimos 7 dias completos (não inclui hoje se cron rodou às 09h, inclui domingo passado até sábado passado se rodou segunda)
- Janela de comparação: 4 semanas anteriores à janela atual, mesma quantidade de dias por tipo

### Fase 2 — Extrair série

Lê `workspace/memory/events.md`:
- 7 entradas da janela atual
- 28 entradas de comparação (ou o que tiver — mínimo 14 dias pra rodar)

Se houver buracos (dias sem extração) → marca `lacuna_dados: [datas]` no relatório, não interpola.

### Fase 3 — Calcular agregados

Para cada métrica, separar por tipo de dia (operacional vs evento):

```
faturamento_semana = sum(operacionais.faturamento) + sum(eventos.faturamento)
ticket_medio_semana = avg(faturamento_dia / itens_dia) ponderado
conversao_eventos = sum(convertidos) / sum(inseridos) [só eventos]
mix_top_5 = produtos rankeados por faturamento agregado
```

Mesma coisa pra janela de comparação. Calcular delta de cada métrica.

### Fase 4 — Identificar 3 destaques

Critérios pra eleger destaque (ordenado por relevância):

1. Variação > banda em métrica primária (faturamento, ticket, conversão)
2. Mudança no top 1 de produto ou top 1 de promoter
3. Padrão de série (3 dias consecutivos subindo/caindo)
4. Contraste entre eventos e operacionais (ex: eventos fortes mas operacional fraco)

Pega os 3 mais relevantes. Cada um vira: **padrão observado** + **hipótese** + **ação sugerida**.

### Fase 5 — Identificar 1 ponto de atenção

Critério: padrão recorrente que não vira destaque (não é variação aguda, é tendência lenta) — ex: "ticket médio caindo de leve há 4 semanas". Sempre 1, máximo. Se nada destoa, devolve "Sem ponto de atenção: tudo dentro da banda."

### Fase 6 — Persistir + devolver

1. Append em `agentes/intel/memory/relatorios.md`:
   ```yaml
   - ts: ISO8601
     tipo: relatorio_semanal
     janela: "YYYY-MM-DD a YYYY-MM-DD"
     destaques: ["...", "...", "..."]
     atencao: "..."
     entregue_a: jarbas
   ```

2. Se identificou padrão novo (não estava em `padroes.md`), adicionar entrada em `agentes/intel/memory/padroes.md` com `confiança: baixa` (vira mais alta se repetir).

3. Devolve estrutura pro Jarbas:

```jsonc
{
  "janela": "2026-05-04 a 2026-05-10",
  "destaques": [
    {
      "padrao": "...",
      "hipotese": "...",
      "acao_sugerida": "..."
    }
  ],
  "atencao": {
    "padrao": "...",
    "porque_agora": "..."
  },
  "fonte": "Bar Fácil [data] + PNE [data]",
  "lacuna_dados": []
}
```

## Formato em entrega via Jarbas (texto)

```
🔍 Relatório semanal — [DD/MM] a [DD/MM]

3 destaques:
1. [padrão] — [hipótese] — [ação sugerida]
2. [padrão] — [hipótese] — [ação sugerida]
3. [padrão] — [hipótese] — [ação sugerida]

⚠️ Ponto de atenção:
[padrão recorrente] — [por que merece olhar agora]

Fonte: PNE [data extração] + Bar Fácil [data extração]
```

Jarbas integra resumido em 1-2 linhas no briefing diário de segunda. O relatório completo fica em `agentes/intel/memory/relatorios.md` pra Rodrigo abrir se quiser detalhe.

## Quando NÃO disparar

- **Primeira semana de operação** (sem 14 dias de base) → sai com nota "base estatística limitada — relatório completo a partir de [data]"
- **Bar Fácil offline** → flag pro Jarbas: "Sem dado da semana inteira. Quer que eu rode com dado parcial ou aguardo?"
- **Janela com buraco > 3 dias** → relatório sai com `lacuna_dados` explícita; destaque só de métricas com base completa

## Limites

- **Não** envia mensagem direto — sempre via Jarbas
- **Não** afirma causa — hipótese marcada
- **Não** sugere ação financeira (corte de custo, reajuste de preço) — isso é Tomás+Rodrigo
- **Não** revela dado individual de promoter — destaque sobre promoter cita performance da casa, individual fica em `perfil-promoter`

## Fontes que esta skill toca

- **lê**: `workspace/memory/events.md`, `agentes/intel/memory/padroes.md`
- **escreve**: `agentes/intel/memory/relatorios.md`, `agentes/intel/memory/padroes.md` (append em padrões novos)
- **chama**: `extrair-pne`, `extrair-barfacil` (se algum dia da janela tá em branco)

## Erros comuns

| Sintoma | Causa | Ação |
|---------|-------|------|
| Variação enorme em todas as métricas | Provavelmente buraco na série anterior | Verificar lacuna; relatório sai sem destaques numéricos, foca em padrão observacional |
| Hipótese genérica em 2+ destaques | Padrão complexo, modelo não cobriu | Marca `[CLAUDE-CODE recomendado]` no relatório, Jarbas decide se escala Trilha C |
| Mesmo padrão repete 4 semanas seguidas | Não é mais destaque, é regime | Move pra `padroes.md` com `confianca: alta`, sai dos destaques semanais |
