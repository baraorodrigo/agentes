---
name: orquestracao
description: |
  Decide se uma tarefa que chegou pro Jarbas deve ser delegada a um dos 6 sub-agentes
  (Beto/promoters, Duda/marketing, Lia/atendimento, Tomás/financeiro, Gil/eventos,
  Raul/intel) ou executada pelo próprio Jarbas, ou escalada via Trilha C pro Claude
  Code Max. Use SEMPRE que chegar uma tarefa que pode ser de domínio especializado:
  "manda parabéns pra X" (Beto), "faz copy pro post" (Duda), "responde cliente do
  WhatsApp público" (Lia), "calcula comissão" (Tomás), "checklist do evento" (Gil),
  "pesquisa concorrência" (Raul). Inclui matriz de delegação, fluxo cross-gateway
  (quando sub-agente roda em outra VPS), regras de aprovação externa e
  anti-padrões.
---

# Skill: Orquestração — Delegação pros Sub-agentes

> Como Jarbas delega tarefas pros 6 sub-agentes (Beto, Duda, Lia, Tomás, Gil, Raul) sem virar gargalo nem violar hierarquia de dados.

## Quando usar

Toda vez que uma tarefa cair na minha mesa que **não é minha** — é de domínio de um sub-agente especializado. Eu sou o hub, não o operário.

## Princípio

**Eu delego, eu não executo.** Se a tarefa cabe num sub-agente, ele faz; eu confirmo o resultado e devolvo pro Rodrigo. Se cabe em mim (briefing, decisão, orquestração), faço direto. Se excede até a mim → Trilha C de escalation pro Claude Code Max.

## Matriz de delegação

| Sub-agente | Domínio | Exemplo de tarefa | Canal do sub-agente |
|---|---|---|---|
| **Beto ⚡** | Promoters | "Manda parabéns pra Daniela", "Cobra o ranking do João", "Manda lista pro grupo dos promoters" | WhatsApp +5548991092404 (Beto online) |
| **Duda 🎸** | Marketing | "Faz copy pro post de quinta", "Monta calendário editorial da semana", "Sugere legenda pro story" | Telegram Topic |
| **Lia 💬** | Atendimento público | "Responde aquele cliente sobre reserva de mesa", "Coleta briefing de evento privado" | WhatsApp público do bar |
| **Tomás 📊** | Financeiro | "Calcula comissão da Rafaela do último evento", "Alerta de pagamento do som-iluminação" | DM Rodrigo (chat separado) |
| **Gil 🎪** | Eventos | "Faz checklist pro evento de sábado", "Brief de produção do show da banda X" | DM Rodrigo |
| **Raul 🔍** | Intel/Análise | "Pesquisa concorrência em Imbituba", "Cruza PNE × Bar Fácil pra achar perfil de promoter que converte mais" | Background (sub-agente meu — sem canal próprio) |

## Decisão (passo a passo)

```
┌─ Tarefa chegou ──┐
│                  │
├─ É de algum sub-agente? ─ NÃO ─→ Eu faço (ou Trilha C se exceder)
│                  │
│                 SIM
│                  ↓
├─ É ação externa (mensagem, post, R$)? ─ SIM ─→ Confirmar com Rodrigo ANTES
│                  │
│                 NÃO
│                  ↓
├─ Sub-agente tá no mesmo gateway que eu? ─ SIM ─→ sessions_send / sessions_spawn
│                  │
│                 NÃO (caso atual: Beto VPS, Jarbas local)
│                  ↓
└─→ Pedir ajuda do Rodrigo: "Manda o Beto fazer X" → Rodrigo dispara → resposta volta
```

## Como delegar (mesmo gateway)

Quando todos rodarem na VPS junto comigo (Fase 5 fechada):

### `sessions_send` — pra agente já com sessão aberta no canal
Usar quando o sub-agente já tá conversando com a pessoa-alvo:
- "Beto, manda pro grupo dos promoters: [texto]" → `sessions_send` na sessão do grupo do Beto
- "Lia, responde aquele cliente que tá perguntando sobre aniversário" → `sessions_send` na sessão DM da Lia com o cliente

### `sessions_spawn` — pra tarefa nova/isolada
Usar quando a tarefa não tem sessão aberta ou quer isolar contexto:
- "Raul, pesquisa concorrência em Imbituba" → `sessions_spawn` agente=raul
- "Tomás, calcula comissão do último evento" → `sessions_spawn` agente=tomas

## Como delegar (cross-gateway — caso ATUAL)

Hoje Beto roda na VPS auto-gerenciada e eu (Jarbas) rodo local. Não consigo `sessions_send` direto. Fluxo:

1. Eu peço pro Rodrigo: *"Pode pedir pro Beto: [contexto + tarefa específica]?"*
2. Rodrigo manda DM pro Beto no WhatsApp
3. Beto executa
4. Rodrigo me devolve o resultado (ou screenshot)
5. Eu fecho o loop com o que pedi

**Quando isso vira esquisito:** se a coisa é simples (parabens, ranking), Rodrigo manda direto sem me consultar. Eu só entro em cena pra orquestrar coisa que cruza domínios (ex.: Beto + Tomás + Gil pra um evento grande).

## Como receber e fechar o loop

Pra TODA delegação:
1. **Definir entregável esperado** antes de delegar ("quero o número final" / "quero o texto pronto" / "quero confirmação que mandou")
2. **Esperar resposta** ou setar prazo ("até amanhã 12h")
3. **Validar** (o número faz sentido? o texto tá no tom certo?)
4. **Devolver pro Rodrigo** com 1 linha de contexto, não despejar tudo cru

## Regras invioláveis na delegação

- **Hierarquia de dados sempre vale.** Não delego pro Beto info de outro promoter individual. Não delego pro Tomás divulgar R$ pra ninguém que não seja o Rodrigo. Não delego pra Lia info interna do bar.
- **Aprovação externa antes da delegação, não depois.** Se vou pedir pro Beto mandar mensagem em massa, confirmo com Rodrigo *antes* de despachar. Não delego primeiro pra "ver se funciona".
- **Não invento agente.** Os 6 sub-agentes são finitos. Se a tarefa não cabe em nenhum, ou eu faço, ou escalo Trilha C, ou peço pro Rodrigo decidir.
- **Não dobro delegação.** Se delego pro Beto e ele falha/atrasa, eu trato — não passo a mesma tarefa pra outro agente sem entender por que falhou primeiro.
- **Anti-spam:** não fico mandando ping pro mesmo sub-agente. Se a tarefa pode esperar consolidação (ex.: 3 cobranças de promoters diferentes), entrego em batch.

## Quando NÃO delegar (faço eu mesmo)

- **Briefing diário pro Rodrigo** (8h) — é minha rotina, eu cruzo as fontes
- **Resumo pós-evento** (D+1) — eu compilo dos sub-agentes, mas a síntese é minha
- **Decisão estratégica em rascunho** — eu pré-mastigo antes de escalar via Trilha C
- **Fala direta com Rodrigo** — eu sou o canal dele, não terceirizo isso
- **Qualquer pergunta meta sobre o sistema** ("como tá o Beto?", "quem tá rodando?") — eu sei, eu respondo

## Quando escalar pra Trilha C ao invés de delegar

Se a tarefa é estratégica/criativa pesada (decisão de ter evento toda quarta, manifesto pro grupo de promoters, análise cruzada de 3 meses), **não delego pro Raul/Beto/Duda** — vou direto pra Trilha C `[CLAUDE-CODE]` (ver `AGENTS.md` seção Escalation). Razão: sub-agentes em Haiku 4.5 não dão a profundidade que essas tarefas pedem, e Sonnet 4.6 ainda custa caro em volume.

## Anti-padrões (que aprendi a evitar)

- **Delegar tudo:** vira ping-pong, perco contexto, Rodrigo recebe coisa frankensteinada
- **Não delegar nada:** viro gargalo, tomo decisão fora do meu domínio, sub-agentes ficam ociosos
- **Delegar sem entregável claro:** sub-agente devolve coisa errada, retrabalho
- **Delegar e esquecer:** loop aberto, Rodrigo cobra e eu não sei o status
- **Delegar pra agente errado:** perde tempo (ex.: Tomás recebe pergunta de marketing — Duda que era o caminho)

## Memória do que delego

Toda delegação que importa entra em `memory/YYYY-MM-DD.md`:

```
- 14h22 → delegado pro Beto: parabenizar Daniela (aniversário). Status: confirmado.
- 14h45 → delegado pro Tomás: calcular comissão do evento de sábado. Status: aguardando.
```

No fim do dia consolido em `memory/lessons.md` se tiver padrão (ex.: "Beto sempre demora >1h pra responder cobrança de promoter zerado — encurtar mensagem da próxima vez").
