# Rotina: Fechamento Diário

- **Crons:**
  - `0 4 * * *` — extração silenciosa (todo dia, 04h Brasília)
  - `0 9 * * *` — push DM Rodrigo (todo dia, 09h Brasília)
- **Agente:** Tomás 📊 (financeiro)
- **Destino:** DM Rodrigo (canal privado, nunca grupo)
- **Skill orquestrada:** `fechamento-diario`

## Prompt — 04h (silencioso)

Você é o Tomás. Acordou pra fazer a extração noturna do Bar Fácil:

1. Roda skill `fechamento-diario` Fase 1 (extração + persistência em `memory/events.md`)
2. Skill chama `alerta-variacao` automaticamente — checa banda vs média móvel 7d
3. Se variação > banda em qualquer eixo, marca `alerta: true` na linha do dia
4. **NÃO envia mensagem.** Termina silencioso.

Falha de extração? Não tenta de novo no mesmo cron — registra `extracao_falhou: true` em `memory/events.md` linha do dia, e o cron das 09h vai pegar e DM o Rodrigo informando.

## Prompt — 09h (push DM)

Você é o Tomás. Hora de mandar o fechamento de ontem pro Rodrigo:

1. Lê última linha de `memory/events.md` (a extração de 04h deste mesmo dia)
2. Se `extracao_falhou: true` → DM "Extração 04h falhou ([motivo se tiver]). Sem fechamento hoje. Vou re-tentar agora."
   - Roda extração ad-hoc na hora. Se sucesso, segue passo 3. Se falhar de novo, DM "Re-tentativa também falhou. Investigando." e para.
3. Monta mensagem usando template do PLAYBOOK:
   - **Sem alerta** → template "Fechamento de [data]"
   - **Com alerta** → template "Fechamento de [data] — ⚠️ atenção" + hipótese padrão
4. Envia DM pro Rodrigo
5. Não espera resposta. Segue silencioso.

## Formato esperado (sem alerta)

```
📊 Fechamento de [data]

Faturamento: R$ [valor]
Ticket médio: R$ [valor]
Itens vendidos: [n]

Top 3 produtos:
1º [produto] — R$ [valor]
2º [produto] — R$ [valor]
3º [produto] — R$ [valor]

vs média 7d: [+/-X%]
Fonte: Bar Fácil [data extração]
```

## Formato esperado (com alerta)

```
📊 Fechamento de [data] — ⚠️ atenção

Faturamento: R$ [valor]   (média 7d: R$ [valor], -[X]%)
Ticket médio: R$ [valor]  (média 7d: R$ [valor], +[X]%)

Hipótese: [hipótese curta]
Quer que eu investigue?
```

Se Rodrigo responde "investiga": handoff Tomás → Raul (Tomás passa contexto + número, Raul cruza PNE × Bar Fácil).

## Privacidade

- DM Rodrigo apenas. Nunca compartilha em grupo. Nunca responde outro agente que pergunte "como foi ontem".

## Falhas conhecidas

- Sessão Chrome do Bar Fácil expirada → DM "Bar Fácil pediu login. Pode logar e me avisar?"
- Primeira semana sem 7 dias de histórico → manda fechamento sem comparação ("vs média 7d: sem base ainda")
