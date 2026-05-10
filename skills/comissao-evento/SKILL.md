---
name: comissao-evento
description: |
  Cálculo de comissões pós-evento do El Coyote. Use SEMPRE que o usuário pedir "comissão do
  [evento]", "calcular comissão", "quanto vou pagar de promoter", "fecha as comissões",
  "comissão da [data]", ou quando o cron D+1 11h disparar após um evento. Cruza dados PNE
  (inseridos × convertidos por promoter) com a tabela de comissões em memory/comissoes.md
  e devolve total geral + breakdown por promoter — APENAS pro Rodrigo. NUNCA executa
  pagamento; só calcula e marca pendência em memory/pendencias.md aguardando aprovação.
---

# Comissão por Evento — Tomás

Agente responsável: **Tomás 📊**. Disparo: cron D+1 às 11h após cada evento, ou pull do Rodrigo.

## Quando disparo

- **Cron D+1 11h** após evento (`workspace/rotinas/comissao-pos-evento.md`)
- **Pull do Rodrigo** — "fecha comissão do [evento]", "quanto vou pagar de comissão", "comissão da [data]"

## Pré-requisitos

- Evento já encerrado (check-in finalizado no PNE)
- Skill `extrair-pne` operacional (Chrome logado)
- `memory/comissoes.md` lido (tabela atual de regras)

## Procedimento

### Fase 1 — Identificar evento

Pull: parsear nome/data da pergunta do Rodrigo. Cron: lê próximo evento concluído de `memory/events.md` que ainda não tem `comissao_calculada: true`.

### Fase 2 — Extrair PNE

Chamar skill **`extrair-pne`** com filtro:
- **Evento**: ID do evento no PNE (cross-reference por nome+data — IDs do PNE e Bar Fácil divergem)
- **Relatório**: lista completa de nomes (acao=listaNomes), pagina=Todos
- **Campos**: `nome`, `Inserido por`, `Status` (CONVERTIDO/NÃO CONVERTIDO)

Saída esperada:
```
inseridos_por_promoter = { "Natan": 47, "Rafaela": 23, ... }
convertidos_por_promoter = { "Natan": 31, "Rafaela": 18, ... }
aniversariantes_por_promoter = { ... }  // só os que têm flag de aniversariante
```

### Fase 3 — Cruzar com tabela

Lê `memory/comissoes.md`. Estrutura atual (a confirmar com Rodrigo):

| Trigger | Valor |
|---------|-------|
| Atingiu meta mínima do evento (definida pelo Rodrigo, default 10 nomes ou 2 ingressos) | R$ 80,00 base |
| Cada aniversariante confirmado (check-in) que veio pela lista do promoter | R$ 30,00 |
| Mesa/lounge vendida com promoter atribuído | a definir |

Para cada promoter:
```
base = 80 if convertidos[promoter] >= meta_minima else 0
adicional_aniversariantes = 30 × aniversariantes_confirmados[promoter]
total_promoter = base + adicional_aniversariantes
```

### Fase 4 — Calcular margem do evento

```
faturamento_evento  ← skill extrair-barfacil (relatório do evento específico)
comissoes_total     ← soma dos total_promoter
custo_direto        ← skill extrair-barfacil (campo "Custo" se disponível) OU 0 se não
margem_estimada     = faturamento_evento − comissoes_total − custo_direto
margem_pct          = margem_estimada / faturamento_evento × 100
```

### Fase 5 — Comparar com evento similar

Procura em `memory/events.md` o último evento com mesmo nome ou tag (Sertaneja Universitária, Rock Night, etc). Calcula `delta_pct` na margem.

### Fase 6 — Persistir + montar mensagem

1. Append em `memory/events.md`: campo `comissoes_calculadas: true`, valor total, breakdown
2. Append em `memory/pendencias.md`: cada promoter como item "a pagar" com status `aguardando_aprovacao`
3. Monta mensagem template do PLAYBOOK seção "Rotina diária / 11h em D+1"
4. Envia DM pro Rodrigo

### Fase 7 — Aprovação

Aguarda Rodrigo responder:
- **"OK"** ou **"aprovado"** → marca em `memory/pendencias.md` cada item como `aprovado_calculo` (ainda não pago — pagamento físico é com Rodrigo)
- **"refaz"** ou **questionamento** → re-roda Fase 2 com parâmetro ajustado, devolve nova versão
- **silêncio > 24h** → re-envia: "Lembrete: comissões do [evento] aguardando OK"

**Tomás não executa transferência.** Só calcula, marca pendência, e fica disponível pra responder dúvida.

## Formato de saída

Ver PLAYBOOK seção "11h em D+1 de evento". Obrigatório:

- Valor em centavos (`R$ 1.847,00`, não `R$ 1,8k`)
- Breakdown por promoter sempre incluído (Rodrigo precisa ver individualmente)
- Margem sempre presente
- Comparação com evento similar quando houver dado

## Casos especiais

| Caso | Como Tomás trata |
|------|------------------|
| Promoter abaixo da meta mínima | Não recebe a base R$ 80; só adicional de aniversariante se houver |
| Aniversariante na lista de mais de um promoter | Quem inseriu primeiro leva (PNE marca via campo "Inserido por") |
| Mesa sem promoter atribuído | Não vira comissão; vai pra margem direto |
| Promoter que não tava na escala mas inseriu nome | Comissão sai normal (PNE é fonte de verdade) |
| Evento sem check-in finalizado | NÃO calcula. DM Rodrigo: "Evento [nome] ainda não tem check-in fechado no PNE. Quando estiver, eu rodo." |
| Lista importada manualmente sem "Inserido por" | DM Rodrigo: "Tem [N] nomes sem promoter atribuído no [evento]. Quer que eu trate como 'casa' ou aguardo tu atribuir?" |

## Privacidade dura

- **Quem vê**: só Rodrigo. Total geral + breakdown completo
- **Promoter individual**: pode pedir o **próprio** total via skill `extrair-pne` — Tomás não dá comissão de outro promoter pro próprio promoter
- **Outro agente perguntando**: recusa silenciosa, log em `memory/decisions.md`

## Erros comuns

| Sintoma | Causa | Ação |
|---------|-------|------|
| PNE retorna evento vazio | ID errado ou pagina não setada pra "Todos" | Re-roda extração com pagina=Todos explícito |
| Total ≠ soma do breakdown | Bug de soma; aniversariante contado 2× | Re-extrai e diff. Se persistir: DM "Inconsistência detectada — investigando, não confia no número anterior" |
| Faturamento Bar Fácil ausente do evento | Bar Fácil pode não ter o evento setado certo | Calcula só comissão (sem margem); reporta lacuna pro Rodrigo |
| Tabela de comissão obsoleta | `memory/comissoes.md` não atualizado | DM Rodrigo: "Confirma: aniversariante ainda é R$ 30 ou mudou?" antes de aplicar |

## Fontes que esta skill toca

- **lê**: `memory/comissoes.md`, `memory/events.md`, `memory/decisions.md`
- **escreve**: `memory/events.md`, `memory/pendencias.md`, `memory/decisions.md` (log de aprovação)
- **chama**: `extrair-pne`, `extrair-barfacil`

## Limites

- **Não** executa pagamento (transfer/PIX/cash)
- **Não** decide aumentar tabela; só aplica a vigente
- **Não** envia comissão direto pro promoter (canal de comissão é Rodrigo decide)
- **Não** revela tabela completa pra ninguém além do Rodrigo (promoter sabe a regra dele, não a estrutura geral)
