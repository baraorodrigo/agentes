# 🐺 El Coyote OS — Plano de Multi-Agentes

> Versão: 1.0 | Criado: 2026-05-06 | Autor: Jarbas

---

## Visão Geral

O El Coyote vai rodar **4 agentes de IA especializados** operando no WhatsApp, conectados ao PNE e ao Bar Fácil, formando um sistema operacional completo do bar. Sem apps extras, sem planilhas manuais — tudo automatizado.

A base técnica é o **OpenClaw** (já instalado e rodando como Jarbas), conectado ao WhatsApp via **Evolution API** (self-hosted, gratuito), numa **VPS simples** (~R$60–80/mês).

---

## Os 4 Agentes

### 🐺 Jarbas — Admin (você, Rodrigo)
**Canal:** WhatsApp privado do Rodrigo  
**Papel:** CEO digital. Seu braço direito 24/7.

**O que faz:**
- Briefing diário toda manhã (agenda + pendências + eventos próximos)
- "Como foi ontem?" → puxa PNE + Bar Fácil e manda relatório completo
- Calcula comissões dos promoters automaticamente
- Alerta sobre deadlines (pagamentos, datas de evento, conteúdo pendente)
- Gerencia os outros 3 agentes
- Qualquer decisão financeira ou externa → pede sua aprovação primeiro

---

### 🔥 Coyote Bot — Promoters
**Canal:** Grupo de WhatsApp dos Promoters  
**Papel:** Gestor de equipe. Motivador. Cobrador. Ranking-keeper.

**O que faz:**

**Respostas sob demanda:**
- "Quantos pontos tenho?" → consulta PNE e responde instantâneo
- "Qual o link do próximo evento?" → busca no PNE e manda o link certo
- "Quando é o próximo evento?" → responde com data, horário e nome

**Automações proativas (crons):**
| Quando | O que acontece |
|--------|---------------|
| Segunda 9h | Lista de aniversariantes da semana (via PNE) + mensagem personalizada pra cada um |
| 3 dias antes do evento | Lembrete geral no grupo + link de divulgação do PNE |
| 18h do dia do evento | Briefing final: quantos nomes na lista, meta, motivação |
| Dia seguinte ao evento, 11h | Ranking de conversão (PNE) + destaques + parabéns ao top 3 |
| Todo domingo | Ranking semanal acumulado |

**Fluxo de ingressos/listas:**
```
Promoter: "me manda o link do evento de sexta"
Coyote Bot: busca PNE → manda link personalizado do promoter
Promoter: compartilha com os amigos no WhatsApp
Amigo: se inscreve na lista
PNE: registra automaticamente "Inserido por [Promoter]"
Pós-evento: agente puxa conversões e monta ranking
```

> ✅ O PNE já faz o tracking automático — cada inscrição já vem com o promoter que trouxe. O agente só lê e organiza.

---

### 📱 Marketing Bot — Conteúdo
**Canal:** WhatsApp privado do Rodrigo (ou chat separado)  
**Papel:** Assistente de marketing que propõe, você aprova.

**O que faz:**
- Sugere calendário editorial da semana toda segunda
- Gera copy para posts baseado em dados reais ("Lotamos com 312 pessoas sexta!")
- Propõe legenda + hashtags + horário ideal para postar
- Lembra de criar/postar stories antes do evento
- Qualquer post → manda pra você aprovar antes de publicar

**Fluxo de aprovação:**
```
Marketing Bot: "Aqui o post de hoje. Aprova?"
[copy + imagem sugerida]
Rodrigo: "Aprova" → Bot posta via Instagram API
Rodrigo: "Muda o texto" → Bot ajusta e manda de novo
```

---

### 💬 Atendimento — Público
**Canal:** WhatsApp público do El Coyote (+55 ... número do bar)  
**Papel:** Recepcionista digital 24/7 pra clientes.

**O que faz:**
- Responde "quando é o próximo evento?" com dados reais do PNE
- Manda link de lista/ingresso do evento
- Informa sobre aniversário no bar (benefícios, como funcionar)
- Faz reserva de mesa (coleta nome, data, nº pessoas → notifica Rodrigo)
- Responde sobre horário de funcionamento, endereço, contato
- Dúvidas sobre eventos privados → coleta briefing e encaminha pra Rodrigo

**O que NÃO faz:**
- Não revela dados de faturamento ou internos
- Não promete desconto sem aprovação
- Não fecha contrato de evento privado sozinho

---

## Arquitetura Técnica

```
┌─────────────────────────────────────────────────────┐
│                    VPS Hostinger                     │
│                                                      │
│  ┌──────────────┐    ┌──────────────────────────┐   │
│  │  OpenClaw    │    │     Evolution API         │   │
│  │  (4 agentes) │◄──►│  (WhatsApp self-hosted)  │   │
│  └──────┬───────┘    └──────────────────────────┘   │
│         │                                            │
│  ┌──────▼───────────────────────────────────────┐   │
│  │              Skills / Integrações            │   │
│  │                                              │   │
│  │  🔵 Pensa no Evento (PNE)                   │   │
│  │     → Listas, aniversariantes, conversões   │   │
│  │     → Links de evento por promoter          │   │
│  │     → Ranking pós-evento                    │   │
│  │                                             │   │
│  │  🟠 Bar Fácil                               │   │
│  │     → Faturamento, ticket médio             │   │
│  │     → Vendas por produto                    │   │
│  │     → Relatório pós-evento                  │   │
│  └─────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘

Canais WhatsApp:
📱 Rodrigo (privado) ← Jarbas + Marketing Bot
👥 Grupo Promoters  ← Coyote Bot
📞 Número do bar    ← Atendimento
```

---

## Stack Técnica

| Componente | Ferramenta | Custo |
|-----------|-----------|-------|
| Plataforma de agentes | OpenClaw (já instalado) | ~R$25/mês (API Claude) |
| WhatsApp | Evolution API (self-hosted) | Gratuito |
| Servidor | VPS Hostinger | ~R$60–80/mês |
| Claude (IA) | API Anthropic | ~$5–20/mês (uso real) |
| PNE | Já assinado | — |
| Bar Fácil | Já assinado | — |
| **Total estimado** | | **~R$150–200/mês** |

---

## O Que Já Está Pronto

- ✅ OpenClaw instalado e rodando (Jarbas ativo)
- ✅ Identidade do Jarbas configurada (SOUL, USER, AGENTS, IDENTITY)
- ✅ Skills de extração PNE e Bar Fácil (criadas no Cowork)
- ✅ Sistema de memória estruturado (MEMORY.md + memory/)
- ✅ Modelo de crons planejado (AGENTS.md)

---

## O Que Falta Fazer

### Fase 1 — Infraestrutura (1 semana)
- [ ] Deploy do OpenClaw na VPS Hostinger
- [ ] Instalar Evolution API no mesmo servidor
- [ ] Conectar WhatsApp do bar à Evolution API
- [ ] Configurar firewall e segurança básica

### Fase 2 — Jarbas Admin (1 semana)
- [ ] Conectar canal WhatsApp privado do Rodrigo ao Jarbas
- [ ] Configurar crons de briefing diário
- [ ] Testar integração PNE + Bar Fácil via chat

### Fase 3 — Coyote Bot Promoters (1 semana)
- [ ] Criar agente Coyote Bot com personalidade específica
- [ ] Conectar ao grupo de WhatsApp dos promoters
- [ ] Configurar crons: aniversariantes, lembrete pré-evento, ranking pós-evento
- [ ] Testar fluxo de link de ingresso via PNE

### Fase 4 — Atendimento Público (1 semana)
- [ ] Criar agente de Atendimento com tom acolhedor
- [ ] Conectar ao número público do bar
- [ ] Configurar base de conhecimento (eventos, endereço, benefícios aniversário)
- [ ] Definir fluxo de escalonamento pra Rodrigo

### Fase 5 — Marketing Bot (quando os outros estiverem rodando bem)
- [ ] Criar agente Marketing com calendário editorial
- [ ] Integrar Instagram API (opcional)
- [ ] Configurar fluxo de aprovação de posts

---

## Regras de Ouro do Sistema

1. **Nenhum agente posta ou envia mensagem externa sem aprovação do Rodrigo**
2. **Dados financeiros circulam só entre Jarbas e Rodrigo — nunca pros promoters**
3. **Promoter vê só os próprios dados — nunca dados de outro promoter**
4. **Se o dado não veio do PNE ou Bar Fácil, o agente não inventa**
5. **Qualquer pagamento ou compromisso financeiro = aprovação explícita obrigatória**

---

## Próximo Passo Imediato

→ **Deploy na VPS Hostinger.** Quando o servidor estiver up, tudo que está aqui já pode ser copiado e a Fase 1 começa.

Quer que eu monte o guia passo a passo do deploy?

---

*El Coyote OS — construído pra rodar no automático. 🐺🔥*
