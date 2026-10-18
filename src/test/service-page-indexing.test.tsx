import { afterEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { Link, MemoryRouter, Route, Routes } from "react-router-dom";
import { isServicePage, ServicePageIndexing } from "@/components/ServicePageIndexing";
import { useNoIndex } from "@/hooks/use-canonical";

afterEach(cleanup);

function MissingPage() {
  useNoIndex(true);
  return <p>Страница не найдена</p>;
}

describe("service page indexing", () => {
  it.each([
    "/auth/login", "/auth/register", "/auth/reset-password", "/auth/callback",
    "/admin", "/admin/products", "/cart", "/checkout", "/orders",
    "/order-success", "/profile", "/favorites", "/compare", "/cart/",
  ])("marks the service page %s as noindex", (path) => {
    expect(isServicePage(path)).toBe(true);
  });

  it.each([
    "/", "/catalog", "/catalog/bicycles", "/product/action-an100",
    "/contacts", "/about", "/delivery", "/quiz", "/author", "/administrator",
    "/cartoon", "/unknown-page",
  ])("does not match public routes or loose prefix %s", (path) => {
    expect(isServicePage(path)).toBe(false);
  });

  it("removes the robots directive when navigating from login to the catalog", () => {
    render(
      <MemoryRouter initialEntries={["/auth/login"]}>
        <ServicePageIndexing />
        <Link to="/catalog">Открыть каталог</Link>
      </MemoryRouter>
    );
    expect(document.head.querySelector('meta[name="robots"]')).toHaveAttribute("content", "noindex, nofollow");
    fireEvent.click(screen.getByRole("link", { name: "Открыть каталог" }));
    expect(document.head.querySelector('meta[name="robots"]')).toBeNull();
  });

  it.each(["/auth/login", "/unknown"])("retains noindex when overlapping service and missing-page owners navigate to %s", (destination) => {
    render(
      <MemoryRouter initialEntries={["/auth/unknown"]}>
        <ServicePageIndexing />
        <Link to={destination}>Продолжить</Link>
        <Link to="/catalog">Открыть каталог</Link>
        <Routes>
          <Route path="/auth/login" element={<p>Вход</p>} />
          <Route path="/catalog" element={<p>Каталог</p>} />
          <Route path="*" element={<MissingPage />} />
        </Routes>
      </MemoryRouter>
    );
    expect(document.head.querySelector('meta[name="robots"]')).toHaveAttribute("content", "noindex, nofollow");
    fireEvent.click(screen.getByRole("link", { name: "Продолжить" }));
    expect(document.head.querySelector('meta[name="robots"]')).toHaveAttribute("content", "noindex, nofollow");
    fireEvent.click(screen.getByRole("link", { name: "Открыть каталог" }));
    expect(document.head.querySelector('meta[name="robots"]')).toBeNull();
  });
});
