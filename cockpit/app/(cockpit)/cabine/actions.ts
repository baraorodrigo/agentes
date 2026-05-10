"use server";

import { revalidatePath } from "next/cache";
import { sendChatMessage, type SendResult } from "@/lib/cabine";

export async function sendMessage(agentId: string, text: string): Promise<SendResult> {
  const trimmed = text.trim();
  if (!trimmed) return { ok: false, error: "mensagem vazia" };
  const result = await sendChatMessage(agentId, trimmed);
  revalidatePath("/cabine");
  return result;
}
