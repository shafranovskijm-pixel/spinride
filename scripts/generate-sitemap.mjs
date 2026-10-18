/**
 * Build-time sitemap refresh for spinride.ru.
 *
 * Fetches the live dynamic sitemap (edge function backed by the real
 * categories/products tables), validates it, and writes it to
 * public/sitemap.xml so `vite build` copies a current sitemap into dist/.
 *
 * Fail-safe policy: ANY problem (fetch error, malformed XML, wrong origin,
 * unexpected routes, duplicates, or lost coverage vs the last good file)
 * exits the build with a nonzero code and leaves the existing
 * public/sitemap.xml untouched. A bad refresh never reaches production.
 */

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { validateSitemap, compareCoverage, extractLocs } from "./sitemap-validate.mjs";

const SOURCE_URL =
  "https://atkgcbunyakdnkfybvvp.supabase.co/functions/v1/sitemap";
const OUT_PATH = join(
  dirname(fileURLToPath(import.meta.url)),
  "..",
  "public",
  "sitemap.xml"
);

function fail(message) {
  console.error(`[sitemap] FAILED: ${message}`);
  console.error("[sitemap] existing public/sitemap.xml left untouched; build aborted");
  process.exit(1);
}

async function main() {
  let xml;
  try {
    const res = await fetch(SOURCE_URL, { signal: AbortSignal.timeout(20000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    xml = await res.text();
  } catch (err) {
    fail(`upstream fetch failed (${err.message})`);
  }

  const { ok, urlCount, locs, errors } = validateSitemap(xml);
  if (!ok) {
    fail(`upstream sitemap failed validation: ${errors.join("; ")}`);
  }

  let previousLocs = [];
  try {
    previousLocs = extractLocs(readFileSync(OUT_PATH, "utf8"));
  } catch {
    // No previous file — first generation, nothing to compare against
  }

  if (previousLocs.length > 0) {
    const { ok: coverageOk, lost } = compareCoverage(locs, previousLocs);
    if (!coverageOk) {
      fail(
        `new sitemap lost ${lost.length} previously listed URLs (e.g. ${lost[0]}). ` +
          `If this reflects intentional removals, update public/sitemap.xml deliberately.`
      );
    }
  }

  writeFileSync(OUT_PATH, xml, "utf8");
  console.log(
    `[sitemap] wrote ${urlCount} URLs to public/sitemap.xml (was ${previousLocs.length})`
  );
}

main();
