# Rotina: Cobrança Privada nos Zerados

- **Cron:** `0 13 * * 1-6` (seg-sáb, 13h Brasília)
- **Agente:** Beto
- **Destino:** WhatsApp privado de cada promoter zerado
- **Condição:** Só executa se há evento na semana. Senão, completa silenciosamente.
- **Skill usada:** `skills/extrair-pne.md`

## Prompt

1. Consultar no PNE quais promoters ainda **não movimentaram hoje** (zero nomes inseridos / zero ingressos vendidos no dia)
2. Pra cada um, enviar mensagem **privada** (nunca no grupo) com tom de cobrança leve do PLAYBOOK
3. Se promoter responder "tá difícil" ou similar, mandar a mensagem de apoio (com a pergunta sobre canal preferido: WhatsApp/Instagram/grupo)
4. Registrar resposta na base de promoters

## Regras

- Nunca exposição pública. **Elogio em público, correção no privado.**
- Não enviar pro mesmo promoter mais de 1 cobrança no mesmo dia
- Não enviar pra quem já avisou que tá fora desse evento

## Formato esperado

Ver `agentes/promoters/PLAYBOOK.md` § 13h — Cobrança leve.
