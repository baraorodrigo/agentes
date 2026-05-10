import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import type { PipelineSnapshot } from "./pipeline";

const WORKSPACE = process.env.COCKPIT_WORKSPACE
  ? process.env.COCKPIT_WORKSPACE
  : path.resolve(process.cwd(), "..");

export async function getPipeline(): Promise<PipelineSnapshot> {
  const file = path.resolve(WORKSPACE, "memory/pipeline.fixture.json");
  const raw = await fs.readFile(file, "utf8");
  return JSON.parse(raw) as PipelineSnapshot;
}
