import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Header } from "@/components/shop/Header";
import { Footer } from "@/components/shop/Footer";

const state = vi.hoisted(() => ({
  season: "winter" as "summer" | "winter",
  contactHours: "Пн-Пт: 10:00-19:00, Сб: 11:00-17:00, Вс: выходной",
}));

vi.mock("@/hooks/use-season", () => ({ useSeason: () => ({ season: state.season }) }));
vi.mock("@/hooks/use-cart", () => ({ useCart: () => ({ itemCount: 0 }) }));
vi.mock("@/hooks/use-favorites", () => ({ useFavorites: () => ({ count: 0 }) }));
vi.mock("@/hooks/use-auth", () => ({
  useAuth: () => ({ user: null, profile: null, isAdmin: false, signOut: vi.fn() }),
}));
vi.mock("@/components/shop/SearchAutocomplete", () => ({ SearchAutocomplete: () => null }));
vi.mock("@/hooks/use-store-info", () => ({ useStoreInfo: () => ({ data: undefined }) }));
vi.mock("@/hooks/use-page-content", () => ({
  usePageContent: () => ({ data: { content: { work_hours: state.contactHours } } }),
}));
vi.mock("@/hooks/use-footer-settings", () => ({
  useFooterSettings: () => ({
    data: {
      description: "SPINRIDE",
      phone: "+7 924-788-11-11",
      address: "г. Уссурийск, ул. Пушкина, 13",
      email: "info@spinride.ru",
      work_hours: "Пн-Вс: 10:00 - 19:00",
      social: {},
      info_links: [],
      copyright_text: "SPINRIDE",
    },
  }),
}));

afterEach(cleanup);
beforeEach(() => { state.season = "winter"; });

function renderStorefrontNavigation() {
  return render(<MemoryRouter><Header /><Footer /></MemoryRouter>);
}

describe("storefront navigation", () => {
  it("keeps winter header and footer links on populated catalog categories", () => {
    const { container } = renderStorefrontNavigation();
    // Categories with actual products in the public catalog on 2026-10-18.
    const populatedRoutes = new Set([
      "/catalog/winter", "/catalog/bicycles", "/catalog/scooters",
      "/catalog/kids", "/catalog/parts", "/catalog/atv", "/catalog/elektromobil",
    ]);
    for (const element of container.querySelectorAll("header, footer")) {
      const links = Array.from(element.querySelectorAll<HTMLAnchorElement>('a[href^="/catalog/"]'));
      expect(links.length).toBeGreaterThan(0);
      for (const link of links) expect(populatedRoutes.has(link.getAttribute("href")!)).toBe(true);
      expect(links.some((link) => link.getAttribute("href") === "/catalog/winter")).toBe(true);
      expect(links.some((link) => link.getAttribute("href") === "/catalog/scooters")).toBe(true);
    }
  });

  it("promotes populated scooter and winter sections instead of empty electrical sections in summer", () => {
    state.season = "summer";
    const { container } = renderStorefrontNavigation();
    const footer = within(container.querySelector("footer")!);
    expect(footer.getByRole("link", { name: "Самокаты" })).toHaveAttribute("href", "/catalog/scooters");
    expect(footer.getByRole("link", { name: "Зимние товары" })).toHaveAttribute("href", "/catalog/winter");
    expect(container.querySelector('a[href="/catalog/e-bikes"], a[href="/catalog/e-scooters"], a[href="/catalog/bmx"], a[href="/catalog/accessories"]')).toBeNull();
  });

  it("uses contact page hours when the saved footer hours disagree", () => {
    const { container } = renderStorefrontNavigation();
    const footer = within(container.querySelector("footer")!);
    expect(footer.getByText(state.contactHours)).toBeInTheDocument();
    expect(footer.queryByText("Пн-Вс: 10:00 - 19:00")).not.toBeInTheDocument();
  });
});
