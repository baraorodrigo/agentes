import { promises as fs } from "node:fs";
import path from "node:path";

export type ActivityEvent = {
  ts: string;
  agent_from: string | null;
  agent_to: string | null;
  type: "cron_fire" | "handoff" | "escalation" | "alert" | "human_decision";
  payload: Record<string, unknown>;
  status: "ok" | "failed" | "partial";
};

const WORKSPACE = process.env.COCKPIT_WORKSPACE
  ? process.env.COCKPIT_WORKSPACE
  : path.resolve(process.cwd(), "..");

const SOURCES: { agent: string; rel: string }[] = [
  { agent: "beto", rel: "agentes/promoters/activity.jsonl" },
  { agent: "lia", rel: "agentes/atendimento/activity.jsonl" },
  { agent: "duda", rel: "agentes/marketing/activity.jsonl" },
  { agent: "tomas", rel: "agentes/financeiro/activity.jsonl" },
  { agent: "gil", rel: "agentes/eventos/activity.jsonl" },
  { agent: "raul", rel: "agentes/intel/activity.jsonl" },
];

async function readJsonl(file: string): Promise<ActivityEvent[]> {
  let raw: string;
  try {
    raw = await fs.readFile(file, "utf8");
  } catch {
    return [];
  }
  const out: ActivityEvent[] = [];
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    try {
      out.push(JSON.parse(trimmed) as ActivityEvent);
    } catch {
      // skip malformed line
    }
  }
  return out;
}

export async function getRecentActivity(limit = 50): Promise<ActivityEvent[]> {
  const all = (
    await Promise.all(SOURCES.map((s) => readJsonl(path.resolve(WORKSPACE, s.rel))))
  ).flat();
  all.sort((a, b) => (a.ts < b.ts ? 1 : a.ts > b.ts ? -1 : 0));
  return all.slice(0, limit);
}

export async function getTodayActivity(): Promise<ActivityEvent[]> {
  const today = new Date().toISOString().slice(0, 10);
  const all = await getRecentActivity(500);
  return all.filter((e) => e.ts.startsWith(today));
}
