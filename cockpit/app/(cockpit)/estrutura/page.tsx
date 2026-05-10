import { getAgents } from "@/lib/agents";
import { EstruturaClient } from "./EstruturaClient";

export const dynamic = "force-dynamic";

export default async function EstruturaPage() {
  const agents = await getAgents();
  return <EstruturaClient agents={agents} />;
}
