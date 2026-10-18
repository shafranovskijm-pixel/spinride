/**
 * Structural validation for the SPINRIDE XML sitemap.
 * Shared by the build-time generator and tests.
 */

import { DOMParser } from "@xmldom/xmldom";

export const SITEMAP_ORIGIN = "https://spinride.ru";
// Sanity floor: the real catalog currently yields 62 URLs
// (9 static + 13 categories + 40 products). Anything far below is broken.
export const MIN_URL_COUNT = 50;

const STATIC_ROUTES = new Set([
  "/",
  "/catalog",
  "/quiz",
  "/about",
  "/delivery",
  "/warranty",
  "/contacts",
  "/privacy",
  "/terms",
]);

function isAllowedRoute(path) {
  return (
    STATIC_ROUTES.has(path) ||
    /^\/catalog\/[a-z0-9-]+$/.test(path) ||
    /^\/product\/[a-z0-9-]+$/.test(path)
  );
}

/**
 * Parses and validates a sitemap string.
 * @param {string} xml
 * @returns {{ ok: boolean, urlCount: number, locs: string[], errors: string[] }}
 */
export function validateSitemap(xml) {
  const errors = [];
  let locs = [];

  if (typeof xml !== "string" || xml.length === 0) {
    return { ok: false, urlCount: 0, locs, errors: ["empty response"] };
  }

  // Real XML wellformedness check (rejects malformed/truncated/HTML input)
  let doc = null;
  try {
    doc = new DOMParser({
      onError: (level, msg) => {
        if (level === "error" || level === "fatalError") {
          errors.push(`XML parse ${level}: ${msg}`);
        }
      },
    }).parseFromString(xml, "application/xml");
  } catch (err) {
    errors.push(`XML parse exception: ${err.message}`);
  }

  if (!doc || doc.documentElement?.tagName !== "urlset") {
    errors.push("root element is not <urlset>");
  } else {
    const locNodes = Array.from(doc.getElementsByTagName("loc"));
    locs = locNodes.map((n) => (n.textContent || "").trim());
  }

  if (locs.length < MIN_URL_COUNT) {
    errors.push(`only ${locs.length} URLs (expected >= ${MIN_URL_COUNT}) — looks truncated`);
  }

  const seen = new Set();
  const dupes = [];
  for (const loc of locs) {
    if (seen.has(loc)) dupes.push(loc);
    seen.add(loc);
  }
  if (dupes.length > 0) {
    errors.push(`${dupes.length} duplicate URLs, e.g. ${dupes[0]}`);
  }

  const badOrigin = locs.filter(
    (loc) => !loc.startsWith(SITEMAP_ORIGIN + "/") && loc !== SITEMAP_ORIGIN + "/"
  );
  if (badOrigin.length > 0) {
    errors.push(`${badOrigin.length} URLs with wrong origin, e.g. ${badOrigin[0]}`);
  }

  const badRoutes = locs.filter((loc) => {
    const path = loc.slice(SITEMAP_ORIGIN.length);
    return !isAllowedRoute(path);
  });
  if (badRoutes.length > 0) {
    errors.push(`${badRoutes.length} URLs with unexpected route shape, e.g. ${badRoutes[0]}`);
  }

  return { ok: errors.length === 0, urlCount: locs.length, locs, errors };
}

/**
 * Compares new coverage against the last good sitemap. Any URL that
 * existed before and is gone now is an explicit failure requiring review
 * (legitimate inventory deletions are handled as intentional updates).
 * @param {string[]} newLocs
 * @param {string[]} previousLocs
 * @returns {{ ok: boolean, lost: string[] }}
 */
export function compareCoverage(newLocs, previousLocs) {
  const next = new Set(newLocs);
  const lost = previousLocs.filter((loc) => !next.has(loc));
  return { ok: lost.length === 0, lost };
}

/** Extracts <loc> values from an existing sitemap file (best-effort). */
export function extractLocs(xml) {
  if (typeof xml !== "string") return [];
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
}
