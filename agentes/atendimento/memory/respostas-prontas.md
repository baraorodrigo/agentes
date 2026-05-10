# Respostas Prontas — Lia

> FAQ canônico do atendimento público. Lia consulta este arquivo SEMPRE antes
> de responder pergunta padrão. Se a pergunta tá aqui, resposta sai daqui
> (sem reescrever do zero, sem improvisar valor).
>
> **Mudança aqui** → registrar em `agentes/atendimento/memory/topicos-permitidos.md`
> com data e contexto antes de aplicar (estas respostas viram print no grupo
> dos clientes — qualquer mudança propaga).

**Última atualização:** 2026-05-09 (criação — campos a preencher com Rodrigo)
**Aprovação Rodrigo:** ⚠️ pendente — Lia NÃO usa esta skill em produção até Rodrigo validar cada item

---

## Schema

```yaml
- id: faq-XXX                          # incremental, auto-gerado
  pergunta_chave: "frase que dispara"  # match aproximado, case-insensitive
  variantes: ["sinônimo 1", "sinônimo 2"]
  resposta: |
    texto literal pra mandar
  fonte: "validado por Rodrigo em YYYY-MM-DD"
  ultima_revisao: YYYY-MM-DD
  publicizavel: true                   # sempre true neste arquivo;
                                       # se false, NÃO entra aqui
```

---

## Regras de uso

1. Lia faz match aproximado de `pergunta_chave` + `variantes` na mensagem do cliente. Se bater, usa `resposta` LITERAL.
2. Se cliente fez 2+ perguntas em uma única mensagem e ambas têm FAQ, responde as duas em sequência (cada uma em parágrafo separado).
3. Se a resposta exige um dado dinâmico (ex: line-up da semana), NÃO entra aqui — entra em `info-evento-publico` que consulta PNE.
4. Pergunta que não tem FAQ → Lia escala pelo fluxo normal de `atendimento-cliente`. NUNCA inventa resposta nova.
5. Atualizações de FAQ: sempre via Rodrigo. Se Rodrigo definiu algo novo no chat, Lia confirma com ele *"posso registrar isso como resposta padrão?"* antes de adicionar aqui.

---

## Entradas

<!-- Lia preenche conforme Rodrigo for validando. Cada item começa em rascunho;
     Rodrigo confirma e Lia muda `fonte` pra "validado por Rodrigo em [data]". -->

<!-- ÁREAS PRIORITÁRIAS PRA POPULAR (rascunho — pendente OK Rodrigo): -->

<!--
- id: faq-001
  pergunta_chave: "endereço"
  variantes: ["onde fica", "qual endereço", "localização", "como chego", "endereco"]
  resposta: |
    A gente fica na esquina da R. João Martins com a Av. 13 de Setembro,
    Imbituba/SC — pertinho da orla.
    Mapa: https://maps.app.goo.gl/AuhL5iskPZBR1NXR6
    Te esperamos! 🤘
  fonte: "brand/NAP-canonico.md (2026-05-10)"
  ultima_revisao: "2026-05-10"
  publicizavel: true

- id: faq-002
  pergunta_chave: "horário de funcionamento"
  variantes: ["que horas abre", "horario", "abre que horas", "fecha que horas", "tá aberto hoje"]
  resposta: |
    A casa abre toda sexta e sábado, 22h até as 5h da manhã.
    Em dia de evento privado, é sob agendamento (ter-dom).
    Quer confirmar pra uma data específica? Manda a data aqui!
  fonte: "brand/NAP-canonico.md (2026-05-10)"
  ultima_revisao: "2026-05-10"
  publicizavel: true

- id: faq-003
  pergunta_chave: "idade mínima"
  variantes: ["idade minima", "menor pode", "tem +18", "menor de idade entra", "que idade"]
  resposta: |
    Idade mínima: [VALOR — pendente Rodrigo, em geral 18].
    Documento com foto obrigatório na entrada.
  fonte: "rascunho — aguarda Rodrigo"
  ultima_revisao: null
  publicizavel: true

- id: faq-004
  pergunta_chave: "formas de pagamento"
  variantes: ["aceita cartão", "aceita pix", "tem maquininha", "como paga", "dinheiro"]
  resposta: |
    Aceitamos cartão (crédito/débito) e pix.
    [DETALHE BANDEIRAS — pendente Rodrigo]
  fonte: "rascunho — aguarda Rodrigo"
  ultima_revisao: null
  publicizavel: true

- id: faq-005
  pergunta_chave: "couvert"
  variantes: ["tem couvert", "cobra couvert", "couvert artistico", "consumação mínima"]
  resposta: |
    [POLÍTICA DE COUVERT/CONSUMAÇÃO — pendente Rodrigo]
  fonte: "rascunho — aguarda Rodrigo"
  ultima_revisao: null
  publicizavel: true

- id: faq-006
  pergunta_chave: "estacionamento"
  variantes: ["onde estaciono", "tem estacionamento", "tem valet", "vaga"]
  resposta: |
    [INFO ESTACIONAMENTO — pendente Rodrigo]
  fonte: "rascunho — aguarda Rodrigo"
  ultima_revisao: null
  publicizavel: true

- id: faq-007
  pergunta_chave: "wifi"
  variantes: ["tem wifi", "senha do wifi", "internet"]
  resposta: |
    Tem wifi pra galera sim 🤘
    [SE TEM SENHA PUBLICÁVEL: senha — pendente Rodrigo. Se não, "pede pro
    bartender na hora"]
  fonte: "rascunho — aguarda Rodrigo"
  ultima_revisao: null
  publicizavel: true

- id: faq-008
  pergunta_chave: "dress code"
  variantes: ["o que vestir", "tem dress code", "pode entrar de chinelo", "regra de roupa"]
  resposta: |
    [POLÍTICA DRESS CODE — pendente Rodrigo. Default: vista bem, sem dress
    code formal]
  fonte: "rascunho — aguarda Rodrigo"
  ultima_revisao: null
  publicizavel: true

- id: faq-009
  pergunta_chave: "perdi e achados"
  variantes: ["perdi minha [item]", "esqueci no bar", "achados e perdidos"]
  resposta: |
    Vou pedir pra galera dar uma olhada aqui. Me passa o que era,
    quando tu veio e tua descrição rapidinha — se aparecer, te chamo!
  fonte: "rascunho — aguarda Rodrigo"
  ultima_revisao: null
  publicizavel: true

- id: faq-010
  pergunta_chave: "instagram do bar"
  variantes: ["qual o insta", "redes sociais", "tem instagram", "@elcoyote", "site"]
  resposta: |
    Nosso Insta principal é @elcoyotepub — novidade sai lá primeiro 🤘
    Pra eventos privados (casamento, aniversário, corporativo) é @elcoyote_eventos.
    Site: elcoyotepub.com
  fonte: "brand/NAP-canonico.md (2026-05-10)"
  ultima_revisao: "2026-05-10"
  publicizavel: true
-->

---

## Tópicos que NÃO entram aqui (mesmo se cliente perguntar muito)

- Faturamento, ticket médio, "qual a média de público"
- Salário/comissão de promoter, garçom, segurança
- Endereço residencial do Rodrigo, telefone privado
- Nome de fornecedor (cerveja, energético, decoração)
- Histórico de qual evento bombou ou flopou financeiramente
- Quem o bar contrata pra produzir / quem é dono junto
- Próximos eventos não anunciados oficialmente
- Política interna ("a gente desliga promoter quando X")

Se cliente perguntar sobre qualquer um → resposta padrão:

```
Esse a gente prefere alinhar fora daqui. Manda um direct pro
Insta @elcoyotepub que a galera certa te responde 🤘
```
