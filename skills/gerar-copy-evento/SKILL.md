---
name: gerar-copy-evento
description: |
  Gera copy de divulgação de evento do El Coyote em 3 opções (A/B/C) com ângulos diferentes.
  Use SEMPRE que o usuário pedir "copy pra [evento]", "rascunha post do [evento]", "ideia
  de story pra [data]", "monta divulgação pra [evento]", "frase pra grupo de promoter sobre
  [evento]", ou quando outra skill (ex: lembrete-stories ou calendario-editorial-semanal)
  fizer handoff. Cruza dados do PNE (data, atração, line-up, preço) com narrativa de eventos
  passados em workspace/memory/events.md (sem expor R$) e preferências de tom em
  agentes/marketing/memory/preferencias-tom.md. Devolve 3 opções pro Rodrigo no Telegram
  topic Marketing. NUNCA posta. NUNCA expõe valor de faturamento. Sempre 3 opções, sempre
  rascunho aguardando aprovação.
---

# Gerar Copy de Evento — Duda

Agente responsável: **Duda 🎸**. Disparo: pull do Rodrigo, ou handoff de outra skill (calendário, lembrete).

## Quando disparo

- **Pull do Rodrigo** — "monta copy do [evento]", "rascunha post pra [data]", "ideia pra story de [evento]", "frase pro grupo de promoter sobre [evento]"
- **Handoff de `calendario-editorial-semanal`** — Rodrigo aprovou calendário e pediu "rascunha o de sexta"
- **Handoff de `lembrete-stories`** — Rodrigo respondeu "quero mais 2 opções"

## Pré-requisitos

- Evento existente no PNE (skill confirma cross-reference por nome+data)
- `workspace/memory/events.md` legível (pra puxar narrativa histórica)
- `agentes/marketing/memory/templates-copy.md` legível (biblioteca por categoria)
- `agentes/marketing/memory/preferencias-tom.md` legível

## Procedimento

### Fase 1 — Identificar evento + tipo de peça

Parse da pergunta do Rodrigo:

- **Evento**: nome+data. Se ambíguo ("o de sexta"), cruza com PNE pra próximo evento na data.
- **Tipo de peça**: feed Instagram | story Instagram | reels caption | grupo promoters | aniversariante | branding genérico.

Se Rodrigo não especificou tipo:
- Default por janela:
  - D-7 a D-3 do evento → **feed Instagram** (aquecimento)
  - D-1 → **story** (pré-evento)
  - D-0 manhã → **story** (dia do evento)
  - D+1 → **feed** (pós-evento)
- Se ainda ambíguo → DM Rodrigo: "Esse copy é pra feed, story ou grupo de promoter?"

### Fase 2 — Confirmar dados do evento no PNE

Chamar skill **`extrair-pne`** com filtro do evento:

- **Campos obrigatórios**: nome exato, data, horário de início, atração/line-up
- **Campos opcionais**: preço base (se for público), local (se diferente do El Coyote)

Se algum campo crítico faltar (ex: line-up vazio) → DM Rodrigo: "Pra montar copy do [evento] preciso confirmar: [campo faltando]. Tens?"

**Nunca inventa atração ou preço.** Se PNE não tem, não tem.

### Fase 3 — Puxar narrativa histórica (sem R$)

Lê `workspace/memory/events.md`:

1. Procura último evento com mesma **tag** (Sertaneja Universitária, Rock Night, Pagode SC, etc.) ou nome similar
2. Extrai **apenas**:
   - Público estimado (quantidade)
   - Taxa de conversão (% de presença)
   - Narrativa publicizável: ex `"esgotou em 3h"`, `"lotou"`, `"primeira vez no bar"`, `"3ª edição"`
3. **NÃO extrai**: faturamento, ticket médio, comissão, custo. Esses dados são do Tomás e jamais entram em copy publicado.

Conversão pra narrativa pública:

| Dado bruto (Bar Fácil/Tomás) | Narrativa publicizável (Duda) |
|------------------------------|-------------------------------|
| Faturamento alto | "lotação histórica", "edição que virou tradição" |
| Público > 250 | "casa cheia", "lotou" |
| Conversão > 80% | "todo mundo apareceu" |
| Edição passada similar com sucesso | "depois do que rolou no último, a gente sabe que vai bombar" |

### Fase 4 — Aplicar tom + templates

Lê `agentes/marketing/memory/preferencias-tom.md`:

- Palavras a evitar (ex: "galera", "pessoal", emoji em excesso)
- Palavras a priorizar (ex: "rolê", "encontro", "noite")
- Tamanho preferido por tipo
- Estilo de CTA preferido

Lê `agentes/marketing/memory/templates-copy.md`:

- Categoria + tipo → puxa templates aprovados anteriormente que casam
- Se vazio (primeiras execuções) → usa estrutura neutra do PLAYBOOK

### Fase 5 — Gerar 3 opções (A/B/C)

**Sempre 3 opções, sempre ângulos diferentes.** Padrão recomendado:

| Opção | Ângulo | Característica |
|-------|--------|----------------|
| **A** | Direto e curto | Fato + CTA. Sem floreio. |
| **B** | Storytelling | Narrativa histórica + emoção + CTA. |
| **C** | Gancho/pergunta | Abre com pergunta ou desafio. CTA implícito. |

Restrições por tipo:

| Tipo | Tamanho máx | Estrutura |
|------|-------------|-----------|
| Feed Instagram | ~200 chars | 1ª linha forte + corpo + CTA + hashtags |
| Story Instagram | ~80 chars | 1 frase de impacto |
| Reels caption | ~100 chars | Hook + CTA |
| Grupo promoters | ~300 chars | Por que vale a pena trazer público + argumento de venda (sem R$ de comissão) |
| Aniversariante | ~150 chars | Personalizado, sem expor lista nem nomes |

### Fase 6 — Hashtags

Sempre incluir base: `#ElCoyote #ElCoyotePub #ImbitubaNightLife #RockBar`

Mais 1 ou 2 do tema do evento, ex:
- Sertaneja → `#SertanejoUniversitario #SertanejoSC`
- Rock → `#RockNight #RockBar`
- Pagode → `#PagodeSC #PagodeImbituba`

### Fase 7 — Enviar pro Rodrigo

Template de saída (Telegram topic Marketing):

```
🎸 Copy pro [nome do evento] — [tipo de peça]

A) [opção curta e direta]

B) [opção com storytelling]

C) [opção com gancho/pergunta]

Hashtags sugeridas: [hashtags base + tema]

Qual tu curte? Posso ajustar tom também.
```

### Fase 8 — Registrar em memória

Append em `agentes/marketing/memory/posts-aprovados.md`:

```yaml
- id: post-XXX
  evento: "[nome+data]"
  tipo: "[feed|story|reels|grupo|...]"
  opcoes_geradas: 3
  opcao_A: "[texto]"
  opcao_B: "[texto]"
  opcao_C: "[texto]"
  status: pendente
  criado_em: ISO8601
```

Quando Rodrigo responde:

- **"A" (ou B/C)** → atualiza `status: aprovado` + `escolha: A`. Se essa categoria/tipo teve aprovação 3× seguidas com mesmo ângulo, considera atualizar `templates-copy.md`.
- **"A com [edição]"** → `status: aprovado_editado` + `versao_final: "[texto editado]"` + nota com diff curto.
- **"refaz"** ou **"nenhum"** → `status: recusado`. Se motivo dado, registra. Roda Fase 5 de novo com ajuste.
- **silêncio > 24h** → mantém `status: pendente`. Não re-envia.

## Casos especiais

| Caso | Como Duda trata |
|------|-----------------|
| Evento sem line-up confirmado | Não rascunha copy de aquecimento. DM: "Falta line-up do [evento]. Confirma pra eu rascunhar?" |
| Evento privado / fechado | Recusa: "Esse é privado. Copy de evento privado não vai pra rede pública. Quer texto pra convidar especificamente?" |
| Aniversariante específico (nome) | Pede confirmação: "Pode usar o nome do/a [pessoa] no copy ou prefere genérico?" |
| Rodrigo pede "copy igual ao do último Rock Night" | Lê `templates-copy.md` por tag, devolve template + 2 variações. Se não tem registro, DM: "Não tenho template salvo desse tipo ainda. Posso rascunhar do zero — 3 opções." |
| Rodrigo pede copy mas não tem evento marcado | Sugere copy de branding/vibe. Não inventa evento. |
| Evento com R$ envolvido (ex: "esse vendeu R$ 12k, capricha") | Confirma: "Recebi o contexto do faturamento. Vou usar narrativa de 'lotação' e 'edição que pegou' — sem cravar valor. OK?" |

## Privacidade dura

- **Nunca** R$ no copy publicado. Mesmo se Rodrigo deu o número, vira "lotação"/"esgotou"/"casa cheia".
- **Nunca** dado de promoter individual ("Natan trouxe 47 pessoas") em copy.
- **Nunca** lista de aniversariantes em copy. Se evento de aniversário, copy é genérico ("hoje tem aniversariante na casa") ou personalizado por pessoa com permissão dela.
- **Nunca** menciona outro estabelecimento por nome (concorrência) em copy.

## Erros comuns

| Sintoma | Causa | Ação |
|---------|-------|------|
| 3 opções saíram parecidas | Faltou diferenciar ângulo | Re-gera com prompt explícito de ângulos A/B/C diferentes |
| Copy estourou tamanho | Tipo errado escolhido | Re-corta pro tamanho do tipo + DM "Reduzi pra caber em story, mantenho a essência" |
| Copy citou valor R$ | Bug de filtro | DM Rodrigo "Saiu valor R$ no rascunho — refazendo sem isso" + corrige |
| Hashtags duplicadas | Template antigo + tema | Dedup automático antes de enviar |

## Fontes que esta skill toca

- **lê**: `workspace/memory/events.md`, `agentes/marketing/memory/templates-copy.md`, `agentes/marketing/memory/preferencias-tom.md`
- **escreve**: `agentes/marketing/memory/posts-aprovados.md`, `agentes/marketing/memory/templates-copy.md` (quando padrão se consolida)
- **chama**: skill `extrair-pne`

## Limites

- **Não** posta nada. Sem login de Instagram, sem API.
- **Não** envia pra grupo de promoter direto. Material pro grupo passa por Rodrigo aprovar, depois Beto dispara.
- **Não** envia pra cliente direto. Atendimento é Lia.
- **Não** cria flyer/arte/visual. Só copy.
- **Não** consulta Bar Fácil. Faturamento é só do Tomás. Copy publicado nunca tem R$.
- **Não** menos de 3 opções. Se contexto for fraco demais pra 3, devolve 1 + pede mais info: "Só consegui 1 opção forte sem mais contexto. Quer me passar [X] pra eu fazer mais 2?"
