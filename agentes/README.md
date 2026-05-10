# agentes/ — Sub-mapa dos Agentes

Cada pasta tem o `IDENTITY.md` do agente — papel, canal, modelo, personalidade, regras. Beto também tem `PLAYBOOK.md` (operação detalhada). Os outros vão ganhar PLAYBOOK conforme cada fase do `PLANO-MULTIAGENTES.md` for fechando.

> Status atualizado em 2026-05-08.

| Pasta | Agente | Modelo | Canal | Status |
|-------|--------|--------|-------|--------|
| `promoters/` | Beto ⚡ | Haiku 4.5 | WhatsApp +5548991092404 (DM + grupo Promoters) | ✅ ONLINE em prod (VPS `nano.elcoyotepub.com`) |
| `marketing/` | Duda 🎸 | Haiku 4.5 | Telegram Topic — Marketing | Stub (IDENTITY pronta, sem deploy) |
| `atendimento/` | Lia 💬 | Haiku 4.5 | WhatsApp público do bar | Stub (IDENTITY pronta, sem deploy) |
| `financeiro/` | Tomás 📊 | Sonnet 4.6 | DM Rodrigo | Stub (IDENTITY pronta, sem deploy) |
| `eventos/` | Gil 🎪 | Haiku 4.5 | DM Rodrigo | Stub (IDENTITY pronta, sem deploy) |
| `intel/` | Raul 🔍 | Sonnet 4.6 | Background (sub-agente do Jarbas, sem canal próprio) | Stub (IDENTITY pronta, sem deploy) |

## Regra de modelo (decidida 2026-05-08)

- **Haiku 4.5** é default pra agentes operacionais (Beto/Duda/Lia/Gil + Jarbas hub).
- **Sonnet 4.6** só pra agentes analíticos (Tomás financeiro, Raul intel).
- **Opus 4.7 nunca como default** — só via Trilha C de escalation manual pelo Claude Code Max.

Detalhes em `memory/decisions.md`.

## Padrão de IDENTITY (referência: Beto)

Seções esperadas em ordem: Header → Missão → Background → Personalidade → Regra de ouro → Nunca faço → Sempre faço → Tom de voz → Frases típicas → Ferramentas → Funções → Regra final → Onde detalhar.

Stubs preenchem o que dá pra derivar; Ferramentas/Funções/PLAYBOOK ficam pra fase de deploy de cada agente.
