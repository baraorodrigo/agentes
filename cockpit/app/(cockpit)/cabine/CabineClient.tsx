"use client";

import { useMemo, useState } from "react";
import type { AgentRecord } from "@/lib/agents";
import type { ChatMessage } from "@/lib/cabine";
import type { ActivityEvent } from "@/lib/activity";
import { ChatPanel } from "./ChatPanel";
import { OperationPanel } from "./OperationPanel";

type Props = {
  agents: AgentRecord[];
  agentMap: Record<string, AgentRecord>;
  histories: Record<string, ChatMessage[]>;
  activityByAgent: Record<string, ActivityEvent[]>;
  initialAgent: string;
  highlightItem: string | null;
  apiKeyConfigured: boolean;
};

export function CabineClient({
  agents,
  agentMap,
  histories,
  activityByAgent,
  initialAgent,
  highlightItem,
  apiKeyConfigured,
}: Props) {
  const [selected, setSelected] = useState<string>(initialAgent);
  const agent = agentMap[selected] ?? agents[0];
  const history = useMemo(() => histories[selected] ?? [], [histories, selected]);
  const activity = useMemo(() => activityByAgent[selected] ?? [], [activityByAgent, selected]);

  return (
    <div className="flex flex-col gap-3">
      {/* Pill selector */}
      <div className="flex flex-wrap gap-1 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] p-1.5">
        {agents.map((a) => {
          const active = a.id === selected;
          return (
            <button
              key={a.id}
              type="button"
              onClick={() => setSelected(a.id)}
              className={
                "flex items-center gap-1.5 rounded px-3 py-1 text-[12px] transition-colors " +
                (active
                  ? "bg-[var(--color-surface-2)] text-[var(--color-text)]"
                  : "text-[var(--color-text-muted)] hover:text-[var(--color-text)]")
              }
            >
              <span className="text-[14px] leading-none">{a.emoji}</span>
              <span>{a.name}</span>
            </button>
          );
        })}
      </div>

      {/* Header agente */}
      <div className="flex items-center gap-3 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] p-3">
        <span className="text-[24px] leading-none">{agent.emoji}</span>
        <div className="flex flex-1 flex-col gap-0.5">
          <span className="text-[14px] font-medium">{agent.name}</span>
          <span className="text-[11px] text-[var(--color-text-muted)]">{agent.meta}</span>
        </div>
        <span
          className="inline-block h-2.5 w-2.5 rounded-full"
          style={{ background: "var(--color-ok)" }}
          title="placeholder de saúde"
        />
      </div>

      {/* 2 colunas */}
      <div className="grid grid-cols-[1.7fr_1fr] gap-3">
        <OperationPanel agent={agent} activity={activity} highlightItem={highlightItem} />
        <ChatPanel agent={agent} initialHistory={history} apiKeyConfigured={apiKeyConfigured} />
      </div>
    </div>
  );
}
