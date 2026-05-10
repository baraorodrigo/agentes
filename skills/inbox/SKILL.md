---
name: inbox
description: |
  Cria item na Inbox de decisão do Rodrigo. Use SEMPRE que um agente precisar
  da decisão humana do Rodrigo pra continuar — aprovar copy, escolher entre
  opções, autorizar pagamento, confirmar atração de evento, etc. NÃO use pra
  notificação informativa (isso vai por canal próprio do agente). Inbox é
  reservado pra ITEM QUE BLOQUEIA o agente de continuar.

  Backend: database Notion "Inbox de decisão". Token reaproveitado de
  openclaw.json (skills.entries.notion.apiKey). Cockpit lê e renderiza nos 3
  lugares (Tela Hoje "Travado em ti" / Tela Estrutura "Acontecendo agora" /
  Tela Cabine card de execução).
---

# Skill: inbox

Cria item de decisão pro Rodrigo. Único caminho válido pros agentes pedirem
decisão — não tem POST direto pro Notion fora dessa skill.

## Quando usar

- Aprovar copy/post antes de Duda submeter (`agent: duda`, `priority: média`).
- Escolher entre 2+ atrações pra evento (Gil).
- Autorizar pagamento de fornecedor acima do limite (Tomás, `priority: alta`).
- Confirmar resposta a cliente em situação ambígua (Lia, `priority: alta`).
- Reagir a alerta financeiro de variação >20% (Tomás, `priority: crítica`).

## Quando NÃO usar

- Notificação rotineira ("ranking semanal pronto") — vai pelo canal do agente.
- Erro técnico ou exceção — vai pra log, não pra inbox humana.
- Pergunta especulativa do agente pra si mesmo — resolve internamente.

## Schema do item

Campos obrigatórios:

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `agent` | string | id do agente (`beto`, `lia`, `duda`, `tomas`, `gil`, `raul`, `jarbas`) |
| `priority` | enum | `baixa` \| `média` \| `alta` \| `crítica` |
| `description` | string | uma frase descrevendo a decisão pendente |
| `deeplink` | string | URL ou path absoluto que abre o contexto (`cockpit://cabine/tomas?item=<id>` ou link Notion da peça) |

Campos opcionais:

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `context` | string | parágrafo curto com o que o agente já tentou/decidiu |
| `options` | string[] | se a decisão é entre alternativas, lista delas |
| `expires_at` | ISO8601 | quando o item perde valor (ex: copy pra evento de hoje) |

## Validações

Antes de criar o item:

1. Todos os 4 campos obrigatórios presentes e não-vazios.
2. `agent` ∈ lista canônica dos 7 ids.
3. `priority` ∈ {`baixa`, `média`, `alta`, `crítica`}.
4. `description` ≤ 200 caracteres.
5. `deeplink` é URL absoluta (`http://`, `https://`, `cockpit://`, `notion://`) — sem path relativo.

Se faltar campo: o agente NÃO retry, ele LOGA o erro e segue. Item perdido é
melhor que item duplicado ou malformado.

## Output esperado da skill

```json
{
  "ok": true,
  "id": "<notion_page_id>",
  "url": "https://www.notion.so/<workspace>/<id>"
}
```

Em caso de falha (rate limit, validação, network):

```json
{
  "ok": false,
  "error": "rate_limited" | "invalid_payload" | "network" | "unauthorized",
  "detail": "<mensagem curta>"
}
```

## Boundaries

- Skill é o ÚNICO caminho de write na inbox. Cockpit lê via Notion API direto,
  mas writes vêm exclusivamente desta skill.
- Idempotência: se o agente passar o mesmo `description` + `agent` em < 60s,
  retornar o `id` do item existente em vez de duplicar.
- Não passa dado financeiro detalhado no `description` ou `context` se o
  destinatário humano puder ver de tela compartilhada — usar deeplink pra
  Cabine do Tomás onde o número aparece.
