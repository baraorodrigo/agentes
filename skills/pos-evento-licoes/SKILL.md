---
name: pos-evento-licoes
description: |
  Lições pós-evento agregadas pelo Gil. Use SEMPRE que o cron D+2 14h disparar (verifica
  evento de 2 dias atrás com Tomás+Raul prontos), ou sob pull "lições do [evento]",
  "post-mortem do [evento]", "que aprendemos com [evento]?". Agrega 3 fontes: Tomás
  (margem, comissão %, comparação), Raul (padrão observado, hipótese), e observações
  próprias do Gil (fornecedores, atrasos, falhas operacionais). Escreve entrada
  estruturada em workspace/memory/lessons.md e DM resumo curto pro Rodrigo. NÃO repete
  análise do Raul nem cálculo do Tomás — agrega e operacionaliza.
---

# Lições Pós-Evento — Gil

Agente responsável: **Gil 🎪**. Disparo: cron D+2 14h Brasília, ou pull do Rodrigo.

## Quando disparo

- **Cron D+2 14h** (`workspace/rotinas/pos-evento-licoes.md`) — 2 dias após cada evento
- **Pull do Rodrigo** — "lições do [evento]", "post-mortem do [evento]", "que aprendemos com X?"

## Por que D+2 e não D+1

Sequência cronológica de pós-evento:

| Quando | Quem | O quê |
|--------|------|-------|
| D+0 noite | Rodrigo | Acompanha evento, observa o que rolou |
| D+1 11h | Tomás | Fecha comissão e calcula margem |
| D+1 11h+ | Raul | Análise pós-evento (handoff Jarbas) |
| **D+2 14h** | **Gil** | **Agrega + escreve lições** |

Gil entra **depois** de Tomás e Raul terminarem. Atropelar antes deles → faltam dados, lição sai pela metade. D+2 14h dá margem operacional pra ambos finalizarem (e pra Rodrigo digerir o que sentiu na hora).

## Pré-requisitos

- Evento já encerrado com check-in fechado no PNE
- Tomás já rodou `comissao-evento` (`comissoes_calculadas: true` em `memory/events.md`)
- Raul já rodou `analise-pos-evento` (entrada em `agentes/intel/memory/relatorios.md`)
- Gil tem observações próprias acumuladas durante o evento (em `memory/eventos-privados.md` se foi privado, ou em `memory/fornecedores.md` se houve incidente, ou notas livres do Rodrigo)

## Procedimento

### Fase 1 — Detecção do evento alvo

Cron D+2 14h:

1. Calcula data alvo: `hoje - 2 dias`
2. Lê `workspace/memory/events.md`, filtra entradas com `data == hoje-2` E `tipo: evento`
3. **Sem evento na data** → sai silencioso
4. Tem evento → checa pré-requisitos (Tomás+Raul prontos):
   - Se `comissoes_calculadas: false` ou `analise_pos_evento: false` → flag pro Jarbas: "Aguardando Tomás/Raul fechar [evento]. Re-tento amanhã 14h." (cron D+3 retoma)
   - Limite: se D+5 ainda não fecharam, escala: "Pós-evento [evento] travado há 5 dias. Quer que eu peça atualização?"
5. Tudo pronto → segue Fase 2

Pull:

1. Parser de nome/data na pergunta
2. Localiza evento, checa pré-requisitos. Se algum não pronto, avisa Rodrigo (não tenta produzir lição com base incompleta).

### Fase 2 — Coletar input das 3 fontes

**Tomás (via `workspace/memory/events.md` + `agentes/financeiro/memory/comissoes.md`)**:
- Faturamento do evento (não revela pra ninguém — Gil só lê pra contexto interno)
- Margem operacional (`margem_pct`)
- Comissão / faturamento (banda do Tomás é 12% — se ultrapassou é sinal)
- Comparação com evento similar anterior (`delta_faturamento_pct` se calculado)

**Raul (via `agentes/intel/memory/relatorios.md`)**:
- Filtra entradas com `tipo: pos_evento` e `evento` correspondente
- Lê `funcionou`, `nao_funcionou`, `hipotese.principal`
- **Não duplica** o que Raul disse. Gil resume em 1 linha e referencia: "Raul observou: [hipótese]"

**Próprias do Gil (via `agentes/eventos/memory/`)**:
- `fornecedores.md`: algum fornecedor teve problema? Atrasou? Faltou item de rider?
- `eventos-privados.md`: se evento foi privado, cliente teve reclamação ou destaque?
- Checklist 14h salvo em `memory/events.md` (`checklist_14h`): quais itens estavam ⚠️/❌ no dia? Resolveram? Como?
- Observações livres do Rodrigo (se DM enviou comentário durante/após evento)

### Fase 3 — Estruturar lição

Critério: lição precisa ser **acionável**. "O evento foi bom" não é lição. "Trocar fornecedor de som X — atrasou 1h pelo 3º evento seguido" é lição.

Cada lição agrega 3 elementos:

1. **Observação** — o que aconteceu (objetivo, dado/fato)
2. **Hipótese** — por que aconteceu (de Raul ou inferência operacional)
3. **Ação pra próximo evento igual** — o que mudar concretamente

Tipos típicos de lição operacional do Gil:

- Fornecedor problemático (atrasou, faltou, qualidade ruim)
- Fornecedor destaque (entregou bem, repetir)
- Atração que excedeu expectativa (ou decepcionou)
- Falha de checklist (algo não foi conferido a tempo)
- Acerto de checklist (item bem antecipado, repetir processo)
- Estimativa de público errada (subestimou/superestimou — afeta planejamento)
- Janela de horário inadequada (soundcheck atrasou, abertura tarde)

### Fase 4 — Escrever em `workspace/memory/lessons.md`

Append entrada estruturada em `workspace/memory/lessons.md`:

```yaml
- id: les-XXX                      # incremental
  evento: "<nome>"
  evento_data: YYYY-MM-DD
  evento_tag: "<tag>"
  registrado_em: ISO8601
  registrado_por: gil
  fontes:
    tomas: "<resumo 1 linha do output do Tomás>"
    raul: "<resumo 1 linha do output do Raul>"
    operacional: "<resumo 1-2 linhas do que Gil observou>"
  licoes:
    - observacao: "..."
      hipotese: "..."
      acao_proximo: "..."
    - observacao: "..."
      hipotese: "..."
      acao_proximo: "..."
  destaques_positivos: ["..."]
  destaques_negativos: ["..."]
```

### Fase 5 — DM resumo pro Rodrigo

Mensagem curta (5 bullets máximo):

```
📝 Lições — [evento] em [data]

Operacional (eu):
- [observação 1]
- [observação 2]

Financeiro (Tomás): [resumo curto da margem vs anterior]
Padrões (Raul): [hipótese principal]

Pra próximo igual:
- [ação concreta]

Salvei em lessons.md.
```

**Não revela faturamento ou margem em valores absolutos** — só comparação relativa ("acima/abaixo de evento similar"). Detalhe absoluto fica no Tomás.

### Fase 6 — Atualizar memórias auxiliares

Se lição envolve fornecedor:
- Atualiza `agentes/eventos/memory/fornecedores.md`: ajusta `reputacao` se necessário (`alta` → `media` se 1º problema, `media` → `baixa` se 2º, considerar `banido` se 3º — sempre com aprovação Rodrigo).

Se lição envolve template de evento:
- Atualiza `agentes/eventos/memory/templates-evento.md`: ajusta lista padrão de fornecedores ou itens de checklist.

Se lição envolve padrão recorrente (3+ vezes):
- Sinaliza pro Raul via Jarbas: "Padrão observado em 3 eventos: [X]. Quer entrar como `pat-XXX` em padroes.md?"

## Formato de saída

Ver Fase 5. DM pro Rodrigo curta + escrita estruturada em `lessons.md`.

## Casos especiais

| Caso | Como Gil trata |
|------|----------------|
| Evento sem nada digno de lição (rotina ok, sem destaque) | Escreve entrada mínima ("evento rotineiro, sem variação relevante") + DM pro Rodrigo: "Pós-evento [nome] sem destaque. Lição rotineira salva." |
| Tomás flagou comissão > 12% | Vira lição automática: revisar critério de meta ou estrutura de comissão pro tipo de evento |
| Raul não rodou (handoff Jarbas falhou) | Roda lição com lacuna: "Padrões: análise Raul ausente. Lição com base só em Tomás + operacional." |
| Evento privado | Adiciona seção "Cliente": ele aceitou bem? Vai voltar? Reclamação? — apenas operacional, **sem revelar margem**. |
| Múltiplos eventos no mesmo dia (festival) | Uma lição agregada por dia, com sub-bullets por evento |
| Evento cancelado | Não roda. Marca em `eventos-privados.md` ou `events.md` com `cancelado: true` + motivo |

## Privacidade

- DM Rodrigo apenas. Lições têm referência a fornecedor, atração e cliente — não vai pra outro agente nem grupo.
- `lessons.md` é leitura geral pro Jarbas (que pode citar lição em briefing) e Raul (que pode usar como base estatística). **Não pode ser referenciada com nome de fornecedor/cliente em mensagem pública.**

## Erros comuns

| Sintoma | Causa | Ação |
|---------|-------|------|
| Lição duplicada (já tinha lição similar de evento anterior) | Padrão recorrente — virou regra | Em vez de lição nova, sinaliza Jarbas+Rodrigo: "Padrão se repete pela [N]ª vez. Vira regra do PLAYBOOK?" |
| Lição vaga ("o evento foi bom") | Falha de critério acionável | Re-roda Fase 3 com foco em ação concreta. Se não tem ação, não vira lição. |
| Tomás reportou margem mas Raul não tem padrão | Primeira ocorrência ou amostra pequena | OK, lição sai com `padroes_recorrentes: false` |
| Conflito: Tomás diz "evento ruim financeiramente" mas Raul diz "público engajado" | Possível padrão complexo | Vira lição com 2 lados: "Resultado financeiro abaixo + engajamento alto. Hipótese: ticket ou mix de produto. Investigar próximo igual." |

## Fontes que esta skill toca

- **lê**: `workspace/memory/events.md`, `agentes/financeiro/memory/comissoes.md` (readonly), `agentes/intel/memory/relatorios.md`, `agentes/eventos/memory/fornecedores.md`, `agentes/eventos/memory/eventos-privados.md`, `agentes/eventos/memory/templates-evento.md`
- **escreve**: `workspace/memory/lessons.md` (append), `agentes/eventos/memory/fornecedores.md` (atualiza reputação), `agentes/eventos/memory/templates-evento.md` (ajustes pontuais)
- **não chama** skills externas (PNE/Bar Fácil) — agrega o que Tomás+Raul já extraíram

## Limites

- **Não** repete análise do Raul nem cálculo do Tomás — agrega e operacionaliza
- **Não** revela faturamento/margem em valores absolutos no DM (fica no Tomás)
- **Não** julga decisão estratégica do Rodrigo (tipo de evento, atração escolhida) — observa resultado
- **Não** força lição quando evento foi rotineiro — registra mínimo, segue
- **Não** edita lessons.md retroativamente — entrada nova sempre, com `registrado_em` próprio
