import { getCalendarItems } from "@/lib/calendar-server";
import { getAgents } from "@/lib/agents";
import { SemanaClient } from "./SemanaClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Semana() {
  const [items, agents] = await Promise.all([getCalendarItems(), getAgents()]);
  const agentMap = Object.fromEntries(agents.map((a) => [a.id, a]));
  const today = new Date();
  const todayISO = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  return <SemanaClient items={items} agentMap={agentMap} todayISO={todayISO} />;
}
