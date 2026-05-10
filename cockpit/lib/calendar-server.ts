import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import type { CalendarItem } from "./calendar";

const WORKSPACE = process.env.COCKPIT_WORKSPACE
  ? process.env.COCKPIT_WORKSPACE
  : path.resolve(process.cwd(), "..");

export async function getCalendarItems(): Promise<CalendarItem[]> {
  const file = path.resolve(WORKSPACE, "memory/calendar.fixture.json");
  let raw: string;
  try {
    raw = await fs.readFile(file, "utf8");
  } catch {
    return [];
  }
  try {
    const parsed = JSON.parse(raw) as { items?: CalendarItem[] };
    return parsed.items ?? [];
  } catch {
    return [];
  }
}
