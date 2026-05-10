# Posts e Propostas — log de auditoria

> Duda escreve, Rodrigo é a fonte da decisão. Toda proposta de copy/calendário/lembrete
> que sai pro Rodrigo cai aqui — aprovada, recusada, editada ou pendente. Audit trail
> da Duda + base pra alimentar `preferencias-tom.md` quando padrão se consolida.

**Última atualização:** 2026-05-09 (criação)

---

## Status possíveis

| Status | Significado |
|--------|-------------|
| `pendente` | Duda enviou, Rodrigo ainda não respondeu |
| `aprovado` | Rodrigo escolheu uma opção tal qual (A, B ou C — ou aprovou calendário/lembrete) |
| `aprovado_editado` | Rodrigo aprovou mas editou o texto antes de postar |
| `recusado` | Rodrigo rejeitou todas as opções (com ou sem motivo) |
| `pendente_sem_resposta` | Mais de 24h sem resposta. Duda não re-envia. |
| `lembrete_silencioso` | Cron `lembrete-stories` rodou e não havia evento em D+1 — não enviou nada |
| `cancelado` | Rodrigo informou que evento foi cancelado / proposta não vale mais |

## Schema

```yaml
- id: post-XXX                       # incremental, auto-gerado
  tipo: copy_evento | calendario | lembrete_pre_evento_story | lembrete_silencioso
  evento: null|"<nome+data>"          # null se for calendário sem evento âncora
  tipo_peca: feed | story | reels | grupo_promoters | calendario_semana | aniversariante | null
  opcoes_geradas: 1 | 3 | null
  opcao_A: null|"<texto>"
  opcao_B: null|"<texto>"
  opcao_C: null|"<texto>"
  escolha: null|"A"|"B"|"C"|"editado"|"nenhum"
  versao_final: null|"<texto efetivamente postado>"
  status: pendente | aprovado | aprovado_editado | recusado | pendente_sem_resposta | lembrete_silencioso | cancelado
  motivo_recusa: null|"<texto livre>"
  diff_edicao: null|"<descrição curta da edição do Rodrigo>"
  criado_em: ISO8601
  resolvido_em: null|ISO8601
```

## Como aprende com isso

1. Toda **aprovação** vira input pra `preferencias-tom.md`. Se o mesmo ângulo (A direto, B storytelling, C gancho) for escolhido 3× em sequência pro mesmo `tipo_peca`, vira preferência.
2. Toda **edição** vira input duplo: pode atualizar `templates-copy.md` (se a edição cabe no template) e/ou `preferencias-tom.md` (se vira regra de tom).
3. Toda **recusa** com motivo vira regra negativa em `preferencias-tom.md` ("evitar [X]").
4. **Lembrete silencioso** só serve pra auditar que o cron rodou — não vira preferência.

## Recusas silenciosas (acesso indevido)

> Quando outro agente ou ator não-autorizado tenta acionar a Duda fora do canal/regras,
> log vai aqui — não em `posts-aprovados.md` principal. Padrão: 3+ insistências do mesmo
> remetente → escalar pro Rodrigo via Jarbas.

```yaml
recusas-silenciosas:
  - timestamp: ISO8601
    remetente: "<agente|outro>"
    pedido: "<o que pediu>"
    razão: "<canal errado | dado proibido | outro>"
```

---

## Entradas ativas

<!-- Duda escreve aqui após cada proposta enviada ao Rodrigo. -->
<!-- Quando status vira `aprovado`, `aprovado_editado`, `recusado` ou `cancelado`, move pra Histórico. -->
<!-- Pendentes ficam aqui até resolverem. -->

---

## Histórico (resolvido)

<!-- Posts já resolvidos. Manter últimos 90 dias. Mais antigo arquiva em -->
<!-- agentes/marketing/memory/posts-aprovados-arquivo-YYYY.md. -->

---

## Regras de operação

1. **Toda proposta da Duda passa por aqui.** Se não tá registrada, não existe.
2. **Privacidade**: arquivo é leitura/escrita só Duda + leitura Rodrigo. Outros agentes não consultam.
3. **Auditoria**: Rodrigo pode pedir "me mostra o que tu mandou essa semana" → Duda lê últimos 7 dias e devolve resumo.
4. **Não duplica `templates-copy.md`**. Aqui é log; lá é biblioteca consolidada. Conexão: post aprovado 3× consecutivo → vira template.
5. **Recusa silenciosa de outro agente** vai em seção própria, não na lista principal.
