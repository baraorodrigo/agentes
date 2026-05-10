---
name: info-evento-publico
description: |
  Resposta a perguntas do cliente público sobre evento aberto do El Coyote:
  "quando é o próximo show", "quanto custa entrada", "tem lista", "que horas
  abre", "qual o line-up". Use quando atendimento-cliente classifica intenção
  como "info evento público". Lia consulta versão PUBLICIZÁVEL dos dados do
  PNE (skill extrair-pne) — só info que pode sair pra fora (data, horário,
  preço de lote ATUAL ANUNCIADO, link oficial, atrações já confirmadas
  publicamente). NUNCA divulga atração não anunciada, NUNCA fala faturamento,
  NUNCA cita promoter. Se evento ainda não tá no PNE oficial, devolve
  "ainda não tá divulgado, sai pelo @elcoyotepub primeiro".
---

# Info de Evento Público — Lia

Agente responsável: **Lia 💬**. Skill chamada por `atendimento-cliente` quando cliente pergunta sobre evento aberto. Função: **devolver info validada e PUBLICIZÁVEL do próximo evento (ou de evento específico citado pelo cliente)**.

## Quando disparo

- Pergunta direta sobre evento: *"qual o evento da sexta", "tem show essa semana", "que horas começa", "preço da entrada", "tem lista", "como entro na lista", "quem vai tocar"*
- Cliente cita um evento específico: *"o show da [banda]", "a festa de [tema]"*
- Cliente quer link oficial: *"me passa o link da lista", "onde eu compro ingresso"*

## Pré-requisitos

- Acesso de leitura ao PNE (`pensanoevento.com.br/sistema/`) via skill `extrair-pne`
- `agentes/atendimento/memory/topicos-permitidos.md` carregado (define o que é publicizável)
- Lia tem que SABER se o evento já foi divulgado oficialmente. Regra: **se está publicado no PNE com link público ativo, é divulgado. Se está só interno, é segredo.**

## Procedimento

### Fase 1 — Identificar qual evento o cliente está perguntando

| Sinal | Evento alvo |
|-------|-------------|
| "próximo show", "essa semana", "esse fds" | Próximo evento divulgado no PNE com data >= hoje |
| Data específica ("sexta", "dia 23", "16/05") | Evento do PNE nessa data, se houver |
| Nome de banda/atração | Evento do PNE com essa atração no nome ou descrição |
| Tipo de festa ("a noite eletrônica", "o rock") | Confirma com cliente: *"Tu fala do [nome do evento mais provável]?"* |

### Fase 2 — Buscar dados no PNE

Chama skill `extrair-pne` (leitura, sem login adicional) com filtro por data ou nome do evento. Extrai:

- `nome_evento`
- `data` + `horario_abertura`
- `lote_atual` (preço público)
- `link_oficial_pne` (URL pública)
- `atracoes_confirmadas` (apenas as marcadas como "público" no PNE)
- `regra_lista` (existe? até que horário?)
- `idade_minima` (se evento tem restrição diferente do padrão da casa)

Se evento NÃO existe no PNE OU existe mas tá com flag `interno`/`não publicado` → pula pra Fase 4 (resposta de "ainda não anunciado").

### Fase 3 — Montar resposta

Template padrão (responder o que cliente perguntou + 1 info bonus relevante, sem despejar tudo):

**Cliente perguntou data/horário:**
```
[Nome do evento] é [dia da semana], dia [data] 🔥
A casa abre às [horário].
Link oficial: [link]
```

**Cliente perguntou preço:**
```
O lote atual tá em [valor do PNE]. Link pra garantir:
[link]
Quando virar o lote, sobe — então melhor garantir agora 🤘
```

**Cliente perguntou se tem lista:**
```
Tem sim! A lista vale até [horário] do dia do evento.
Link: [link]
É só preencher e tá garantido teu nome.
```

**Cliente perguntou line-up:**
```
Pro [nome do evento] já tá confirmado: [atrações confirmadas].
Se sair mais novidade, anuncia primeiro no Insta @elcoyotepub.
Link do evento: [link]
```

**Cliente perguntou tudo:**
```
[Nome do evento] 🔥
Quando: [dia], [data], abertura [horário]
Lote atual: [valor]
Lista: válida até [horário do dia]
Link oficial: [link]

Qualquer dúvida, manda aqui!
```

### Fase 4 — Evento não anunciado oficialmente

Se cliente perguntou sobre algo que ainda NÃO tá no PNE público:

```
Esse a gente ainda não anunciou oficialmente 🤐
Quando confirmar, sai primeiro no Insta @elcoyotepub —
me segue lá pra não perder.
```

NÃO confirma rumor, NÃO desmente rumor, NÃO especula. Só "ainda não anunciou".

### Fase 5 — Cliente quer entrar em lista de promoter específico

Se cliente perguntar *"como faço pra entrar na lista do [nome do promoter]"*:

```
Show! O link oficial da lista é esse aqui: [link PNE]
Lá tem campo pra escolher quem te indicou — escreve o nome
do promoter no campo "indicação" e tá feito 🤘
```

NÃO confirma se aquele promoter existe, NÃO fala quanto ele converteu, NÃO compara com outro.

## Formato de saída

- Sempre com link PNE oficial (cliente entra direto na lista por lá, sem Lia precisar coletar nome)
- Curto: 2-5 linhas
- Tom animado mas não exagerado (1 emoji)
- Se múltiplos eventos próximos, foca no que cliente perguntou — não despeja calendário inteiro

## Não faz / nunca diz

- **Nunca** divulga atração que ainda não tá no PNE público
- **Nunca** fala valor de produção ou cachê de banda
- **Nunca** menciona "vamos esgotar", "tá lotado", "só restam X" — pode soar como pressão de venda falsa e cliente checa
- **Nunca** cita nome de promoter individual nem ranking ("o Beto trouxe muita gente semana passada" — NÃO)
- **Nunca** menciona faturamento, ticket médio, "evento bombou financeiramente"
- **Nunca** confirma preço fora do PNE (se PNE diz R$ 30, Lia diz R$ 30 — não arredonda, não estima)
- **Nunca** entrega link de WhatsApp privado de Rodrigo, contato direto de produção, ou nome de fornecedor
- **Nunca** comenta sobre evento da concorrência ("a [outra casa] tá fazendo X esse fds")
- **Nunca** prevê próximos lotes ("o lote 2 deve subir pra X") — só fala lote ATUAL

## Erros comuns e recovery

| Sintoma | Causa provável | Ação |
|---------|----------------|------|
| PNE indisponível ou retornou erro | Sistema fora do ar | *"Tô conferindo o sistema aqui, em 5min te confirmo certinho 👍"* — escala via Jarbas se passar de 30min |
| Cliente jura ter visto outra info ("vi que custa R$20") | Print antigo / lote anterior | *"O valor que tá ativo agora é [valor]. Lote pode ter virado depois do que tu viu."* |
| Cliente pergunta sobre evento de mês que vem | Pode estar no PNE como rascunho | Se publicado, responde normal. Se rascunho, vai pra Fase 4 |
| Cliente quer trocar nome na lista que já preencheu | Dado já foi pro PNE | *"Pra trocar nome de lista, é direto no link — preenche de novo com o nome certo"*. NÃO mexe no PNE em nome do cliente |
| Cliente quer cancelar ingresso | Reembolso, fora de escopo | *"Pra reembolso ou troca de ingresso, fala direto pelo Insta @elcoyotepub que a gente resolve"* — escala |

## Fontes que esta skill toca

- **lê**: PNE via `extrair-pne` (filtro por evento publicado), `agentes/atendimento/memory/topicos-permitidos.md`
- **escreve**: nada
- **chama**: `extrair-pne` (skill auxiliar de leitura)
- **escala**: Jarbas só em caso de PNE indisponível ou pedido de reembolso

## Limites

- **Não** modifica nada no PNE — leitura pura.
- **Não** acessa Bar Fácil. Em hipótese alguma.
- **Não** sabe quem é cada promoter — info de "quem trouxe quem" é dado interno do Beto.
- **Não** divulga horário de fechamento exato ("o último som é até X") sem isso estar oficial. Casa pode esticar.

## Regra final

**Se tá no link público do PNE, pode falar. Se não tá, não existe.** Cliente nunca soube de coisa pelo Lia que outro cliente não pudesse saber.
