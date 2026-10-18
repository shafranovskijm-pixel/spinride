export interface CategoryLike {
  slug: string;
  name: string;
}

export type PathCategoryResult =
  | { status: "none" }
  | { status: "valid"; category: CategoryLike }
  | { status: "invalid" };

/**
 * Resolves the /catalog/:category path slug against the real category list.
 * "none" — no slug in the path (plain /catalog).
 * "valid" — slug matches an existing category.
 * "invalid" — slug present but unknown (must not silently show full catalog).
 */
export function resolvePathCategory(
  slug: string | undefined,
  categories: CategoryLike[]
): PathCategoryResult {
  if (!slug) return { status: "none" };
  const category = categories.find((c) => c.slug === slug);
  return category ? { status: "valid", category } : { status: "invalid" };
}

/**
 * Builds the canonical catalog URL for a category selection:
 * - 0 categories -> /catalog
 * - 1 category  -> /catalog/:slug (canonical path form)
 * - several     -> /catalog?categories=a,b
 * Non-category query params (sort, q, price, etc.) are preserved.
 */
export function buildCategoryPath(
  selected: string[],
  currentParams: URLSearchParams
): string {
  const params = new URLSearchParams(currentParams);
  params.delete("categories");

  if (selected.length === 1) {
    const qs = params.toString();
    return `/catalog/${selected[0]}${qs ? `?${qs}` : ""}`;
  }
  if (selected.length > 1) {
    params.set("categories", selected.join(","));
  }
  const qs = params.toString();
  return `/catalog${qs ? `?${qs}` : ""}`;
}
