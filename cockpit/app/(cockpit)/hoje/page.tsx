import Link from "next/link";
import { getInbox } from "@/lib/inbox";
import { getTodayActivity } from "@/lib/activity";
import { getAgents } from "@/lib/agents";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const PRIORITY_BORDER: Record<string, string> = {
  crítica: "var(--color-danger)",
  alta: "var(--color-danger)",
  média: "var(--color-warn)",
  baixa: "var(--color-border-strong)",
};

const PRIORITY_LABEL: Record<string, string> = {
  crítica: "crítica",
  alta: "alta",
  média: "média",
  baixa: "baixa",
};

const TYPE_LABEL: Record<string, string> = {
  cron_fire: "cron",
  handoff: "handoff",
  escalation: "escalação",
  alert: "alerta",
  human_decision: "decisão",
};

function fmtTime(ts: string) {
  const d = new Date(ts);
  return d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

function timeAgo(ts: string) {
  const ms = Date.now() - new Date(ts).getTime();
  const min = Math.floor(ms / 60000);
  if (min < 1) return "agora";
  if (min < 60) return `há ${min}min`;
  const h = Math.floor(min / 60);
  if (h < 24) return `há ${h}h`;
  const d = Math.floor(h / 24);
  return `há ${d}d`;
}

export default async function Hoje() {
  const [inbox, activity, agents] = await Promise.all([getInbox(), getTodayActivity(), getAgents()]);
  const agentById = Object.fromEntries(agents.map((a) => [a.id, a]));

  const inExecution = activity.filter((e) => e.type === "cron_fire" || e.type === "handoff").slice(0, 3);
  const delivered = activity.filter((e) => e.status === "ok").length;

  return (
    <div className="flex flex-col gap-3">
      {/* 4 stat cards */}
      <div className="grid grid-cols-4 gap-2">
        <Stat label="Em execução" value={String(inExecution.length)} />
        <Stat label="Travado em ti" value={String(inbox.length)} danger={inbox.length > 0} />
        <Stat label="Entregue hoje" value={String(delivered)} />
        <Stat label="Agendado hoje" value="—" muted />
      </div>

      {/* Travado em ti */}
      <Section title="Travado em ti" dot="danger">
        {inbox.length === 0 ? (
          <Empty>Inbox vazio. Bom sinal.</Empty>
        ) : (
          <div className="flex flex-col gap-1.5">
            {inbox.map((it) => {
              const ag = agentById[it.agent];
              return (
                <div
                  key={it.id}
                  className="flex items-center gap-3 rounded border border-[var(--color-border)] bg-[var(--color-bg)] p-3"
                  style={{ borderLeft: `2px solid ${PRIORITY_BORDER[it.priority] ?? "var(--color-border)"}` }}
                >
                  <span className="text-[18px] leading-none">{ag?.emoji ?? "•"}</span>
                  <div className="flex flex-1 flex-col gap-0.5">
                    <span className="text-[12px]">{it.description}</span>
                    <span className="text-[11px] text-[var(--color-text-dim)]">
                      {ag?.name ?? it.agent} · {PRIORITY_LABEL[it.priority]} · parado {timeAgo(it.created_at)}
                    </span>
                    {it.context && (
                      <span className="mt-0.5 text-[11px] text-[var(--color-text-muted)]">{it.context}</span>
                    )}
                  </div>
                  <Link
                    href={`/cabine?agent=${it.agent}&item=${it.id}`}
                    className="rounded border border-[var(--color-border)] px-2.5 py-1 text-[11px] hover:border-[var(--color-accent)]"
                  >
                    resolver
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </Section>

      {/* Agora · em execução */}
      <Section title="Agora · em execução" dot="ok" pulse>
        {inExecution.length === 0 ? (
          <Empty>Sem cron rodando agora.</Empty>
        ) : (
          <div className="flex flex-col gap-1.5">
            {inExecution.map((e, i) => {
              const ag = e.agent_from ? agentById[e.agent_from] : null;
              const note = (e.payload as Record<string, string>)?.note ?? (e.payload as Record<string, string>)?.job ?? "";
              return (
                <div
                  key={i}
                  className="flex items-center gap-3 rounded border border-[var(--color-border)] bg-[var(--color-bg)] p-3"
                >
                  <span className="text-[18px] leading-none">{ag?.emoji ?? "•"}</span>
                  <div className="flex flex-1 flex-col gap-0.5">
                    <span className="text-[12px]">
                      {ag?.name ?? e.agent_from ?? "?"} · {TYPE_LABEL[e.type] ?? e.type}
                    </span>
                    <span className="text-[11px] text-[var(--color-text-dim)]">{note}</span>
                  </div>
                  <span className="text-[11px] text-[var(--color-text-muted)]">{fmtTime(e.ts)}</span>
                </div>
              );
            })}
          </div>
        )}
      </Section>

      {/* Agendado pra hoje */}
      <Section title="Agendado pra hoje" dot="muted">
        <Empty>Cron agenda real entra na Slice 4 (Semana). Hoje só mostra o que já rodou.</Empty>
      </Section>

      <p className="px-1 text-[10px] text-[var(--color-text-dim)]">
        Fonte: <code>memory/inbox.fixture.json</code> + <code>workspace/agentes/&lt;role&gt;/activity.jsonl</code>. Quando o
        token do Notion estiver pareado, o bloco &ldquo;Travado em ti&rdquo; lê direto da database.
      </p>
    </div>
  );
}

function Stat({
  label,
  value,
  danger,
  muted,
}: {
  label: string;
  value: string;
  danger?: boolean;
  muted?: boolean;
}) {
  return (
    <div className="rounded border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2.5">
      <div
        className="text-[10px] uppercase tracking-wider"
        style={{
          color: danger
            ? "var(--color-danger)"
            : muted
              ? "var(--color-text-dim)"
              : "var(--color-text-muted)",
        }}
      >
        {label}
      </div>
      <div
        className="text-[22px] font-medium"
        style={{ color: danger ? "var(--color-danger)" : "var(--color-text)" }}
      >
        {value}
      </div>
    </div>
  );
}

function Section({
  title,
  dot,
  pulse,
  children,
}: {
  title: string;
  dot: "ok" | "danger" | "muted";
  pulse?: boolean;
  children: React.ReactNode;
}) {
  const color =
    dot === "ok" ? "var(--color-ok)" : dot === "danger" ? "var(--color-danger)" : "var(--color-text-dim)";
  return (
    <section>
      <div className="mb-1.5 flex items-center gap-2 px-1">
        <span
          className="inline-block h-2 w-2 rounded-full"
          style={{ background: color, animation: pulse ? "pulse 1.6s infinite" : undefined }}
        />
        <h2 className="text-[11px] font-medium uppercase tracking-wider" style={{ color }}>
          {title}
        </h2>
      </div>
      {children}
    </section>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded border border-dashed border-[var(--color-border)] bg-[var(--color-surface)] p-4 text-center text-[11px] text-[var(--color-text-dim)]">
      {children}
    </div>
  );
}
