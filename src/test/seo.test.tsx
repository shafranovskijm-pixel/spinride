import { describe, it, expect, beforeEach } from "vitest";
import { render, act } from "@testing-library/react";
import { MemoryRouter, Routes, Route, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useCanonical, useNoIndex } from "@/hooks/use-canonical";
import { resolvePathCategory } from "@/lib/catalog-utils";
import { validateSitemap } from "../../scripts/sitemap-validate.mjs";

const CATEGORIES = [
  { slug: "bicycles", name: "Велосипеды" },
  { slug: "bmx", name: "BMX" },
];

function CanonicalProbe({ to }: { to?: string }) {
  useCanonical();
  const navigate = useNavigate();
  useEffect(() => {
    if (to) navigate(to);
  }, [to, navigate]);
  return null;
}

function NoIndexProbe({ noindex }: { noindex: boolean }) {
  useNoIndex(noindex);
  return null;
}

beforeEach(() => {
  document.head
    .querySelectorAll('link[rel="canonical"], meta[name="robots"]')
    .forEach((el) => el.remove());
});

describe("useCanonical", () => {
  it("sets a single canonical with fixed origin and normalized pathname, ignoring query/hash", () => {
    render(
      <MemoryRouter initialEntries={["/catalog/bmx?sort=price-asc#top"]}>
        <CanonicalProbe />
      </MemoryRouter>
    );
    const links = document.head.querySelectorAll('link[rel="canonical"]');
    expect(links).toHaveLength(1);
    expect(links[0].getAttribute("href")).toBe("https://spinride.ru/catalog/bmx");
  });

  it("updates the same element on client navigation — no duplicates, no stale value", () => {
    function Nav() {
      useCanonical();
      const navigate = useNavigate();
      return <button onClick={() => navigate("/product/snow-tube-100")}>go</button>;
    }
    const { getByText } = render(
      <MemoryRouter initialEntries={["/catalog"]}>
        <Nav />
      </MemoryRouter>
    );
    expect(document.head.querySelector('link[rel="canonical"]')!.getAttribute("href"))
      .toBe("https://spinride.ru/catalog");

    act(() => getByText("go").click());

    const links = document.head.querySelectorAll('link[rel="canonical"]');
    expect(links).toHaveLength(1);
    expect(links[0].getAttribute("href")).toBe("https://spinride.ru/product/snow-tube-100");
  });

  it("normalizes trailing slash on root", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <CanonicalProbe />
      </MemoryRouter>
    );
    expect(document.head.querySelector('link[rel="canonical"]')!.getAttribute("href"))
      .toBe("https://spinride.ru/");
  });
});

describe("useNoIndex", () => {
  it("adds robots noindex when true and removes it when false", () => {
    const { rerender } = render(
      <MemoryRouter>
        <NoIndexProbe noindex={true} />
      </MemoryRouter>
    );
    const meta = document.head.querySelector('meta[name="robots"]');
    expect(meta?.getAttribute("content")).toBe("noindex, nofollow");

    rerender(
      <MemoryRouter>
        <NoIndexProbe noindex={false} />
      </MemoryRouter>
    );
    expect(document.head.querySelector('meta[name="robots"]')).toBeNull();
  });
});

describe("resolvePathCategory", () => {
  it("returns 'none' without a slug", () => {
    expect(resolvePathCategory(undefined, CATEGORIES).status).toBe("none");
  });
  it("returns 'valid' with the matching category for a known slug", () => {
    const r = resolvePathCategory("bmx", CATEGORIES);
    expect(r.status).toBe("valid");
    if (r.status === "valid") expect(r.category.name).toBe("BMX");
  });
  it("returns 'invalid' for an unknown slug (must not show full catalog)", () => {
    expect(resolvePathCategory("spaceships", CATEGORIES).status).toBe("invalid");
  });
});

describe("validateSitemap", () => {
  const entry = (path: string) =>
    `  <url><loc>https://spinride.ru${path}</loc></url>`;
  const validXml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${[
    "/",
    "/catalog",
    "/quiz",
    ...Array.from({ length: 12 }, (_, i) => `/catalog/cat-${i}`),
    ...Array.from({ length: 30 }, (_, i) => `/product/prod-${i}`),
  ]
    .map(entry)
    .join("\n")}\n</urlset>`;

  it("accepts a valid sitemap and counts URLs", () => {
    const r = validateSitemap(validXml);
    expect(r.ok).toBe(true);
    expect(r.urlCount).toBe(45);
  });

  it("rejects empty/truncated output", () => {
    expect(validateSitemap("").ok).toBe(false);
    expect(validateSitemap('<?xml version="1.0"?><urlset></urlset>').ok).toBe(false);
  });

  it("rejects HTML error pages", () => {
    expect(validateSitemap("<html><body>404</body></html>").ok).toBe(false);
  });

  it("rejects wrong-origin URLs", () => {
    const bad = validXml.replace(
      "https://spinride.ru/catalog",
      "https://atkgcbunyakdnkfybvvp.supabase.co/catalog"
    );
    expect(validateSitemap(bad).ok).toBe(false);
  });

  it("rejects unexpected route shapes (e.g. admin)", () => {
    const bad = validXml + entry("/admin/secret");
    expect(validateSitemap(bad).ok).toBe(false);
  });
});
