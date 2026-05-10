# Padrões observados — Raul

> Base de aprendizado do Raul. Cada padrão tem confiança graduada (baixa/média/alta) e evolui com a evidência. Skills `relatorio-semanal-intel` e `analise-pos-evento` consultam aqui antes de marcar hipótese como nova ou recorrente.

## Schema

```yaml
- id: pat-XXX                       # incremental
  nome: "nome curto descritivo"
  descricao: "1-2 linhas do que o padrão é"
  primeiro_visto: YYYY-MM-DD
  ultimo_visto: YYYY-MM-DD
  ocorrencias: N                    # quantas vezes confirmado
  confianca: baixa | media | alta   # baixa: 1-2 vezes; media: 3-5; alta: 6+
  contraexemplos: N                 # vezes que o padrão NÃO se confirmou
  hipotese_principal: "..."
  hipotese_alternativa: "..."
  acao_quando_recorre: "..."
  fonte: "Bar Fácil + PNE + memory/events.md"
  eventos_origem: [id, id, id]      # eventos onde padrão foi observado
  notas: "histórico de mudança"
```

## Regras de manutenção

- **Quando criar entrada nova**: skill identifica padrão que não bate com nenhum existente. `confianca: baixa`, ocorrências = 1.
- **Quando incrementar**: padrão se repete em novo evento/semana. Aumentar `ocorrencias`, atualizar `ultimo_visto`. Se `ocorrencias >= 3` → `confianca: media`. Se `>= 6` → `alta`.
- **Quando marcar contraexemplo**: padrão estava previsto mas não aconteceu. Incrementa `contraexemplos`. Se `contraexemplos > ocorrencias / 3` → rebaixa confiança.
- **Quando arquivar**: `confianca: baixa` + 90 dias sem nova ocorrência → move pra `padroes-arquivo-YYYY.md` (preserva histórico).
- **Quando promover a regra**: `confianca: alta` + 6+ meses estável → considera virar parte do PLAYBOOK (Raul propõe via Jarbas, Rodrigo aprova).

## Categorias (organização interna)

- **operacional** — padrões de dia a dia (ticket médio, mix de produto, dia da semana)
- **evento** — padrões de eventos (conversão, comparação entre tags, sazonalidade)
- **promoter** — padrões de comportamento de promoter (tipos de público, queda)
- **externo** — padrões ligados a clima, feriado, sazonalidade da cidade

---

## Padrões ativos

<!-- Raul preenche aqui ao longo do tempo. Primeira entrada nasce após primeiras 4 semanas de operação com base estatística. -->

<!-- Exemplo (template, não real):
- id: pat-001
  nome: "Sertaneja Universitária 1ª quinzena > 2ª"
  descricao: "Eventos de Sertaneja Universitária na 1ª quinzena do mês fecham 15-25% acima dos da 2ª quinzena, mantida a programação"
  primeiro_visto: 2026-XX-XX
  ultimo_visto: 2026-XX-XX
  ocorrencias: 0
  confianca: baixa
  contraexemplos: 0
  hipotese_principal: "Salário do mês — público gasta mais quando recebeu há pouco"
  hipotese_alternativa: "Calendário de provas universitárias afeta 2ª quinzena"
  acao_quando_recorre: "Ao agendar Sertaneja na 2ª quinzena, ajustar expectativa de meta -15%"
  fonte: "Bar Fácil + PNE + memory/events.md"
  eventos_origem: []
  notas: "padrão hipotético — aguarda primeira observação real"
-->

---

## Histórico arquivado

<!-- Padrões antigos com confiança baixa que sumiram. Move pra cá em vez de deletar — auditoria e revisitar quando padrão similar aparecer. -->
