"use server";

import { revalidatePath } from "next/cache";
import { updateAgentField, type CockpitField } from "@/lib/agents";

const FIELDS: CockpitField[] = ["purpose", "trigger", "output", "consumer", "health_rule_human", "no_go"];

export async function saveAgentField(agentId: string, field: string, value: string): Promise<void> {
  if (!FIELDS.includes(field as CockpitField)) {
    throw new Error(`invalid field: ${field}`);
  }
  await updateAgentField(agentId, field as CockpitField, value);
  revalidatePath("/estrutura");
}
