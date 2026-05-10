---
name: calendario-editorial-semanal
description: |
  Calendário editorial semanal de marketing do El Coyote. Use SEMPRE que o usuário pedir
  "calendário da semana", "planejamento de posts", "que conteúdo fazer essa semana",
  "agenda de marketing", "o que postar de qua a dom", ou quando o cron de segunda 10h
  disparar. Cruza eventos da semana no PNE com tags de eventos passados em
  workspace/memory/events.md (sem expor R$), aplica preferências de tom em
  agentes/marketing/memory/preferencias-tom.md, e devolve 1 calendário rascunhado pro
  Rodrigo no Telegram topic Marketing. NUNCA posta direto. NUNCA dispara em outro canal
  além do topic Marketing. Saída sempre como rascunho aguardando aprovação.
---

# Calendário Editorial Semanal — Duda

Agente responsável: **Duda 🎸** (marketing). Roda toda segunda 10h ou sob demanda do Rodrigo.

## Quando disparo

- **Cron seg 10h** (`workspace/rotinas/calendario-editorial-semanal.md`)
- **Pull do Rodrigo** — "calendário da semana", "que posto essa semana", "monta agenda de conteúdo"

## Pré-requisitos

- Usuário (Rodrigo) com Chrome logado em `pensanoevento.com.br/sistema/` (skill `extrair-pne` cobre)
- `workspace/memory/events.md` legível (histórico pra puxar tags de eventos passados similares)
- `agentes/marketing/memory/preferencias-tom.md` legível
- `agentes/marketing/memory/templates-copy.md` legível

## Procedimento

### Fase 1 — Levantar eventos da semana

1. Calcular janela: **quarta atual até domingo** (5 dias). Se hoje é domingo, calcula próxima quarta.
2. Chamar skill **`extrair-pne`** com filtro:
   - **Período**: data inicial = quarta da semana, data final = domingo da semana
   - **Relatório**: lista de eventos ativos (nome, data, atração/line-up, preço base se público)
3. Se o PNE não tem evento na janela → segue Fase 2 só com posts de branding/vibe (sem evento âncora).

### Fase 2 — Cruzar com histórico (sem R$)

Para cada evento da semana:

1. Procurar em `workspace/memory/events.md` evento com mesma **tag** (Sertaneja Universitária, Rock Night, Pagode etc) ou nome similar.
2. Extrair **apenas**: público estimado, taxa de conversão, narrativa pública (ex: "esgotou", "lotou", "primeira edição"). **NÃO extrair faturamento, ticket médio, comissão.**
3. Marcar narrativa publicizável: ex `"última edição lotou"`, `"tradição que se consolidou"`, `"primeira vez no El Coyote"`.

### Fase 3 — Aplicar preferências de tom

Lê `agentes/marketing/memory/preferencias-tom.md`:

- Tamanho preferido por tipo (feed/story/reels)
- Palavras a evitar
- Palavras a priorizar
- Estilo de CTA
- Frequência preferida (ex: "Rodrigo prefere no máximo 1 post + 2 stories por dia")

Se `preferencias-tom.md` está vazio (primeiras semanas) → usa padrão neutro: 1 feed por evento + 2 stories de aquecimento por evento + 1 post de branding/vibe nos dias sem evento.

### Fase 4 — Montar tabela

Estrutura por dia útil de evento da semana:

```
[dia da semana] [dd/mm]:
  - Tipo: [feed | story | reels | grupo promoters]
  - Ângulo: [aquecimento | pré-evento | dia | pós | branding | aniversariante]
  - Narrativa: [1 linha — o que destacar]
  - CTA: [ação esperada do público]
```

Padrão por evento:

| Janela | Tipo | Ângulo |
|--------|------|--------|
| D-7 a D-3 | 1 feed + 2 stories | Aquecimento (anuncia line-up, save the date) |
| D-1 | 2 stories + 1 reels (se tiver vídeo) | Pré-evento (urgência, "amanhã") |
| D-0 (manhã/tarde) | 2 stories | Dia do evento ("hoje", clima) |
| D+1 | 1 feed | Pós (agradecimento, prova social) |

Dias sem evento: 1 post de branding/vibe (cardápio, frase, foto antiga, bastidor).

### Fase 5 — Rascunhar mensagem pro Rodrigo

Template de saída (Telegram topic Marketing):

```
🎸 Calendário da semana ([dd/mm] a [dd/mm])

Qua [dd/mm]: [tipo] — [ângulo curto]
Qui [dd/mm]: [tipo] — [ângulo curto]
Sex [dd/mm]: [tipo] — [ângulo curto] (evento [nome])
Sáb [dd/mm]: [tipo] — [ângulo curto] (evento [nome])
Dom [dd/mm]: [tipo] — [ângulo curto]

Eventos da semana:
- [data] — [nome] — [atração / line-up]
- [data] — [nome] — [atração / line-up]

Quer que eu rascunhe copy de algum agora? Me diz qual.
```

### Fase 6 — Aguardar resposta + handoff

Possíveis respostas do Rodrigo:

- **"Top, manda copy do de sexta"** → chama skill `gerar-copy-evento` para evento de sexta
- **"Tira o post de quarta"** → ajusta calendário, devolve nova versão
- **"Aprovado"** → registra em `posts-aprovados.md` como `tipo: calendario, status: aprovado, semana: [dd/mm-dd/mm]`
- **silêncio > 24h** → não re-envia. Anota em `posts-aprovados.md` como `status: pendente_sem_resposta`

## Formato de saída

Ver PLAYBOOK seção "Seg 10h — Calendário editorial semanal". Padrões obrigatórios:

- Sempre quarta-a-domingo (a semana operacional do El Coyote começa quarta)
- Sempre menciona eventos do PNE pelo nome+data (cross-reference por nome+data, IDs PNE/Bar Fácil divergem)
- **Nunca** inclui R$, margem, custo, comissão
- **Nunca** afirma número de público sem fonte (PNE)

## Erros comuns e recovery

| Sintoma | Causa provável | Ação |
|---------|----------------|------|
| PNE retorna 0 eventos | Pagina não estava em "Todos" ou janela errada | Re-roda extração com pagina=Todos explícito |
| `memory/events.md` vazio | Primeira execução do sistema | Pula Fase 2; calendário sai sem narrativa histórica |
| `preferencias-tom.md` vazio | Primeiras semanas | Usa padrão neutro, sem ajuste fino |
| Sessão Chrome PNE expirou | Login caiu | DM Rodrigo: "PNE pediu login. Pode logar e me avisar?" |
| Rodrigo pede "calendário do mês" | Skill é semanal, não mensal | Recusa polidamente: "Eu trabalho em janela semanal. Quer 4 calendários (1 por semana) ou ajusto pra um só agregado?" |

## Fontes que esta skill toca

- **lê**: `workspace/memory/events.md`, `agentes/marketing/memory/preferencias-tom.md`, `agentes/marketing/memory/templates-copy.md`
- **escreve**: `agentes/marketing/memory/posts-aprovados.md` (após resposta do Rodrigo)
- **chama**: skill `extrair-pne`, possivelmente `gerar-copy-evento` (se Rodrigo pedir copy direto)

## Limites

- **Não** posta nada. Não tem login de Instagram, não dispara WhatsApp, não envia pra grupo.
- **Não** decide horário de postagem definitivo — sugere com base em `preferencias-tom.md`, mas Rodrigo confirma.
- **Não** cria peça visual (flyer, arte). Só copy + planejamento. Visual é Rodrigo (ou skill futura).
- **Não** roda fora de segunda sem pull explícito. Cron é 1×/semana.
- **Não** usa dado de Bar Fácil direto. Histórico publicizável vem de `memory/events.md`, sem R$.
