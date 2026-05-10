# Templates de Copy — biblioteca aprovada

> Fonte canônica de copies aprovados pela Duda. Lido pelas skills `gerar-copy-evento`,
> `calendario-editorial-semanal` e `lembrete-stories`. Mudança aqui → registrar contexto
> antes de aplicar (qual evento gerou, quando, por que virou template).

**Última atualização:** 2026-05-09 (criação — biblioteca vazia, vai povoando)
**Aprovação Rodrigo:** N/A (templates são extraídos de copies que o Rodrigo aprovou via skill `gerar-copy-evento`)

---

## Como esta biblioteca cresce

1. Toda vez que Rodrigo aprova uma opção (A/B/C) ou edita uma sem rejeitar a estrutura, a Duda registra em `posts-aprovados.md`.
2. Quando o **mesmo padrão** (ângulo + estrutura + tom) é aprovado **3× para a mesma combinação `categoria × tipo de peça`**, vira template aqui.
3. Templates ficam parametrizados (`[evento]`, `[atração]`, `[horário]`, `[narrativa-historica]`) pra reuso.
4. Se Rodrigo pedir explicitamente "salva esse como template", entra direto, sem esperar 3×.

## Schema

```yaml
- id: tpl-XXX
  categoria: aquecimento | pre_evento | dia_evento | pos_evento | aniversariante | branding | grupo_promoters
  tipo_peca: feed | story | reels | grupo_promoters
  tag_evento: "Sertaneja Universitária" | "Rock Night" | "Pagode SC" | "Genérico" | ...
  tom: direto | storytelling | gancho | vibe
  template: |
    [texto com placeholders entre colchetes]
  hashtags_extra: ["#Tag1", "#Tag2"]
  exemplo_aplicado: |
    [texto preenchido com evento real]
  criado_em: YYYY-MM-DD
  aprovacoes: 3
  ultima_uso: YYYY-MM-DD
```

## Categorias

| Categoria | Janela | Tipo de peça mais comum |
|-----------|--------|-------------------------|
| aquecimento | D-7 a D-3 | Feed |
| pre_evento | D-1 | Story |
| dia_evento | D-0 | Story |
| pos_evento | D+1 | Feed |
| aniversariante | qualquer | Feed ou story |
| branding | dia sem evento | Feed/story de vibe |
| grupo_promoters | qualquer | Texto pro grupo via Beto |

## Hashtags base (sempre incluir)

```
#ElCoyote #ElCoyotePub #ImbitubaNightLife #RockBar
```

Mais 1 ou 2 do tema do evento (ex: `#SertanejoUniversitario`, `#RockNight`, `#PagodeSC`).

---

## Regras de operação

1. **Templates não inventam dado.** Placeholders são preenchidos com dado real do PNE (evento, data, atração) ou de `memory/events.md` (narrativa histórica sem R$).
2. **Templates respeitam tamanho máximo do tipo de peça** (ver PLAYBOOK.md "Tipos de peça").
3. **Templates nunca incluem R$, comissão, custo, margem.** Mesmo se o evento foi "lotação histórica", a frase é "lotou", "esgotou", "casa cheia" — nunca o número.
4. **Templates evoluem.** Se Rodrigo pediu edição mínima 3× no mesmo template, atualiza o template (ou cria variação).
5. **Templates morrem.** Se um template não é usado em 6 meses, marca `ultima_uso` antiga e considera arquivar.

## Quem pode ler este arquivo

- Duda 🎸 — leitura/escrita
- Rodrigo (humano) — sempre
- Raul 🔍 — pode ler (precisa pra análise de performance de copy), mas não escreve
- Outros agentes — não. Beto recebe copy pronto via Rodrigo, não consulta biblioteca direto.

---

## Entradas

<!-- Templates vão sendo adicionados aqui conforme padrão se consolida em posts-aprovados.md -->
<!-- Formato: usar schema acima. Manter ordenado por categoria → tipo_peca → tag_evento. -->
