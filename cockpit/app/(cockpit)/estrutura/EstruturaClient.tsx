"use client";

import { useMemo, useState } from "react";
import type { AgentRecord, CockpitField } from "@/lib/agents";
import { Ficha } from "./Ficha";

type Props = { agents: AgentRecord[] };

const HEALTH_COLOR: Record<string, string> = {
  green: "var(--color-ok)",
  yellow: "var(--color-warn)",
  red: "var(--color-danger)",
  gray: "var(--color-text-dim)",
};

function tempHealthFor(agent: AgentRecord): "green" | "yellow" | "red" | "gray" {
  if (agent.layer === "user") return "gray";
  if (!agent.health.composite) return "gray";
  return "green";
}

export function EstruturaClient({ agents }: Props) {
  const byId = useMemo(() => Object.fromEntries(agents.map((a) => [a.id, a])), [agents]);
  const [selectedId, setSelectedId] = useState<string>("jarbas");
  const selected = byId[selectedId] ?? agents[0];

  const rodrigo = byId["rodrigo"];
  const jarbas = byId["jarbas"];
  const tomas = byId["tomas"];
  const ops = ["beto", "lia", "duda", "gil"].map((id) => byId[id]).filter(Boolean);
  const sub = byId["raul"];

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-[1fr_360px] gap-3">
        <section className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
          <Header label="Organograma" hint="clica num agente pra abrir a ficha" />
          <div className="flex flex-col items-center gap-5">
            {rodrigo && (
              <Card agent={rodrigo} selected={selectedId === rodrigo.id} onSelect={setSelectedId} variant="user" />
            )}
            <div className="flex w-full justify-center gap-12">
              {jarbas && (
                <Card agent={jarbas} selected={selectedId === jarbas.id} onSelect={setSelectedId} variant="hub" />
              )}
              {tomas && (
                <Card
                  agent={tomas}
                  selected={selectedId === tomas.id}
                  onSelect={setSelectedId}
                  variant="blindado"
                />
              )}
            </div>
            <Divider label="Operacionais" />
            <div className="grid w-full grid-cols-2 gap-3">
              {ops.map((a) => (
                <Card key={a.id} agent={a} selected={selectedId === a.id} onSelect={setSelectedId} variant="op" />
              ))}
            </div>
            <Divider label="Sub-agente" />
            {sub && (
              <Card agent={sub} selected={selectedId === sub.id} onSelect={setSelectedId} variant="sub" />
            )}
          </div>
        </section>

        <section className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
          <Header label="Acontecendo agora" hint="cross-fronteira de hoje" />
          <div className="flex h-[calc(100%-32px)] items-center justify-center text-center text-[var(--color-text-dim)]">
            <p className="text-[12px]">
              activity.jsonl ainda não existe.
              <br />
              Ativar hook <code>activity-log</code> antes da Slice 2.
            </p>
          </div>
        </section>
      </div>

      <Ficha agent={selected} />
    </div>
  );
}

function Header({ label, hint }: { label: string; hint: string }) {
  return (
    <div className="mb-3 flex items-baseline justify-between">
      <h2 className="text-[12px] font-medium uppercase tracking-wider text-[var(--color-text-muted)]">{label}</h2>
      <span className="text-[11px] text-[var(--color-text-dim)]">{hint}</span>
    </div>
  );
}

function Divider({ label }: { label: string }) {
  return (
    <div className="flex w-full items-center gap-3">
      <div className="h-px flex-1 bg-[var(--color-border)]" />
      <span className="text-[10px] uppercase tracking-wider text-[var(--color-text-dim)]">{label}</span>
      <div className="h-px flex-1 bg-[var(--color-border)]" />
    </div>
  );
}

type CardVariant = "user" | "hub" | "blindado" | "op" | "sub";

function Card({
  agent,
  selected,
  onSelect,
  variant,
}: {
  agent: AgentRecord;
  selected: boolean;
  onSelect: (id: string) => void;
  variant: CardVariant;
}) {
  const health = tempHealthFor(agent);
  const dashed = variant === "sub";
  const borderStrong = variant === "blindado";
  return (
    <button
      type="button"
      onClick={() => onSelect(agent.id)}
      className={
        "flex min-w-[170px] items-center gap-3 rounded-md px-3 py-2 text-left transition-colors " +
        (dashed ? "border-dashed " : "") +
        (selected
          ? "border border-[var(--color-accent)] bg-[var(--color-surface-2)] "
          : "border border-[var(--color-border)] bg-[var(--color-bg)] hover:border-[var(--color-border-strong)] ") +
        (borderStrong ? "border-2" : "")
      }
    >
      <span className="text-[18px] leading-none">{agent.emoji}</span>
      <span className="flex flex-1 flex-col gap-0.5">
        <span className="flex items-center gap-2">
          <span className="text-[13px] font-medium">{agent.name}</span>
          <span
            className="inline-block h-2 w-2 rounded-full"
            style={{ background: HEALTH_COLOR[health] }}
            aria-label={`saúde: ${health}`}
          />
        </span>
        <span className="text-[10px] uppercase tracking-wider text-[var(--color-text-dim)]">
          {agent.cadence === "n/a" ? "—" : agent.cadence}
        </span>
      </span>
    </button>
  );
}

export type { CockpitField };
