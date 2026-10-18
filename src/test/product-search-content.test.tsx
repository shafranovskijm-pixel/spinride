import { afterEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, render } from "@testing-library/react";
import { ProductDetails } from "@/components/shop/ProductDetails";
import { getProductStructuredData } from "@/lib/product-seo";
import { useStructuredData } from "@/hooks/use-structured-data";
import { useDocumentSEO } from "@/hooks/use-seo";
import type { Product } from "@/types/shop";

vi.mock("@/integrations/supabase/client", () => ({
  supabase: { from: () => ({ select: () => ({ eq: () => ({ maybeSingle: () => Promise.resolve({ data: null, error: null }) }) }) }) },
}));

const product: Product = {
  id: "test-product", slug: "scooter", name: "Самокат", category_id: "scooters",
  description: "Компрессия SCS. Рост от 170 до 185 см.", specifications: {},
  price: 23500, sale_price: 21000, images: ["/products/scooter.jpg"],
  in_stock: false, stock_quantity: 0, season: "summer", is_featured: false,
  is_new: false, rating_average: 5, rating_count: 8, created_at: "", updated_at: "",
};

afterEach(() => {
  cleanup();
  document.head.querySelectorAll('meta, script[type="application/ld+json"]').forEach((element) => element.remove());
});

it("shows the original description without any click even when specifications are empty", () => {
  const view = render(<ProductDetails product={product} />);
  expect(view.getByText(product.description!)).toBeVisible();
  expect(view.queryByRole("heading", { name: "Характеристики" })).not.toBeInTheDocument();
  expect(view.queryByRole("tab")).not.toBeInTheDocument();
  view.rerender(<ProductDetails product={{ ...product, specifications: { Колёса: "110 мм" } }} />);
  expect(view.getByText("110 мм")).toBeVisible();
  expect(view.getByText(product.description!)).toBeVisible();
});

describe("product search metadata", () => {
  it("uses the visible sale price, real stock and absolute product images without inventing a rating", () => {
    const data = getProductStructuredData(product);
    expect(data.offers).toMatchObject({ price: "21000.00", priceCurrency: "RUB", availability: "https://schema.org/OutOfStock" });
    expect(data.image).toEqual(["https://spinride.ru/products/scooter.jpg"]);
    expect(data).not.toHaveProperty("aggregateRating");
    expect(data).not.toHaveProperty("review");
    expect(getProductStructuredData({ ...product, price: 0, sale_price: null, images: [] })).not.toHaveProperty("offers");
    const badImages = getProductStructuredData({ ...product, images: ["http://", "javascript:alert(1)", "/products/scooter.jpg"] });
    expect(badImages.image).toEqual(["https://spinride.ru/products/scooter.jpg"]);
  });

  it("replaces stale product structured data on navigation and removes it on missing products", () => {
    function Probe({ item }: { item: Product | null }) {
      useStructuredData("product-structured-data", item ? getProductStructuredData(item) : null);
      return null;
    }
    const view = render(<Probe item={product} />);
    expect(document.querySelectorAll("#product-structured-data")).toHaveLength(1);
    view.rerender(<Probe item={{ ...product, slug: "another-scooter", name: "Другой самокат" }} />);
    expect(document.querySelectorAll("#product-structured-data")).toHaveLength(1);
    expect(JSON.parse(document.querySelector("#product-structured-data")!.textContent!).url).toBe("https://spinride.ru/product/another-scooter");
    view.rerender(<Probe item={null} />);
    expect(document.querySelector("#product-structured-data")).toBeNull();
  });

  it("updates description and social metadata when moving from a product to a category", async () => {
    function Probe({ name, type }: { name: string; type?: string }) {
      useDocumentSEO(name, `Описание ${name}`, { type, image: type === "product" ? "https://spinride.ru/products/scooter.jpg" : undefined });
      return null;
    }
    let view!: ReturnType<typeof render>;
    await act(async () => { view = render(<Probe name="Самокат в Уссурийске" type="product" />); });
    expect(document.title).toBe("Самокат в Уссурийске | SPINRIDE");
    expect(document.head.querySelector('meta[name="twitter:title"]')?.getAttribute("content")).toBe(document.title);
    expect(document.head.querySelector('meta[property="og:type"]')?.getAttribute("content")).toBe("product");
    expect(document.head.querySelector('meta[property="og:image"]')?.getAttribute("content")).toBe("https://spinride.ru/products/scooter.jpg");
    view.rerender(<Probe name="Велосипеды в Уссурийске" />);
    expect(document.head.querySelector('meta[property="og:type"]')?.getAttribute("content")).toBe("website");
    expect(document.head.querySelector('meta[name="description"]')?.getAttribute("content")).toBe("Описание Велосипеды в Уссурийске");
    expect(document.head.querySelectorAll('meta[name="description"]')).toHaveLength(1);
    expect(document.head.querySelector('meta[property="og:image"]')?.getAttribute("content")).not.toBe("https://spinride.ru/products/scooter.jpg");
  });
});
