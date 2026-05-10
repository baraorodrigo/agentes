import { promises as fs } from "node:fs";
import path from "node:path";

export type InboxItem = {
  id: string;
  agent: string;
  priority: "baixa" | "média" | "alta" | "crítica";
  description: string;
  context?: string;
  options?: string[];
  deeplink: string;
  expires_at?: string;
  created_at: string;
};

const WORKSPACE = process.env.COCKPIT_WORKSPACE
  ? process.env.COCKPIT_WORKSPACE
  : path.resolve(process.cwd(), "..");

const FIXTURE_REL = "memory/inbox.fixture.json";

async function readFixture(): Promise<InboxItem[]> {
  const file = path.resolve(WORKSPACE, FIXTURE_REL);
  try {
    const raw = await fs.readFile(file, "utf8");
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed as InboxItem[];
    return [];
  } catch {
    return [];
  }
}

const PRIORITY_ORDER: Record<InboxItem["priority"], number> = {
  crítica: 0,
  alta: 1,
  média: 2,
  baixa: 3,
};

export async function getInbox(): Promise<InboxItem[]> {
  // Notion ainda não pareado — usa fixture local.
  // Quando token Notion entrar em openclaw.json, trocar por chamada à API
  // com cache 30s server-side.
  const items = await readFixture();
  items.sort((a, b) => {
    const p = PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
    if (p !== 0) return p;
    return a.created_at < b.created_at ? -1 : 1;
  });
  return items;
}
