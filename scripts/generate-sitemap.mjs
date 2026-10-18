/**
 * Build-time sitemap refresh for spinride.ru.
 *
 * Fetches the live dynamic sitemap (edge function backed by the real
 * categories/products tables), validates it structurally, and writes it to
 * public/sitemap.xml so `vite build` copies a current sitemap into dist/.
 *
 * Failure policy: never publish an empty or truncated sitemap. If the
 * upstream fetch or validation fails, the existing public/sitemap.xml is
 * kept untouched and the build continues with a warning.
 */

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { validateSitemap } from "./sitemap-validate.mjs";

const SOURCE_URL =
  "https://atkgcbunyakdnkfybvvp.supabase.co/functions/v1/sitemap";
const OUT_PATH = join(
  dirname(fileURLToPath(import.meta.url)),
  "..",
  "public",
  "sitemap.xml"
);

async function main() {
  let xml;
  try {
    const res = await fetch(SOURCE_URL, { signal: AbortSignal.timeout(20000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    xml = await res.text();
  } catch (err) {
    console.warn(
      `[sitemap] upstream fetch failed (${err.message}); keeping existing public/sitemap.xml`
    );
    return;
  }

  const { ok, urlCount, errors } = validateSitemap(xml);
  if (!ok) {
    console.warn(
      `[sitemap] upstream sitemap failed validation: ${errors.join("; ")}; keeping existing public/sitemap.xml`
    );
    return;
  }

  const previous = readFileSync(OUT_PATH, "utf8");
  const prevCount = (previous.match(/<loc>/g) || []).length;

  writeFileSync(OUT_PATH, xml, "utf8");
  console.log(
    `[sitemap] wrote ${urlCount} URLs to public/sitemap.xml (was ${prevCount})`
  );
}

main();
