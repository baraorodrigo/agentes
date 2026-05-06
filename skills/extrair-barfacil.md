---
name: barfacil-relatorio
description: |
  Extrai relatórios do sistema Bar Fácil (bar.barfacil.com.br) via Chrome browser automation.
  Use SEMPRE que o usuário mencionar Bar Fácil, relatório de vendas, relatório do bar,
  relatório de evento, vendas por atendente, vendas por produto, financeiro do evento,
  "puxa o relatório", "como foi o evento", "quanto vendeu", "ticket médio",
  "resultado da noite", "faturamento do evento", ou qualquer pedido de dados
  operacionais do El Coyote Rock N Bar vindos do sistema Bar Fácil.
  Também acione quando o usuário pedir comparação entre eventos, análise de performance
  de atendentes, produtos mais vendidos, ou tendências de vendas.
---

# Bar Fácil — Extração de Relatórios

Skill para extrair dados do sistema Bar Fácil (BF Play) do El Coyote Rock N Bar - Imbituba.

## Pré-requisitos

- O usuário precisa estar com o Chrome aberto e logado em bar.barfacil.com.br
- O MCP Claude in Chrome precisa estar ativo
- A conta logada é "EL COYOTE ROCK N BAR - IMBITUBA" (Rodrigo Silva Santos)

## Estrutura do Sistema

### URLs principais

- **Home/Monitoramento**: `https://bar.barfacil.com.br/`
- **Relatórios gerais**: `https://bar.barfacil.com.br/relatorio/`
- **Lista de eventos**: `https://bar.barfacil.com.br/eventos`
- **Relatório de evento específico**: `https://bar.barfacil.com.br/relatorio-evento/{EVENT_ID}`
- **Monitoramento de evento**: `https://bar.barfacil.com.br/monitoramento-evento/{EVENT_ID}`

### Abas principais do sistema

| Aba | O que tem |
|-----|-----------|
| MONITORAMENTO | Dashboard ao vivo do evento ativo |
| RELATÓRIOS | Relatórios filtráveis por período |
| CADASTROS | Produtos, categorias, atendentes |
| TERMINAIS | Status dos terminais de venda |
| VENDA DETALHADA | Cada venda individual |
| EVENTOS | Lista de todos os eventos (cards com nome + data) |
| OUTROS | Configurações extras |

### Tipos de relatório disponíveis

Dentro de RELATÓRIOS (e dentro de cada evento):

1. **VENDAS POR ATENDENTE** — Colunas: Última Venda, Atendente, Vendido, Cortesia, Valor, Comissão, Ticket Médio
2. **VENDAS POR PRODUTO** — Colunas: Última Venda, Produto, Quantidade, Valor, Custo, Ticket Médio
3. **FINANCEIRO POR ATENDENTE** — Colunas: Atendente, Dinheiro, Crédito, Débito, QRCode/PIX, Voucher, Entrada, Retirada, Cortesia, Estornos Terminal/ADM, Acréscimo, Desconto, Serviço, Quebra
4. **TRANSAÇÕES** — Detalhamento de cada transação
5. **CASHLESS** — Dados do sistema cashless
6. **VALIDADOS** — Tickets validados
7. **SAÍDA DE ESTOQUE** — Movimentação de estoque
8. **VENDAS POR TERMINAL** — Vendas agrupadas por terminal

### Dashboard do evento (Monitoramento)

Ao acessar `/monitoramento-evento/{ID}`, mostra cards com:
- Total de Vendas (R$)
- Vendido Última Hora (R$)
- Ticket Médio (R$)
- Quantidade Total (itens)
- Total Creditado, Consumido, Devoluções/Estornos, Não Consumido
- Cartões (ativações/devoluções)
- Bônus, Receita

Tem duas abas: FINANCEIRO e OPERACIONAL.

## Como extrair dados

### Passo 1: Navegar para o evento

```
// Opção A: Ir direto para a lista de eventos
navigate → https://bar.barfacil.com.br/eventos

// Opção B: Se souber o ID do evento
navigate → https://bar.barfacil.com.br/relatorio-evento/{EVENT_ID}
```

### Passo 2: Identificar o evento

Na página de eventos, os cards mostram NOME e DATA. O evento mais recente fica no topo esquerdo. Clique em "VISUALIZAR EVENTO" para acessar.

### Passo 3: Extrair dados via JavaScript

Esta é a forma mais rápida e confiável. Após navegar para o relatório do evento e clicar em "VISUALIZAR" para carregar os dados:

```javascript
// Extrair tabela de dados da página
var table = document.querySelector('.dataTable') || document.querySelector('table');
var headers = [];
table.querySelectorAll('thead th').forEach(function(th) { headers.push(th.textContent.trim()); });
var rows = [];
table.querySelectorAll('tbody tr').forEach(function(tr) {
  var cells = [];
  tr.querySelectorAll('td').forEach(function(td) { cells.push(td.textContent.trim()); });
  if (cells.length > 0) rows.push(cells);
});
JSON.stringify({headers: headers, data: rows});
```

### Passo 4: Trocar tipo de relatório

Os tipos de relatório são sub-abas na página. Para trocar, clique na sub-aba correspondente:

- VENDAS POR ATENDENTE (padrão)
- VENDAS POR PRODUTO
- FINANCEIRO POR ATENDENTE
- TRANSAÇÕES
- CASHLESS
- VALIDADOS

Após clicar, espere 2 segundos e então clique em VISUALIZAR para carregar os dados. Depois extraia via JavaScript.

### Passo 5: Extrair dados do dashboard (monitoramento)

Para o dashboard do evento, navegue para `/monitoramento-evento/{ID}` e extraia os cards:

```javascript
var cards = document.querySelectorAll('.portlet, .mt-widget-1, [class*="card"]');
var data = {};
cards.forEach(function(c) {
  var label = c.querySelector('.uppercase, .title, h4, h5');
  var value = c.querySelector('.font-green-jungle, .font-red, .bold, .value, h3');
  if (label && value) data[label.textContent.trim()] = value.textContent.trim();
});
JSON.stringify(data);
```

## Formatos de saída

Após extrair os dados, apresente ao usuário de forma clara. Opções:

1. **Resumo no chat** — Para consultas rápidas ("quanto vendeu ontem?")
2. **Planilha Excel** — Para análise detalhada (usar skill xlsx)
3. **Comparação entre eventos** — Tabela lado a lado
4. **Dashboard visual** — Criar artifact com gráficos

## Eventos conhecidos (histórico parcial)

Eventos recentes encontrados no sistema (maio 2026):
- SHOW NACIONAL VINE 7 — 30/04/2026 (ID: 149188) — R$ 55.297, ticket médio R$ 34,60
- SHOW NACIONAL MC LUCKY — 18/04/2026
- IMBICOMEX — 10/09/2025
- JOAOZINHO VT — 19/07/2025
- BAILE DO HAVAI 11/01 — 11/01/2025
- BAILINHO DE SEXTA 10/01 — 10/01/2025
- HUNGRIA — 20/07/2024
- BONDE DO TIGRÃO — 09/02/2024
- REVELAÇÃO — 30/12/2023
- BAILE DO TEDDY — 23/12/2023

## Dicas operacionais

- O sistema às vezes mostra "Nenhuma informação disponível na tabela" — significa que o período ou filtro não tem dados. Ajuste as datas.
- O campo EVENTO no filtro permite selecionar um evento específico nos relatórios gerais.
- Cortesias aparecem como coluna separada — são itens dados sem cobrar (importante para controle).
- O sistema usa sessão por cookies — se der erro 403 ou redirecionar pro login, o usuário precisa relogar manualmente.
- Sempre espere 2-3 segundos após clicar em VISUALIZAR antes de extrair dados (o sistema carrega via AJAX).
- A API interna é POST para `/relatorio-evento-post/{EVENT_ID}?_domain=barfacil.com.br`.
- O formulário usa campos com prefixo `AgpRelatorio[...]` para filtros.
