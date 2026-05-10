# memory/decisions.md — Decisões do Rodrigo

> Atualizado: 2026-05-08

---

## Decisões Permanentes

### Workspace e Organização
- **2026-05-07** — `.openclaw/workspace/` é a fonte da verdade. `ELCOYOTE/openclaw-elcoyote/` é cópia de backup.
- **2026-05-06** — Jarbas 🐺 é o agente CEO. Nome "Claudio" foi descartado definitivamente.
- **2026-05-06** — Hierarquia: Jarbas → Beto, Duda, Lia, Tomás, Gil, Raul (7 agentes total).

### Deploy e Infra
- **2026-05-07** — VPS auto-gerenciada `nano.elcoyotepub.com` (substitui plano Hostinger gerenciado descartado). OpenClaw 2026.5.4 rodando, gateway loopback :18789.
- **2026-05-07** — WhatsApp via plugin nativo `@openclaw/whatsapp` (Evolution API descartada — desnecessária, plugin nativo cobre).
- **2026-05-07** — Beto deployado em produção. Pareado em +5548991092404. WhatsApp pessoal do bot (não business API).

### Modelos e Custo
- **2026-05-08** — Default oficial pra agentes operacionais é **Haiku 4.5** (`anthropic/claude-haiku-4-5`). Validado em prod com Beto.
- **2026-05-08** — Sonnet 4.6 só como fallback ou pra agentes analíticos (Tomás financeiro, Raul intel).
- **2026-05-08** — Opus 4.7 NUNCA como default. Só via Trilha C de escalation manual pelo Claude Code Max plan (custo zero).
- **2026-05-08** — Trilha C aplicada como regra em todos AGENTS.md (atual e futuro). Bloco canônico em `~/.claude/skills/openclaw-agent-builder/reference/escalation-rule.md`.
- **Why:** Em 2026-05-07 queimaram $50 numa tarde com Sonnet/Opus default. Plano Max do Rodrigo cobre Opus sem custo extra — humano-no-loop é mais barato e sem ToS gray do `claude-code-openai-wrapper` (estudado e rejeitado).

### Configuração do OpenClaw
- **2026-05-07** — `tools.profile = "coding"` + `tools.alsoAllow = ["message"]` é o combo certo pra agentes que precisam outbound. `coding` puro NÃO inclui a tool `message` (só `messaging` e `full` incluem).
- **2026-05-07** — `tools.sessions.visibility = "agent"` pra Beto cruzar DM ↔ grupo do mesmo agentId. Default `tree` bloquearia.
- **2026-05-07** — Edição de `openclaw.json` via `jq + tmpfile + mv`. Hot-reload pega mudanças de modelo, canais, agentes. `gateway.port/bind/mode` exigem restart.

### Segurança (inviolável)
- Dados financeiros NUNCA saem do escopo admin (Rodrigo).
- Promoter nunca vê dados de outro promoter individualmente.
- Público nunca vê dados internos.
- Ação externa (mensagem, post, pagamento) sempre pede aprovação — exceto crons agendados (autorização foi a entrada do job).
