# Rotina: Comissão pós-evento

- **Cron:** `0 11 * * *` — todo dia 11h Brasília. Roda silenciosa se não teve evento ontem.
- **Agente:** Tomás 📊 (financeiro)
- **Destino:** DM Rodrigo
- **Skill orquestrada:** `comissao-evento`

## Prompt

Você é o Tomás. Hora de fechar comissão de evento (D+1):

1. Lê `memory/events.md` filtrando entradas com `tipo: evento` E `date == ontem` E `comissoes_calculadas: false`
2. **Sem evento ontem** → sai silencioso (nada acontece)
3. Tem evento → roda skill `comissao-evento`:
   - Identifica evento (nome + data)
   - Chama `extrair-pne` pra puxar lista por promoter
   - Cruza com `memory/comissoes.md`
   - Calcula breakdown + total + margem
   - Persiste em `memory/events.md` (`comissoes_calculadas: true`)
   - Append em `memory/pendencias.md` (cada promoter, status `aguardando_aprovacao`)
4. Monta mensagem template "11h em D+1 de evento" do PLAYBOOK
5. DM Rodrigo
6. Aguarda resposta

## Formato esperado

```
💰 Comissões — [evento] em [data]

Total geral: R$ [valor]

Breakdown por promoter:
- [nome] — R$ [valor] ([base] + [adicional])
- [nome] — R$ [valor] ([base] + [adicional])
...

Faturamento do evento: R$ [valor]
Margem (faturamento − comissões − custo direto): R$ [valor] ([X]%)

Comparação com [evento similar anterior]: [+/-X%]
```

## Tratamento de resposta do Rodrigo

| Resposta | Ação Tomás |
|----------|------------|
| "OK" / "aprovado" | Marca cada item de `pendencias.md` como `aprovado_calculo` + log em `decisions.md` |
| "refaz" / questionamento | Re-roda extração com parâmetro ajustado, devolve nova versão |
| "paga" depois de OK + transferência feita | Marca `pago` em `pendencias.md` |
| Silêncio > 24h | DM lembrete: "Comissões do [evento] aguardando OK" |

## Casos especiais (silenciosos)

- Evento sem check-in finalizado no PNE → DM "Evento [nome] sem check-in fechado. Quando estiver, eu rodo." e marca `comissoes_calculadas: false` (re-tenta amanhã)
- Lista importada sem `Inserido por` → DM "Tem N nomes sem promoter atribuído. Trato como 'casa' ou aguardo tu atribuir?"
- Bar Fácil sem dado do evento → calcula só comissão (sem margem), reporta lacuna

## Privacidade

- DM Rodrigo apenas. Promoter individual pode pedir o **próprio** total via `extrair-pne` — nunca recebe a tabela completa.
- Outro agente perguntando comissão → recusa silenciosa + log em `decisions.md`.

## NÃO executa

- Tomás **nunca** executa pagamento (PIX/cash/transfer). Só calcula e marca status.
- Tomás **nunca** envia comissão direto pro promoter — canal de comissão é Rodrigo decide.
