import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const BASE_ORIGIN = "https://spinride.ru";

/**
 * Ensures exactly one <link rel="canonical"> in <head>, pointing at
 * https://spinride.ru + normalized pathname (no query/hash).
 * Reuses the existing element so client-side navigation never leaves
 * duplicate or stale canonicals.
 */
export function useCanonical(pathOverride?: string) {
  const { pathname } = useLocation();

  useEffect(() => {
    const raw = pathOverride ?? pathname;
    const normalized = raw.replace(/\/+$/, "") || "/";
    const url = BASE_ORIGIN + normalized;

    let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = document.createElement("link");
      link.setAttribute("rel", "canonical");
      document.head.appendChild(link);
    }
    link.setAttribute("href", url);
  }, [pathname, pathOverride]);
}

/**
 * Adds <meta name="robots" content="noindex, nofollow"> while `noindex` is
 * true and removes it otherwise, so real public pages are never noindexed.
 */
export function useNoIndex(noindex: boolean) {
  useEffect(() => {
    let meta = document.querySelector<HTMLMetaElement>('meta[name="robots"]');
    if (noindex) {
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute("name", "robots");
        document.head.appendChild(meta);
      }
      meta.setAttribute("content", "noindex, nofollow");
    } else if (meta) {
      meta.remove();
    }
  }, [noindex]);
}
