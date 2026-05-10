import { promises as fs } from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export type CockpitField = "purpose" | "trigger" | "output" | "consumer" | "health_rule_human" | "no_go";

export type CockpitMeta = {
  purpose: string;
  trigger: string;
  output: string;
  consumer: string;
  health_rule_human: string;
  no_go: string;
};

export type HealthMeta = {
  cron_freshness?: { enabled: boolean; threshold_minutes?: number };
  response_latency?: { enabled: boolean; threshold_minutes?: number };
  channel_open?: { enabled: boolean };
  composite?: string;
};

export type AgentRecord = {
  id: string;
  filePath: string;
  emoji: string;
  name: string;
  meta: string;
  layer: "user" | "hub" | "blindado" | "operacional" | "subagente";
  cadence: "push" | "pull" | "mix" | "n/a";
  cockpit: CockpitMeta;
  health: HealthMeta;
};

const WORKSPACE = process.env.COCKPIT_WORKSPACE
  ? process.env.COCKPIT_WORKSPACE
  : path.resolve(process.cwd(), "..");

type RegistryEntry = Pick<AgentRecord, "id" | "emoji" | "name" | "meta" | "layer" | "cadence"> & {
  filePath: string;
};

const REGISTRY: RegistryEntry[] = [
  {
    id: "rodrigo",
    emoji: "👤",
    name: "Rodrigo",
    meta: "tu · centro de tudo",
    layer: "user",
    cadence: "n/a",
    filePath: "USER.md",
  },
  {
    id: "jarbas",
    emoji: "🐺",
    name: "Jarbas",
    meta: "hub · WhatsApp privado · pull",
    layer: "hub",
    cadence: "pull",
    filePath: "IDENTITY.md",
  },
  {
    id: "tomas",
    emoji: "📊",
    name: "Tomás",
    meta: "Financeiro · DM separada · push",
    layer: "blindado",
    cadence: "push",
    filePath: "agentes/financeiro/IDENTITY.md",
  },
  {
    id: "beto",
    emoji: "⚡",
    name: "Beto",
    meta: "Promoters · grupo WhatsApp · push",
    layer: "operacional",
    cadence: "push",
    filePath: "agentes/promoters/IDENTITY.md",
  },
  {
    id: "lia",
    emoji: "💬",
    name: "Lia",
    meta: "Atendimento público · WhatsApp do bar · pull",
    layer: "operacional",
    cadence: "pull",
    filePath: "agentes/atendimento/IDENTITY.md",
  },
  {
    id: "duda",
    emoji: "🎸",
    name: "Duda",
    meta: "Marketing · Telegram · push",
    layer: "operacional",
    cadence: "push",
    filePath: "agentes/marketing/IDENTITY.md",
  },
  {
    id: "gil",
    emoji: "🎪",
    name: "Gil",
    meta: "Eventos · DM contigo · pull (com checklist)",
    layer: "operacional",
    cadence: "mix",
    filePath: "agentes/eventos/IDENTITY.md",
  },
  {
    id: "raul",
    emoji: "🔍",
    name: "Raul",
    meta: "Inteligência · sub-agente do Jarbas · push semanal",
    layer: "subagente",
    cadence: "push",
    filePath: "agentes/intel/IDENTITY.md",
  },
];

const EMPTY_COCKPIT: CockpitMeta = {
  purpose: "",
  trigger: "",
  output: "",
  consumer: "",
  health_rule_human: "",
  no_go: "",
};

function absPath(rel: string) {
  return path.resolve(WORKSPACE, rel);
}

async function readEntry(entry: RegistryEntry): Promise<AgentRecord> {
  const file = absPath(entry.filePath);
  const raw = await fs.readFile(file, "utf8");
  const parsed = matter(raw);
  const fm = (parsed.data ?? {}) as { cockpit?: Partial<CockpitMeta>; health?: HealthMeta };
  const cockpit: CockpitMeta = { ...EMPTY_COCKPIT, ...(fm.cockpit ?? {}) };
  const health: HealthMeta = fm.health ?? {};
  return {
    id: entry.id,
    filePath: entry.filePath,
    emoji: entry.emoji,
    name: entry.name,
    meta: entry.meta,
    layer: entry.layer,
    cadence: entry.cadence,
    cockpit,
    health,
  };
}

export async function getAgents(): Promise<AgentRecord[]> {
  return Promise.all(REGISTRY.map(readEntry));
}

export async function getAgent(id: string): Promise<AgentRecord | null> {
  const entry = REGISTRY.find((e) => e.id === id);
  if (!entry) return null;
  return readEntry(entry);
}

export async function updateAgentField(id: string, field: CockpitField, value: string): Promise<void> {
  const entry = REGISTRY.find((e) => e.id === id);
  if (!entry) throw new Error(`unknown agent: ${id}`);
  const file = absPath(entry.filePath);
  const raw = await fs.readFile(file, "utf8");
  const parsed = matter(raw);
  const data = (parsed.data ?? {}) as Record<string, unknown>;
  const cockpit = { ...EMPTY_COCKPIT, ...((data.cockpit as Partial<CockpitMeta>) ?? {}) };
  cockpit[field] = value;
  data.cockpit = cockpit;
  const next = matter.stringify(parsed.content, data);
  await fs.writeFile(file, next, "utf8");
}
