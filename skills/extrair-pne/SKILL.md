---
name: pensanoevento-relatorio
description: |
  Extrai relatórios do sistema Pensa no Evento (pensanoevento.com.br/sistema/) via Chrome browser automation.
  Use SEMPRE que o usuário mencionar Pensa no Evento, lista de evento, lista de nomes,
  nomes inseridos, nomes convertidos, taxa de conversão, promoters/comissários,
  "quem inseriu", "quem trouxe", "quantos converteram", "lista do evento",
  "relatório de presença", "ranking de conversão", "faturamento online",
  aniversariantes, reservas, ou qualquer pedido de dados de listas e público
  do El Coyote vindos do sistema Pensa no Evento.
  Também acione quando o usuário pedir dados de promoters por evento,
  comparação de performance entre comissários/membros, ou integração
  com o dashboard de promoters.
---

# Pensa no Evento — Extração de Relatórios

Skill para extrair dados do sistema Pensa no Evento (PNE) do El Coyote Pub - Imbituba.

## Pré-requisitos

- O usuário precisa estar com o Chrome aberto e logado em www.pensanoevento.com.br/sistema/
- O MCP Claude in Chrome precisa estar ativo
- A equipe logada é "El Coyote Pub" (Rodrigo Barão)

## Estrutura do Sistema

### URLs principais

- **Home/Dashboard**: `https://www.pensanoevento.com.br/sistema/`
- **Lista de Eventos**: `https://www.pensanoevento.com.br/sistema/eventos/`
- **Eventos Antigos**: `https://www.pensanoevento.com.br/sistema/eventos/?filter=antigos`
- **Evento específico**: `https://www.pensanoevento.com.br/sistema/eventos/{EVENT_ID}`
- **Resumo do evento**: `https://www.pensanoevento.com.br/sistema/eventos/{EVENT_ID}/resumo`
- **Listas do evento**: `https://www.pensanoevento.com.br/sistema/eventos/{EVENT_ID}/listas`
- **Lista de Nomes (tabela completa)**: `https://www.pensanoevento.com.br/sistema/eventos/{EVENT_ID}/listas?acao=listaNomes&id={EVENT_ID}`
- **Relatórios do evento**: `https://www.pensanoevento.com.br/sistema/relatorios/{EVENT_ID}`
- **Financeiro**: `https://www.pensanoevento.com.br/sistema/financeiro/`

### Menu de Navegação Principal

| Menu | Submenus |
|------|----------|
| Início | Dashboard com vendas hoje + gráfico 7 dias |
| Eventos | Calendário de eventos, lista com filtro próximos/antigos |
| Reservas | Central de Solicitações de Reserva |
| Relatórios | (ver seção abaixo) |
| Financeiro | Faturamento por Casa, Contas Bancárias |

### Menu Relatórios (top nav) — URLs

| Relatório | URL | Descrição |
|-----------|-----|-----------|
| Resumo Geral Por Período | `/sistema/relatorios/resumo_geral.php` | Visão geral consolidada |
| Conversões Por Evento | `/sistema/relatorios/nomes_convertidos_evento.php` | Filtro: Membro + Período. Cards: Total Convertidos, Valor Vendido, Comissões. Detalhado por evento |
| Conversões Por Membro | `/sistema/relatorios/nomes_convertidos.php` | **PRINCIPAL para promoters.** Filtro: período. Mostra TODOS os membros com: Inseridos, Convertidos, Taxa Conversão, Total, Comissões |
| Reservas Por Membro | `/sistema/relatorios/reservas_membro.php` | Reservas agrupadas por membro |
| Reservas de Aniversário Por Membro | `/sistema/relatorios/reservas_aniversario.php` | Reservas de aniversário por membro |
| Visão de Público | `/sistema/relatorios/visao_publico.php` | Análise demográfica do público |
| Aniversariantes | `/sistema/relatorios/aniversariantes.php` | Lista de aniversariantes |
| Ranking de Clientes | `/sistema/relatorios/ranking_clientes.php` | Ranking por frequência/gasto |
| Ranking de Conversões | `/sistema/relatorios/ranking_conversoes.php` | Ranking de taxa de conversão |
| Ranking de Frequência | `/sistema/relatorios/ranking_frequencia.php` | Ranking de frequência de presença |
| Impressões (Ingressos) | `/sistema/relatorios/impressoes.php` | Controle de impressão de ingressos |
| Ingressos Vendidos Por Membro | `/sistema/relatorios/ingressos_membro.php` | Vendas de ingressos por comissário |
| Total de Vendas Por Membro | `/sistema/relatorios/vendas_membro.php` | Total de vendas por comissário |
| Nomes convertidos | `/sistema/relatorios/nomes_convertidos_comissario.php` | Nomes convertidos por comissário |
| Reservas (Comissários) | `/sistema/relatorios/reservas_comissario.php` | Reservas por comissário |
| Exportar Clientes (Excel) | `/sistema/relatorios/exportar_clientes.php` | Export completo de clientes |

### Sub-abas dentro de cada evento

| Aba | O que tem |
|-----|-----------|
| RESUMO | Dashboard: presentes, receita, gênero, métodos pagamento |
| RESERVAS | Reservas de mesas/áreas |
| VENDA ONLINE | Vendas de ingressos online |
| LISTAS | **Tabela principal**: todos os nomes com Situação, Nome, Produto, Inserido por, Valor |
| LISTAS ESPECIAIS / ANIVERSÁRIO | Listas especiais e aniversários |
| PERMISSÕES / LIMITES | Controle de acesso dos membros |
| RELATÓRIOS | Resumo do evento: presentes, receita, gênero |
| AJUSTES | Configurações do evento |

## Como extrair dados

### Método 1: Lista de Nomes do Evento (dados detalhados por pessoa)

Esta é a extração mais importante — mostra QUEM inseriu cada nome (campo "Inserido por" = promoter).

```
1. Navegar para: /sistema/eventos/{EVENT_ID}/listas
2. Clicar em "Consultar Nomes Inseridos"
3. URL resultante: /sistema/eventos/{EVENT_ID}/listas?acao=listaNomes&id={EVENT_ID}
4. Mudar paginação para "Todos" (select no final da página)
5. Esperar 3 segundos para carregar
6. Extrair via JavaScript
```

**JavaScript para extrair Lista de Nomes:**
```javascript
// Primeiro: mudar paginação para mostrar TODOS
var selects = document.querySelectorAll('select');
selects.forEach(function(s) {
  for (var i = 0; i < s.options.length; i++) {
    if (s.options[i].text === 'Todos') {
      s.value = s.options[i].value;
      s.dispatchEvent(new Event('change'));
    }
  }
});

// Esperar 3 segundos e depois extrair
setTimeout(function() {
  var rows = document.querySelectorAll('table tbody tr');
  var data = [];
  rows.forEach(function(tr) {
    var tds = tr.querySelectorAll('td');
    if (tds.length >= 7) {
      data.push({
        situacao: tds[2] ? tds[2].textContent.trim() : '',
        nome: tds[4] ? tds[4].textContent.trim() : '',
        produto: tds[5] ? tds[5].textContent.trim().split('\n')[0].trim() : '',
        inserido_por: tds[6] ? tds[6].textContent.trim() : '',
        valor: tds[7] ? tds[7].textContent.trim() : ''
      });
    }
  });
  window._pneData = data;
}, 3000);

// Depois de esperar, recuperar:
JSON.stringify({total: window._pneData.length, data: window._pneData});
```

**JavaScript para agregar por promoter (Inserido por):**
```javascript
var rows = document.querySelectorAll('table tbody tr');
var byPromoter = {};
rows.forEach(function(tr) {
  var tds = tr.querySelectorAll('td');
  if (tds.length >= 7) {
    var promoter = tds[6] ? tds[6].textContent.trim() : 'Desconhecido';
    var situacao = tds[2] ? tds[2].textContent.trim() : '';
    if (!byPromoter[promoter]) {
      byPromoter[promoter] = {inseridos: 0, convertidos: 0};
    }
    byPromoter[promoter].inseridos++;
    if (situacao === 'CONVERTIDO') byPromoter[promoter].convertidos++;
  }
});
// Calcular taxa
Object.keys(byPromoter).forEach(function(k) {
  var p = byPromoter[k];
  p.taxa = p.inseridos > 0 ? ((p.convertidos / p.inseridos) * 100).toFixed(1) + '%' : '0%';
});
JSON.stringify(byPromoter);
```

### Método 2: Relatório Conversões Por Membro (visão consolidada)

Relatório agregado que mostra todos os membros/comissários com seus totais.

```
1. Navegar para: /sistema/relatorios/nomes_convertidos.php
2. Ajustar período se necessário (date picker no topo)
3. Clicar em "visualizar"
4. Esperar 2 segundos
5. Extrair via JavaScript
```

**JavaScript para extrair Conversões Por Membro:**
```javascript
var panels = document.querySelectorAll('.panel.panel-default.user');
var results = [];
panels.forEach(function(p) {
  var heading = p.querySelector('.panel-heading, .panel-title');
  var name = '';
  if (heading) {
    name = heading.textContent.trim().replace(/Excel/g, '').trim();
  } else {
    for (var i = 0; i < p.children.length; i++) {
      var c = p.children[i];
      if (!c.classList.contains('panel-body')) {
        var t = c.textContent.trim().replace(/Excel/g, '').trim();
        if (t.length > 2 && t.length < 60) { name = t; break; }
      }
    }
  }
  var table = p.querySelector('table');
  var totalRow = table ? table.querySelector('tbody tr:last-child') : null;
  var cells = totalRow ? totalRow.querySelectorAll('td') : [];
  results.push({
    membro: name,
    inseridos: cells.length > 1 ? cells[1].textContent.trim() : '',
    convertidos: cells.length > 2 ? cells[2].textContent.trim() : '',
    taxa: cells.length > 3 ? cells[3].textContent.trim() : '',
    total: cells.length > 4 ? cells[4].textContent.trim() : '',
    comissoes: cells.length > 5 ? cells[5].textContent.trim() : ''
  });
});
JSON.stringify({count: results.length, data: results});
```

### Método 3: Relatório do Evento (Resumo)

```
1. Navegar para: /sistema/relatorios/{EVENT_ID}
2. Esperar 2 segundos
3. Extrair via JavaScript
```

**JavaScript para extrair Resumo do Evento:**
```javascript
// Extrair cards de resumo
var cards = document.querySelectorAll('.info-box, .small-box, [class*="card"], .col-md-3, .col-sm-6');
var summary = {};
cards.forEach(function(c) {
  var label = c.querySelector('.info-box-text, .small-box-footer, h4, h5, .title, p');
  var value = c.querySelector('.info-box-number, .small-box-number, h3, .value, .number');
  if (label && value) {
    summary[label.textContent.trim()] = value.textContent.trim();
  }
});
// Extrair tabela de listas (Bônus, Cortesias etc)
var tables = document.querySelectorAll('table');
var listData = [];
tables.forEach(function(t) {
  t.querySelectorAll('tbody tr').forEach(function(tr) {
    var cells = [];
    tr.querySelectorAll('td').forEach(function(td) { cells.push(td.textContent.trim()); });
    if (cells.length > 0) listData.push(cells);
  });
});
JSON.stringify({summary: summary, lists: listData});
```

### Método 4: Faturamento (Financeiro)

```
1. Navegar para: /sistema/financeiro/
2. Ajustar datas se necessário
3. Clicar em "visualizar"
4. Esperar 2 segundos
5. Extrair tabela
```

**JavaScript para extrair Faturamento:**
```javascript
var table = document.querySelector('table');
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

## Filtros disponíveis na Lista de Nomes

| Coluna | Tipo de filtro | Valores exemplo |
|--------|---------------|-----------------|
| Situação | Dropdown | CONVERTIDO, INSERIDO |
| Nome | Dropdown/busca | Lista de todos os nomes |
| Produto | Dropdown | Lista Aniversário, Lista Free Unissex, etc. |
| Inserido por | Dropdown | Nomes dos promoters/comissários |
| Valor/Consumação | Dropdown | Valores |
| Paginação | Dropdown | 10, 25, 50, Todos |

## Eventos conhecidos (histórico parcial)

Eventos recentes encontrados no sistema (maio 2026):
- SHOW NACIONAL VINE 7 E MC DANADO — 30/04/2026 (ID: 101516) — 596 inseridos, 252 convertidos
- BAILINHO DE SEXTA — 01/05/2026
- Boteco 360° — 02/05/2026
- SHOW NACIONAL MC LUCKY — 18/04/2026

## Relação com outros sistemas

### Integração com Bar Fácil
- **Pensa no Evento** = LISTAS (quem veio, quem inseriu, conversão)
- **Bar Fácil** = VENDAS (quanto vendeu, por produto, por atendente)
- Cruzar dados: qual promoter trouxe mais público que consumiu mais no bar

### Integração com Dashboard de Promoters
- O campo **"Inserido por"** na Lista de Nomes = nome do promoter
- **Situação = CONVERTIDO** = pessoa veio ao evento (presença confirmada)
- **Situação = INSERIDO** = nome foi colocado na lista mas pessoa não apareceu
- Esses dados alimentam o dashboard de promoters:
  - Pessoas trazidas = total de nomes INSERIDOS por aquele promoter
  - Pessoas convertidas = total de CONVERTIDOS
  - Taxa de conversão = Convertidos / Inseridos

## Conceitos importantes

| Termo | Significado |
|-------|-------------|
| Inserido | Nome colocado na lista pelo promoter |
| Convertido | Pessoa que apareceu no evento (presença confirmada) |
| Taxa Conversão | % de inseridos que realmente vieram |
| Membro | Pessoa da equipe que pode inserir nomes (promoter/comissário) |
| Comissário | Membro com comissão sobre vendas de ingressos |
| Produto | Tipo de lista (Lista Free Unissex, Lista Aniversário, etc.) |
| Lista Especial | Sub-lista dentro de um produto (ex: "Lista Free da Rafa") |
| Faturamento | Receita de venda de ingressos online |
| A Repassar | Valor que o PNE deve repassar para a casa |

## Dicas operacionais

- A tabela de nomes é paginada (50 por página padrão). Sempre mudar para "Todos" antes de extrair.
- O sistema usa DataTables — os filtros são dropdowns dentro do thead.
- A busca de evento pode ser feita pela barra superior "Busque um evento pelo nome ou data..."
- Eventos encerrados mostram aviso laranja "Este evento já foi encerrado."
- A sessão é por cookies — se expirar, precisa relogar manualmente.
- As URLs de relatórios gerais usam `.php` no final.
- O campo "Inserido por" é a chave para conectar com o sistema de promoters.
- Os filtros dropdown permitem filtrar por Situação, Produto e Inserido por antes de extrair.
