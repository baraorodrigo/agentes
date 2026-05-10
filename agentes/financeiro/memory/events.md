# Histórico de fechamentos diários — Tomás

> Append-only por padrão. Cada linha é um dia operacional do El Coyote, com extração validada do Bar Fácil. Skill `fechamento-diario` escreve aqui no cron 04h. Skill `alerta-variacao` lê pra calcular média móvel 7d. Skill `comissao-evento` lê filtrando por tag pra comparar evento similar.

**Schema:**

```yaml
- date: YYYY-MM-DD              # data operacional (não data da extração)
  weekday: seg|ter|qua|qui|sex|sab|dom
  tipo: operacional|evento|fechado  # "fechado" = casa não abriu
  tag: null|<nome do evento>    # ex: "Sertaneja Universitária", "Rock Night"
  faturamento_total: 0.00       # R$ exato
  ticket_medio: 0.00
  itens_vendidos: 0
  top_3_produtos:
    - { nome: "...", valor: 0.00, qtd: 0 }
  top_3_atendentes:
    - { nome: "...", valor: 0.00, qtd: 0 }
  custo_direto: null|0.00       # se Bar Fácil expôs campo "Custo"
  comissoes_calculadas: false   # vira true depois que skill comissao-evento rodou
  comissoes_total: null|0.00
  margem_estimada: null|0.00    # faturamento − comissões − custo_direto
  margem_pct: null|0.00
  delta_fat_pct_vs_7d: null|0.0 # vs média móvel 7d operacionais
  delta_ticket_pct_vs_7d: null|0.0
  alerta: false|true            # true se delta > banda
  alerta_eixos: []              # ["faturamento", "ticket", ...]
  hipotese: null|"<texto curto>"
  fonte: "Bar Fácil"
  extraido_em: ISO8601 timestamp
  observacao: null|"<texto livre — ex: feriado, chuva, reforma>"
```

**Regras de leitura:**

- **Média móvel 7d**: pega últimas 7 entradas com `tipo: operacional` (pula `fechado` e `evento` se for cálculo de banda diária).
- **Comparação evento similar**: filtra por `tag` igual + `tipo: evento`, pega o último anterior.
- **Primeira semana sem base**: se `len(operacionais) < 7`, skill devolve `delta = null` e pula alerta.

**Regras de escrita:**

- Append em ordem cronológica. Não reescrever histórico.
- Se precisar corrigir (ex: extração errada), adicionar nova entrada `correcao: true` apontando pra `corrige_date: YYYY-MM-DD` em vez de editar a antiga. Auditoria preservada.

---

## Entradas

<!-- Tomás escreve aqui. Formato: bloco YAML separado por `---`. -->
<!-- Primeira linha real chega quando o cron 04h rodar pela primeira vez. -->
<!-- Antes disso, este arquivo fica vazio e a skill fechamento-diario sai sem média móvel (banda nula). -->
