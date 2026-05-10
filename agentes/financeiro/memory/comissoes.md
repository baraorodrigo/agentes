# Tabela de Comissões — fonte canônica

> Fonte de verdade para a skill `comissao-evento`. Mudança aqui → registrar em `decisions.md` com data e contexto antes de aplicar.

**Última atualização:** 2026-05-09 (criação — valores a confirmar com Rodrigo)
**Aprovação Rodrigo:** ⚠️ pendente — Tomás envia DM antes do primeiro cálculo real

---

## Regra ativa

| Trigger | Valor | Notas |
|---------|-------|-------|
| Atingiu meta mínima do evento | R$ 80,00 base | "Meta mínima" = `default 10 nomes inseridos OU 2 ingressos vendidos`. Rodrigo pode definir meta diferente por evento na hora de criar no PNE. |
| Aniversariante confirmado (check-in) trazido pelo promoter | + R$ 30,00 cada | Conta só quem fez check-in. "Trazido pelo promoter" = campo `Inserido por` no PNE bate com o promoter. |
| Mesa/lounge vendida com promoter atribuído | a definir | Aguardando Rodrigo definir valor fixo ou % |

## Casos especiais

| Caso | Tratamento |
|------|------------|
| Promoter abaixo da meta | NÃO recebe a base R$ 80. Ainda recebe adicional de aniversariante se houver. |
| Aniversariante na lista de 2+ promoters | Quem inseriu primeiro leva (PNE marca via `Inserido por`). |
| Mesa sem promoter atribuído | Não vira comissão. Vai pra margem direto. |
| Promoter fora da escala que inseriu nome | Comissão sai normal. PNE é fonte de verdade — quem entrou na lista por canal dele leva. |
| Lista importada manualmente sem `Inserido por` | Tomás DM Rodrigo: "Tem N nomes sem promoter atribuído. Trato como 'casa' ou aguardo tu atribuir?" |
| Evento cancelado / com check-in incompleto | NÃO calcula. Tomás avisa: "Evento [nome] sem check-in fechado. Quando estiver, eu rodo." |

## Limite de banda

Comissões totais > 12% do faturamento do evento → alerta automático "comissão alta" no fechamento. Não bloqueia pagamento, só sinaliza pro Rodrigo revisar a estrutura do evento.

## Fórmula

```
Para cada promoter:
  base = 80 if convertidos[promoter] >= meta_minima else 0
  adicional = 30 × aniversariantes_confirmados[promoter]
  total_promoter = base + adicional

Total geral = soma(total_promoter)
Razão = Total geral / faturamento_evento
```

## Histórico de mudanças

| Data | Mudança | Quem aprovou | Motivo |
|------|---------|--------------|--------|
| 2026-05-09 | Tabela inicial documentada (R$ 80 base + R$ 30 aniversariante) | Pendente Rodrigo | Setup inicial do Tomás v2 |

---

## Quem pode ler este arquivo

- Tomás 📊 — leitura/escrita
- Rodrigo (humano) — sempre
- **Outros agentes**: NÃO. Beto/Lia/Duda/Gil/Raul não enxergam estrutura de comissão.
