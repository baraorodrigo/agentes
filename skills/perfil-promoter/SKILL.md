---
name: perfil-promoter
description: |
  Perfil analítico de um promoter do El Coyote pelo Raul. Use SEMPRE que Beto convocar via
  Jarbas, ou pull "como tá o [promoter]", "perfil do [promoter]", "[promoter] tá caindo?".
  Cruza PNE (inseridos × convertidos × taxa por evento) com Bar Fácil (ticket médio do
  público trazido — proxy via evento se cruzamento por nome falhar) e compara com a média
  da casa. Devolve perfil + sugestão de ação pro Beto. NUNCA fala direto com promoter —
  sempre via Beto, que filtra o que mostra. NUNCA expõe comparativo individual com outros
  promoters pro promoter.
---

# Perfil de Promoter — Raul

Agente responsável: **Raul 🔍**. Skill convocada via handoff — Beto pergunta, Jarbas roteia, Raul responde, resposta volta via Jarbas pro Beto.

## Quando disparo

- **Handoff Beto → Jarbas → Raul** — "como tá o [promoter] nas últimas 4 semanas?"
- **Pull do Rodrigo via Jarbas** — "Rodrigo quer entender o caso do [promoter]"
- **Trigger automático** (futuro): se relatório semanal flagar promoter caindo 3 semanas seguidas, Raul roda perfil dele e oferece pro Beto via Jarbas

## Pré-requisitos

- Promoter ativo e cadastrado em `workspace/memory/people.md`
- Pelo menos 2 eventos no histórico do promoter na janela pedida
- PNE acessível (`extrair-pne` operacional)
- Bar Fácil acessível (pra ticket médio dos eventos onde o promoter atuou)

## Procedimento

### Fase 1 — Definir janela e parâmetros

Default:
- Janela: últimas 4 semanas
- Comparação 1: 4 semanas anteriores (mesmo promoter)
- Comparação 2: média de todos os promoters ativos na janela

Beto pode pedir janela diferente (8 semanas, mês X) — usa a pedida.

### Fase 2 — Coletar dados do promoter

**Por evento na janela** (extraído via `extrair-pne` filtrado por `Inserido por: <promoter>`):

```
inseridos_por_evento = { evento_id: N }
convertidos_por_evento = { evento_id: N }
aniversariantes_por_evento = { evento_id: N }
mesas_atribuidas = { evento_id: N }   # se PNE expõe
```

**Cruzamento com Bar Fácil**:

Tentativa 1 — match por nome (cliente que chegou pelo promoter X):
- Lê lista de nomes do promoter no PNE
- Procura mesmo nome em "atendido por" / cadastro de venda no Bar Fácil
- Calcula ticket médio só desse subset

Tentativa 2 (fallback) — proxy por evento:
- Se Bar Fácil não tem cadastro nominal: usa ticket médio geral do evento como proxy do ticket do público trazido pelo promoter
- Marca campo `ticket_proxy: true` no resultado

### Fase 3 — Agregados na janela

```
total_inseridos    = sum(inseridos_por_evento)
total_convertidos  = sum(convertidos_por_evento)
taxa_conversao    = total_convertidos / total_inseridos
ticket_publico    = avg(ticket_por_evento)   # ou proxy
volume_aniversariantes = sum(aniversariantes_por_evento)
eventos_atuou      = count(eventos)
```

### Fase 4 — Comparar

**Vs média da casa** (mesma janela, todos os promoters ativos):
- delta_volume = (inseridos_promoter / eventos_promoter) − (inseridos_media / eventos_media)
- delta_conversao = taxa_promoter − taxa_media (em pontos percentuais)
- delta_ticket = ticket_promoter − ticket_media

**Vs própria janela anterior**:
- mesmas métricas, comparando com 4 semanas anteriores
- tendência: subindo / estável / caindo

### Fase 5 — Caracterizar perfil

Tipologia (usar como referência, não rótulo final):

| Padrão | Caracterização |
|--------|----------------|
| Volume alto + conversão baixa | "infla lista, não traz público" — checar se é meta-only ou se tem público real |
| Volume baixo + conversão alta | "qualidade alta, baixa escala" — bom candidato a aumentar inputs |
| Ticket alto + volume médio | "público bom" — tipo de público que rende — proteger |
| Ticket baixo + volume alto | "público de saideira" — converte mas não consome — entender mix |
| Tudo abaixo da média | "caindo" — checar se tá em ciclo ruim ou se desengajou |

### Fase 6 — Sugestão de ação (pro Beto)

Acionável, baseada no padrão. Exemplos:

| Caracterização | Ação sugerida |
|----------------|---------------|
| Caindo 3+ semanas | Beto chama 1-1: "tá rolando algo?" antes de cobrar performance |
| Volume alto / conversão baixa | Beto explica meta com critério mais rigoroso (não conta nome só) |
| Ticket alto / volume médio | Beto reforça público — convidar pra eventos premium |
| Subindo + acima da média | Reconhecimento público no grupo (mantém energia) |
| Subiu de repente sem padrão claro | Investigar: pode ter sido aniversariante grande / única lista de amigos |

### Fase 7 — Persistir + devolver

1. Append em `agentes/intel/memory/relatorios.md`:
   ```yaml
   - ts: ISO8601
     tipo: perfil_promoter
     promoter: <nome>
     janela: "YYYY-MM-DD a YYYY-MM-DD"
     caracterizacao: "..."
     sugestao_acao: "..."
     entregue_a: beto (via jarbas)
   ```

2. Se caracterização mudou vs último perfil do mesmo promoter, marca `mudanca_perfil: true` — sinal pra Beto reagir.

3. Devolve estrutura pro Jarbas (que repassa pro Beto):

```jsonc
{
  "promoter": "Natan",
  "janela": "2026-04-13 a 2026-05-10",
  "volume": { "inseridos": 187, "convertidos": 124, "vs_media": "+12%" },
  "conversao": { "taxa": 0.66, "vs_media_pp": +4 },
  "ticket": { "valor": 71.20, "vs_media_pct": +6, "proxy": false },
  "tendencia": "subindo",
  "caracterizacao": "público bom — ticket alto e volume acima da média",
  "sugestao_acao": "convidar pra próximo evento premium; reforço público no grupo",
  "mudanca_perfil": false,
  "fonte": "PNE [data] + Bar Fácil [data]"
}
```

## Formato em entrega via Jarbas (texto pro Beto)

```
🔍 Perfil — [promoter] (últimas 4 semanas)

Volume: [N inseridos / N convertidos] — [acima/abaixo] da média ([+/-X%])
Conversão: [X%] (média da casa: [Y%], [+/-pp])
Ticket do público dele: R$ [valor] (média: R$ [valor], [+/-X%]) [proxy se aplicável]
Tendência: [subindo/estável/caindo] vs 4 semanas anteriores

Caracterização:
[1 linha]

Sugestão (pro Beto, não pro promoter):
[ação concreta]
```

## Privacidade dura

- **Promoter NUNCA recebe esse perfil cru.** Beto filtra:
  - Promoter pode saber a tendência dele (subindo/caindo)
  - Promoter pode saber a sugestão de ação (sem ver os números comparativos)
  - Promoter NUNCA vê: ticket, conversão da casa, comparação com outros promoters
- **Outro promoter NUNCA vê esse perfil**, nem que pergunte.
- **Pull do próprio promoter pra Beto** ("como eu tô?") → Beto pode pedir perfil pro Raul, mas devolve pro promoter só o que cabe (ver privacidade)

## Quando NÃO disparar

- **Promoter com < 2 eventos na janela** → flag: "Base muito pequena pra perfil. Janela maior?"
- **Bar Fácil sem cruzamento nominal** → roda com `ticket_proxy: true`, marca explicitamente
- **PNE sem `Inserido por`** em parte da lista → reporta lacuna; perfil sai parcial

## Limites

- **Não** decide se promoter fica ou sai — observação + sugestão. Decisão é Rodrigo.
- **Não** revela tabela de comissão (escopo do Tomás)
- **Não** ranqueia promoter na frente de outro — perfil é individual, comparação é com a média (anônima), não com top1
- **Não** afirma intenção (ex: "ele tá enchendo lista de propósito") — só padrão observado

## Fontes que esta skill toca

- **lê**: `workspace/memory/events.md`, `workspace/memory/people.md`, `agentes/intel/memory/padroes.md`, `agentes/intel/memory/relatorios.md` (perfis anteriores do mesmo promoter)
- **escreve**: `agentes/intel/memory/relatorios.md`
- **chama**: `extrair-pne`, `extrair-barfacil`

## Erros comuns

| Sintoma | Causa | Ação |
|---------|-------|------|
| Conversão = 100% em janela curta | Lista pequena, todos converteram | Reportar como "amostra pequena, não conclusivo" |
| Ticket bate na média exata | Provavelmente caiu no fallback proxy | Marcar `ticket_proxy: true` no relatório |
| Promoter com nome ambíguo (2 promoters mesmo primeiro nome) | PNE cadastra nome completo? | Usar nome completo do `memory/people.md`, não primeiro nome |
| Mudança brusca de perfil sem evento óbvio | Pode ser feriado / clima / atração específica | Cruzar com `memory/events.md.observacao`; se nada óbvio, sinaliza "sem causa óbvia, vale 1-1" |
