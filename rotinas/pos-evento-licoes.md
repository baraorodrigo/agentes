# Rotina: Lições pós-evento

- **Cron:** `0 14 * * *` — todo dia 14h Brasília. Roda silenciosa se não há evento de 2 dias atrás OU se Tomás/Raul ainda não fecharam.
- **Agente:** Gil 🎪 (eventos)
- **Destino:** DM Rodrigo + escrita em `workspace/memory/lessons.md`
- **Skill orquestrada:** `pos-evento-licoes`

> **Decisão de design:** rotina é cron D+2 14h (não sob demanda puro). Justificativa abaixo.

## Por que cron D+2 14h e não sob demanda

A skill **suporta pull do Rodrigo** ("lições do [evento]"), mas o cron D+2 garante que **toda lição é registrada** mesmo sem Rodrigo perguntar. Sem o cron, lições viram esporádicas e o `memory/lessons.md` perde valor estatístico ao longo do tempo.

D+2 (não D+1) porque:
- D+1 11h é o Tomás (comissão)
- D+1 11h+ é o Raul (análise)
- D+2 14h dá margem operacional pra ambos finalizarem
- Atropelar antes deles → faltam dados, lição sai pela metade

Convivência com cron 14h do checklist (`checklist-dia-evento.md`): ambos rodam às 14h mas em datas diferentes (checklist roda quando hoje é evento; pos-evento-licoes roda quando hoje-2 foi evento). Não conflitam — Gil identifica qual disparo aplica baseado em `events.md`.

## Prompt

Você é o Gil. 14h, hora de conferir se algum evento de 2 dias atrás precisa de lição:

1. Calcula `data_alvo = hoje - 2 dias`
2. Lê `workspace/memory/events.md`, filtra entradas com `tipo: evento` E `data == data_alvo`
3. **Sem evento na data** → sai silencioso. Termina.
4. Tem evento → checa pré-requisitos:
   - `comissoes_calculadas: true` (Tomás fechou)?
   - `analise_pos_evento: true` (Raul rodou)? Verifica em `agentes/intel/memory/relatorios.md` se há entrada `tipo: pos_evento` correspondente.
   - Se ambos prontos → segue passo 5
   - Se algum faltando → flag pro Jarbas: "Aguardando Tomás/Raul fechar [evento]. Re-tento amanhã 14h." e sai. Cron D+3, D+4, D+5 retomam. Se D+5 e ainda não fechou → escala: "Pós-evento [evento] travado há 5 dias. Quer que eu peça atualização?"
5. Roda skill `pos-evento-licoes`:
   - Agrega input: Tomás (`memory/events.md`), Raul (`agentes/intel/memory/relatorios.md`), próprias (`fornecedores.md`, `eventos-privados.md`, `events.md.checklist_14h`)
   - Estrutura cada lição: observação + hipótese + ação pra próximo
   - Append entrada em `workspace/memory/lessons.md` com schema do PLAYBOOK
   - Atualiza memórias auxiliares se aplicável (`fornecedores.md` reputação; `templates-evento.md` ajustes)
6. DM resumo curto (5 bullets) pro Rodrigo

## Formato esperado

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

## Tratamento de resposta do Rodrigo

| Resposta | Ação Gil |
|----------|----------|
| "OK" / "Anotado" | Sem ação extra; lição já tá em `lessons.md` |
| "Discordo de [X]" | Atualiza entrada em `lessons.md` com nota "Rodrigo discorda: [motivo]". Lição fica registrada mas com flag de revisão |
| "Bana o fornecedor [X]" | Atualiza `agentes/eventos/memory/fornecedores.md` `status: banido` + nota com timestamp e motivo |
| "Vamos investigar [Y] mais a fundo" | Sinaliza Raul via Jarbas pra investigação cruzada (sai do escopo da lição rotineira) |
| Silêncio | Normal. Lição registrada, segue. |

## Casos especiais (silenciosos)

- Evento sem nada digno de lição (rotina ok) → registra entrada mínima + DM curto: "Pós-evento [nome] sem destaque. Lição rotineira salva."
- Tomás flagou comissão > 12% → vira lição automática sobre estrutura de comissão pro tipo de evento
- Raul não rodou (handoff Jarbas falhou) → lição com lacuna explícita: "Padrões: análise Raul ausente. Lição com base só em Tomás + operacional."
- Evento privado → adiciona seção "Cliente" (aceitou bem? volta? reclamação?) **sem revelar margem**
- Múltiplos eventos no mesmo dia → 1 lição agregada com sub-bullets por evento
- Evento cancelado → não roda. `cancelado: true` em `events.md` faz Gil pular.

## Privacidade

- DM Rodrigo apenas. Lições têm referência a fornecedor, atração e cliente.
- `lessons.md` é leitura geral pro Jarbas (cita lição em briefing) e Raul (base estatística). **Não pode ser referenciada com nome de fornecedor/cliente em mensagem pública.**

## NÃO faz

- Não repete análise do Raul nem cálculo do Tomás — agrega e operacionaliza
- Não revela faturamento/margem em valor absoluto no DM (fica no Tomás)
- Não julga decisão estratégica (tipo de evento, atração escolhida) — observa resultado
- Não força lição quando evento foi rotineiro — registra mínimo, segue
- Não edita `lessons.md` retroativamente — entrada nova sempre, com `registrado_em` próprio
