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
