#!/usr/bin/env -S npx tsx
/**
 * leadconnector-smoke-test.ts
 *
 * Smoke test idempotente (somente GET) pros endpoints que o Cockpit vai consumir.
 * Não modifica nada na conta WeSales. Roda antes de Task #43 pra validar:
 *   - PIT funcional
 *   - Escopos suficientes
 *   - Schemas que o Cockpit espera
 *
 * Uso:
 *   LC_PIT=pit-... LC_LOCATION_ID=QQujnkMxKvJJWSahf5b0 npx tsx scripts/leadconnector-smoke-test.ts
 *
 * Ou colocar em .env.local:
 *   LC_PIT=pit-...
 *   LC_LOCATION_ID=QQujnkMxKvJJWSahf5b0
 */

const BASE = "https://services.leadconnectorhq.com";
const VERSION = "2021-07-28";

const PIT = process.env.LC_PIT;
const LOCATION_ID = process.env.LC_LOCATION_ID ?? "QQujnkMxKvJJWSahf5b0";

if (!PIT) {
  console.error("ERR: LC_PIT não setado. Exporta a Personal Integration Token.");
  process.exit(1);
}

type Probe = {
  name: string;
  path: string;
  expect: number;
  parse?: (json: unknown) => string;
};

const probes: Probe[] = [
  {
    name: "Location detail",
    path: `/locations/${LOCATION_ID}`,
    expect: 200,
    parse: (j: any) => `name=${j?.location?.name ?? "?"}`,
  },
  {
    name: "Contacts list (limit 1)",
    path: `/contacts/?locationId=${LOCATION_ID}&limit=1`,
    expect: 200,
    parse: (j: any) => `total=${j?.meta?.total ?? "?"} · first=${j?.contacts?.[0]?.id ?? "—"}`,
  },
  {
    name: "Custom fields",
    path: `/locations/${LOCATION_ID}/customFields`,
    expect: 200,
    parse: (j: any) => `count=${j?.customFields?.length ?? 0}`,
  },
  {
    name: "Tags",
    path: `/locations/${LOCATION_ID}/tags`,
    expect: 200,
    parse: (j: any) => `count=${j?.tags?.length ?? 0}`,
  },
  {
    name: "Pipelines",
    path: `/opportunities/pipelines?locationId=${LOCATION_ID}`,
    expect: 200,
    parse: (j: any) => `count=${j?.pipelines?.length ?? 0}`,
  },
  {
    name: "Workflows",
    path: `/workflows/?locationId=${LOCATION_ID}`,
    expect: 200,
    parse: (j: any) => `count=${j?.workflows?.length ?? 0}`,
  },
  {
    name: "Calendars",
    path: `/calendars/?locationId=${LOCATION_ID}`,
    expect: 200,
    parse: (j: any) => `count=${j?.calendars?.length ?? 0}`,
  },
  {
    name: "Conversations search (latest)",
    path: `/conversations/search?locationId=${LOCATION_ID}&limit=1`,
    expect: 200,
    parse: (j: any) => `total=${j?.total ?? "?"} · first=${j?.conversations?.[0]?.id ?? "—"}`,
  },
];

async function probe(p: Probe): Promise<{ ok: boolean; line: string }> {
  try {
    const res = await fetch(BASE + p.path, {
      headers: {
        Authorization: `Bearer ${PIT}`,
        Version: VERSION,
        Accept: "application/json",
      },
    });
    const ok = res.status === p.expect;
    const status = `${res.status}`;
    let detail = "";
    if (ok && p.parse) {
      try {
        const json = await res.json();
        detail = ` · ${p.parse(json)}`;
      } catch {
        detail = " · (body não-json)";
      }
    } else if (!ok) {
      const body = await res.text();
      detail = ` · body=${body.slice(0, 200)}`;
    }
    return {
      ok,
      line: `${ok ? "✅" : "❌"} ${p.name.padEnd(36)} ${status}${detail}`,
    };
  } catch (err) {
    return {
      ok: false,
      line: `❌ ${p.name.padEnd(36)} EXC ${(err as Error).message}`,
    };
  }
}

(async () => {
  console.log(`\nLeadConnector smoke test — location ${LOCATION_ID}\n`);
  let pass = 0;
  for (const p of probes) {
    const r = await probe(p);
    console.log(r.line);
    if (r.ok) pass++;
  }
  console.log(`\n${pass}/${probes.length} probes OK\n`);
  process.exit(pass === probes.length ? 0 : 1);
})();
