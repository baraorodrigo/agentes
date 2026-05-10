# Pipeline de Eventos Privados — Gil

> Pipeline de eventos privados do El Coyote: em proposta, fechados, recusados, executados. Cada entrada acompanha o ciclo do orçamento (Lia → Gil → Tomás → Rodrigo → Lia → Cliente).
>
> Skill `evento-privado-orcamento` cria/atualiza entradas aqui em todas as fases. Skill `pos-evento-licoes` lê eventos `executados` pra agregar lições.

**Última atualização:** 2026-05-09 (criação — vazio, Gil preenche conforme demanda chega)

---

## Schema

```yaml
- id: ep-XXX                         # incremental
  cliente_nome: "..."
  cliente_contato: "..."             # WhatsApp ou e-mail
  data_pretendida: YYYY-MM-DD
  publico_estimado: N
  ocasiao: "aniversário | empresa | despedida | outro"
  expectativa_cliente: "1-2 linhas livres"
  status: aguardando_briefing | aguardando_tomas | aguardando_aprovacao_rodrigo | aprovado_aguardando_cliente | recusado_rodrigo | contraproposta | fechado | cliente_recusou | cliente_silencio | fechado_depois_cancelado | executado | cliente_desistiu_pre_briefing
  recebido_em: ISO8601               # quando Lia entregou pra Gil
  template_aplicado: tpl-XXX         # ID do template de evento usado
  briefing:
    espaco: "..."
    atracao: "..."
    fornecedores: [forn-XXX, forn-YYY, ...]
    equipe_extra: "..."
    janela: "..."
    riders: "..."
    custo_direto_conhecido_brl: 0.00 # apenas o que Gil conhece (não é total real)
  preco_tomas:                       # preenchido por Tomás na Fase 3
    preco_sugerido_brl: 0.00
    margem_alvo_pct: X
    breakdown:
      custo_direto_brl: 0.00
      custo_overhead_estimado_brl: 0.00
      margem_alvo_brl: 0.00
      preco_final_brl: 0.00
    notas: "..."
  proposta_consolidada: "<texto que foi DM Rodrigo>"
  decisao_rodrigo:
    decisao: aprovado | aprovado_com_ajuste | recusado
    valor_ajustado_brl: 0.00         # só se aprovado_com_ajuste
    motivo: "..."
    decidido_em: ISO8601
  comunicacao_cliente:
    enviado_em: ISO8601
    via_lia: true
    tom_usado: "..."
  resposta_cliente:
    decisao: aceitou | recusou | contraproposta | silencio
    valor_contraproposta_brl: 0.00   # se aplicável
    recebido_em: ISO8601
    motivo: "..."
  rodadas_contraproposta: 0          # max 2 antes de escalar pro Rodrigo
  evento_executado: false            # vira true quando privado fecha + acontece + post-mortem rodou
  notas: "histórico curto"
```

## Estados (status) — fluxo

```
aguardando_briefing       ← Lia entregou, Gil pode ter campos faltantes
   │
   ▼
aguardando_tomas          ← Gil terminou briefing, esperando Tomás precificar
   │
   ▼
aguardando_aprovacao_rodrigo ← Tomás devolveu, Gil mandou DM Rodrigo
   │
   ├──► recusado_rodrigo ──► (Lia comunica recusa) ──► fim
   │
   └──► aprovado_aguardando_cliente ──► (Lia comunica aprovação)
              │
              ├──► cliente_recusou ──► fim
              ├──► cliente_silencio ──► (Lia faz follow-up; após 2 follow-ups, fim)
              ├──► contraproposta ──► volta pra aguardando_tomas (max 2 rodadas)
              └──► fechado
                     │
                     ├──► fechado_depois_cancelado (cliente cancelou após fechar)
                     │
                     └──► executado (evento aconteceu, post-mortem rodou)
```

Estado especial: `cliente_desistiu_pre_briefing` — Lia retornou pro cliente coletar campos faltantes, cliente sumiu/desistiu antes de Gil começar briefing.

## Regras de manutenção

- **Criar entrada nova**: Lia entrega pacote inicial. Status `aguardando_briefing`. Gil valida campos.
- **Atualizar entrada**: cada fase do skill `evento-privado-orcamento` atualiza campos correspondentes + bumpa status.
- **Não deletar entrada**: mesmo recusados ou cancelados ficam como histórico (auditoria + aprendizado).
- **Migrar pra `workspace/memory/events.md`**: quando status vira `fechado`, Gil cria entrada correspondente em `events.md` pra entrar no fluxo de pré-evento (cron 10h, checklist 14h). Mantém entrada em `eventos-privados.md` pra rastrear histórico do funil.
- **Marcar `executado`**: skill `pos-evento-licoes` atualiza após D+2 do evento, depois de gerar lição.

## Privacidade dura

- Leitura: Gil + Rodrigo + Tomás (Tomás precisa pra precificar)
- **Não acessível**: Beto, Duda, Raul (recusa silenciosa)
- **Lia tem acesso parcial**: vê status de privados que ela mesma encaminhou (via Jarbas), mas não vê `preco_tomas.breakdown` nem `decisao_rodrigo.motivo` se for sensível
- **Cliente externo nunca vê este arquivo** (óbvio, mas explícito)

## Métricas operacionais (calculadas sob demanda)

Skill `evento-privado-orcamento` ou pull do Rodrigo pode pedir:

- **Conversion rate** = `fechado` ou `executado` / total de propostas mandadas
- **Tempo médio de fechamento** = decisão_rodrigo.decidido_em − recebido_em (em dias)
- **Taxa de contraproposta** = entradas com `rodadas_contraproposta > 0` / total
- **Recusa por motivo** = agrupamento de `decisao_rodrigo.motivo` e `resposta_cliente.motivo` pra detectar padrão (ex: preço alto, data conflitante)

## Histórico de mudanças

| Data | Mudança | Quem | Motivo |
|------|---------|------|--------|
| 2026-05-09 | Schema documentado, vazio | Gil (setup inicial) | Primeira versão |

---

## Pedidos recusados (sem briefing)

> Recusa silenciosa de outros agentes pedindo dado deste arquivo. Append pra auditoria. Se mesmo remetente repete 3+ vezes, escala pro Jarbas.

<!-- Schema:
- ts: ISO8601
  remetente: <agente>
  pedido: "..."
  motivo_recusa: "fora da hierarquia | não tem necessidade operacional | ..."
-->

---

## Entradas

<!-- Gil preenche aqui ao longo do tempo. Vazio até primeira demanda real chegar via Lia. -->

<!-- Exemplo (template, não real):
- id: ep-001
  cliente_nome: "..."
  cliente_contato: "..."
  data_pretendida: 2026-XX-XX
  publico_estimado: 0
  ocasiao: "..."
  expectativa_cliente: "..."
  status: aguardando_briefing
  recebido_em: 2026-XX-XXT00:00:00-03:00
  template_aplicado: null
  briefing: null
  preco_tomas: null
  proposta_consolidada: null
  decisao_rodrigo: null
  comunicacao_cliente: null
  resposta_cliente: null
  rodadas_contraproposta: 0
  evento_executado: false
  notas: "—"
-->

---

## Arquivados

<!-- Privados antigos (executados há 6+ meses, recusados há 12+ meses). Move pra cá pra reduzir leitura ativa, mantém histórico. -->
