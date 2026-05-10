# Prompt Master — Site EL COYOTE (claude.ai/design)

> Versão 3.0 — alinhada ao Design System v2 (autoridade atual).
> Como usar: cola o bloco `## Prompt (pra colar)` no claude.ai/design
> dentro do mesmo projeto onde está o `design-system-v2.html`.
> Anexa os assets da pasta `workspace/site/`.

---

## Prompt (pra colar)

```
Site oficial do EL COYOTE — pub & eventos à beira-mar em Imbituba/SC.
Use o design-system-v2.html deste projeto como contrato visual e de
voz — fontes, cores, tokens, vocabulário e tom. Tagline canônica:
"a noite vira história."

DUAS FRENTES NA HOMEPAGE:
- O PUB → sex/sáb 22h às 5h · live music · deck com vista do porto
         "PUB · LIVE MUSIC · DECK"  | público 20-35
- A CASA INTEIRA → eventos privados (casamento, formatura, aniversário
                   da firma) — "a casa fica sua." | público 28-55
[Vista do Porto fica fora do site v1 — em construção]

VOZ (literal do design-system-v2):
- Português brasileiro · informal e elegante · poético sem ser piegas
- Frase curta · verbo no presente · imagem concreta antes de adjetivo
- Eixos: 78% informal · 72% coração · 65% sugere

VOCABULÁRIO (use):
deck · noite · brasa · vista · história · a casa · amanhecer · a pista
· o porto · imbituba · hora dourada · âmbar · uivo · litoral

PROIBIDO (não usar em nenhum lugar do site):
balada · vip · premium · experiência · inesquecível · exclusivo
· high-end · incrível · imperdível · top · rolê · brother · promoção
· baladinha · bomba · mega · 🔥 emoji · "!!!"

FRASES PRONTAS (do v2 — use literais quando couber):
- "a noite vira história." (tagline principal · hero · footer)
- "a noite te espera." (CTA hero alt)
- "venha inteiro." (hand · ornamento)
- "sexta começa às 22h. seu domingo a gente devolve." (agenda)
- "a casa fica sua." (eventos privados · hero do bloco)
- "o sol cai. a pista sobe." (subtítulo)
- "se é pra viver, que seja inteiro." (manifesto · assinatura)
- "a casa aberta." (contato)
- "um sim com vista pro mar." (casamento · ornamento Caveat)

ESTRUTURA (single-page com âncoras):
1. Nav sticky transparente sobre hero, cream/95 com blur ao scroll
   (logo · agenda · eventos · contato · CTA "reservar mesa")
2. Hero fullbleed: foto pôr do sol do deck + logo branco +
   eyebrow "PUB · LIVE MUSIC · DECK" + display "a noite\nte espera."
   + 2 CTAs (primary ember "reservar mesa" + secondary "ver agenda")
   + ornamento Caveat sun "venha inteiro."
3. Conceito (cinco pilares — grid 5 colunas com numeração ember):
   01 LIVRE · 02 QUENTE · 03 INTENSO · 04 POÉTICO · 05 LITORÂNEO
   (copy curto de cada pilar do design-system-v2 seção 02)
4. Manifesto editorial (display 5xl lg:7xl):
   "litoral brasileiro\ncom alma de pub."
   3 colunas: tensão criativa · caráter · o que evitamos (riscar)
5. Agenda — bloco "o que vem aí na casa." com 3 cards de evento
   (data ember · nome em CAPS · descrição curta · badge sun "vendendo"
   ou border "esgotado") · CTA ghost "ver tudo →"
6. EVENTOS PRIVADOS (bloco principal — fundo deep #274156, texto cream):
   eyebrow sun "a casa fica sua"
   display 4xl: "casamento\nformatura\naniversário da firma"
   parágrafo curto cream/70: "o EL COYOTE inteiro pra quem você ama.
   vista do porto, deck preparado, equipe da casa cuidando do resto."
   CTA ember "conversar com a casa" → wa.me/5548991744141
   foto vertical aspect-3/4 + ornamento Caveat sun
   "um sim com vista pro mar."
7. Fotografia (galeria documental masonry · grão leve · photo-grade
   warm overlay · lazy load · sem títulos sobre fotos)
8. Contato (display "a casa aberta."):
   grid 2 colunas com microetiquetas:
   WHATSAPP RESERVAS · +55 48 99666-3645 → wa.me/5548996663645
   WHATSAPP EVENTOS  · +55 48 99174-4141 → wa.me/5548991744141
   INSTAGRAM         · @elcoyotepub
   SITE              · elcoyotepub.com
   FUNCIONAMENTO     · SEX · SÁB · 22h → 5h
   ENDEREÇO          · R. João Martins esq. Av. 13 de Setembro
                       Imbituba — SC · 88780-000
9. Footer cream: display "a noite vira história." + logo preto +
   "© ELCOYOTE 2026 · A NOITE VIRA HISTÓRIA"

DADOS CANÔNICOS DE NEGÓCIO:
Endereço: R. João Martins esq. Av. 13 de Setembro · Imbituba/SC · 88780-000
Horário: SEX · SÁB · 22h → 5h
WhatsApp Reservas: +55 48 99666-3645 → wa.me/5548996663645
WhatsApp Eventos:  +55 48 99174-4141 → wa.me/5548991744141
                   (número diferente, NÃO unificar com reservas)
Instagram: @elcoyotepub (público) · @elcoyote_eventos (vertical eventos)
Email: elcoyoteimbituba@gmail.com
Próximo evento (PNE): https://pensanoevento.com.br/casas/1117/el-coyote-pub
Desde: 2017

ASSETS (anexados — usar SÓ estes):
- Logos PNG (branco/preto · 2 cópias de cada)
- 18 fotos reais do Pub (16 @SimplePixOficial + 2 datadas) — energia
  noturna, multidões, palco, ambiente — para hero, fotografia e agenda
- 10 imagens AI conceituais — usar APENAS se baterem com a direção
  fotográfica do v2 (hora dourada · âmbar · gestos espontâneos · grão
  leve · sem flash duro · sem HDR · sem stock)
Faltando: pôr do sol limpo do deck · casamento real no deck · banda
ao vivo close · brindando hora dourada · fachada limpa.
Para esses: placeholder bg-sand/40 com border-2 dashed border-ink/20,
texto Anton 2xl "[ FOTO REAL: descrição curta ]" + linha mono.

TECH:
- HTML único + Tailwind CDN (mesma config do v2: cores ink/deep/sage/
  sun/ember/terra/mist/cream/sand · fontFamily display=Anton,
  sans=Inter, hand=Caveat, mono=JetBrains Mono)
- Google Fonts: Anton + Inter 300/400/500/600/700 + Caveat 400/700 +
  JetBrains Mono 400/600
- Reaproveitar CSS do v2 (.display, .eyebrow, .grain, .photo-grade,
  .hairline, .scratch, .tick, .btn variants, .field) — copiar literal
- Lucide icons via CDN
- IntersectionObserver vanilla pra fade-up
- Sem build step · sem React · mobile-first
- Schema.org BarOrPub LocalBusiness com sameAs dos 2 Instagrams,
  openingHours "Fr,Sa 22:00-05:00", priceRange "$$"
- Sem cookies · sem popups · sem analytics no v1
- Lighthouse mobile 90+

REGRAS DURAS:
- Paleta exata do v2 (8 hex codes), sem aproximação, sem neon
- Apenas Anton + Inter + Caveat + JetBrains Mono
- Caveat APENAS uma frase por seção, como ornamento (nunca CTA)
- Anton APENAS em ≥28px e em CAIXA ALTA (é o equity do logo)
- Inter Light pra parágrafos · Inter 700 pra eyebrows
- WhatsApp Reservas e Eventos são números separados (não unificar)
- Wordmark é "EL COYOTE" / "ELCOYOTE" caixa alta — coyote no O central
- "Desde 2017" no rodapé/lockups
- Sem inventar números, anos, métricas
- Não tem Vista do Porto neste site (em construção, fora do escopo v1)

Comece pelo bloco 1+2 (Nav + Hero). Me mostra esse pedaço pra eu
validar tom antes de seguir pro Conceito + Manifesto. Depois Eventos.
```

---

## Tokens canônicos do v2 (para referência rápida)

### Paleta (8 cores)

| Nome | Hex | Uso |
|---|---|---|
| Coyote Ink | `#0E0E0E` | tipografia · logo · noite · base 60% |
| Mar Antes do Sol | `#274156` | primária · institucional · headers · apoio 30% |
| Brasa do Pôr do Sol | `#f58549` | acento · CTA · destaque · 10% |
| Hora Dourada | `#f2c14e` | secundária · celebração · convite |
| Madeira do Deck | `#9e5641` | neutro quente · superfícies |
| Mato do Morro | `#88a07d` | natureza · contraste · suporte |
| Bruma de Manhã | `#a9b0b3` | suporte · linhas · estados inativos |
| Areia de Praia | `#F4EFE6` | fundo · papel · cream padrão |

Combinação A (Noite Combustível): `#0E0E0E + #f58549 + #F4EFE6`
Combinação B (Entardecer no Porto): `#274156 + #f2c14e + #F4EFE6`
Combinação C (Domingo de Ressaca): `#F4EFE6 + #9e5641 + #0E0E0E`
Regra 60·30·10: 60% cream/ink · 30% deep/terra · 10% ember/sun

### Tipografia

- **Display:** Anton (Regular). Caixa alta. Tracking 0.005em. Line-height 0.92. Mínimo 28px.
- **Sans:** Inter 300/400/500/600/700. Corpo, UI, eyebrow.
- **Hand:** Caveat 400/700. Ornamento. Uma frase por peça.
- **Mono:** JetBrains Mono 400/600. Metadados, datas, especs.

Escala display: Hero 96px · H1 56px · H2 36px.
Eyebrow: Inter 700 · 11px · letter-spacing 0.32em · UPPERCASE.

### Componentes (CSS classes do v2 — copiar literal)

`.display` `.eyebrow` `.grain` `.hairline` `.hairline-strong` `.smallcaps` `.scratch` `.tick` `.photo-grade` `.btn` `.btn-primary` `.btn-secondary` `.btn-ghost` `.btn-disabled` `.field` `.field-label` `.field-error` `.field-error-msg` `.anchor-nav`

### Voz — eixos

- 78% informal (vs formal)
- 72% coração (vs cabeça)
- 65% sugere (vs explica)

---

## Checklist anti-frustração

✅ **Bom feedback:** "O bloco 6 está com cor de fundo errada — usa o `#274156` (deep), não o ink. E o ornamento Caveat tem que ser sun (`#f2c14e`), não ember."

✅ **Bom feedback:** "Substitui a foto do hero pelo placeholder bg-sand/40 dashed com texto '[ FOTO REAL: pôr do sol do deck ]' — ainda não temos o asset."

❌ **Feedback que não funciona:** "tá ruim, refaz."

---

## Fluxo de iteração

1. **Round 1:** cola prompt + anexa assets · pede só Nav + Hero
2. **Round 2:** Conceito (5 pilares) + Manifesto editorial
3. **Round 3:** Agenda + Eventos Privados (bloco crítico)
4. **Round 4:** Fotografia + Contato + Footer
5. **Round 5:** export `.html` único · baixa · Hostinger

---

## O que ficou de fora deste site v1

- Vista do Porto (em construção · entra no v2 do site)
- Cardápio
- Reservas online (delegado pro WhatsApp)
- Galeria infinita / acervo histórico
- Multi-idioma (público local · só BR-PT)
- E-commerce / merch
- Blog
