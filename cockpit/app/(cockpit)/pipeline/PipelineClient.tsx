"use client";

import { useState } from "react";
import type { AgentRecord } from "@/lib/agents";
import {
  EVENTO_STAGES,
  PROPOSTA_STAGES,
  fmtBRL,
  type EventoCard,
  type EventoStage,
  type PipelineSnapshot,
  type PropostaCard,
  type PropostaStage,
} from "@/lib/pipeline";

type Props = {
  snapshot: PipelineSnapshot;
  agentMap: Record<string, AgentRecord>;
};

const TIPO_LABEL: Record<string, string> = {
  casamento: "casamento",
  aniversario: "aniversário",
  empresarial: "empresarial",
  outro: "outro",
};

function fmtDate(iso: string) {
  const [, m, d] = iso.split("-");
  return `${d}/${m}`;
}

export function PipelineClient({ snapshot, agentMap }: Props) {
  const [eventos, setEventos] = useState<EventoCard[]>(snapshot.eventos);
  const [propostas, setPropostas] = useState<PropostaCard[]>(snapshot.propostas);
  const [draggingEv, setDraggingEv] = useState<string | null>(null);
  const [draggingProp, setDraggingProp] = useState<string | null>(null);
  const [hoverCol, setHoverCol] = useState<string | null>(null);
  const [dirty, setDirty] = useState(false);

  function moveEvento(id: string, stage: EventoStage) {
    setEventos((cur) => cur.map((e) => (e.id === id ? { ...e, stage } : e)));
    setDirty(true);
  }

  function moveProposta(id: string, stage: PropostaStage) {
    setPropostas((cur) => cur.map((p) => (p.id === id ? { ...p, stage } : p)));
    setDirty(true);
  }

  const fin = snapshot.financeiro;

  return (
    <div className="flex flex-col gap-3">
      {/* Saúde financeira */}
      <Section title="Saúde financeira">
        <div className="grid grid-cols-3 gap-2">
          <FinCard
            label="Caixa"
            value={fmtBRL(fin.caixa.valor)}
            sub={fin.caixa.trend}
            tone="ok"
          />
          <FinCard
            label="A receber"
            value={fmtBRL(fin.a_receber.valor)}
            sub={`${fmtBRL(fin.a_receber.venc_semana)} vencendo essa semana`}
            tone="muted"
          />
          <FinCard
            label="A pagar"
            value={fmtBRL(fin.a_pagar.valor)}
            sub={`${fmtBRL(fin.a_pagar.venc_semana)} vencendo essa semana`}
            tone="warn"
          />
        </div>
        <p className="mt-1 text-[10px] text-[var(--color-text-dim)]">
          Atualizado {new Date(fin.atualizado).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })}
          · placeholder até parear extrato Bar Fácil + Sicoob.
        </p>
      </Section>

      {/* Eventos em produção */}
      <Section title="Eventos em produção" right={dirty ? <DirtyBadge /> : null}>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {EVENTO_STAGES.map((col) => {
            const cards = eventos.filter((e) => e.stage === col.id);
            const isHover = hoverCol === `ev-${col.id}`;
            return (
              <div
                key={col.id}
                onDragOver={(e) => {
                  if (!draggingEv) return;
                  e.preventDefault();
                  setHoverCol(`ev-${col.id}`);
                }}
                onDragLeave={() => setHoverCol((c) => (c === `ev-${col.id}` ? null : c))}
                onDrop={(e) => {
                  e.preventDefault();
                  if (!draggingEv) return;
                  moveEvento(draggingEv, col.id);
                  setDraggingEv(null);
                  setHoverCol(null);
                }}
                className="flex min-w-[180px] flex-1 flex-col gap-1.5 rounded border border-[var(--color-border)] bg-[var(--color-bg)] p-2 transition-colors"
                style={{
                  borderColor: isHover ? "var(--color-accent)" : undefined,
                  background: isHover ? "var(--color-surface-2)" : undefined,
                }}
              >
                <div className="flex items-center justify-between text-[11px]">
                  <span className="uppercase tracking-wider text-[var(--color-text-muted)]">{col.label}</span>
                  <span className="text-[var(--color-text-dim)]">{cards.length}</span>
                </div>
                {cards.length === 0 && (
                  <div className="rounded border border-dashed border-[var(--color-border)] p-2 text-center text-[10px] text-[var(--color-text-dim)]">
                    vazio
                  </div>
                )}
                {cards.map((ev) => {
                  const ag = agentMap[ev.lead];
                  return (
                    <div
                      key={ev.id}
                      draggable
                      onDragStart={() => setDraggingEv(ev.id)}
                      onDragEnd={() => {
                        setDraggingEv(null);
                        setHoverCol(null);
                      }}
                      className="cursor-grab rounded border border-[var(--color-border)] bg-[var(--color-surface)] p-2 active:cursor-grabbing"
                      style={{ opacity: draggingEv === ev.id ? 0.45 : 1 }}
                    >
                      <div className="text-[12px] font-medium">{ev.title}</div>
                      <div className="mt-0.5 text-[10px] text-[var(--color-text-muted)]">
                        {fmtDate(ev.date)} · {ev.atracao}
                      </div>
                      <div className="mt-1 flex items-center justify-between gap-2 text-[10px] text-[var(--color-text-dim)]">
                        <span className="flex items-center gap-1">
                          {ag && <span>{ag.emoji}</span>}
                          <span>{ag?.name ?? ev.lead}</span>
                        </span>
                        {ev.cover > 0 && <span>cover {fmtBRL(ev.cover)}</span>}
                      </div>
                      {ev.detail && (
                        <div className="mt-1 truncate text-[10px] text-[var(--color-text-muted)]" title={ev.detail}>
                          {ev.detail}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </Section>

      {/* Propostas comerciais */}
      <Section title="Propostas comerciais">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {PROPOSTA_STAGES.map((col) => {
            const cards = propostas.filter((p) => p.stage === col.id);
            const isHover = hoverCol === `pr-${col.id}`;
            const totalValor = cards.reduce((sum, c) => sum + (c.valor ?? 0), 0);
            return (
              <div
                key={col.id}
                onDragOver={(e) => {
                  if (!draggingProp) return;
                  e.preventDefault();
                  setHoverCol(`pr-${col.id}`);
                }}
                onDragLeave={() => setHoverCol((c) => (c === `pr-${col.id}` ? null : c))}
                onDrop={(e) => {
                  e.preventDefault();
                  if (!draggingProp) return;
                  moveProposta(draggingProp, col.id);
                  setDraggingProp(null);
                  setHoverCol(null);
                }}
                className="flex min-w-[200px] flex-1 flex-col gap-1.5 rounded border border-[var(--color-border)] bg-[var(--color-bg)] p-2 transition-colors"
                style={{
                  borderColor: isHover ? "var(--color-accent)" : undefined,
                  background: isHover ? "var(--color-surface-2)" : undefined,
                }}
              >
                <div className="flex items-center justify-between text-[11px]">
                  <span className="uppercase tracking-wider text-[var(--color-text-muted)]">{col.label}</span>
                  <span className="text-[var(--color-text-dim)]">
                    {cards.length}
                    {totalValor > 0 && col.id !== "perdido" && (
                      <> · {fmtBRL(totalValor)}</>
                    )}
                  </span>
                </div>
                {cards.length === 0 && (
                  <div className="rounded border border-dashed border-[var(--color-border)] p-2 text-center text-[10px] text-[var(--color-text-dim)]">
                    vazio
                  </div>
                )}
                {cards.map((p) => (
                  <div
                    key={p.id}
                    draggable
                    onDragStart={() => setDraggingProp(p.id)}
                    onDragEnd={() => {
                      setDraggingProp(null);
                      setHoverCol(null);
                    }}
                    className="cursor-grab rounded border border-[var(--color-border)] bg-[var(--color-surface)] p-2 active:cursor-grabbing"
                    style={{ opacity: draggingProp === p.id ? 0.45 : 1 }}
                  >
                    <div className="text-[12px] font-medium">{p.cliente}</div>
                    <div className="mt-0.5 text-[10px] text-[var(--color-text-muted)]">
                      {TIPO_LABEL[p.tipo] ?? p.tipo}
                      {p.valor && <> · {fmtBRL(p.valor)}</>}
                    </div>
                    <div className="mt-1 text-[10px] text-[var(--color-text-dim)]">{p.contato}</div>
                    <div className="mt-0.5 text-[10px] text-[var(--color-text-dim)]">
                      últ. update {fmtDate(p.ultimo_update)}
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </Section>

      <p className="px-1 text-[10px] text-[var(--color-text-dim)]">
        Fonte: <code>memory/pipeline.fixture.json</code>. Drop reorganiza só na sessão; persistência real entra com o
        adaptador Notion.
      </p>
    </div>
  );
}

function Section({
  title,
  right,
  children,
}: {
  title: string;
  right?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="mb-1.5 flex items-center justify-between gap-2 px-1">
        <h2 className="text-[11px] font-medium uppercase tracking-wider text-[var(--color-text-muted)]">{title}</h2>
        {right}
      </div>
      {children}
    </section>
  );
}

function FinCard({
  label,
  value,
  sub,
  tone,
}: {
  label: string;
  value: string;
  sub?: string;
  tone?: "ok" | "warn" | "muted";
}) {
  const color =
    tone === "ok" ? "var(--color-ok)" : tone === "warn" ? "var(--color-warn)" : "var(--color-text)";
  return (
    <div className="rounded border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2.5">
      <div className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)]">{label}</div>
      <div className="text-[20px] font-medium" style={{ color }}>
        {value}
      </div>
      {sub && <div className="text-[10px] text-[var(--color-text-dim)]">{sub}</div>}
    </div>
  );
}

function DirtyBadge() {
  return (
    <span className="rounded border border-[var(--color-warn)] px-1.5 py-0.5 text-[10px] text-[var(--color-warn)]">
      mudanças locais · não persistidas
    </span>
  );
}
