export type CalendarCategory = "evento" | "vencimento" | "post" | "meu" | "cron";

export type CalendarItem = {
  id: string;
  date: string;          // YYYY-MM-DD
  start: string;         // "HH:MM" ou "all-day"
  end?: string;          // "HH:MM" — pode ser menor que start se atravessa meia-noite
  endDayOffset?: number; // dias adiante (1 = próximo dia)
  category: CalendarCategory;
  title: string;
  agent?: string;
  detail?: string;
};

export function toISO(d: Date): string {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

/** Retorna ISO yyyy-mm-dd da segunda-feira da semana de `d` (timezone local). */
export function startOfWeekISO(d: Date): string {
  const day = d.getDay();              // 0=dom, 1=seg, ...
  const diff = day === 0 ? -6 : 1 - day;
  const monday = new Date(d.getFullYear(), d.getMonth(), d.getDate() + diff);
  return toISO(monday);
}

export function addDaysISO(iso: string, days: number): string {
  const [y, m, d] = iso.split("-").map(Number);
  const nd = new Date(y, m - 1, d + days);
  return toISO(nd);
}

export function weekDays(weekStartISO: string): string[] {
  return Array.from({ length: 7 }, (_, i) => addDaysISO(weekStartISO, i));
}
