# Hook: activity-log

> Status: **especificado, não implementado**. Ativar quando rodar Slice 2 do cockpit.

Hook interno do runtime OpenClaw que intercepta eventos cross-fronteira e
escreve em `workspace/agentes/<role>/activity.jsonl`. Idempotente, append-only.

## Ativação

Em `~/.openclaw/openclaw.json`:

```json
{
  "hooks": {
    "internal": {
      "entries": {
        "activity-log": { "enabled": true }
      }
    }
  }
}
```

## Eventos capturados

Disparado pra todo evento que cruza fronteira de agente:

| Tipo | Dispara quando |
|------|---------------|
| `cron_fire` | um cron do agente roda (sucesso ou falha) |
| `handoff` | agente A entrega contexto pra agente B |
| `escalation` | agente delega pra Rodrigo ou pra outro agente acima |
| `alert` | agente detecta variação anormal e empurra |
| `human_decision` | Rodrigo aprova/rejeita/edita item da inbox |

## Schema do `.jsonl`

Cada linha é um JSON object:

```json
{
  "ts": "2026-05-08T16:00:00-03:00",
  "agent_from": "beto",
  "agent_to": null,
  "type": "cron_fire",
  "payload": { "job": "lembrete-lista", "note": "..." },
  "status": "ok"
}
```

Campos:

- `ts` — ISO8601 com timezone (sempre `-03:00` Brasília).
- `agent_from` — agente origem (id canônico). `null` se evento interno do runtime.
- `agent_to` — agente destino. `null` quando o evento é "broadcast" (cron pra grupo) ou interno.
- `type` — um dos 5 tipos acima.
- `payload` — objeto livre, varia por tipo. Sem PII desnecessária.
- `status` — `ok` \| `failed` \| `partial`.

## Roteamento

O hook escolhe o `.jsonl` de destino baseado em `agent_from`:

- `agent_from: "beto"` → `workspace/agentes/promoters/activity.jsonl`
- `agent_from: "lia"` → `workspace/agentes/atendimento/activity.jsonl`
- `agent_from: "duda"` → `workspace/agentes/marketing/activity.jsonl`
- `agent_from: "tomas"` → `workspace/agentes/financeiro/activity.jsonl`
- `agent_from: "gil"` → `workspace/agentes/eventos/activity.jsonl`
- `agent_from: "raul"` → `workspace/agentes/intel/activity.jsonl`
- `agent_from: "jarbas"` ou `null` → `workspace/agentes/jarbas/activity.jsonl` (criar dir se virar relevante)

## Não é responsabilidade do hook

- Compactar / rotacionar o log (vira problema quando passar de 100MB por agente).
- Filtrar dado sensível — agente é responsável por não colocar PII no `payload`.
- Garantir entrega remota — é log local. Backup/sync entram em outra fase.

## Como testar (depois de ativar)

```bash
# disparar cron manual e olhar a última linha
openclaw cron run beto-ranking-segunda
tail -1 workspace/agentes/promoters/activity.jsonl
```
