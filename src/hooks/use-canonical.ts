import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const BASE_ORIGIN = "https://spinride.ru";
const OWNED_ATTR = "data-seo-owned";

/**
 * Ensures exactly one <link rel="canonical"> in <head>, pointing at
 * https://spinride.ru + normalized pathname (no query/hash).
 * If duplicates already exist, extras are removed; the surviving element
 * is updated in place so navigation never leaves stale values.
 */
export function useCanonical(pathOverride?: string) {
  const { pathname } = useLocation();

  useEffect(() => {
    const raw = pathOverride ?? pathname;
    const normalized = raw.replace(/\/+$/, "") || "/";
    const url = BASE_ORIGIN + normalized;

    const links = Array.from(
      document.head.querySelectorAll<HTMLLinkElement>('link[rel="canonical"]')
    );
    let link = links[0];
    // Enforce exactly one canonical: drop any duplicates
    for (const extra of links.slice(1)) extra.remove();
    if (!link) {
      link = document.createElement("link");
      link.setAttribute("rel", "canonical");
      document.head.appendChild(link);
    }
    link.setAttribute("href", url);
    for (const [attribute, name] of [["property", "og:url"], ["name", "twitter:url"]]) {
      let meta = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${name}"]`);
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute(attribute, name);
        document.head.appendChild(meta);
      }
      meta.setAttribute("content", url);
    }
  }, [pathname, pathOverride]);
}

/**
 * Adds <meta name="robots" content="noindex, nofollow"> while `noindex` is
 * true. The tag is marked as owned by this hook; on unmount or when
 * `noindex` becomes false only the owned tag is removed — unrelated
 * deliberate robots directives are left untouched.
 */
export function useNoIndex(noindex: boolean) {
  useEffect(() => {
    if (!noindex) return;

    let meta = document.head.querySelector<HTMLMetaElement>(
      `meta[name="robots"][${OWNED_ATTR}]`
    );
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "robots");
      meta.setAttribute(OWNED_ATTR, "true");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", "noindex, nofollow");

    return () => {
      // Remove only the tag this hook owns
      document.head
        .querySelectorAll(`meta[name="robots"][${OWNED_ATTR}]`)
        .forEach((el) => el.remove());
    };
  }, [noindex]);
}
