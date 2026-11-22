import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { Scenario } from "./types";

let cache: Scenario[] | null = null;

export async function loadScenarios(): Promise<Scenario[]> {
  if (cache) return cache;
  try {
    const raw = await readFile(join(process.cwd(), "data", "scenarios.jsonl"), "utf8");
    cache = raw
      .split("\n")
      .filter(Boolean)
      .flatMap((line) => {
        try {
          return [JSON.parse(line) as Scenario];
        } catch {
          return [];
        }
      });
    return cache;
  } catch {
    return [];
  }
}

export async function findScenario(id: string): Promise<Scenario | undefined> {
  const scenarios = await loadScenarios();
  return scenarios.find((scenario) => scenario.id === id);
}
