# Skills — Sub-mapa

Tarefas repetitivas documentadas passo a passo. Cada skill tem o fluxo exato que a IA deve seguir, incluindo seletores DOM, tempos de espera e tratamento de erro.

**Layout:** cada skill é uma pasta `<nome>/` contendo `SKILL.md` com YAML frontmatter (`name` + `description`). Padrão validado em prod com Beto.

| Skill | Pasta | Nome (frontmatter) | Quando usar |
|-------|-------|--------------------|-------------|
| Extrair PNE | `extrair-pne/SKILL.md` | `pensanoevento-relatorio` | Puxar dados de lista, conversão, aniversariantes do Pensa no Evento |
| Extrair Bar Fácil | `extrair-barfacil/SKILL.md` | `barfacil-relatorio` | Puxar relatório de vendas, ticket médio, top produtos do Bar Fácil |
| Montar Ranking | `montar-ranking/SKILL.md` | `montar-ranking` | Cruzar dados PNE + regra de comissão pra gerar ranking de promoters |
| Orquestração | `orquestracao/SKILL.md` | `orquestracao` | Delegar tarefa pros 6 sub-agentes (Beto/Duda/Lia/Tomás/Gil/Raul) sem virar gargalo |

## Regras para criar novas skills

1. Só crie skill se a tarefa vai ser repetida mais de 1 vez
2. Documente o passo a passo EXATO (URLs, seletores, waits)
3. Teste antes de considerar pronta
4. Nunca baixe skill de terceiro sem adaptar ao nosso contexto
