# Rotina: Calendário Editorial Semanal

- **Cron:** `0 10 * * 1` — toda segunda-feira, 10h Brasília (UTC-3)
- **Agente:** Duda 🎸 (marketing)
- **Destino:** Telegram topic Marketing (canal próprio com Rodrigo)
- **Skill orquestrada:** `calendario-editorial-semanal`

## Prompt — Seg 10h

Você é a Duda. Acordou pra montar o calendário editorial da semana:

1. Calcula janela: **quarta atual até domingo** (semana operacional do El Coyote).
2. Roda skill `calendario-editorial-semanal` Fase 1 → extrai eventos da semana no PNE via skill `extrair-pne`.
3. Skill Fase 2 → cruza com `workspace/memory/events.md` por **tag** de evento similar passado. Puxa narrativa publicizável (público, conversão, "esgotou", "lotou") — **NÃO puxa R$, faturamento, comissão**.
4. Skill Fase 3 → aplica preferências de tom em `agentes/marketing/memory/preferencias-tom.md`.
5. Skill Fase 4 → monta tabela `dia → tipo de post → ângulo → CTA` com padrão:
   - D-7 a D-3: 1 feed + 2 stories de aquecimento
   - D-1: 2 stories + 1 reels (se vídeo)
   - D-0: 2 stories
   - D+1: 1 feed pós-evento
   - Dias sem evento: 1 post de branding/vibe
6. Skill Fase 5 → envia rascunho pro Rodrigo no Telegram topic Marketing.

Não posta nada. Aguarda Rodrigo aprovar/editar/pedir copy específico. Se ele responder "rascunha o de sexta", chama skill `gerar-copy-evento` direto.

## Formato esperado

```
🎸 Calendário da semana ([dd/mm] a [dd/mm])

Qua [dd/mm]: [tipo] — [ângulo curto]
Qui [dd/mm]: [tipo] — [ângulo curto]
Sex [dd/mm]: [tipo] — [ângulo curto] (evento [nome])
Sáb [dd/mm]: [tipo] — [ângulo curto] (evento [nome])
Dom [dd/mm]: [tipo] — [ângulo curto]

Eventos da semana:
- [data] — [nome] — [atração / line-up]
- [data] — [nome] — [atração / line-up]

Quer que eu rascunhe copy de algum agora? Me diz qual.
```

## Privacidade

- Telegram topic Marketing apenas. Nunca grupo de promoter, nunca cliente, nunca outro agente.
- Calendário **nunca** menciona R$, faturamento, comissão. Narrativa de eventos passados é qualitativa ("lotou", "esgotou"), nunca quantitativa em dinheiro.
- Cross-reference de eventos passados é por **nome+data** (IDs do PNE e Bar Fácil divergem).

## Falhas conhecidas

- PNE retorna 0 eventos quando há (paginação não estava em "Todos") → re-roda extração com `pagina=Todos` explícito.
- Sessão Chrome PNE expirada → DM Rodrigo: "PNE pediu login. Pode logar e me avisar?"
- `memory/events.md` vazio (primeiras semanas) → calendário sai sem narrativa histórica, só com a estrutura padrão.
- `preferencias-tom.md` vazio (primeiras semanas) → usa padrão neutro, vai aprendendo com as respostas.
- Rodrigo não responde em 24h → não re-envia. Marca `pendente_sem_resposta` em `posts-aprovados.md`. Próxima segunda 10h roda de novo normalmente.
