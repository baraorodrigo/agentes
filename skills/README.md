# Skills — Sub-mapa

Tarefas repetitivas documentadas passo a passo. Cada skill tem o fluxo exato que a IA deve seguir, incluindo seletores DOM, tempos de espera e tratamento de erro.

| Skill | Arquivo | Quando usar |
|-------|---------|-------------|
| Extrair PNE | `extrair-pne.md` | Puxar dados de lista, conversão, aniversariantes do Pensa no Evento |
| Extrair Bar Fácil | `extrair-barfacil.md` | Puxar relatório de vendas, ticket médio, top produtos do Bar Fácil |
| Montar Ranking | `montar-ranking.md` | Cruzar dados PNE + regra de comissão pra gerar ranking de promoters |

## Regras para criar novas skills

1. Só crie skill se a tarefa vai ser repetida mais de 1 vez
2. Documente o passo a passo EXATO (URLs, seletores, waits)
3. Teste antes de considerar pronta
4. Nunca baixe skill de terceiro sem adaptar ao nosso contexto
