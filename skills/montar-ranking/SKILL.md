---
name: montar-ranking
description: |
  Gera o ranking de desempenho dos promoters cruzando dados extraídos do PNE
  com a regra de comissão (R$ 80 fixo + R$ 30 por aniversariante convertido).
  Use quando o usuário mencionar ranking de promoters, ranking semanal,
  ranking pós-evento, "quem converteu mais", performance da equipe,
  comissão da semana/evento, "quanto cada promoter ganhou",
  ou qualquer pedido de comparação entre promoters do El Coyote.
  Tem duas versões de saída: pública (sem R$, pra grupo dos promoters)
  e admin (com R$, só pro Rodrigo).
---

# Skill: Montar Ranking de Promoters

## Quando usar
Após cada evento ou semanalmente (domingo) para gerar o ranking de desempenho dos promoters.

## Fontes de dados
- **PNE** (Pensa no Evento) → conversões por promoter (Inserido por + Situação CONVERTIDO)
- **Regra de comissão** → R$ 80 fixo por evento + R$ 30 por aniversariante convertido

## Passo a passo

### 1. Extrair dados do PNE
- Usar skill `skills/extrair-pne/SKILL.md` (name: `pensanoevento-relatorio`)
- Navegar até Relatórios → Conversões Por Membro
- Filtrar pelo período desejado (evento específico ou últimos 7 dias)
- Selecionar "Todos" na paginação e aguardar 3s
- Extrair: nome do promoter, inseridos, convertidos

### 2. Calcular métricas
Para cada promoter:
- **Taxa de conversão** = convertidos / inseridos × 100
- **Comissão base** = R$ 80 (por evento trabalhado)
- **Bônus aniversariantes** = quantidade de aniversariantes convertidos × R$ 30
- **Total** = comissão base + bônus

### 3. Ordenar e formatar

#### Versão Promoters (grupo WhatsApp — SEM valores financeiros)
```
⚡ RANKING SEMANAL ⚡

🥇 [Nome] — [X] convertidos ([Y]%)
🥈 [Nome] — [X] convertidos ([Y]%)
🥉 [Nome] — [X] convertidos ([Y]%)
4. [Nome] — [X] convertidos ([Y]%)
...

Total da equipe: [N] convertidos
Bora pra cima! 💪
```

#### Versão Admin (só Rodrigo — COM valores financeiros)
```
📊 RANKING + COMISSÕES

🥇 [Nome] — [X] conv ([Y]%) → R$ [valor]
🥈 [Nome] — [X] conv ([Y]%) → R$ [valor]
...

Total comissões: R$ [valor]
```

## Regras
- NUNCA enviar versão com valores financeiros no grupo de promoters
- Se dados do PNE falharem, informar e não inventar números
- Empates: ordenar por número absoluto de convertidos, depois alfabético
