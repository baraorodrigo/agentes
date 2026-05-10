# Preferências de Tom — Rodrigo

> Como o Rodrigo gosta que o copy soe. Duda aprende com o tempo, lendo padrões em
> `posts-aprovados.md`. Regra entra aqui só depois de **3 ocorrências do mesmo padrão**
> (ou se Rodrigo pedir explicitamente "salva isso").

**Última atualização:** 2026-05-09 (criação — vazio, vai povoando)
**Aprovação Rodrigo:** continua, cada bullet é validado por padrão observado ou pedido direto

---

## Como esta lista cresce

1. Duda observa cada proposta em `posts-aprovados.md`:
   - Aprovações repetidas com mesmo ângulo → vira preferência positiva
   - Edições repetidas removendo a mesma palavra → vira preferência negativa
   - Recusas com motivo → vira regra explícita
2. Mínimo de **3 ocorrências** antes de virar regra (evita falso positivo).
3. Rodrigo pode adicionar bullet direto se pedir: "Duda, sempre evita 'galera' no copy" → entra na hora com nota "pedido direto Rodrigo [data]".
4. Regras podem ser **revistas/removidas** se padrão muda. Duda registra na seção "Histórico de mudanças".

## Schema

```yaml
- id: pref-XXX
  categoria: tamanho | palavra_evitar | palavra_priorizar | estilo_cta | hashtag | horario | frequencia | tom_geral
  regra: "<texto curto da regra>"
  origem: padrao_observado_3x | pedido_direto_rodrigo
  data_entrada: YYYY-MM-DD
  evidencias: ["<post-XXX>", "<post-YYY>", "<post-ZZZ>"]   # IDs em posts-aprovados.md que sustentam a regra
  ativa: true|false
```

## Categorias

| Categoria | Exemplos |
|-----------|----------|
| `tamanho` | "Story sempre < 80 chars" / "Feed entre 120-200 chars" |
| `palavra_evitar` | "Evita 'galera', 'pessoal'" / "Sem 'incrível'" |
| `palavra_priorizar` | "Usa 'rolê', 'noite', 'encontro'" |
| `estilo_cta` | "CTA implícito > CTA explícito" / "Pergunta no fim funciona" |
| `hashtag` | "Story com no máx 2 hashtags" / "Sempre #ImbitubaNightLife" |
| `horario` | "Posta feed só após 18h" / "Story de manhã = baixa engajamento, evita" |
| `frequencia` | "Máx 1 post + 2 stories por dia" |
| `tom_geral` | "Direto > storytelling longo" / "Energia rock, sem corporativo" |

---

## Preferências ativas

<!-- Duda escreve aqui quando padrão se consolida (3x) ou quando Rodrigo pede direto. -->
<!-- Formato: schema acima. Manter ordenado por categoria. -->

---

## Preferências em observação (1-2 ocorrências)

<!-- Quando um padrão aparece 1 ou 2 vezes, fica aqui. Se chegar a 3, sobe pra "ativas". -->
<!-- Se contradizer (próxima ocorrência foi oposta), tira daqui. -->

---

## Histórico de mudanças

| Data | Mudança | Origem | Motivo |
|------|---------|--------|--------|
| 2026-05-09 | Arquivo criado, vazio | Setup inicial | Vai povoando com base em `posts-aprovados.md` |

---

## Regras de operação

1. **Não inventa preferência.** Duda só adiciona regra com evidência (3 IDs em posts-aprovados.md OU pedido direto Rodrigo registrado).
2. **Conflito entre regra ativa e padrão novo**: se 3 ocorrências contradizem regra ativa, Duda DM Rodrigo: "Rodrigo, vejo que tu tá escolhendo [X] agora — antes a preferência era [Y]. Mudou? Atualizo a regra ou foi exceção?"
3. **Privacidade**: Duda + Rodrigo. Outros agentes não consultam preferências de tom — não é dado deles.
4. **Aplicação**: skills `gerar-copy-evento`, `calendario-editorial-semanal` e `lembrete-stories` leem este arquivo antes de gerar saída.
5. **Limite de regras**: máximo 30 ativas. Mais que isso, Duda revisa as menos usadas (sem evidência nos últimos 60 dias) e arquiva.

## Quem pode ler este arquivo

- Duda 🎸 — leitura/escrita
- Rodrigo (humano) — sempre
- Outros agentes — não. Esta é a impressão digital criativa do Rodrigo, não circula.
