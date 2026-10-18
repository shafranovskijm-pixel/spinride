import { describe, it, expect, beforeEach } from "vitest";
import { render, act } from "@testing-library/react";
import { MemoryRouter, Routes, Route, useNavigate } from "react-router-dom";
import { useCanonical, useNoIndex } from "@/hooks/use-canonical";
import { resolvePathCategory, buildCategoryPath } from "@/lib/catalog-utils";
import {
  validateSitemap,
  compareCoverage,
  extractLocs,
} from "../../scripts/sitemap-validate.mjs";

const CATEGORIES = [
  { slug: "bicycles", name: "Велосипеды" },
  { slug: "bmx", name: "BMX" },
];

function CanonicalProbe() {
  useCanonical();
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

  it("removes pre-existing duplicate canonicals, keeping exactly one", () => {
    const dup = document.createElement("link");
    dup.setAttribute("rel", "canonical");
    dup.setAttribute("href", "https://spinride.ru/stale");
    document.head.appendChild(dup);

    render(
      <MemoryRouter initialEntries={["/about"]}>
        <CanonicalProbe />
      </MemoryRouter>
    );
    const links = document.head.querySelectorAll('link[rel="canonical"]');
    expect(links).toHaveLength(1);
    expect(links[0].getAttribute("href")).toBe("https://spinride.ru/about");
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
});

describe("useNoIndex route-level behavior", () => {
  function App({ initial }: { initial: string }) {
    return (
      <MemoryRouter initialEntries={[initial]}>
        <Routes>
          <Route path="/catalog/spaceships" element={<NoIndexProbe noindex={true} />} />
          <Route path="/product/ghost" element={<NoIndexProbe noindex={true} />} />
          <Route path="/" element={<CanonicalProbe />} />
          <Route path="/catalog/bmx" element={<CanonicalProbe />} />
          <Route path="/product/snow-tube-100" element={<CanonicalProbe />} />
        </Routes>
      </MemoryRouter>
    );
  }

  it("invalid category -> home: noindex is removed on unmount", () => {
    const { unmount } = render(<App initial="/catalog/spaceships" />);
    expect(document.head.querySelector('meta[name="robots"]')?.getAttribute("content"))
      .toBe("noindex, nofollow");
    unmount();

    render(<App initial="/" />);
    expect(document.head.querySelector('meta[name="robots"]')).toBeNull();
  });

  it("invalid product -> valid product: noindex is removed", () => {
    const { unmount } = render(<App initial="/product/ghost" />);
    expect(document.head.querySelector('meta[name="robots"]')).not.toBeNull();
    unmount();

    render(<App initial="/product/snow-tube-100" />);
    expect(document.head.querySelector('meta[name="robots"]')).toBeNull();
  });

  it("invalid category -> valid category: noindex is removed", () => {
    const { unmount } = render(<App initial="/catalog/spaceships" />);
    expect(document.head.querySelector('meta[name="robots"]')).not.toBeNull();
    unmount();

    render(<App initial="/catalog/bmx" />);
    expect(document.head.querySelector('meta[name="robots"]')).toBeNull();
  });

  it("does not remove an unrelated deliberate robots directive", () => {
    const foreign = document.createElement("meta");
    foreign.setAttribute("name", "robots");
    foreign.setAttribute("content", "noarchive");
    document.head.appendChild(foreign);

    const { unmount } = render(<App initial="/catalog/spaceships" />);
    unmount();

    const remaining = document.head.querySelector('meta[name="robots"]');
    expect(remaining?.getAttribute("content")).toBe("noarchive");
    foreign.remove();
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

describe("buildCategoryPath", () => {
  it("single category -> canonical path form", () => {
    expect(buildCategoryPath(["bmx"], new URLSearchParams())).toBe("/catalog/bmx");
  });
  it("path -> different single category navigates to the new canonical path", () => {
    expect(buildCategoryPath(["bicycles"], new URLSearchParams())).toBe("/catalog/bicycles");
  });
  it("unchecking the only category -> plain /catalog", () => {
    expect(buildCategoryPath([], new URLSearchParams())).toBe("/catalog");
  });
  it("multiple categories -> query form", () => {
    expect(buildCategoryPath(["bmx", "bicycles"], new URLSearchParams()))
      .toBe("/catalog?categories=bmx%2Cbicycles");
  });
  it("preserves non-category filters", () => {
    const params = new URLSearchParams("sort=price-asc&categories=bmx&sale=true");
    expect(buildCategoryPath(["bicycles"], params))
      .toBe("/catalog/bicycles?sort=price-asc&sale=true");
  });
  it("clearing all categories keeps other filters on /catalog", () => {
    const params = new URLSearchParams("sort=price-asc&categories=bmx");
    expect(buildCategoryPath([], params)).toBe("/catalog?sort=price-asc");
  });
});

describe("validateSitemap", () => {
  const entry = (path: string) =>
    `  <url><loc>https://spinride.ru${path}</loc></url>`;
  const paths = [
    "/",
    "/catalog",
    "/quiz",
    ...Array.from({ length: 13 }, (_, i) => `/catalog/cat-${i}`),
    ...Array.from({ length: 40 }, (_, i) => `/product/prod-${i}`),
  ];
  const validXml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${paths.map(entry).join("\n")}\n</urlset>`;

  it("accepts a valid sitemap and counts URLs", () => {
    const r = validateSitemap(validXml);
    expect(r.ok).toBe(true);
    expect(r.urlCount).toBe(55);
  });

  it("rejects empty/truncated output", () => {
    expect(validateSitemap("").ok).toBe(false);
    expect(validateSitemap('<?xml version="1.0"?><urlset></urlset>').ok).toBe(false);
  });

  it("rejects malformed XML", () => {
    const malformed = validXml.replace("</urlset>", "");
    expect(validateSitemap(malformed).ok).toBe(false);
  });

  it("rejects HTML error pages", () => {
    expect(validateSitemap("<html><body>404</body></html>").ok).toBe(false);
  });

  it("rejects duplicate URLs", () => {
    const withDupe = validXml.replace("</urlset>", `${entry("/catalog")}\n</urlset>`);
    expect(validateSitemap(withDupe).ok).toBe(false);
  });

  it("rejects wrong-origin URLs", () => {
    const bad = validXml.replace(
      "https://spinride.ru/catalog",
      "https://atkgcbunyakdnkfybvvp.supabase.co/catalog"
    );
    expect(validateSitemap(bad).ok).toBe(false);
  });

  it("rejects unexpected route shapes (e.g. admin)", () => {
    const bad = validXml.replace("</urlset>", `${entry("/admin/secret")}\n</urlset>`);
    expect(validateSitemap(bad).ok).toBe(false);
  });
});

describe("compareCoverage", () => {
  const previous = [
    "https://spinride.ru/",
    "https://spinride.ru/catalog/bmx",
    "https://spinride.ru/product/a",
  ];

  it("passes when all previous URLs are still present", () => {
    expect(compareCoverage([...previous, "https://spinride.ru/product/b"], previous).ok).toBe(true);
  });

  it("fails explicitly when previously listed URLs are lost (62 -> 40 truncation)", () => {
    const r = compareCoverage(["https://spinride.ru/"], previous);
    expect(r.ok).toBe(false);
    expect(r.lost).toContain("https://spinride.ru/product/a");
  });
});

describe("extractLocs", () => {
  it("extracts loc values from an existing sitemap", () => {
    const xml = `<urlset><url><loc>https://spinride.ru/</loc></url><url><loc>https://spinride.ru/catalog</loc></url></urlset>`;
    expect(extractLocs(xml)).toEqual(["https://spinride.ru/", "https://spinride.ru/catalog"]);
  });
});
