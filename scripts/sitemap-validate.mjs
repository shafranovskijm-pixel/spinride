/**
 * Structural validation for the SPINRIDE XML sitemap.
 * Shared by the build-time generator and tests.
 */

export const SITEMAP_ORIGIN = "https://spinride.ru";
// Current static sitemap has 40 URLs; the dynamic source has 62.
// Anything below this floor is treated as truncated/broken.
export const MIN_URL_COUNT = 40;

/**
 * @param {string} xml
 * @returns {{ ok: boolean, urlCount: number, errors: string[] }}
 */
export function validateSitemap(xml) {
  const errors = [];

  if (typeof xml !== "string" || xml.length === 0) {
    return { ok: false, urlCount: 0, errors: ["empty response"] };
  }
  if (!xml.trimStart().startsWith("<?xml")) {
    errors.push("missing XML declaration (not XML?)");
  }
  if (!xml.includes("<urlset")) {
    errors.push("missing <urlset> root element");
  }

  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
  const urlCount = locs.length;

  if (urlCount < MIN_URL_COUNT) {
    errors.push(`only ${urlCount} URLs (expected >= ${MIN_URL_COUNT}) — looks truncated`);
  }

  const badOrigin = locs.filter((loc) => !loc.startsWith(SITEMAP_ORIGIN + "/") && loc !== SITEMAP_ORIGIN + "/");
  if (badOrigin.length > 0) {
    errors.push(`${badOrigin.length} URLs with wrong origin, e.g. ${badOrigin[0]}`);
  }

  // Route types: only known public route shapes are allowed
  const badRoutes = locs.filter((loc) => {
    const path = loc.slice(SITEMAP_ORIGIN.length);
    return !(
      path === "/" ||
      /^\/(catalog|quiz|about|delivery|warranty|contacts|privacy|terms)$/.test(path) ||
      /^\/catalog\/[a-z0-9-]+$/.test(path) ||
      /^\/product\/[a-z0-9-]+$/.test(path)
    );
  });
  if (badRoutes.length > 0) {
    errors.push(`${badRoutes.length} URLs with unexpected route shape, e.g. ${badRoutes[0]}`);
  }

  return { ok: errors.length === 0, urlCount, errors };
}
