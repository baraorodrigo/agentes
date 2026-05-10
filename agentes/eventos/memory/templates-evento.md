# Templates de Evento — Gil

> Templates por tipo de evento. Cada template define lista padrão de fornecedores, equipe operacional, janela de horário típica, riders comuns e itens críticos de checklist.
>
> Skills `briefing-pre-evento`, `checklist-operacional-dia` e `evento-privado-orcamento` leem daqui pra montar briefing/proposta consistente. `pos-evento-licoes` pode contribuir ajustando template baseado em padrões observados.

**Última atualização:** 2026-05-09 (criação — templates iniciais a serem refinados com a operação real)

---

## Schema

```yaml
- id: tpl-XXX                       # incremental
  nome: "..."                       # ex: "Sertaneja Universitária"
  tipo: publico | privado
  ocasiao: "..."                    # ex: "público recorrente", "aniversário", "corporativo"
  publico_estimado_default: N
  janela_horario_default:
    abre: "HH:MM"
    fecha: "HH:MM"
    soundcheck: "HH:MM"
  fornecedores_padrao:
    - categoria: som
      criticidade: critica          # critica | media | baixa
      notas: "..."
    - categoria: seguranca
      criticidade: critica
      notas: "..."
    # etc
  equipe_operacional:
    bartenders_extras: N            # 0 = só quadro fixo
    garcons_extras: N
    seguranca_pessoas: N
  rider_tipico:
    - "água/refrigerante para banda"
    - "iluminação cênica"
    # etc
  checklist_critico:
    - "atração confirmou chegada"
    - "rider entregue"
    # etc
  notas_gerais: "..."
  ultima_atualizacao: ISO8601
```

## Regras de manutenção

- **Criar template novo**: quando aparece tipo de evento que não tem template correspondente. Gil cria com defaults conservadores; refina conforme primeiros eventos do tipo.
- **Atualizar template**: skill `pos-evento-licoes` identifica padrão recorrente (ex: "Sertaneja sempre precisa +2 garçons"). Após 3+ eventos confirmando, Gil ajusta template.
- **Deprecar template**: tipo de evento não acontece mais há 6+ meses. Marca `deprecated: true` (não deleta).
- **Defaults conservadores**: melhor superestimar fornecedor/equipe e ajustar pra menos do que subestimar e ficar pelado.

---

## Templates ativos

### tpl-001 — Sertaneja Universitária

```yaml
id: tpl-001
nome: "Sertaneja Universitária"
tipo: publico
ocasiao: "público recorrente"
publico_estimado_default: 250
janela_horario_default:
  abre: "22:00"
  fecha: "04:00"
  soundcheck: "20:00"
fornecedores_padrao:
  - categoria: som
    criticidade: critica
    notas: "PA de porte médio; banda traz instrumentos próprios mas casa fornece PA"
  - categoria: luz
    criticidade: media
    notas: "iluminação cênica básica + lasers se rider pedir"
  - categoria: seguranca
    criticidade: critica
    notas: "público jovem, pico de aglomeração na entrada"
  - categoria: gelo
    criticidade: media
    notas: "público alto consumo de cerveja; gelo extra recomendado"
equipe_operacional:
  bartenders_extras: 2
  garcons_extras: 1
  seguranca_pessoas: 4
rider_tipico:
  - "água/isotônico para banda (8-12 unidades)"
  - "camarim com espelho"
  - "frutas/sanduíches leves"
  - "toalhas brancas (4-6)"
checklist_critico:
  - "banda confirmou chegada"
  - "rider entregue 24h antes"
  - "soundcheck 20h"
  - "lista PNE > 100 inseridos no D-1"
  - "segurança briefada sobre porta + idade mínima"
notas_gerais: "Padrão histórico: 1ª quinzena do mês fecha melhor que 2ª (Raul investiga). Aniversariantes costumam puxar conversão alta."
ultima_atualizacao: 2026-05-09T00:00:00-03:00
```

### tpl-002 — Rock Night

```yaml
id: tpl-002
nome: "Rock Night"
tipo: publico
ocasiao: "público recorrente"
publico_estimado_default: 180
janela_horario_default:
  abre: "22:00"
  fecha: "03:00"
  soundcheck: "20:30"
fornecedores_padrao:
  - categoria: som
    criticidade: critica
    notas: "PA mais robusto que Sertaneja — guitarra/bateria precisam de mais headroom"
  - categoria: luz
    criticidade: media
    notas: "iluminação cênica obrigatória, atmosfera é parte do produto"
  - categoria: seguranca
    criticidade: critica
    notas: "público mais velho que Sertaneja, mas mosh/pogo possível em headliners pesados"
equipe_operacional:
  bartenders_extras: 1
  garcons_extras: 0
  seguranca_pessoas: 3
rider_tipico:
  - "água + cerveja artesanal pra banda"
  - "camarim com geladeira"
  - "toalhas pretas (rock)"
  - "merch table reservada"
checklist_critico:
  - "banda confirmou + headliner OK"
  - "rider entregue 48h antes (banda costuma cobrar mais)"
  - "soundcheck 20:30 sem atraso"
  - "merch table montada antes das portas abrirem"
  - "lista PNE > 80 inseridos no D-1"
notas_gerais: "Ticket médio costuma ser mais alto que Sertaneja (cerveja artesanal, camisetas). Banda local tem público fiel — divulgação direta da banda gera mais que casa só."
ultima_atualizacao: 2026-05-09T00:00:00-03:00
```

### tpl-003 — Aniversário Privado

```yaml
id: tpl-003
nome: "Aniversário Privado"
tipo: privado
ocasiao: "aniversário"
publico_estimado_default: 80
janela_horario_default:
  abre: "21:00"
  fecha: "03:00"
  soundcheck: "n/a"               # geralmente DJ próprio ou trilha
fornecedores_padrao:
  - categoria: som
    criticidade: critica
    notas: "DJ próprio do El Coyote ou DJ contratado a pedido — confirmar antes"
  - categoria: seguranca
    criticidade: critica
    notas: "público fechado, mas porta precisa de controle de lista de convidado"
  - categoria: decoracao
    criticidade: media
    notas: "cliente costuma trazer ou contratar decoradora; casa fornece estrutura básica"
equipe_operacional:
  bartenders_extras: 1
  garcons_extras: 1
  seguranca_pessoas: 2
rider_tipico:
  - "lista de convidados consolidada D-1"
  - "consumo mínimo combinado por escrito"
  - "aniversariante: drink/bolo/parabéns combinado"
checklist_critico:
  - "lista de convidados na porta D-1"
  - "consumação mínima acordada e assinada"
  - "decoração entregue/montada antes das portas"
  - "horário de parabéns + bolo combinado com cliente"
  - "regra de 'fora da lista' definida (paga consumo? recusa?)"
notas_gerais: "Cliente sempre via Lia. Margem definida pelo Tomás. Cobrança do sinal antes do evento — Tomás registra. Cliente paga restante até saída."
ultima_atualizacao: 2026-05-09T00:00:00-03:00
```

### tpl-004 — Corporativo

```yaml
id: tpl-004
nome: "Corporativo"
tipo: privado
ocasiao: "empresa"
publico_estimado_default: 60
janela_horario_default:
  abre: "19:00"
  fecha: "23:00"               # corporativo tende a fechar mais cedo
  soundcheck: "n/a"
fornecedores_padrao:
  - categoria: som
    criticidade: media
    notas: "música ambiente, talvez microfone pra fala/discurso"
  - categoria: seguranca
    criticidade: media
    notas: "público controlado, lista da empresa"
  - categoria: garcom_extra
    criticidade: critica
    notas: "atendimento de mesa é o produto; quadro fixo geralmente não dá conta"
equipe_operacional:
  bartenders_extras: 1
  garcons_extras: 2
  seguranca_pessoas: 1
rider_tipico:
  - "menu fechado ou aberto (cliente decide)"
  - "ponto de fala/microfone se houver discurso"
  - "estacionamento ou Uber combinado"
  - "nota fiscal corporativa"
checklist_critico:
  - "menu acordado e assinado"
  - "número de convidados confirmado D-2"
  - "nota fiscal pré-emitida ou modelo combinado"
  - "ponto de fala montado se aplicável"
  - "horário de saída respeitado (corporativo é rígido)"
notas_gerais: "Cliente pessoa jurídica — Tomás precisa de CNPJ pra precificação correta. Margem costuma ser melhor que aniversário privado pelo ticket alto e horário curto."
ultima_atualizacao: 2026-05-09T00:00:00-03:00
```

### tpl-005 — Despedida (de solteiro/a)

```yaml
id: tpl-005
nome: "Despedida"
tipo: privado
ocasiao: "despedida"
publico_estimado_default: 30
janela_horario_default:
  abre: "22:00"
  fecha: "04:00"
  soundcheck: "n/a"
fornecedores_padrao:
  - categoria: som
    criticidade: media
    notas: "DJ próprio funciona bem; público pequeno não exige PA grande"
  - categoria: seguranca
    criticidade: media
    notas: "grupo unido, baixo risco; mas confusão pode rolar (público alterado)"
  - categoria: bartender_extra
    criticidade: media
    notas: "público quer atenção rápida; 1 bartender dedicado ajuda"
equipe_operacional:
  bartenders_extras: 1
  garcons_extras: 0
  seguranca_pessoas: 1
rider_tipico:
  - "drink/shots especiais combinados (homenagem ao despedido)"
  - "área reservada ou mesa grande"
  - "consumo mínimo combinado"
checklist_critico:
  - "consumo mínimo combinado"
  - "lista de convidados (em geral 20-40)"
  - "homenagem/drink especial preparado"
  - "área reservada montada"
notas_gerais: "Grupo costuma chegar já alterado. Atenção redobrada da segurança e bar. Cliente é geralmente o organizador (amigo do despedido) — cobrar dele, não do despedido."
ultima_atualizacao: 2026-05-09T00:00:00-03:00
```

---

## Templates a criar (futuros)

Tipos de evento que ainda não rolaram mas podem aparecer:

- **Festival** — múltiplas atrações, dia inteiro, estrutura grande
- **Casamento/Recepção** — privado de alto valor, decoração intensiva, banquete
- **Lançamento de produto** — corporativo com presença de imprensa
- **Show solo (artista grande)** — evento público com cachê alto, divulgação intensiva

Quando o primeiro caso real aparecer, Gil cria template inicial conservador e refina nos seguintes.

---

## Privacidade

- Leitura: Gil + Rodrigo + Tomás (Tomás usa pra precificar privado)
- Outros agentes (Beto, Lia, Duda, Raul) podem ler info **pública** do template (tipo, janela de horário) mas não custo de referência ou rider sensível.
