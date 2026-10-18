import { useLocation } from "react-router-dom";
import { useNoIndex } from "@/hooks/use-canonical";

const SERVICE_PATHS = new Set([
  "/cart", "/checkout", "/orders", "/order-success",
  "/profile", "/favorites", "/compare",
]);

export function isServicePage(pathname: string): boolean {
  const path = pathname.replace(/\/+$/, "") || "/";
  return SERVICE_PATHS.has(path)
    || path === "/auth" || path.startsWith("/auth/")
    || path === "/admin" || path.startsWith("/admin/");
}

/** Keep account and checkout screens out of search while leaving them crawlable. */
export function ServicePageIndexing() {
  const { pathname } = useLocation();
  useNoIndex(isServicePage(pathname));
  return null;
}
