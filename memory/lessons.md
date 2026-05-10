# memory/lessons.md — Lições Aprendidas

> Atualizado: 2026-05-07

---

## Organização

- **Não duplicar workspaces.** Ter duas cópias (ELCOYOTE/openclaw-elcoyote/ + .openclaw/workspace/) causou confusão e divergência. Uma fonte da verdade só.
- **Nomes de agentes são decisão final.** Trocar de Claudio→Jarbas gerou retrabalho em Notion, GitHub, e arquivos locais. Definir uma vez, nunca mudar sem motivo forte.
- **Notion e GitHub devem espelhar, não duplicar.** O GitHub (workspace) é o master. Notion é visualização. Se divergirem, o GitHub ganha.

## Técnico

- **openclaw.json: não editar manualmente se puder evitar.** Usar o wizard do OpenClaw. Ao editar manual, rodar backup antes (`cp openclaw.json openclaw.json.bak.$(date +%s)`) e usar `jq + tmpfile + mv` (nunca in-place).
- **Skills de extração (PNE/Bar Fácil):** sempre usar paginação "Todos" + setTimeout antes de scrape. Selectors mudam — fixar no SKILL.md, não criar snippet avulso.
- **Git no sandbox Cowork:** não tem credenciais GitHub. O push tem que ser feito manualmente no PowerShell local.
- **2026-05-07 — `tools.profile = "coding"` NÃO inclui a tool `message`.** Agente em `coding` puro só consegue REPLY (pipeline auto), nunca INITIATE. Pra cold outbound, adicionar `tools.alsoAllow: ["message"]`. Sintoma quando falta: log mostra `[agent:nested] ... channel=webchat <texto>` em vez de `[whatsapp] Sent message ...`.
- **2026-05-07 — `tools.sessions.visibility = "agent"` é o que cruza DM ↔ grupo.** Default `tree` isola. Erro de schema NÃO necessariamente significa "campo inexistente" — pode ser nesting errado (top-level vs `agents.list[]`) ou file errado (`config.json` fantasma vs `openclaw.json` canônico). Validar em source `/usr/lib/node_modules/openclaw/dist/plugin-sdk/src/config/types.*.d.ts` antes de marcar como chute.
- **2026-05-07 — Filename canônico é `openclaw.json`, NÃO `config.json`.** Coexistem em `/root/.openclaw/`. Patches em `config.json` parecem aplicar (jq escreve, file persiste) mas runtime ignora. Sempre `ls -la openclaw.json` antes de patch.
- **2026-05-07 — Edição externa via `mv` não dispara audit log nem hot-reload completo.** Sessões existentes podem manter valor cached. Pra forçar reload de mudanças sensíveis (model, defaults): `systemctl --user restart openclaw-gateway` (~3s).
- **2026-05-07 — Bootstrap files inicializam como template default em inglês.** Setup `openclaw agents add <id>` cria 8 files genéricos. Conferir conteúdo (`head -3` cada um), não só presença. Strings óbvias de template: "Your human", "Natan", "cameras", "TTS voices".

## Custo

- **2026-05-07 — Defaults Sonnet/Opus queimam dinheiro rápido.** $50 numa tarde só com Beto + main agent rodando Sonnet 4.6 + Opus 4.7. Mudou pra Haiku 4.5 default em 2026-05-08, validado em prod.
- **2026-05-08 — Plano Max do Rodrigo (Claude Code) NÃO cobre OpenClaw.** OpenClaw usa API key separada (`auth.profiles[].mode = "api_key"`). Trilha C de escalation é o jeito de aproveitar o Max sem ToS gray.
- **2026-05-08 — `claude-code-openai-wrapper` rejeitado.** 10 req/min cap, tool calling off por padrão, ToS cinza pra "service to third parties". Não vale pra produção em volume.
