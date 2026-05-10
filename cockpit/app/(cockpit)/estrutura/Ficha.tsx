"use client";

import { useState, useTransition } from "react";
import type { AgentRecord, CockpitField } from "@/lib/agents";
import { saveAgentField } from "./actions";

const FIELDS: { key: CockpitField; label: string; hint: string }[] = [
  { key: "purpose", label: "1. Pra quê serve", hint: "função num parágrafo" },
  { key: "trigger", label: "2. Quando age (gatilho)", hint: "cron, evento, mensagem" },
  { key: "output", label: "3. O que produz", hint: "saída concreta" },
  { key: "consumer", label: "4. Quem consome", hint: "destinatário" },
  { key: "health_rule_human", label: "5. Sinal de saúde", hint: "como sei que tá funcionando" },
  { key: "no_go", label: "6. Quando NÃO age", hint: "escopo negativo" },
];

export function Ficha({ agent }: { agent: AgentRecord }) {
  return (
    <section className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-[22px] leading-none">{agent.emoji}</span>
          <div>
            <h2 className="text-[14px] font-medium">{agent.name}</h2>
            <p className="text-[11px] text-[var(--color-text-muted)]">{agent.meta}</p>
          </div>
        </div>
        <button
          type="button"
          disabled
          className="cursor-not-allowed rounded border border-[var(--color-border)] px-3 py-1 text-[11px] text-[var(--color-text-dim)]"
          title="Cabine entra na Slice 3"
        >
          abrir cabine ↗
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {FIELDS.map((f) => (
          <FichaField key={f.key} agentId={agent.id} field={f.key} label={f.label} hint={f.hint} value={agent.cockpit[f.key]} />
        ))}
      </div>
    </section>
  );
}

function FichaField({
  agentId,
  field,
  label,
  hint,
  value,
}: {
  agentId: string;
  field: CockpitField;
  label: string;
  hint: string;
  value: string;
}) {
  const [draft, setDraft] = useState(value);
  const [committed, setCommitted] = useState(value);
  const [pending, startTransition] = useTransition();
  const [err, setErr] = useState<string | null>(null);

  if (committed !== value && !pending) {
    setCommitted(value);
    setDraft(value);
  }

  const dirty = draft !== committed;
  const onBlur = () => {
    if (!dirty) return;
    setErr(null);
    startTransition(async () => {
      try {
        await saveAgentField(agentId, field, draft);
        setCommitted(draft);
      } catch (e) {
        setErr(e instanceof Error ? e.message : "erro ao salvar");
      }
    });
  };

  return (
    <label className="flex flex-col gap-1 rounded border border-[var(--color-border)] bg-[var(--color-bg)] p-3">
      <span className="flex items-baseline justify-between">
        <span className="text-[11px] font-medium uppercase tracking-wider text-[var(--color-text-muted)]">
          {label}
        </span>
        <span className="text-[10px] text-[var(--color-text-dim)]">
          {pending ? "salvando…" : err ? `erro: ${err}` : dirty ? "edição não salva" : hint}
        </span>
      </span>
      <textarea
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={onBlur}
        rows={3}
        className="resize-y border-0 bg-transparent text-[12px] leading-relaxed text-[var(--color-text)] outline-none"
        placeholder="(vazio)"
      />
    </label>
  );
}
