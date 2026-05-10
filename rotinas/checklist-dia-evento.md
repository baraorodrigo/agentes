# Rotina: Checklist do dia-do-evento

- **Cron:** `0 14 * * *` — todo dia 14h Brasília. Roda silenciosa se hoje não é dia de evento.
- **Agente:** Gil 🎪 (eventos)
- **Destino:** DM Rodrigo
- **Skill orquestrada:** `checklist-operacional-dia`

## Por que 14h

- Mais cedo (8h-12h): info ainda chegando, fornecedor não respondeu, equipe acordando
- 14h: maioria das pendências do dia já tem retorno; ainda dá tempo de ação corretiva
- Mais tarde (16h+): tarde demais pra ligar pra fornecedor de som ou trocar segurança que furou

**Regra dura:** este cron NÃO pode falhar em dia de evento. Se falhar, Jarbas precisa flagar imediatamente.

## Prompt

Você é o Gil. 14h, vamos conferir o dia:

1. Lê `workspace/memory/events.md` filtrando entradas com `tipo: evento` E `data == hoje`
2. **Sem evento hoje** → sai silencioso. Termina.
3. Tem evento → roda skill `checklist-operacional-dia`:
   - Coleta status por área (atração, som & luz, bar, segurança, lista PNE)
   - Cross-ref com `agentes/eventos/memory/fornecedores.md`
   - Identifica furos (item crítico sem confirmação ≤ 4h do evento; rider faltando sem alternativa; lista PNE muito abaixo da média)
   - Persiste `checklist_14h: ISO8601` + array de furos em `events.md`
4. Monta mensagem usando template do PLAYBOOK seção "14h — Checklist operacional"
5. DM Rodrigo
6. Aguarda. Se Rodrigo responder com resoluções, pode rodar mini-update curto (15-30min depois).

## Formato esperado

```
🎪 Hoje é dia: [nome] — abre [horário]

Checklist (atualizado [hh:mm]):

Atração:
- [✅/⚠️/❌] Confirmada chegada (horário previsto: [HH:MM])
- [...] Soundcheck agendado: [HH:MM]
- [...] Rider entregue / em mãos

Som & luz:
- [...] Equipe técnica confirmada
- [...] Equipamento no local

Bar:
- [...] Estoque conferido
- [...] Equipe escalada confirmada

Segurança:
- [...] Equipe confirmada (N pessoas)
- [...] Briefing de porta combinado

Lista PNE:
- Inseridos: [N] | Convertidos esperados: ~[N]
- Aniversariantes: [N] confirmados

⚠️ ATENÇÃO:
- [item furando + ação sugerida]

Tudo ok? Se algo trava, me dá um toque que ajusto.
```

Convenção:
- ✅ confirmado e ok
- ⚠️ pendente mas dentro da janela
- ❌ pendente fora da janela (ação imediata)

## Tratamento de resposta do Rodrigo

| Resposta | Ação Gil |
|----------|----------|
| "[Item] resolvido" / "Confirmei [X]" | Atualiza `events.md` + `fornecedores.md`. Pode rodar mini-update curto consolidando os ✅ novos |
| "Cancela tudo" / "Cancelou" | Marca `cancelado: true` em `events.md` + motivo. Cancela checklist subsequente. Avisa Tomás (não vai ter comissão pós-evento) e Beto via Jarbas (lista PNE precisa de comunicação) |
| Silêncio | Normal — Gil não cobra durante o dia. Mas se ❌ no checklist e silêncio > 2h, escala pro Jarbas |
| "[Atração] cancelou" | Sai de cron — Gil entra em modo emergência: lista plano B de fornecedores/atrações alternativas, sugere ações |

## Casos especiais

- Atração cancelou no dia (descoberto fora do cron) → Gil dispara DM imediata, não espera 14h
- Múltiplos eventos no mesmo dia → mensagem agregada, sub-seção por evento
- Cron rodou mas evento foi removido/cancelado depois → não dispara mensagem (lê estado atual)
- PNE expirou sessão Chrome → DM "Bar Fácil/PNE pediu login" e segue checklist sem dado PNE

## Privacidade

- DM Rodrigo apenas. Checklist tem contato direto de fornecedor — não vai pra grupo.
- Lia pode receber checklist filtrado de privado se Rodrigo autorizar (sem cachê, sem custo, só status operacional pra ela responder cliente)

## NÃO faz

- Não liga ou manda mensagem pra fornecedor diretamente — só sinaliza pendência
- Não confirma item por conta própria — todo ✅ veio de Rodrigo ou de info já registrada
- Não acompanha o evento em tempo real durante a noite (essa é fase futura)
- Não toca em faturamento, margem, ticket (Tomás)
