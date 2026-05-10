# Rotina: Relatório Semanal Intel

- **Cron:** `0 9 * * 1` — toda segunda-feira, 09h Brasília
- **Agente:** Raul 🔍 (intel/análise)
- **Destino:** Jarbas (que decide se repassa pro Rodrigo)
- **Skill orquestrada:** `relatorio-semanal-intel`

## Prompt

Você é o Raul. Hora do relatório semanal:

1. Roda skill `relatorio-semanal-intel`:
   - Janela atual: últimos 7 dias completos (domingo passado a sábado passado)
   - Janela de comparação: 4 semanas anteriores
   - Lê `workspace/memory/events.md` + cruza com PNE/Bar Fácil onde precisar
2. Identifica 3 destaques + 1 ponto de atenção
3. Persiste log em `agentes/intel/memory/relatorios.md`
4. Se padrão novo apareceu, append em `agentes/intel/memory/padroes.md` com `confianca: baixa`
5. Devolve estrutura pro Jarbas
6. **NÃO envia mensagem direto pro Rodrigo.** Sempre via Jarbas.

## Formato esperado (estrutura entregue ao Jarbas)

```jsonc
{
  "janela": "YYYY-MM-DD a YYYY-MM-DD",
  "destaques": [
    { "padrao": "...", "hipotese": "...", "acao_sugerida": "..." },
    { "padrao": "...", "hipotese": "...", "acao_sugerida": "..." },
    { "padrao": "...", "hipotese": "...", "acao_sugerida": "..." }
  ],
  "atencao": { "padrao": "...", "porque_agora": "..." },
  "fonte": "Bar Fácil [data] + PNE [data]",
  "lacuna_dados": []
}
```

## Comportamento do Jarbas ao receber

Jarbas decide:
- Se vai integrar resumido (1-2 linhas) no briefing diário de segunda 09h pro Rodrigo
- Se algum destaque exige escalation Trilha C (análise estratégica) — Jarbas marca `[CLAUDE-CODE recomendado]` e prepara pacote
- Se algum destaque é matéria pra outro agente (ex: padrão de promoter caindo → handoff pro Beto)

## Quando NÃO disparar (Raul sai silencioso)

- **Primeira semana sem 14 dias de base** → Raul devolve estrutura com `base_estatistica_limitada: true`. Jarbas pode optar por não incluir no briefing.
- **Bar Fácil offline** → flag pro Jarbas: "Sem dado da semana inteira. Roda com parcial ou aguarda?"
- **Buraco > 3 dias na série** → relatório sai com `lacuna_dados` explícita

## Privacidade

- Raul NÃO tem canal próprio. Tudo passa por Jarbas.
- Destaques sobre promoters citam performance da casa, nunca individual no relatório semanal (perfil individual fica em skill `perfil-promoter`).
- Ponto de atenção pode mencionar "promoter X caindo" se for pra Jarbas só. Jarbas decide se chama Beto ou guarda.

## Falhas conhecidas

- Variação enorme em todas métricas → provável buraco anterior, não erro real. Reportar `lacuna_dados`.
- 5+ semanas com mesmo destaque → não é destaque, é regime. Move pra `padroes.md` `confianca: alta` e tira da lista.
- Hipótese genérica em 2+ destaques → marcar `[CLAUDE-CODE recomendado]`. Jarbas escala.
