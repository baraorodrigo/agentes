import { getAgents } from "@/lib/agents";
import { getHistory } from "@/lib/cabine";
import { getRecentActivity } from "@/lib/activity";
import { CabineClient } from "./CabineClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const CHATABLE = ["jarbas", "beto", "lia", "duda", "tomas", "gil", "raul"];

type SearchParams = { agent?: string; item?: string };

export default async function CabinePage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams;
  const initialAgent = params?.agent && CHATABLE.includes(params.agent) ? params.agent : "jarbas";

  const [agents, activity] = await Promise.all([getAgents(), getRecentActivity(200)]);
  const agentMap = Object.fromEntries(agents.map((a) => [a.id, a]));

  const histories: Record<string, Awaited<ReturnType<typeof getHistory>>> = {};
  for (const id of CHATABLE) {
    histories[id] = await getHistory(id);
  }

  const activityByAgent: Record<string, typeof activity> = {};
  for (const id of CHATABLE) {
    activityByAgent[id] = activity.filter((e) => e.agent_from === id);
  }

  const apiKeyConfigured = Boolean(process.env.ANTHROPIC_API_KEY);

  return (
    <CabineClient
      agents={agents.filter((a) => CHATABLE.includes(a.id))}
      agentMap={agentMap}
      histories={histories}
      activityByAgent={activityByAgent}
      initialAgent={initialAgent}
      highlightItem={params?.item ?? null}
      apiKeyConfigured={apiKeyConfigured}
    />
  );
}
