# Reservas e Briefings — Lia

> Log append-only de toda reserva ou briefing de evento privado coletado
> pela Lia no WhatsApp público. Lia escreve, Rodrigo audita, Gil consulta
> (briefings de evento privado). Esta é a fonte de verdade pra "o que
> a Lia já se comprometeu a repassar".
>
> **NUNCA editar entrada antiga.** Mudança de status = nova linha de
> histórico no campo `status_log` da entrada. Cliente cancelou? Marca
> `status: cancelado` + nova entrada em `status_log`. Reserva confirmada?
> Idem.

**Última atualização:** 2026-05-09 (criação — vazio)

---

## Schemas

### Reserva de mesa (público até 25)

```yaml
- id: res-XXX                              # incremental
  tipo: reserva_mesa
  nome: "..."                              # nome completo do cliente
  contato: "..."                           # número WhatsApp
  data_desejada: YYYY-MM-DD
  qtd_pessoas: n
  aniversario: bool
  data_aniversario: YYYY-MM-DD | null
  status: aguardando_confirmacao | confirmado | cancelado | nao_compareceu
  criado_em: ISO8601
  status_log:
    - quando: ISO8601
      status_novo: aguardando_confirmacao
      por: lia
      nota: "coleta inicial"
  nota: null|"texto livre"                 # ex: "tom hostil", "amigo do João"
```

### Briefing de evento privado (público > 25 ou pedido explícito)

```yaml
- id: ev-priv-XXX
  tipo: aniversario_grande | despedida | corporativo | formatura | casamento | outro
  contato_nome: "..."
  contato_telefone: "..."
  contato_email: null|"..."
  data_desejada: YYYY-MM-DD | "flexivel"
  qtd_pessoas: n
  fechamento_total: bool
  pedidos_especiais: "..."
  status: aguardando_gil | gil_em_contato | orcamento_enviado | fechado | recusado | abandonado
  aguarda_gil_operacional: bool            # true se Gil ainda Phase 5 pendente
  criado_em: ISO8601
  status_log:
    - quando: ISO8601
      status_novo: aguardando_gil
      por: lia
      nota: "briefing inicial coletado"
  nota: null|"texto livre"
```

### Escalação grave (reclamação séria)

```yaml
- id: escal-XXX
  tipo: escalacao_grave
  nome: "..."                              # nome do cliente, se forneceu
  contato: "..."
  resumo: "1 linha do que cliente reclamou"
  status: repassado_jarbas | em_atendimento_rodrigo | resolvido | encerrado_sem_resposta
  criado_em: ISO8601
  status_log:
    - quando: ISO8601
      status_novo: repassado_jarbas
      por: lia
      nota: "..."
```

---

## Regras de operação

1. **Lia escreve append-only.** Não edita entrada antiga. Mudança = atualiza `status` + adiciona linha em `status_log`.
2. **Rodrigo é dono do `status: confirmado` em reservas e do `status: fechado` em eventos privados.** Lia nunca marca esses status sozinha — só registra que Rodrigo/Gil confirmou.
3. **Privacidade dos clientes**: este arquivo é interno. NUNCA aparece em conversa pública. Lia consulta só pra confirmar que tem registro e pra histórico interno.
4. **Auditoria**: Rodrigo confere semanalmente que todas reservas com `status: aguardando_confirmacao` há mais de 48h tiveram retorno. Se não, escala.
5. **Limpeza**: entradas com `status: confirmado` ou `cancelado` há mais de 90 dias arquivar em `agentes/atendimento/memory/reservas-arquivo-YYYY.md`.
6. **Aniversariante**: se `aniversario: true` na reserva, Lia (ou Beto, se for promovido a contato dele depois) pode usar `data_aniversario` pra ações futuras — desde que Rodrigo aprovou trazer aquela pessoa pra base ativa.

---

## Reservas de mesa — ativas

<!-- Lia escreve aqui após cada coleta com status `aguardando_confirmacao`.
     Quando Rodrigo confirma → atualiza pra `confirmado`.
     Quando passa a data → muda pra `nao_compareceu` ou `confirmado` se compareceu. -->

---

## Briefings de evento privado — ativos

<!-- Lia escreve aqui após cada coleta com status `aguardando_gil`.
     Gil atualiza progressivamente. Lia só lê depois disso. -->

---

## Escalações graves — abertas

<!-- Lia escreve aqui após Fase 4 do `atendimento-cliente`.
     Jarbas/Rodrigo atualiza status conforme resolve. -->

---

## Histórico (concluído)

<!-- Quando entrada vai pra status final (`confirmado`, `cancelado`,
     `nao_compareceu`, `fechado`, `recusado`, `resolvido`, `encerrado_sem_resposta`),
     Lia move ela pra esta seção. Mantém os últimos 90 dias aqui. -->

---

## Quem pode ler este arquivo

- Lia 💬 — leitura/escrita
- Jarbas 🐺 — leitura (pra orquestrar handoff)
- Gil 🎪 — leitura/escrita seção "Briefings de evento privado"
- Rodrigo (humano) — sempre, leitura e correção
- **Outros agentes**: NÃO. Beto/Tomás/Duda/Raul não consultam reservas de cliente público.
