import { beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, within } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import CatalogPage from "@/pages/CatalogPage";
import { getCategorySEO } from "@/lib/category-seo";

const { applySEO } = vi.hoisted(() => ({ applySEO: vi.fn() }));

const categories = [
  { id: "bikes", slug: "bicycles", name: "Велосипеды", description: "Городские модели", count: 18 },
  { id: "scooters", slug: "scooters", name: "Самокаты", description: "Детские и взрослые", count: 12 },
  { id: "winter", slug: "winter", name: "Зимние товары", description: "Коньки и тюбинги", count: 4 },
  { id: "bmx", slug: "bmx", name: "BMX", description: "Трюковые велосипеды", count: 0 },
];

vi.mock("@/hooks/use-products", () => ({
  useCategories: () => ({ data: categories, isLoading: false, error: null }),
  useProducts: () => ({ data: [], isLoading: false }),
}));
vi.mock("@/hooks/use-seo", () => ({ useDocumentSEO: applySEO }));
vi.mock("@/hooks/use-canonical", () => ({ useNoIndex: vi.fn() }));
vi.mock("@/components/shop/ShopLayout", () => ({
  ShopLayout: ({ children }: { children: React.ReactNode }) => <main>{children}</main>,
}));
vi.mock("@/components/shop/ProductCard", () => ({ ProductCard: () => null }));
// The price slider's resize handling is unrelated to catalog content.
vi.mock("@/components/ui/slider", () => ({ Slider: () => <div /> }));

function renderCatalog(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/catalog" element={<CatalogPage />} />
        <Route path="/catalog/:category" element={<CatalogPage />} />
      </Routes>
    </MemoryRouter>,
  );
}

beforeEach(() => {
  cleanup();
  applySEO.mockClear();
});

describe("category landing pages", () => {
  it("shows local category content immediately and exposes ordinary links to populated sections", () => {
    renderCatalog("/catalog/bicycles");
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Велосипеды в Уссурийске");
    expect(screen.getByText(/Выберите велосипед для города и прогулок/)).toBeVisible();
    expect(screen.getByText(/Сравнивайте размер колёс/)).toBeVisible();

    const links = within(screen.getByRole("navigation", { name: "Разделы каталога" }));
    expect(links.getByRole("link", { name: "Самокаты" })).toHaveAttribute("href", "/catalog/scooters");
    expect(links.getByRole("link", { name: "Зимние товары" })).toHaveAttribute("href", "/catalog/winter");
    expect(links.queryByRole("link", { name: "BMX" })).not.toBeInTheDocument();
    expect(links.queryByRole("link", { name: "Велосипеды" })).not.toBeInTheDocument();
    expect(applySEO).toHaveBeenLastCalledWith("Велосипеды в Уссурийске", expect.stringContaining("Action, MIQIL"));
  });

  it("does not advertise an assortment for an existing empty category", () => {
    renderCatalog("/catalog/bmx");
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("BMX в Уссурийске");
    expect(screen.getByText(/В этой категории пока нет товаров/)).toBeVisible();
    expect(screen.queryByRole("heading", { name: "Как выбрать" })).not.toBeInTheDocument();
    expect(applySEO).toHaveBeenLastCalledWith("BMX в Уссурийске", expect.stringContaining("Сейчас товаров в этой категории нет"));
    expect(within(screen.getByRole("navigation", { name: "Разделы каталога" })).getByRole("link", { name: "Велосипеды" }))
      .toHaveAttribute("href", "/catalog/bicycles");
  });

  it("keeps general catalog navigation available with a search filter", () => {
    renderCatalog("/catalog?q=STELS");
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Каталог");
    const link = within(screen.getByRole("navigation", { name: "Разделы каталога" })).getByRole("link", { name: "Самокаты" });
    expect(link).toHaveAttribute("href", "/catalog/scooters");
    expect(applySEO).toHaveBeenLastCalledWith("Каталог велосипедов и самокатов в Уссурийске", expect.stringContaining("коньки, тюбинги"));
  });

  it("uses a new category's own description without inventing products or commercial promises", () => {
    const result = getCategorySEO({ slug: "new-category", name: "Новый раздел ", description: "Описание из каталога", count: 2 });
    expect(result.heading).toBe("Новый раздел в Уссурийске");
    expect(result.introduction).toBe("Описание из каталога");
    expect(result.description).not.toMatch(/бесплатн|гаранти|доставка/i);
  });
});
