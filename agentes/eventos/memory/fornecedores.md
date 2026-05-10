# Cadastro de Fornecedores — Gil

> Fonte canônica de fornecedores que o El Coyote usa em eventos. Som, luz, segurança, decoração, gelo, atrações contratadas. Cada entrada tem contato, reputação interna, custo de referência e histórico curto.
>
> Skills `briefing-pre-evento`, `checklist-operacional-dia` e `evento-privado-orcamento` consultam aqui antes de montar checklist ou propor fornecedor pra um evento.

**Última atualização:** 2026-05-09 (criação — vazio, Gil preenche conforme contrata)
**Aprovação Rodrigo:** ⚠️ pendente — Gil envia DM antes de adicionar primeira entrada com cachê/custo

---

## Schema

```yaml
- id: forn-XXX                      # incremental
  nome: "..."
  categoria: som | luz | seguranca | bar | atracao | decoracao | gelo | bartender_extra | garcom_extra | outros
  contato: "..."                    # WhatsApp ou telefone direto
  cidade: "Imbituba | Tubarão | Florianópolis | ..."
  reputacao: alta | media | baixa
  custo_referencia_brl: 0.00        # último valor conhecido — pra Gil ter ideia (Tomás re-confirma na precificação)
  ultima_contratacao: YYYY-MM-DD
  contratacoes_total: N
  problemas: N                      # incidentes registrados
  notas: "histórico curto"
  status: ativo | inativo | banido
  criado_em: ISO8601
  atualizado_em: ISO8601
```

## Regras de manutenção

- **Quando criar entrada nova**: Gil contrata fornecedor pela primeira vez. Status inicial `ativo`, `reputacao: media` (neutro até ter base), `contratacoes_total: 1`.
- **Quando atualizar reputação**:
  - 1º problema: `media` → ajusta `problemas` para 1, mantém `media` mas adiciona nota
  - 2º problema seguido: `media` → `baixa` (com aprovação Rodrigo)
  - 3º problema: considerar `status: banido` (sempre com aprovação Rodrigo)
  - Entregas excepcionais por 3+ eventos seguidos: `media` → `alta`
- **Quando marcar inativo**: fornecedor saiu do mercado, mudou de cidade, ou Gil não usa há 6+ meses. Diferente de `banido` — pode reativar.
- **Quando marcar banido**: Rodrigo decidiu nunca mais. Manter entrada pra histórico (não deletar) — futuras tentativas de contratação caem no banido.
- **Custo de referência**: Gil registra **último valor conhecido**. Não é fonte canônica pra precificar — Tomás sempre re-confirma com fornecedor antes de fechar margem em proposta.

## Categorias

| Categoria | Quando entra em evento | Notas |
|-----------|------------------------|-------|
| `som` | Quase todo evento (exceto privado pequeno com som da casa) | Critical path — atraso aqui afeta showtime |
| `luz` | Eventos grandes, festivais, atrações específicas | Geralmente vem junto com som |
| `seguranca` | Todo evento aberto ao público | Mínimo 2 pessoas, escala vs público |
| `bar` | Eventos onde casa não dá conta sozinha | Bartenders extras ou casa contratada |
| `atracao` | Bandas, DJs, performers contratados | Cachê = item financeiro sensível |
| `decoracao` | Eventos temáticos, privados, festivais | Decoração própria ou contratada |
| `gelo` | Público > 100 pessoas em dias quentes | Volume estimado vs público |
| `bartender_extra` | Privados grandes, eventos com público > 150 | Equipe além do quadro fixo |
| `garcom_extra` | Idem | Idem |
| `outros` | Casos atípicos (food truck, segurança privada VIP, etc) | Adicionar nota explicativa |

## Privacidade

- Leitura: Gil + Rodrigo + Tomás (Tomás precisa pra cruzar custo na precificação de privado)
- **Não compartilha**: contato direto de fornecedor com outros agentes (Beto, Lia, Duda, Raul)
- Beto/Lia/Duda perguntando "quem é o som de sexta?" → responde só o nome do fornecedor (info pública), nunca contato nem custo

## Histórico de mudanças

| Data | Mudança | Quem | Motivo |
|------|---------|------|--------|
| 2026-05-09 | Schema documentado, vazio | Gil (setup inicial) | Primeira versão |

---

## Entradas

<!-- Gil preenche aqui ao longo do tempo. Vazio até primeira contratação real registrada. -->

<!-- Exemplo (template, não real):
- id: forn-001
  nome: "Marcos Silva"
  categoria: seguranca
  contato: "(48) 9XXXX-XXXX"
  cidade: "Imbituba"
  reputacao: media
  custo_referencia_brl: 0.00
  ultima_contratacao: 2026-XX-XX
  contratacoes_total: 0
  problemas: 0
  notas: "—"
  status: ativo
  criado_em: 2026-XX-XXT00:00:00-03:00
  atualizado_em: 2026-XX-XXT00:00:00-03:00
-->

---

## Banidos / arquivados

<!-- Fornecedores com status: banido ou inativo de longo prazo. Manter histórico, não deletar. -->
