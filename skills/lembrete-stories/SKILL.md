---
name: lembrete-stories
description: |
  Lembrete diário pré-evento pro Rodrigo postar story de aquecimento na véspera.
  Use SEMPRE que o cron diário das 18h disparar — a skill verifica se tem evento amanhã
  e só envia se houver. Se não tem evento em D+1, sai silencioso (sem mensagem). Também
  pode ser invocada por pull se Rodrigo perguntar "tem evento amanhã?", "preciso postar
  story?", "lembrete de pré-evento". Devolve 1 lembrete curto + 1 sugestão de frase pronta
  pro Rodrigo postar; se ele quiser mais opções, faz handoff pra skill gerar-copy-evento.
  NUNCA posta direto. NUNCA dispara em outro canal além do Telegram topic Marketing.
---

# Lembrete de Stories Pré-Evento — Duda

Agente responsável: **Duda 🎸**. Disparo: cron diário 18h, ou pull do Rodrigo.

## Quando disparo

- **Cron diário 18h** (`workspace/rotinas/lembrete-stories-pre-evento.md`) — silencioso se sem evento amanhã
- **Pull do Rodrigo** — "tem evento amanhã?", "preciso postar story?", "lembrete de pré-evento"

## Pré-requisitos

- Usuário (Rodrigo) com Chrome logado em `pensanoevento.com.br/sistema/` (skill `extrair-pne`)
- `workspace/memory/events.md` legível (pra puxar narrativa histórica)
- `agentes/marketing/memory/templates-copy.md` legível (categoria "pré-evento story")
- `agentes/marketing/memory/preferencias-tom.md` legível

## Procedimento

### Fase 1 — Verificar evento em D+1

1. Calcular **amanhã** (D+1) na timezone Brasília (UTC-3).
2. Chamar skill **`extrair-pne`** com filtro:
   - **Período**: data inicial = amanhã, data final = amanhã
   - **Relatório**: lista de eventos ativos
3. Resultado:
   - **0 eventos** → segue Fase 2A (saída silenciosa)
   - **1 evento** → segue Fase 2B (lembrete normal)
   - **2+ eventos** → segue Fase 2C (lembrete consolidado)

### Fase 2A — Sem evento amanhã (silencioso)

1. **NÃO envia mensagem.**
2. Append linha em `agentes/marketing/memory/posts-aprovados.md`:
   ```yaml
   - tipo: lembrete_silencioso
     data: YYYY-MM-DD
     motivo: "sem evento em D+1"
   ```
3. Sai. Cron de amanhã verifica de novo.

### Fase 2B — 1 evento amanhã

1. Cruza com `workspace/memory/events.md` pra puxar narrativa de evento similar passado (mesma tag), **sem expor R$**.
2. Lê `agentes/marketing/memory/templates-copy.md` categoria "pré-evento story".
3. Lê `agentes/marketing/memory/preferencias-tom.md`.
4. Gera **1 frase pronta** (não 3) — formato story curto, até 80 chars.
5. Monta mensagem:

```
🎸 Amanhã tem [nome do evento]. Hora de aquecer.

Sugestão de story pra hoje:
"[frase curta — 1 linha, energia, menciona local + horário]"

Quer 2 opções alternativas? Me chama.
```

6. Envia no Telegram topic Marketing.

### Fase 2C — 2+ eventos amanhã

Caso raro (evento dia + late night, por exemplo).

```
🎸 Amanhã rola 2 eventos:
- [horário] [nome 1]
- [horário] [nome 2]

Sugestão de story consolidado:
"[frase curta cobrindo os 2 ou destacando o principal]"

Quer copy separado pra cada um? Me chama.
```

Se Rodrigo pedir copy separado → handoff pra `gerar-copy-evento` (1 chamada por evento).

### Fase 3 — Aguardar resposta

Possíveis respostas do Rodrigo:

- **"Top, vou postar"** → registra `status: aprovado` em `posts-aprovados.md`
- **"Quero mais 2 opções"** ou **"alternativas"** → handoff pra `gerar-copy-evento` em modo "story rápido" (3 opções)
- **"Outro tom"** → re-roda Fase 2B com ajuste de tom (mais energético, mais íntimo, mais técnico, etc.)
- **"Cancelei o evento"** → DM: "Beleza, cancelo o lembrete. Atualiza no PNE pra parar de cair na minha radar." Anota em `posts-aprovados.md`
- **silêncio** → não re-envia. Próximo cron amanhã 18h verifica sozinho.

### Fase 4 — Registrar

Append em `agentes/marketing/memory/posts-aprovados.md`:

```yaml
- id: post-XXX
  tipo: lembrete_pre_evento_story
  evento: "[nome+data]"
  frase_sugerida: "[texto]"
  status: pendente | aprovado | recusado | upgrade_para_3_opcoes
  criado_em: ISO8601
```

## Formato de saída

Sempre curto. **Story pronto pra colar.** Não é a hora de longa estrutura — é véspera, Rodrigo precisa de algo rápido.

Restrições:
- **Tamanho da frase**: 80 chars max (story Instagram)
- **1 sugestão por padrão**, não 3 (3 é pra `gerar-copy-evento` pull explícito)
- **Sempre menciona**: nome do evento + horário + "El Coyote" ou local específico
- **Nunca**: R$, faturamento, comissão, dado de promoter individual
- **Hashtags**: opcional em story (story leva pouca hashtag). Se incluir, máximo 2.

## Erros comuns

| Sintoma | Causa | Ação |
|---------|-------|------|
| PNE retorna 0 eventos mas tinha um marcado | Evento não foi salvo no PNE ou data errada | DM Rodrigo: "Tu tinhas mencionado evento amanhã, mas PNE tá vazio. Confirma se foi cadastrado?" |
| Sessão Chrome PNE expirou | Login caiu | DM Rodrigo: "PNE pediu login pra eu checar amanhã. Loga e me avisa?" — não envia lembrete sem confirmar |
| Evento com nome ambíguo | 2 eventos com nomes parecidos | DM Rodrigo: "Tem 2 eventos amanhã com nomes próximos. Me confirma qual é o foco?" |
| Frase saiu genérica demais | `templates-copy.md` vazio + sem evento similar histórico | Manda mesmo, mas anota: "Primeira sugestão sem template — me dá feedback que aprendo" |
| Cron disparou 19h em vez de 18h | Timezone errada na VPS | Investigar `cron/duda-jobs.sh` e crontab — horário declarado é Brasília (UTC-3) |

## Fontes que esta skill toca

- **lê**: `workspace/memory/events.md`, `agentes/marketing/memory/templates-copy.md`, `agentes/marketing/memory/preferencias-tom.md`
- **escreve**: `agentes/marketing/memory/posts-aprovados.md`
- **chama**: skill `extrair-pne`. Possivelmente handoff pra `gerar-copy-evento` se Rodrigo pedir.

## Limites

- **Não** posta nada. Lembrete é sugestão, postagem é Rodrigo.
- **Não** dispara fora de 18h sem pull do Rodrigo.
- **Não** dispara mensagem em dia sem evento — saída silenciosa.
- **Não** é o lugar de gerar copy completo. Pra copy estruturado em 3 opções, é `gerar-copy-evento`.
- **Não** envia pra grupo de promoter, cliente, ou outro agente. Só Rodrigo no Telegram topic Marketing.
- **Não** consulta Bar Fácil. Histórico de evento vem só de `memory/events.md`, sem R$.
