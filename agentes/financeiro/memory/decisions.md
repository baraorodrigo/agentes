# Decisões financeiras — Tomás

> Log de decisões, mudanças de regra e recusas silenciosas. Tomás escreve, Rodrigo lê quando quiser auditar. Append-only.

## Tipos de entrada

1. **decisão de regra** — mudança em `comissoes.md`, threshold, banda, ou fluxo
2. **recusa silenciosa** — outro agente pediu dado financeiro; Tomás não respondeu, registrou
3. **escalation** — Tomás precisou puxar Rodrigo (lacuna de dado, inconsistência, dúvida)
4. **aprovação de comissão** — Rodrigo deu OK pro cálculo de evento X
5. **inconsistência detectada** — Tomás encontrou diff que não consegue resolver sozinho

## Schema

```yaml
- ts: ISO8601
  tipo: decisao_regra | recusa_silenciosa | escalation | aprovacao_comissao | inconsistencia
  contexto: "texto curto descrevendo o evento/situação"
  remetente: null|<agent_id>     # quem disparou — ex: "beto", "duda", "rodrigo"
  pedido: null|"texto do pedido recusado"
  decisao: "o que Tomás fez/decidiu"
  link: null|"path pro arquivo afetado se aplicável"
```

---

## Entradas

```yaml
- ts: 2026-05-09T14:30:00-03:00
  tipo: decisao_regra
  contexto: "Setup inicial do Tomás v2 — tabela de comissões documentada"
  remetente: rodrigo
  pedido: null
  decisao: "Tabela ativa: R$ 80 base + R$ 30/aniversariante. Mesa a definir. Threshold comissão/fat = 12%."
  link: "memory/comissoes.md"
```

<!-- Próximas entradas serão escritas pelo Tomás durante operação. -->

---

## Política de recusa silenciosa

Quando outro agente pede dado financeiro:

1. **Não responde** mensagem
2. **Registra** entrada `tipo: recusa_silenciosa` aqui
3. Se mesmo remetente fizer 3+ pedidos em 7 dias → escala pro Rodrigo:
   > "[agente] tá insistindo em pedido financeiro. Quer liberar?"

Quem recusa silenciosa pra qual pergunta — ver `PLAYBOOK.md` seção "FAQ silencioso".

## Política de aprovação

Comissões só são marcadas `aprovado_calculo` em `pendencias.md` depois que:

- Rodrigo respondeu "OK" ou "aprovado" no chat
- Aprovação registrada aqui com `tipo: aprovacao_comissao` + valor + evento + timestamp

Pagamento físico é separado — Tomás NÃO marca `pago` automaticamente. Rodrigo executa transferência e responde "pago" → aí Tomás atualiza `pendencias.md`.
