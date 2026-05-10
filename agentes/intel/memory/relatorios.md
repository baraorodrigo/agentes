# Relatórios entregues — Raul

> Log append-only de tudo que Raul entregou. Auditoria de "o que ele já disse" — Jarbas/Rodrigo podem voltar e checar contexto histórico de qualquer entrega. Também serve pra Raul evitar repetir hipótese contraditória sem reconhecer mudança.

## Tipos de entrada

| Tipo | Trigger | Destinatário |
|------|---------|--------------|
| `relatorio_semanal` | cron seg 09h | Jarbas |
| `pos_evento` | handoff Jarbas após Tomás fechar comissão | Jarbas |
| `perfil_promoter` | handoff Beto via Jarbas | Beto (via Jarbas) |
| `pre_evento` | handoff Gil/Jarbas (futuro) | Gil/Jarbas |
| `pull_adhoc` | Rodrigo perguntou via Jarbas | Jarbas |
| `pedido_recusado` | promoter/cliente/outro agente pediu sem rota válida | nenhum (silenciosa) |

## Schema

```yaml
- ts: ISO8601
  tipo: relatorio_semanal | pos_evento | perfil_promoter | pre_evento | pull_adhoc | pedido_recusado
  janela: "YYYY-MM-DD a YYYY-MM-DD" | null
  evento: null | "<nome+data>"
  promoter: null | "<nome>"
  resumo_resposta: "1-3 linhas do que entreguei"
  hipoteses: ["..."]
  acoes_sugeridas: ["..."]
  entregue_a: jarbas | beto | gil | rodrigo
  fonte: "..."
  contradice_anterior: null | "ref-tsXXX"   # se contradiz hipótese anterior, link
  notas: null | "..."
```

## Regras de uso

- **Append-only.** Nunca editar entrada antiga. Se identificou erro, criar entrada nova `tipo: pull_adhoc` com `notas: "corrige relatório de [ts]"` e explicar.
- **Antes de afirmar hipótese nova**, Raul busca aqui se já não disse o oposto há pouco. Se sim, marca `contradice_anterior` e justifica mudança.
- **Mantém últimos 90 dias.** Mais antigo arquiva em `relatorios-arquivo-YYYY.md`.
- **Pedidos recusados ficam aqui também.** Auditoria de quem pede o quê. Se mesmo remetente repete 3+ vezes em 7d → escala pro Jarbas.

---

## Entradas

<!-- Raul preenche em ordem cronológica. Primeira entrada chega quando primeiro relatório semanal (seg 09h) rodar. -->

<!-- Exemplo (template, não real):
- ts: 2026-05-12T09:00:00-03:00
  tipo: relatorio_semanal
  janela: "2026-05-04 a 2026-05-10"
  evento: null
  promoter: null
  resumo_resposta: "Faturamento +8% vs 4 semanas. Ticket estável. Conversão -3pp em eventos. 3 destaques + 1 ponto de atenção."
  hipoteses: ["queda de conversão em eventos pode estar ligada a sobreposição com prova universitária"]
  acoes_sugeridas: ["validar próximas 2 semanas se padrão persiste"]
  entregue_a: jarbas
  fonte: "Bar Fácil 2026-05-11 + PNE 2026-05-11 + memory/events.md"
  contradice_anterior: null
  notas: null
-->

---

## Histórico arquivado

<!-- > 90 dias ficam em relatorios-arquivo-YYYY.md. -->
