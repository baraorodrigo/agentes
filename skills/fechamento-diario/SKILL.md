---
name: fechamento-diario
description: |
  Fechamento financeiro diário do El Coyote. Use SEMPRE que o usuário pedir "fechamento de ontem",
  "como foi ontem", "resumo financeiro do dia", "faturamento de [data]", "quanto vendemos",
  ou quando o cron diário das 04h disparar a extração noturna. Orquestra a extração no Bar Fácil
  via skill extrair-barfacil, calcula variação vs média móvel 7 dias, persiste em memory/events.md
  e prepara mensagem pro Rodrigo às 09h. NUNCA dispara antes de 09h e NUNCA sem confirmação humana
  pra mensagens com alerta de variação >20%.
---

# Fechamento Diário — Tomás

Agente responsável: **Tomás 📊** (financeiro). Esta skill é a coluna vertebral dele: roda todo dia em 2 momentos (04h silencioso + 09h push).

## Quando disparo

- **Cron 04h** (`workspace/rotinas/fechamento-diario.md`) — silencioso, só extrai e salva
- **Cron 09h** — push da mensagem pro Rodrigo
- **Pull do Rodrigo** — "fechamento de ontem", "como foi", "resumo financeiro" → roda ad-hoc

## Pré-requisitos

- Usuário (Rodrigo) com Chrome logado em `bar.barfacil.com.br` (skill `extrair-barfacil` cobre)
- `memory/events.md` legível (histórico de fechamentos pra média móvel)
- Última extração noturna persistida (se rodando 09h, espera ter rodado 04h primeiro)

## Procedimento

### Fase 1 — Extração (04h, silencioso)

1. Chamar skill **`extrair-barfacil`** com filtro:
   - **Período**: ontem (00:00–23:59)
   - **Relatórios**: VENDAS POR PRODUTO + FINANCEIRO POR ATENDENTE + dashboard de monitoramento (ticket médio, total)
2. Extrair os campos:
   - `faturamento_total` (R$, exato)
   - `ticket_medio` (R$, exato)
   - `itens_vendidos` (n)
   - `top_3_produtos` (nome + R$ + qtd)
   - `top_3_atendentes` (nome + R$ + qtd)
3. Calcular vs média móvel 7 dias (lê últimas 7 linhas de `memory/events.md`):
   - `delta_fat_pct = (faturamento − media_7d) / media_7d × 100`
   - `delta_ticket_pct = idem`
4. Persistir nova linha em `memory/events.md` (formato em `memory/events.md` cabeçalho)
5. Se `|delta_fat_pct| > 20` OU `|delta_ticket_pct| > 15` → marca `alerta: true` no item, anexa hipótese padrão (regra em PLAYBOOK seção "Alertas automáticos")
6. **NÃO envia mensagem.** Sai silencioso.

### Fase 2 — Push 09h (push DM Rodrigo)

1. Lê última linha de `memory/events.md` (extração de 04h)
2. Monta mensagem pelo template:
   - **Sem alerta** → template "Fechamento de [data]" do PLAYBOOK
   - **Com alerta** → template "Fechamento de [data] — ⚠️ atenção" do PLAYBOOK
3. Envia DM pro Rodrigo (canal: WhatsApp privado)
4. **NÃO espera resposta** — segue o dia

### Fase 3 — Pull (ad-hoc)

Se Rodrigo perguntou direto, sem cron:

1. Identifica data (default: ontem; se Rodrigo disser "fechamento de [data]", usa essa)
2. Procura primeiro em `memory/events.md`. Se já extraído, devolve
3. Se não, roda Fase 1 só pra essa data
4. Devolve no template do PLAYBOOK

## Formato de saída

Ver PLAYBOOK seção "Rotina diária / 09h". Padrões obrigatórios:

- Valores em centavos exatos (`R$ 8.420,37`, **não** `~R$ 8.4k`)
- Fonte sempre identificada: `Fonte: Bar Fácil [data extração]`
- Comparação sempre presente: `vs média 7d: [+/-X%]`

## Erros comuns e recovery

| Sintoma | Causa provável | Ação |
|---------|----------------|------|
| Extração Bar Fácil retorna 0 | Sessão Chrome expirou | DM Rodrigo: "Bar Fácil pediu login. Pode logar e me avisar?" |
| `memory/events.md` vazio | Primeira execução | Pula cálculo de média móvel; manda fechamento sem comparação |
| Diferença extrema (>50%) | Erro de extração | DM Rodrigo: "Diferença de [X]% ontem — vou re-extrair antes de afirmar. 5min." |
| Cron 09h disparou sem extração 04h | Extração noturna falhou silenciosamente | Roda extração ad-hoc na hora; se falhar, DM "Extração 04h falhou. Sem fechamento hoje. Investigando." |

## Fontes que esta skill toca

- **lê**: `memory/events.md`, `memory/pendencias.md`
- **escreve**: `memory/events.md` (append)
- **chama**: skill `extrair-barfacil`

## Limites

- **Não** envia mensagem pra ninguém além do Rodrigo
- **Não** decide pagamento — só reporta
- **Não** projeta meses futuros (isso é skill `resumo-mensal`, ainda não implementada)
- **Não** investiga causa de variação — só anexa hipótese padrão; investigação real é via handoff Tomás → Raul (sob aprovação Rodrigo)
