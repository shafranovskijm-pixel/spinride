import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { CategoryGrid } from "@/components/shop/CategoryGrid";

const state = vi.hoisted(() => ({ season: "summer" }));
vi.mock("@/hooks/use-season", () => ({ useSeason: () => state }));

// Read-only production catalog audit, 18 October 2026. These are the actual
// populated sections; empty e-bikes/BMX/accessories must not replace them.
const populatedSections = new Map([
  ["/catalog/bicycles", 18],
  ["/catalog/scooters", 12],
  ["/catalog/kids", 2],
  ["/catalog/parts", 1],
  ["/catalog/elektromobil", 2],
  ["/catalog/winter", 4],
]);

beforeEach(() => {
  cleanup();
  vi.stubGlobal("fetch", vi.fn(() => { throw new Error("Category navigation must not fetch extra data"); }));
});
afterEach(() => vi.unstubAllGlobals());

describe("home category navigation", () => {
  it.each(["summer", "winter"])("keeps all populated sections, including scooters, accessible in %s", (season) => {
    state.season = season;
    render(<MemoryRouter><CategoryGrid /></MemoryRouter>);
    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(6);
    const targets = links.map((link) => link.getAttribute("href"));
    expect(new Set(targets)).toEqual(new Set(populatedSections.keys()));
    for (const target of targets) expect(populatedSections.get(target!)).toBeGreaterThan(0);
    expect(screen.getByRole("link", { name: /Самокаты/ })).toHaveAttribute("href", "/catalog/scooters");
    expect(screen.queryByText(/электровелосипеды|фэтбайки|ёлки|снегокаты/i)).not.toBeInTheDocument();
    expect(fetch).not.toHaveBeenCalled();
    expect(links[0]).toHaveAttribute("href", season === "winter" ? "/catalog/winter" : "/catalog/bicycles");
  });
});
