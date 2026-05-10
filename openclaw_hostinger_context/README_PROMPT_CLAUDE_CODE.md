# Contexto visual — Configuração OpenClaw via Hostinger

Este pacote contém duas imagens de referência do ambiente atual que preciso configurar.

## Imagem 01 — `01_openclaw_web_chat_interface.png`
**Legenda:** Interface web do OpenClaw já aberta no navegador pela Hostinger. A tela está na aba **Chat**, com status **Ready to chat**, versão **v2026.4.12**. No topo aparecem os seletores: branch `main`, modelo `Default (Claude Sonnet 4.6)` e modo `Default (adaptive)`. A barra lateral mostra áreas como Visão Geral, Canais, Instâncias, Sessões, Uso, Tarefas Cron, Agentes, Habilidades, Nós e Documentação.

## Imagem 02 — `02_hostinger_openclaw_cli_terminal.png`
**Legenda:** Terminal web da Hostinger com o **OpenClaw CLI** aberto. A tela mostra a mensagem: `OpenClaw CLI - type "openclaw --help" to get started` e o prompt está parado em `$ :~$`. Preciso sair deste ponto inicial e chegar em um ambiente OpenClaw funcional/configurado.

---

# Prompt para colar no Claude Code / agente técnico

Você é meu assistente técnico para configurar o OpenClaw em ambiente Hostinger. Analise as duas imagens anexadas neste diretório e me guie passo a passo, de forma prática, para sair do estado atual e chegar em um ambiente configurado e funcional.

## Estado atual
- Tenho acesso à interface web do OpenClaw pela Hostinger.
- A interface web abre normalmente e mostra o chat como “Ready to chat”.
- O modelo selecionado na interface é `Default (Claude Sonnet 4.6)`.
- Tenho acesso ao terminal web da Hostinger.
- O terminal mostra o OpenClaw CLI instalado, com a mensagem: `OpenClaw CLI - type "openclaw --help" to get started`.
- Estou no prompt inicial `$ :~$`.
- Quero configurar canais, instâncias, agentes e deixar o ambiente pronto para usar com WhatsApp e automações.

## Objetivo
Me orientar exatamente o que digitar no terminal e o que clicar/configurar na interface web para:
1. Verificar se o OpenClaw está instalado corretamente.
2. Verificar versão, status, saúde do sistema e processos ativos.
3. Localizar arquivos de configuração existentes.
4. Entender onde ficam configs, logs, sessões, agentes, canais e nós.
5. Configurar ou revisar variáveis de ambiente necessárias.
6. Configurar canal WhatsApp ou preparar o ambiente para isso.
7. Criar/ajustar um agente chamado **Beto**, responsável por gerenciar promoters do El Coyote.
8. Garantir que o chat web e o CLI estejam conversando com o mesmo ambiente.
9. Criar um checklist final de validação.

## Regras importantes
- Não presuma caminhos de arquivos sem antes pedir/rodar comandos de inspeção.
- Primeiro faça diagnóstico, depois configuração.
- Me dê comandos copiáveis.
- Explique cada comando em linguagem simples.
- Se houver risco de apagar configuração existente, me avise antes.
- Antes de editar qualquer arquivo, faça backup.
- Se precisar de chaves/API tokens, indique exatamente onde devo colocar, mas não invente valores.
- Quero um fluxo para leigo, sem pular etapas.

## Primeiros comandos que quero que você me peça para rodar
Comece pedindo para eu rodar estes comandos e colar o resultado:

```bash
openclaw --help
openclaw --version
pwd
ls -la
find ~ -maxdepth 3 -iname '*openclaw*' 2>/dev/null
```

Depois, com base nos resultados, continue a investigação.

## Resultado esperado
Ao final, quero ter:
- OpenClaw validado.
- Interface web funcionando.
- CLI funcionando.
- Canal WhatsApp encaminhado/configurado ou com próximos passos claros.
- Agente Beto criado ou pronto para ser criado.
- Documentação curta com os comandos usados.
- Checklist de “ambiente pronto”.
