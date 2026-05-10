# El Coyote Corp — Cockpit

Especificação das telas e lógica de comportamento. Acompanha o mockup HTML.

---

## Visão geral

Dashboard web desktop-first, single-user (Rodrigo). 6 telas com navegação por barra superior. Não tem onboarding, não tem multi-tenancy, não precisa ser bonito pra cliente — é ferramenta de operador.

**Princípios de comportamento:**

- Default da tela inicial responde "o que precisa de mim agora", não "todos os números do sistema".  
- Cada tela responde uma pergunta específica e direta.  
- Listagens ordenadas por prioridade/urgência por padrão. Filtro por agente é caso secundário.  
- Mesma estrutura visual em telas equivalentes (memória muscular \> elegância). Zonas vazias quando não se aplicam, em vez de esconder.  
- Edição inline sempre que possível (clica no texto, edita, salva).

**Estado a ser persistido:**

- Última tela aberta (volta nela ao reabrir).  
- Estado dos filtros da Semana (lembra última escolha).  
- Agente selecionado na Cabine.

---

## Tela 1 — Hoje

**Pergunta que responde:** o que tá rolando agora e o que precisa de mim.

**Estrutura vertical (de cima pra baixo):**

1. **4 stat cards** lado a lado: Em execução · Travado em ti · Entregue hoje · Agendado pra hoje. Números puros, sem gráfico. Stat "Travado em ti" em vermelho quando \> 0\.  
     
2. **Bloco "Agora · em execução"** — lista de agentes processando algo neste instante. Cada linha: avatar, descrição da tarefa, sub-info (progresso ou contagem), tempo estimado restante. Bolinha verde pulsando antes do título do bloco.  
     
3. **Bloco "Travado em ti"** — itens parados esperando decisão. Cada linha: avatar, descrição, há quanto tempo parou, prioridade. Botão de ação inline ("resolver", "ver", "passar pra X"). Bolinha vermelha. Borda vermelha de 2px à esquerda.  
     
4. **Bloco "Agendado pra hoje"** — timeline simples horária do que vem por aí. Cada linha: hora · agente — descrição. Sem botões de ação.  
     
5. *(Opcional, desce)* Bloco "Entregue hoje" — itens já saídos, com opacidade reduzida. Tu pode ocultar por padrão e só mostrar com toggle.

**Comportamento:**

- Clique em item de "Travado em ti" leva pra Cabine do agente correspondente, com aquele item destacado.  
- Auto-refresh a cada 30s (silencioso, sem loading).  
- Ordem dentro de cada bloco: prioridade DESC, então tempo parado DESC.

---

## Tela 2 — Semana

**Pergunta que responde:** o que tá programado pros próximos dias.

**Formato:** calendário clássico 7 dias × horas. Coluna de hora à esquerda (09h–00h), 7 colunas de dia. Header com dia da semana e número.

**Linha "all-day"** abaixo do header de cada dia, antes da grade horária. Vai vencimento, prazo, prazo crítico (sem hora específica).

**Filtros no topo da tela** (pills toggáveis):

- Eventos  
- Vencimentos  
- Posts (ou outro tipo de output que tu agendar)  
- Meus (compromissos teus pessoais)  
- Crons (push de agentes)

**Padrão de filtros ao abrir:** todos ligados *exceto Crons*. Crons ligado vira ruído visual porque rodam diariamente. Liga só quando quer auditar.

**Estado dos filtros é persistente** — se tu desligar Crons hoje, próxima sessão abre com Crons desligado.

**Cores por categoria:**

- Eventos → roxo  
- Vencimentos → vermelho/laranja  
- Posts → âmbar  
- Meus → cinza  
- Crons → verde

**Comportamento:**

- Coluna do dia atual destacada com fundo azul claro.  
- Hover num evento mostra tooltip com detalhe completo (label completo, agente responsável, link pra abrir).  
- Clique em evento abre modal com detalhe \+ opções (editar, cancelar, etc).  
- Setas pra trocar de semana no header. Botão "hoje" volta pra semana atual.

**Observação técnica:** crons que rodam fora do range visível (ex: 04:00 diário) ficam fora da grade. Mostrar nota discreta no rodapé indicando isso.

---

## Tela 3 — Pipeline

**Pergunta que responde:** o que tá avançando nos meus fluxos de trabalho.

**Formato:** kanban tradicional, 4 colunas por fluxo, *três fluxos empilhados verticalmente*.

**Os 3 fluxos:**

1. **Eventos em produção** — colunas: Brief → Produção → Divulgação → Realizado.  
2. **Propostas comerciais** — colunas: Lead → Enviada → Negociação → Fechado.  
3. **Saúde financeira** — não é kanban, é grade de 4 stat cards: Faturamento semana · Ticket médio · A pagar · A receber. Pertence à tela porque é também "o que tá avançando" mas em outra dimensão.

**Cabeçalho de cada seção:** ícone, nome do fluxo, agente responsável.

**Cartão de cada item:**

- Título (negrito)  
- Subtítulo curto (data, valor, contexto — uma linha)  
- Borda lateral colorida só se tem sinal: vermelho (atrasado/atrapalhado), amarelo (sem resposta há tempo), azul (esperando aprovação tua), verde claro (ok).

**Coluna "Realizado"/"Fechado":** opacidade 0.7 — passou, segue o jogo.

**Comportamento:**

- Drag & drop entre colunas (move o status do item).  
- Clique abre modal de detalhe \+ ações.  
- Filtro no topo pra mostrar só um fluxo (botões Eventos/Propostas/Saúde).

---

## Tela 4 — Estrutura

**Pergunta que responde:** quem é quem, quem fala com quem, qual a regra de cada um.

**Layout:** 3 zonas.

### Zona 1 (esquerda) — Organograma clicável

Hierarquia visual:

- Topo: tu (Rodrigo) num botão centralizado.  
- Linha do meio: dois agentes lado a lado — o **hub** (Jarbas) e o **blindado** (Tomás). O blindado tem borda mais grossa pra indicar separação visual.  
- Linha "Operacionais": grade 2x2 com os 4 agentes que vivem em canais externos (Beto, Lia, Duda, Gil).  
- Linha "Sub-agente": agente sem canal próprio (Raul) num cartão tracejado, sozinho.

Cada cartão de agente: emoji, nome, bolinha de saúde (verde/amarelo/vermelho), label de cadência (push/pull), canal.

### Zona 2 (direita) — Acontecendo agora

Lista cronológica reversa de **eventos cross-fronteira de hoje**: handoffs, escalações, disparos. Não é log de tudo — é só o que cruza fronteira entre agentes ou pede tua atenção.

Cada linha: agente origem → agente destino · horário · descrição em uma frase. Borda lateral cinza/amarela/vermelha conforme prioridade.

### Zona 3 (rodapé, full width) — Ficha do agente selecionado

Aparece quando tu clica num cartão da Zona 1\. Tem **6 campos editáveis inline**:

1. Pra quê serve  
2. Quando age (gatilho)  
3. O que produz (output)  
4. Quem consome (destinatário)  
5. Sinal de saúde (como sei que tá funcionando)  
6. Quando NÃO age (escopo negativo)

Header da ficha: emoji, nome, meta (canal · cadência · estado). Botões de ação à direita: "abrir cabine ↗" e "salvar".

**Comportamento:**

- Clique no cartão do agente atualiza a ficha de baixo (sem trocar de tela).  
- Edição inline: clica no campo, edita, perde foco salva no `.md` do agente.  
- "Abrir cabine ↗" navega pra Tela 5 com aquele agente já selecionado.

---

## Tela 5 — Cabine do agente

**Pergunta que responde:** o que esse agente tá fazendo, e como eu intervenho.

**Header:** seletor de agente (pílulas com emoji \+ nome dos 7 agentes). Clique troca de cabine sem sair da tela.

**Bloco do agente selecionado** (logo abaixo do seletor): emoji, nome, meta (papel · canal · cadência · estado), bolinha de saúde.

**Layout principal: 2 colunas (proporção 1.7:1).**

### Coluna esquerda (1.7) — Operação

Empilhada de cima pra baixo:

1. **Card "Em execução"** — descrição do que tá rodando agora, progresso, tempo. Botões: pausar / cancelar / pular próximo. Borda lateral verde de 2px. Vazio se agente não tá executando nada.  
     
2. **"Disparar manualmente"** — grade 2x2 de botões pra disparar tarefas que esse agente sabe fazer. Cada botão: ícone, label, sub-label. As tarefas variam por agente (Beto tem "forçar ranking", "lembrete de lista", etc; Tomás tem "forçar fechamento", "calcular comissão"; Lia tem "intervir em conversa"; etc).  
     
3. **"Próximos crons"** — lista dos próximos disparos automáticos agendados. Cada linha: horário · descrição · botão de editar. Vazio pra agentes pull (sem cron).  
     
4. **"Entregas recentes"** — últimas 5–10 saídas do agente. Cada linha: horário · descrição · contexto curto · botão "ver ↗". Opacidade decrescente conforme antiguidade. Entregas que esperam aprovação tua aparecem com borda lateral amarela e botões inline (aprovar/ajustar).

### Coluna direita (1) — Conversar

Chat com o agente. Canal **interno** (separado do canal operacional dele).

- Header: "Conversar com \[agente\]" \+ nota "IDENTITY+SOUL carregados".  
- Histórico de mensagens (bolhas, tu à direita azul, agente à esquerda cinza, com timestamps).  
- **Sugestões rápidas** (chips clicáveis acima do input): respostas comuns ao contexto da última mensagem do agente. Ex: se ele tá pedindo confirmação, aparecem `"confirma"`, `"refaz"`, `"+ opções"`.  
- Input de texto \+ botão enviar.

**Regra do canal interno:** não interfere no canal operacional do agente. Tu fala com Lia aqui, não vai pro WhatsApp dela. É ferramenta tua de ajuste e teste.

**Comportamento:**

- Pílulas de seleção do topo trocam de agente sem perder o histórico de chat de cada um.  
- Para agentes sem certas zonas (ex: Lia não tem fila editável; Jarbas não tem disparo manual), a zona vazia mostra placeholder discreto (ex: "Lia não tem fila — responde sob demanda do cliente público"). **Nunca esconde a zona.**  
- Edição de cron via ícone de lápis abre modal pra editar horário/parâmetros.  
- Botões de disparo manual abrem modal pequeno pra confirmar parâmetros antes de executar.

---

## Tela 6 — Logs

**Pergunta que responde:** preciso calibrar uma regra. Os agentes estão se comportando como esperado em N dias?

**Não é tabela de log filtrável.** É **perguntas pré-formuladas** que respondem 80% dos casos.

### Topo — seletor de range

Pills: 7 dias · 30 dias · 90 dias.

### Bloco — perguntas

Grade 2 colunas com 6 perguntas em forma de botão:

1. Quantas vezes a Lia escalou pro Gil?  
2. O Beto perdeu algum cron?  
3. Quantos alertas o Tomás disparou? Quais foram úteis?  
4. Em quais dias o Jarbas não soube rotear?  
5. Mapa completo de handoffs entre os agentes  
6. Insights do Raul que viraram ação

Sétimo botão tracejado: "+ filtro livre (avançado)" — abre interface de query manual pros casos raros.

### Zona de resposta — abaixo das perguntas

Padrão de cada resposta:

- **Número grande à esquerda** (ex: "14 escalações").  
- **Frase explicativa à direita** com a leitura humana ("11 viraram proposta, 3 não foram pra frente").  
- **Visualização de detalhe** abaixo (gráfico de barras horizontais por categoria, lista das últimas N ocorrências, mapa de fluxo, etc — varia por pergunta).  
- **Sugestão de calibração** num card discreto no final (💡 padrão observado \+ ajuste sugerido na regra do agente).

**Comportamento:**

- Pergunta selecionada destacada visualmente; resposta correspondente visível.  
- Clique em "+ filtro livre" abre interface de query (data, agente origem/destino, tipo de evento).  
- Cada resposta tem botão "exportar" no canto (CSV) pra análise externa se precisar.

---

## Lógica transversal

### Estado de saúde dos agentes

Cada agente tem um sinal de saúde computado a partir do campo "Sinal de saúde" da ficha (Tela Estrutura). Verde / amarelo / vermelho.

A bolinha de saúde aparece em:

- Cartão do agente na Tela Estrutura.  
- Header do agente na Tela Cabine.  
- Stat card da Tela Estrutura.

### Inbox de decisão (universal)

Itens que precisam de decisão tua aparecem:

- No bloco "Travado em ti" da Tela Hoje.  
- Na zona "Acontecendo agora" da Tela Estrutura.  
- No card de execução da Cabine do agente correspondente (com ação inline).

**Mesmo item, três lugares.** Resolver num lugar resolve em todos.

### Fronteira de canais (regra de privacidade)

A regra é estrutural, não cosmética. O sistema deve impor:

- Quem produz canal X não posta no canal Y de outro agente.  
- Dado financeiro nunca trafega pelo Hub.  
- Dado individual de promoter nunca aparece pra outro promoter.

Essa regra entra como validação no `.md` de cada agente (campo "Quando NÃO age") e é checada antes de qualquer disparo cross-agente.

### Logs: o que registrar

Todo evento cross-fronteira gera log:

- Disparos de cron (sucesso/falha).  
- Handoffs entre agentes (origem, destino, motivo, payload).  
- Escalações (agente que escalou, agente que recebeu, motivo).  
- Alertas (agente que detectou, tipo, valor, ação tomada).  
- Decisões tuas (aprovação, rejeição, edição).

Não registrar conversas internas (chat da Cabine) por padrão — só metadados (quantas mensagens, duração).

### Persistência de UI

- Tela ativa.  
- Filtros da Semana.  
- Agente selecionado da Cabine.  
- Range escolhido na Logs.  
- Histórico de chat por agente na Cabine (últimas 50 mensagens).

### Refresh

- Tela Hoje: 30s (silencioso).  
- Tela Semana: 5min.  
- Tela Pipeline: 1min.  
- Tela Estrutura ("Acontecendo agora"): 30s.  
- Tela Cabine ("Em execução"): 10s.  
- Tela Logs: sob demanda (botão "atualizar").

---

## Decisões de arquitetura (resolvidas 2026-05-08)

Cinco perguntas críticas + duas estruturais foram fechadas antes de codar. Registradas aqui pra não rediscutir.

### 1. Chat da Cabine — direto na API Anthropic, fora do gateway

O canal interno de cada agente (Tela 5, coluna direita) chama `claude-opus-4-7` (ou modelo do agente) direto via Anthropic API, passando `IDENTITY.md` + `SOUL.md` do agente como `system`. **Não passa pelo gateway OpenClaw.**

**Por quê:** isolamento de contexto (chat de teste não polui sessão WhatsApp do agente), MVP mais simples (sem precisar criar canal interno no runtime), custo previsível (cobrança por mensagem direta).

**Trade-off aceito:** chat da Cabine não tem acesso a memória persistente do agente automaticamente. Se precisar de memória, anexa `memory/<agente>.md` no system prompt manualmente.

### 2. Edição de cron — `.md` como fonte da verdade, painel chama `openclaw cron sync`

Cada cron é declarado em `workspace/rotinas/<rotina>.md` com YAML frontmatter (`schedule`, `tz`, `agent`, `enabled`). Painel da Cabine edita o `.md`, salva, dispara `openclaw cron sync` via API local.

**Slice 1 read-only:** edição inline de cron entra na Slice 3 (Cabine). Slice 1 só mostra a lista.

**Por quê:** cron permanece versionado em git, edição via painel não é fonte primária, fica fácil auditar. Evita estado divergente entre painel e runtime.

### 3. Inbox de decisão — Notion como backend

Token Notion já existe em `openclaw.json` (`skills.entries.notion.apiKey`). Database "Inbox de decisão" no Notion guarda os itens. Cockpit lê via Notion API com cache 30s.

**Migrar pra Supabase só se:** rate limit Notion atingir (>3 req/s sustained) ou se passar de ~50 itens/dia.

**Por quê:** zero infra nova, Rodrigo já usa Notion, dá pra resolver item via Notion mobile se cockpit estiver fora.

### 4. Sinal de saúde — dois campos paralelos por agente

No frontmatter da `IDENTITY.md`:

- `cockpit.health_rule_human` — string em PT-BR descrevendo a regra ("Beto está saudável se respondeu o último cron de ranking dentro de 1h").
- `health` — bloco YAML estruturado com 4 sinais computáveis:
  - `cron_freshness` — última execução de cron <= X min
  - `response_latency` — última resposta a mensagem <= Y min
  - `channel_open` — canal pareado e online
  - `composite` — fórmula AND/OR sobre os 3 acima

Cockpit computa cor (verde/amarelo/vermelho) a partir do `health.composite`. Texto humano fica visível na ficha pra Rodrigo entender de onde veio o sinal.

### 5. Tela Evento — modal na Slice 1

Detalhe de evento (Tela Pipeline coluna "Eventos em produção") abre como modal full-screen, não tela 7 separada. Modal tem: brief, status, lista de promoters envolvidos, métricas pré-evento, link pra página PNE, link pra ficha do Gil.

**Vira tela 7 se:** modal ficar maior que 70% da viewport ou se Rodrigo precisar abrir lado-a-lado com outro modal.

### A. Webhook inbox — skill `inbox` (padrão protocolo)

Agentes não escrevem direto no Notion. Eles invocam a skill `inbox` (`workspace/skills/inbox/SKILL.md`), que encapsula o POST pro Notion + validação de schema (campos obrigatórios: agente, prioridade, descrição, deeplink).

**Por quê:** se trocar Notion por Supabase amanhã, muda 1 skill ao invés de 7 agentes.

### B. Activity log — hook `activity-log`

Hook interno do runtime (`hooks.internal.entries.activity-log.enabled = true`) intercepta eventos cross-fronteira e escreve em `workspace/agentes/<role>/activity.jsonl`. Não é responsabilidade do agente logar — é responsabilidade do runtime.

**Esquema do jsonl:** `{ts, agent_from, agent_to, type, payload, status}`. Tipos: `cron_fire`, `handoff`, `escalation`, `alert`, `human_decision`.

---

## Convenções de implementação

1. **Skill `inbox`** mora em `workspace/skills/inbox/SKILL.md`. Responsabilidade única: criar item de decisão pra Rodrigo. Validações: campos obrigatórios, prioridade ∈ {baixa, média, alta, crítica}, deeplink válido.

2. **Hook `activity-log`** roda em todo evento cross-fronteira do runtime. Idempotente, append-only. Rotação de log fica fora de escopo (lidar quando passar de 100MB por agente).

3. **`.md` é fonte da verdade.** Cockpit nunca tem estado próprio que não esteja no `.md`. Reload forçado do cockpit reproduz exatamente o mesmo estado. Cache em memória só pra UX (debounce 200ms em edição inline).

---

## O que NÃO faz parte do produto

- Multi-usuário, permissões, papéis.  
- Onboarding ou tutorial.  
- Analytics fancy (gráficos de tendência, dashboards executivos).  
- Mobile (desktop-first; mobile pode vir depois como leitura).  
- Integração com calendário externo (Google Calendar etc) — fica como ideia futura.  
- Notificações push/email — toda atenção vem da própria UI quando tu abre.

---

## Stack (decidido 2026-05-08)

- **Frontend:** Next.js 15 App Router + Tailwind + shadcn/ui. Roda em `127.0.0.1:3030` (loopback only — não exposto na rede). Porta 3030 escolhida pra não colidir com 3000 já usado pelo Rodrigo.
- **Estado:** `.md` no `workspace/` são fonte da verdade. Cockpit lê e escreve via Server Actions usando `fs/promises`.
- **Feed de atividade:** `workspace/agentes/<role>/activity.jsonl`, escrito pelo hook `activity-log` do runtime. Cockpit agrega via leitura direta + tail no servidor.
- **Inbox de decisão:** database Notion. Token reaproveitado do `openclaw.json`. Cache 30s server-side. Skill `inbox` é a única origem de writes.
- **Chat da Cabine:** chamada direta `@anthropic-ai/sdk` no servidor Next.js, passando `IDENTITY.md` + `SOUL.md` como system. Histórico persistido em `workspace/agentes/<role>/cabine_history.jsonl` (últimas 50 mensagens).
- **Logs:** mesma `activity.jsonl`, queries server-side, exportação CSV via Server Action.

---

## Ordem sugerida de implementação

1. Tela Estrutura (organograma \+ ficha). É a base — depois dela todas as outras telas leem dos `.md`.  
2. Tela Hoje (com Inbox de decisão). É a que tu vai abrir 20× por dia.  
3. Tela Cabine. Depende da estrutura tá funcionando.  
4. Tela Semana. Independente, pode ir em paralelo.  
5. Tela Pipeline. Depende de existir um modelo de dado pros 3 fluxos (kanban \+ métricas).  
6. Tela Logs. Por último — só faz sentido depois que tem dado acumulado.

