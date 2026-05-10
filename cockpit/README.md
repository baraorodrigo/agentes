# El Coyote Cockpit

Painel local pra Rodrigo operar os 7 agentes. Spec em `../COCKPIT.md`.

## Rodar

```bash
cd workspace/cockpit
npm install
npm run dev
# abre em http://127.0.0.1:3030
```

`COCKPIT_WORKSPACE` opcional — aponta pra raiz do workspace (default: `..`).

## Status das telas

- ✅ **Estrutura** — Slice 1: organograma + ficha 6 campos editável inline (lê/escreve nos `.md`).
- 🚧 **Hoje, Semana, Pipeline, Cabine, Logs** — stubs.

## Como funciona

- Lê YAML frontmatter `cockpit:` + `health:` dos arquivos `IDENTITY.md` (e `USER.md` pro Rodrigo).
- Edição inline na ficha → Server Action `saveAgentField` → reescreve o `.md` com `gray-matter`.
- Loopback only: `next dev -H 127.0.0.1`.
