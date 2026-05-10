---
name: checklist-operacional-dia
description: |
  Checklist operacional do dia-do-evento pelo Gil. Use SEMPRE que o cron diário 14h
  disparar (verifica se hoje é dia de evento) ou quando Rodrigo perguntar "checklist
  de hoje", "tá tudo pronto pro [evento]?", "como tá o dia?". Lê workspace/memory/events.md
  filtrando entradas com data == hoje, monta checklist por área (atração, som, bar,
  segurança, lista PNE) e DM Rodrigo. Silencioso se não tem evento hoje. Hora 14h é
  CRÍTICA — dá tempo do Rodrigo agir se algo tá faltando.
---

# Checklist Operacional do Dia — Gil

Agente responsável: **Gil 🎪**. Disparo: cron diário 14h Brasília, ou pull do Rodrigo.

## Quando disparo

- **Cron diário 14h** (`workspace/rotinas/checklist-dia-evento.md`) — janela escolhida pra dar tempo de reação
- **Pull do Rodrigo** — "checklist de hoje", "tá tudo pronto?", "como tá o dia?"

## Por que 14h e não outro horário

- Mais cedo (8h-12h): info ainda chegando, fornecedor não respondeu, equipe acordando
- 14h: maioria das pendências do dia já tem retorno; ainda dá tempo de ação corretiva
- Mais tarde (16h+): tarde demais pra ligar pra fornecedor de som ou trocar segurança que furou

## Pré-requisitos

- `workspace/memory/events.md` com evento de hoje populado
- `agentes/eventos/memory/fornecedores.md` lido pra status de cada fornecedor envolvido
- Skill `extrair-pne` operacional (Chrome logado) — pra puxar lista atualizada

## Procedimento

### Fase 1 — Detecção

Cron 14h:

1. Lê `workspace/memory/events.md`, filtra entradas com `data == hoje` E `tipo: evento`
2. **Sem evento hoje** → sai silencioso. Termina.
3. Tem evento → segue Fase 2

Pull:

1. Considera evento de hoje. Se não existe, pergunta: "Não tô vendo evento hoje em events.md. Confirmas?"

### Fase 2 — Coletar status de cada área

Pra cada área crítica, levantar status:

**Atração** (de `events.md` da entrada):
- [ ] Atração confirmou chegada?
- [ ] Soundcheck agendado e horário definido?
- [ ] Rider recebido e itens em mãos?
- [ ] Contato direto da atração disponível?

**Som & luz** (cross-ref `fornecedores.md`):
- [ ] Equipe técnica confirmada (nome + horário de chegada)?
- [ ] Equipamento já no local ou hora de chegada agendada?
- [ ] Furou alguma coisa do rider técnico?

**Bar/estoque** (info do Rodrigo ou registro interno):
- [ ] Cerveja / chopp / destilado conferido vs estimativa de público?
- [ ] Gelo encomendado (se evento grande)?
- [ ] Equipe escalada confirmada (bartenders, garçons)?

**Segurança** (cross-ref `fornecedores.md`):
- [ ] Equipe confirmada (N pessoas escaladas)?
- [ ] Briefing de porta combinado (regras de entrada, lista, idade)?
- [ ] Contato direto do líder de segurança?

**Lista PNE** (skill `extrair-pne`):
- Inseridos totais
- Convertidos esperados (estimativa baseada em conversão histórica do tipo de evento)
- Aniversariantes confirmados (do dia)
- Mesas/lounges vendidas

### Fase 3 — Identificar furos

Pra cada item ⚠️ (não confirmado, atrasado ou problemático), ele entra no topo da mensagem como "ATENÇÃO" antes do checklist completo, com sugestão de ação.

Critério de "furo":

- Item crítico (atração, som, segurança) sem confirmação **a 4h ou menos do evento começar**
- Rider com item faltando que ainda não tem alternativa
- Lista PNE muito abaixo da média (ex: -50% vs evento similar)
- Fornecedor não responde mensagens há > 24h

### Fase 4 — Montar mensagem

Template (do PLAYBOOK seção "14h — Checklist operacional"):

```
🎪 Hoje é dia: [nome] — abre [horário]

Checklist (atualizado [hh:mm]):

Atração:
- [✅/⚠️/❌] Confirmada chegada (horário previsto: [HH:MM])
- [...] Soundcheck agendado: [HH:MM]
- [...] Rider entregue / em mãos

Som & luz:
- [...] Equipe técnica confirmada
- [...] Equipamento no local

Bar:
- [...] Estoque conferido
- [...] Equipe escalada confirmada

Segurança:
- [...] Equipe confirmada (N pessoas)
- [...] Briefing de porta combinado

Lista PNE:
- Inseridos: [N] | Convertidos esperados: ~[N]
- Aniversariantes: [N] confirmados

⚠️ ATENÇÃO:
- [item furando + ação sugerida]

Tudo ok? Se algo trava, me dá um toque que ajusto.
```

Convenção de status:
- ✅ confirmado e ok
- ⚠️ pendente mas ainda dentro da janela
- ❌ pendente fora da janela (precisa ação imediata)

### Fase 5 — Persistir

1. Append em `workspace/memory/events.md` na entrada do evento: `checklist_14h: ISO8601` + array de itens furando
2. Se tem item ❌, adiciona em `workspace/memory/pending.md` com `responsavel: rodrigo` e prazo "antes do evento começar"

### Fase 6 — Re-check opcional

Se Rodrigo responde com "vou resolver" ou "[item] ok agora", Gil pode rodar mini-update curto (15-30min depois) só com os itens que estavam ❌:

```
🎪 Update [evento]:
✅ Segurança confirmada (Marcos respondeu)
✅ Soundcheck agendado 19h

Restante segue ok.
```

Não automatizado — Gil decide se vale o follow-up baseado na resposta do Rodrigo.

## Casos especiais

| Caso | Como Gil trata |
|------|----------------|
| Atração cancelou no dia | ❌ no topo + DM imediata "Atração cancelou. Plano B?" — não espera 14h, Gil dispara assim que descobre |
| Segurança furou | ❌ no topo com sugestão de fornecedor alternativo de `fornecedores.md` |
| Lista PNE com 0 ainda em dia de evento | Cruza com Beto via Jarbas: "Beto, lista do [evento] tá zerada. Promoters precisam ativar." (Gil informa, Beto age) |
| Evento privado | Checklist usa template de `templates-evento.md` correspondente; itens podem variar (ex: privado não tem lista PNE) |
| Múltiplos eventos no mesmo dia | Mensagem agrupada, sub-seção por evento; sequência cronológica |
| Cron rodou mas nenhum evento hoje | Silencioso. Gil não dispara mensagem só pra dizer "nada hoje" |

## Privacidade

- DM Rodrigo apenas. Checklist tem contato de fornecedor — não vai pra grupo.
- Lia pode receber checklist de privado se Rodrigo autorizar (caso o cliente esteja perguntando "tá tudo pronto?") — Gil monta versão filtrada (sem cachê, sem custo, só status operacional).

## Erros comuns

| Sintoma | Causa | Ação |
|---------|-------|------|
| Checklist disparou sem ter evento hoje | Bug de detecção de data | Verifica timezone (cron deve estar em UTC-3, conversão na VPS) |
| Status do fornecedor desatualizado | `fornecedores.md` não foi atualizado quando Rodrigo confirmou | Gil flag: "Quem confirmou [fornecedor]? Atualizo o status?" |
| Furos detectados não são reais (Rodrigo já resolveu) | Skill leu antes de Rodrigo atualizar evento | Re-roda extração se Rodrigo pedir |
| PNE expirou sessão Chrome | Sessão noturna venceu | DM "Bar Fácil/PNE pediu login. Pode logar e me avisar?" e segue checklist sem dado de PNE |

## Fontes que esta skill toca

- **lê**: `workspace/memory/events.md`, `agentes/eventos/memory/fornecedores.md`, `agentes/eventos/memory/templates-evento.md`, PNE via `extrair-pne`
- **escreve**: `workspace/memory/events.md` (campo `checklist_14h`), `workspace/memory/pending.md` (append se ❌)
- **chama**: `extrair-pne`

## Limites

- **Não** liga ou manda mensagem pra fornecedor diretamente — só sinaliza pendência pro Rodrigo
- **Não** confirma item por conta própria — todo ✅ veio de Rodrigo ou de info já registrada em `events.md`/`fornecedores.md`
- **Não** mostra cachê ou custo — área financeira é Tomás
- **Não** acompanha o evento em tempo real durante a noite (essa é fase futura, hoje fica em "evento começou, eu paro")
