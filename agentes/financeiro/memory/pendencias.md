# Pendências — a pagar / a receber

> Tomás escreve, Rodrigo lê. Skill `comissao-evento` escreve aqui após calcular. Lembrete dia 1 e 15 lê daqui pra montar mensagem.

## Status possíveis

| Status | Significado |
|--------|-------------|
| `aguardando_aprovacao` | Tomás calculou, aguarda Rodrigo dar OK |
| `aprovado_calculo` | Rodrigo aprovou o número, mas pagamento físico ainda não saiu |
| `pago` | Rodrigo confirmou que transferiu/quitou |
| `cancelado` | Rodrigo decidiu não pagar (com nota explicando motivo) |
| `parcial` | Pago parte, falta resto |

## Schema

```yaml
- id: pend-XXX                  # incremental, auto-gerado
  tipo: comissao | fornecedor | aluguel | imposto | outro
  descricao: "texto curto"
  valor: 0.00
  vencimento: YYYY-MM-DD | null   # null se não tem deadline
  evento_relacionado: null|"<nome do evento>"
  promoter: null|"<nome>"         # se tipo=comissao
  status: aguardando_aprovacao | aprovado_calculo | pago | cancelado | parcial
  criado_em: ISO8601
  aprovado_em: null|ISO8601
  pago_em: null|ISO8601
  nota: null|"<texto livre>"
```

## A receber

Mesmas regras, schema idêntico, com `tipo: a_receber`. Hoje no El Coyote isso é raro (eventos são pré-pago via PNE), mas pode incluir cobranças pendentes de eventos privados, parcerias, etc.

---

## Entradas ativas

<!-- Tomás escreve aqui após cada cálculo. -->
<!-- Lembrete dia 1 e dia 15 filtra: vencimento <= hoje + 7 dias E status != pago. -->

## Histórico (pago/cancelado)

<!-- Quando entrada vai pra status `pago` ou `cancelado`, Tomás move ela pra esta seção. -->
<!-- Mantém os últimos 90 dias aqui. Mais antigo arquiva em memory/pendencias-arquivo-YYYY.md. -->

---

## Regras de operação

1. **Tomás NUNCA executa pagamento.** Só calcula, marca pendência, e responde dúvida. Pagamento físico (PIX/cash/transfer) é com o Rodrigo.
2. **Lembrete automático**: dia 1 e dia 15, push pro Rodrigo com tudo que vence em 7 dias E status != pago.
3. **Aprovação registrada em 2 lugares**: aqui (`status: aprovado_calculo`) e em `decisions.md` (`tipo: aprovacao_comissao`). Auditoria cruzada.
4. **Promoter individual NÃO consulta este arquivo.** Promoter sabe a comissão dele via Rodrigo (que decide canal) ou via skill `extrair-pne` (próprios números). Tabela completa só Rodrigo.
