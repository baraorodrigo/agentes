"use client";

import type { AgentRecord } from "@/lib/agents";
import type { ActivityEvent } from "@/lib/activity";

const TYPE_LABEL: Record<string, string> = {
  cron_fire: "cron",
  handoff: "handoff",
  escalation: "escalação",
  alert: "alerta",
  human_decision: "decisão",
};

function fmtTime(ts: string) {
  return new Date(ts).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
}

const MANUAL_TRIGGERS: Record<string, { icon: string; label: string; sub: string }[]> = {
  beto: [
    { icon: "🏆", label: "Forçar ranking", sub: "manda ranking agora" },
    { icon: "📋", label: "Lembrete de lista", sub: "puxa pra promoters faltando" },
    { icon: "🎉", label: "Parabéns top 3", sub: "dispara mensagem manual" },
    { icon: "⚡", label: "Briefing pré-evento", sub: "manda no grupo" },
  ],
  tomas: [
    { icon: "💰", label: "Forçar fechamento", sub: "roda fechamento agora" },
    { icon: "🧮", label: "Calcular comissão", sub: "PNE × tabela" },
    { icon: "📊", label: "Resumo da semana", sub: "manda relatório" },
    { icon: "🚨", label: "Checar variações", sub: "scan de anomalia" },
  ],
  lia: [
    { icon: "💬", label: "Intervir em conversa", sub: "abre canal pro cliente" },
    { icon: "📞", label: "Ligar pro Rodrigo", sub: "escalação manual" },
    { icon: "📅", label: "Confirmar reserva", sub: "passa pro Gil" },
    { icon: "❓", label: "Atualizar FAQ", sub: "edita base local" },
  ],
  duda: [
    { icon: "🎨", label: "Gerar copy", sub: "do próximo evento" },
    { icon: "🗓️", label: "Calendário editorial", sub: "reorganiza" },
    { icon: "📲", label: "Submeter post", sub: "manda pra aprovação" },
    { icon: "🎸", label: "Brief pra promoter", sub: "passa pro Beto" },
  ],
  gil: [
    { icon: "✅", label: "Checklist evento", sub: "rodar pré-evento" },
    { icon: "📦", label: "Status fornecedores", sub: "atualizar" },
    { icon: "📝", label: "Brief privado", sub: "abre fluxo de proposta" },
    { icon: "⚙️", label: "Pós-evento", sub: "fecha lições" },
  ],
  raul: [
    { icon: "🔍", label: "Análise sob demanda", sub: "tu pergunta, ele cruza" },
    { icon: "📈", label: "Tendência semana", sub: "roda relatório" },
    { icon: "🎯", label: "Mapa promoters", sub: "quem converte mais" },
    { icon: "🧠", label: "Pós-mortem evento", sub: "cruza dado real" },
  ],
  jarbas: [
    { icon: "📋", label: "Briefing diário", sub: "manda agora" },
    { icon: "🔁", label: "Status da rede", sub: "consolida 6 agentes" },
    { icon: "🐺", label: "Roteamento", sub: "log de últimos handoffs" },
    { icon: "💬", label: "Falar com tudo", sub: "broadcast interno" },
  ],
};

export function OperationPanel({
  agent,
  activity,
  highlightItem,
}: {
  agent: AgentRecord;
  activity: ActivityEvent[];
  highlightItem: string | null;
}) {
  const inExecution = activity.filter((e) => e.type === "cron_fire").slice(0, 1);
  const recent = activity.slice(0, 6);
  const triggers = MANUAL_TRIGGERS[agent.id] ?? [];

  return (
    <section className="flex flex-col gap-3">
      {highlightItem && (
        <div className="rounded border border-[var(--color-warn)] bg-[var(--color-surface)] p-3 text-[12px]">
          🔔 Item destacado da inbox: <code className="text-[11px]">{highlightItem}</code> — resolver com{" "}
          {agent.name} no chat ao lado.
        </div>
      )}

      {/* Em execução */}
      <Card title="Em execução" tone="ok">
        {inExecution.length === 0 ? (
          <Empty>Nada rodando agora.</Empty>
        ) : (
          inExecution.map((e, i) => {
            const note = (e.payload as Record<string, string>)?.note ?? "";
            const job = (e.payload as Record<string, string>)?.job ?? "";
            return (
              <div key={i} className="flex items-center justify-between text-[12px]">
                <div className="flex flex-col gap-0.5">
                  <span>{job || TYPE_LABEL[e.type]}</span>
                  <span className="text-[11px] text-[var(--color-text-dim)]">{note}</span>
                </div>
                <div className="flex gap-1.5">
                  <Mini disabled>pausar</Mini>
                  <Mini disabled>cancelar</Mini>
                </div>
              </div>
            );
          })
        )}
      </Card>

      {/* Disparar manualmente */}
      <Card title="Disparar manualmente">
        {triggers.length === 0 ? (
          <Empty>Sem disparos manuais previstos.</Empty>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {triggers.map((t, i) => (
              <button
                key={i}
                type="button"
                disabled
                className="flex cursor-not-allowed flex-col items-start gap-0.5 rounded border border-[var(--color-border)] bg-[var(--color-bg)] p-2.5 text-left opacity-70"
                title="Disparo real entra com sync de cron na próxima slice"
              >
                <span className="text-[14px] leading-none">{t.icon}</span>
                <span className="text-[12px]">{t.label}</span>
                <span className="text-[10px] text-[var(--color-text-dim)]">{t.sub}</span>
              </button>
            ))}
          </div>
        )}
      </Card>

      {/* Próximos crons */}
      <Card title="Próximos crons">
        <Empty>Sync com runtime entra quando o painel chamar <code>openclaw cron sync</code>.</Empty>
      </Card>

      {/* Entregas recentes */}
      <Card title="Entregas recentes">
        {recent.length === 0 ? (
          <Empty>Nenhuma entrega registrada.</Empty>
        ) : (
          <div className="flex flex-col gap-1.5">
            {recent.map((e, i) => {
              const note =
                (e.payload as Record<string, string>)?.note ??
                (e.payload as Record<string, string>)?.job ??
                JSON.stringify(e.payload);
              return (
                <div key={i} className="flex items-baseline justify-between gap-2 text-[12px]">
                  <div className="flex flex-col gap-0.5">
                    <span>
                      <span className="text-[var(--color-text-dim)]">[{TYPE_LABEL[e.type]}]</span> {note}
                    </span>
                  </div>
                  <span className="shrink-0 text-[11px] text-[var(--color-text-muted)]">{fmtTime(e.ts)}</span>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </section>
  );
}

function Card({ title, tone, children }: { title: string; tone?: "ok"; children: React.ReactNode }) {
  return (
    <div
      className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] p-3"
      style={tone === "ok" ? { borderLeft: "2px solid var(--color-ok)" } : undefined}
    >
      <div className="mb-2 text-[11px] font-medium uppercase tracking-wider text-[var(--color-text-muted)]">{title}</div>
      {children}
    </div>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return <div className="text-[11px] text-[var(--color-text-dim)]">{children}</div>;
}

function Mini({
  children,
  disabled,
}: {
  children: React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      className="cursor-not-allowed rounded border border-[var(--color-border)] px-2 py-0.5 text-[10px] text-[var(--color-text-dim)]"
    >
      {children}
    </button>
  );
}
