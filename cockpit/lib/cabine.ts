import { promises as fs } from "node:fs";
import path from "node:path";
import Anthropic from "@anthropic-ai/sdk";

export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
  ts: string;
};

const WORKSPACE = process.env.COCKPIT_WORKSPACE
  ? process.env.COCKPIT_WORKSPACE
  : path.resolve(process.cwd(), "..");

type AgentPaths = {
  identity: string;
  soul?: string;
  history: string;
  model: string;
};

const AGENT_PATHS: Record<string, AgentPaths> = {
  jarbas: {
    identity: "IDENTITY.md",
    soul: "SOUL.md",
    history: "cabine_history.jsonl",
    model: "claude-opus-4-7",
  },
  beto: {
    identity: "agentes/promoters/IDENTITY.md",
    history: "agentes/promoters/cabine_history.jsonl",
    model: "claude-haiku-4-5-20251001",
  },
  lia: {
    identity: "agentes/atendimento/IDENTITY.md",
    history: "agentes/atendimento/cabine_history.jsonl",
    model: "claude-haiku-4-5-20251001",
  },
  duda: {
    identity: "agentes/marketing/IDENTITY.md",
    history: "agentes/marketing/cabine_history.jsonl",
    model: "claude-haiku-4-5-20251001",
  },
  tomas: {
    identity: "agentes/financeiro/IDENTITY.md",
    history: "agentes/financeiro/cabine_history.jsonl",
    model: "claude-sonnet-4-6",
  },
  gil: {
    identity: "agentes/eventos/IDENTITY.md",
    history: "agentes/eventos/cabine_history.jsonl",
    model: "claude-haiku-4-5-20251001",
  },
  raul: {
    identity: "agentes/intel/IDENTITY.md",
    history: "agentes/intel/cabine_history.jsonl",
    model: "claude-sonnet-4-6",
  },
};

function abs(rel: string) {
  return path.resolve(WORKSPACE, rel);
}

async function readIfExists(file: string): Promise<string> {
  try {
    return await fs.readFile(file, "utf8");
  } catch {
    return "";
  }
}

async function buildSystemPrompt(agentId: string): Promise<string> {
  const paths = AGENT_PATHS[agentId];
  if (!paths) throw new Error(`unknown agent: ${agentId}`);
  const identity = await readIfExists(abs(paths.identity));
  const soul = paths.soul ? await readIfExists(abs(paths.soul)) : "";
  return [
    "Você é um agente do El Coyote OS rodando em modo CABINE (canal interno do Rodrigo).",
    "Não é o canal operacional — esta conversa NÃO vai pro WhatsApp/Telegram. Use isso pra ajustar comportamento, testar respostas, e dar visibilidade pro Rodrigo.",
    "Responda sempre em português brasileiro, no tom da sua IDENTITY.",
    "",
    "=== IDENTITY ===",
    identity || "(IDENTITY.md vazio)",
    soul ? "\n=== SOUL ===\n" + soul : "",
  ].join("\n");
}

export async function getHistory(agentId: string): Promise<ChatMessage[]> {
  const paths = AGENT_PATHS[agentId];
  if (!paths) return [];
  const raw = await readIfExists(abs(paths.history));
  if (!raw) return [];
  const out: ChatMessage[] = [];
  for (const line of raw.split(/\r?\n/)) {
    const t = line.trim();
    if (!t) continue;
    try {
      out.push(JSON.parse(t) as ChatMessage);
    } catch {
      // skip
    }
  }
  return out.slice(-50);
}

async function appendHistory(agentId: string, msg: ChatMessage): Promise<void> {
  const paths = AGENT_PATHS[agentId];
  if (!paths) return;
  await fs.appendFile(abs(paths.history), JSON.stringify(msg) + "\n", "utf8");
}

export type SendResult =
  | { ok: true; reply: ChatMessage }
  | { ok: false; error: string };

export async function sendChatMessage(agentId: string, userText: string): Promise<SendResult> {
  const paths = AGENT_PATHS[agentId];
  if (!paths) return { ok: false, error: `agente desconhecido: ${agentId}` };

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return {
      ok: false,
      error: "ANTHROPIC_API_KEY não configurada. Defina no env do processo do cockpit.",
    };
  }

  const userMsg: ChatMessage = { role: "user", content: userText, ts: new Date().toISOString() };
  await appendHistory(agentId, userMsg);

  const history = await getHistory(agentId);
  const system = await buildSystemPrompt(agentId);

  const client = new Anthropic({ apiKey });
  try {
    const resp = await client.messages.create({
      model: paths.model,
      max_tokens: 1024,
      system,
      messages: history.map((m) => ({ role: m.role, content: m.content })),
    });
    const text = resp.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text)
      .join("\n")
      .trim();
    const replyMsg: ChatMessage = { role: "assistant", content: text || "(sem resposta)", ts: new Date().toISOString() };
    await appendHistory(agentId, replyMsg);
    return { ok: true, reply: replyMsg };
  } catch (e) {
    const err = e instanceof Error ? e.message : String(e);
    return { ok: false, error: err };
  }
}

export function listChatableAgents(): string[] {
  return Object.keys(AGENT_PATHS);
}
