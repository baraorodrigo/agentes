"use client";

import { useEffect, useMemo, useState } from "react";
import type { CalendarCategory, CalendarItem } from "@/lib/calendar";
import { addDaysISO, startOfWeekISO, weekDays } from "@/lib/calendar";
import type { AgentRecord } from "@/lib/agents";

const CATS: { id: CalendarCategory; label: string; color: string; bg: string }[] = [
  { id: "evento",     label: "Eventos",     color: "#a78bfa", bg: "rgba(167,139,250,0.14)" },
  { id: "vencimento", label: "Vencimentos", color: "#ef5350", bg: "rgba(239,83,80,0.14)" },
  { id: "post",       label: "Posts",       color: "#f6c453", bg: "rgba(246,196,83,0.14)" },
  { id: "meu",        label: "Meus",        color: "#9b9ba4", bg: "rgba(155,155,164,0.14)" },
  { id: "cron",       label: "Crons",       color: "#4ade80", bg: "rgba(74,222,128,0.12)" },
];

const CAT_MAP = Object.fromEntries(CATS.map((c) => [c.id, c]));

const HOUR_START = 9;
const HOUR_END = 24; // exclusive — exibe linhas 9..23
const HOURS = Array.from({ length: HOUR_END - HOUR_START }, (_, i) => HOUR_START + i);
const ROW_PX = 38;

const DAY_NAMES = ["seg", "ter", "qua", "qui", "sex", "sáb", "dom"];

const STORAGE_KEY = "cockpit:semana:filters";
const DEFAULT_FILTERS: CalendarCategory[] = ["evento", "vencimento", "post", "meu"];

function fmtDayLabel(iso: string, idx: number) {
  const [, m, d] = iso.split("-");
  return `${DAY_NAMES[idx]} ${d}/${m}`;
}

function hhmmToMinutes(t: string) {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

export function SemanaClient({
  items,
  agentMap,
  todayISO,
}: {
  items: CalendarItem[];
  agentMap: Record<string, AgentRecord>;
  todayISO: string;
}) {
  const [filters, setFilters] = useState<CalendarCategory[]>(DEFAULT_FILTERS);
  const [weekStart, setWeekStart] = useState<string>(() => startOfWeekISO(new Date(todayISO + "T12:00:00")));
  const [hydrated, setHydrated] = useState(false);
  const [selected, setSelected] = useState<CalendarItem | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as CalendarCategory[];
        if (Array.isArray(parsed)) setFilters(parsed);
      }
    } catch {
      // ignore
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filters));
    } catch {
      // ignore
    }
  }, [filters, hydrated]);

  const days = useMemo(() => weekDays(weekStart), [weekStart]);
  const dayLabel = useMemo(() => `${days[0].slice(8)}/${days[0].slice(5, 7)} – ${days[6].slice(8)}/${days[6].slice(5, 7)}`, [days]);

  const filtered = useMemo(
    () => items.filter((it) => filters.includes(it.category)),
    [items, filters],
  );

  const allDayByDay = useMemo(() => {
    const map: Record<string, CalendarItem[]> = {};
    for (const d of days) map[d] = [];
    for (const it of filtered) {
      if (it.start === "all-day" && map[it.date]) map[it.date].push(it);
    }
    return map;
  }, [filtered, days]);

  const timedByDay = useMemo(() => {
    const map: Record<string, CalendarItem[]> = {};
    for (const d of days) map[d] = [];
    for (const it of filtered) {
      if (it.start !== "all-day" && map[it.date]) map[it.date].push(it);
    }
    for (const d of days) map[d].sort((a, b) => hhmmToMinutes(a.start) - hhmmToMinutes(b.start));
    return map;
  }, [filtered, days]);

  function toggle(cat: CalendarCategory) {
    setFilters((cur) => (cur.includes(cat) ? cur.filter((c) => c !== cat) : [...cur, cat]));
  }

  function nudgeWeek(delta: number) {
    setWeekStart((cur) => addDaysISO(cur, delta * 7));
    setSelected(null);
  }

  function goToday() {
    setWeekStart(startOfWeekISO(new Date(todayISO + "T12:00:00")));
    setSelected(null);
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] p-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => nudgeWeek(-1)}
            className="rounded border border-[var(--color-border)] bg-[var(--color-bg)] px-2 py-1 text-[12px] hover:border-[var(--color-accent)]"
            title="Semana anterior"
          >
            ←
          </button>
          <button
            type="button"
            onClick={goToday}
            className="rounded border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-1 text-[12px] hover:border-[var(--color-accent)]"
          >
            hoje
          </button>
          <button
            type="button"
            onClick={() => nudgeWeek(1)}
            className="rounded border border-[var(--color-border)] bg-[var(--color-bg)] px-2 py-1 text-[12px] hover:border-[var(--color-accent)]"
            title="Próxima semana"
          >
            →
          </button>
          <span className="ml-2 text-[12px] text-[var(--color-text-muted)]">{dayLabel}</span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {CATS.map((c) => {
            const active = filters.includes(c.id);
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => toggle(c.id)}
                className="flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] transition-colors"
                style={{
                  borderColor: active ? c.color : "var(--color-border)",
                  background: active ? c.bg : "transparent",
                  color: active ? "var(--color-text)" : "var(--color-text-muted)",
                }}
              >
                <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ background: c.color }} />
                {c.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Calendar grid */}
      <div className="overflow-hidden rounded-md border border-[var(--color-border)] bg-[var(--color-surface)]">
        {/* Day headers */}
        <div
          className="grid border-b border-[var(--color-border)]"
          style={{ gridTemplateColumns: "44px repeat(7, 1fr)" }}
        >
          <div className="border-r border-[var(--color-border)]" />
          {days.map((d, i) => {
            const isToday = d === todayISO;
            return (
              <div
                key={d}
                className="px-2 py-2 text-center text-[11px]"
                style={{
                  color: isToday ? "var(--color-accent)" : "var(--color-text-muted)",
                  background: isToday ? "var(--color-surface-2)" : "transparent",
                  borderRight: i < 6 ? "1px solid var(--color-border)" : undefined,
                  fontWeight: isToday ? 600 : 400,
                }}
              >
                {fmtDayLabel(d, i)}
              </div>
            );
          })}
        </div>

        {/* All-day row */}
        <div
          className="grid border-b border-[var(--color-border)]"
          style={{ gridTemplateColumns: "44px repeat(7, 1fr)", minHeight: "28px" }}
        >
          <div className="flex items-center justify-end pr-2 text-[10px] text-[var(--color-text-dim)]">dia</div>
          {days.map((d, i) => {
            const isToday = d === todayISO;
            return (
              <div
                key={d}
                className="flex flex-col gap-0.5 p-1"
                style={{
                  background: isToday ? "var(--color-surface-2)" : "transparent",
                  borderRight: i < 6 ? "1px solid var(--color-border)" : undefined,
                }}
              >
                {(allDayByDay[d] ?? []).map((it) => (
                  <Tile key={it.id} item={it} agentMap={agentMap} onClick={() => setSelected(it)} compact />
                ))}
              </div>
            );
          })}
        </div>

        {/* Hour grid */}
        <div
          className="relative grid"
          style={{ gridTemplateColumns: "44px repeat(7, 1fr)" }}
        >
          {/* Hours column */}
          <div className="flex flex-col">
            {HOURS.map((h) => (
              <div
                key={h}
                className="flex items-start justify-end border-t border-[var(--color-border)] pr-2 pt-0.5 text-[10px] text-[var(--color-text-dim)]"
                style={{ height: ROW_PX }}
              >
                {String(h).padStart(2, "0")}h
              </div>
            ))}
          </div>

          {/* Day columns */}
          {days.map((d, i) => {
            const isToday = d === todayISO;
            const dayItems = timedByDay[d] ?? [];
            return (
              <div
                key={d}
                className="relative"
                style={{
                  background: isToday ? "var(--color-surface-2)" : "transparent",
                  borderRight: i < 6 ? "1px solid var(--color-border)" : undefined,
                }}
              >
                {/* Hour rules */}
                {HOURS.map((h) => (
                  <div
                    key={h}
                    className="border-t border-[var(--color-border)]"
                    style={{ height: ROW_PX }}
                  />
                ))}

                {/* Tiles positioned absolutely */}
                {dayItems.map((it) => {
                  const startMin = hhmmToMinutes(it.start);
                  const endMin = it.end ? hhmmToMinutes(it.end) : startMin + 30;
                  const crossed = (it.endDayOffset ?? 0) > 0;
                  const effectiveEnd = crossed ? HOUR_END * 60 : endMin;
                  const top = ((startMin - HOUR_START * 60) / 60) * ROW_PX;
                  const heightMin = Math.max(20 / ROW_PX * 60, effectiveEnd - startMin);
                  const height = (heightMin / 60) * ROW_PX;
                  if (top + height < 0) return null;
                  return (
                    <div
                      key={it.id}
                      className="absolute left-1 right-1"
                      style={{ top, height }}
                    >
                      <Tile
                        item={it}
                        agentMap={agentMap}
                        onClick={() => setSelected(it)}
                        crossed={crossed}
                        full
                      />
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      {/* Detail modal */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="max-w-md rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-2 flex items-center gap-2">
              <span
                className="inline-block h-2 w-2 rounded-full"
                style={{ background: CAT_MAP[selected.category]?.color }}
              />
              <span className="text-[11px] uppercase tracking-wider text-[var(--color-text-muted)]">
                {CAT_MAP[selected.category]?.label}
              </span>
            </div>
            <div className="text-[14px] font-medium">{selected.title}</div>
            <div className="mt-1 text-[12px] text-[var(--color-text-muted)]">
              {selected.date}
              {selected.start !== "all-day" && (
                <> · {selected.start}{selected.end ? `–${selected.end}${selected.endDayOffset ? "+1" : ""}` : ""}</>
              )}
              {selected.start === "all-day" && <> · dia inteiro</>}
            </div>
            {selected.agent && agentMap[selected.agent] && (
              <div className="mt-2 flex items-center gap-1.5 text-[12px]">
                <span>{agentMap[selected.agent].emoji}</span>
                <span>{agentMap[selected.agent].name}</span>
              </div>
            )}
            {selected.detail && <div className="mt-2 text-[12px] text-[var(--color-text)]">{selected.detail}</div>}
            <div className="mt-3 flex justify-end">
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="rounded border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-1 text-[11px] hover:border-[var(--color-accent)]"
              >
                fechar
              </button>
            </div>
          </div>
        </div>
      )}

      <p className="px-1 text-[10px] text-[var(--color-text-dim)]">
        Fonte: <code>memory/calendar.fixture.json</code>. Crons puxados do mesmo arquivo até o sync com{" "}
        <code>workspace/rotinas/</code>. Filtros persistem em <code>localStorage</code>.
      </p>
    </div>
  );
}

function Tile({
  item,
  agentMap,
  onClick,
  compact,
  full,
  crossed,
}: {
  item: CalendarItem;
  agentMap: Record<string, AgentRecord>;
  onClick: () => void;
  compact?: boolean;
  full?: boolean;
  crossed?: boolean;
}) {
  const cat = CAT_MAP[item.category];
  const agent = item.agent ? agentMap[item.agent] : null;
  const timeLabel =
    item.start === "all-day"
      ? "dia inteiro"
      : `${item.start}${item.end ? `–${item.end}${crossed ? "+1" : ""}` : ""}`;

  return (
    <button
      type="button"
      onClick={onClick}
      title={`${item.title} · ${timeLabel}`}
      className="w-full overflow-hidden rounded text-left transition-opacity hover:opacity-90"
      style={{
        background: cat?.bg,
        borderLeft: `2px solid ${cat?.color ?? "var(--color-border)"}`,
        padding: compact ? "2px 6px" : "3px 6px",
        height: full ? "100%" : undefined,
      }}
    >
      <div className="flex items-center gap-1 text-[10px] text-[var(--color-text-muted)]">
        {agent && <span>{agent.emoji}</span>}
        <span>{timeLabel}</span>
      </div>
      <div className="truncate text-[11px] leading-tight text-[var(--color-text)]">{item.title}</div>
    </button>
  );
}
