import { getPipeline } from "@/lib/pipeline-server";
import { getAgents } from "@/lib/agents";
import { PipelineClient } from "./PipelineClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Pipeline() {
  const [snapshot, agents] = await Promise.all([getPipeline(), getAgents()]);
  const agentMap = Object.fromEntries(agents.map((a) => [a.id, a]));
  return <PipelineClient snapshot={snapshot} agentMap={agentMap} />;
}
