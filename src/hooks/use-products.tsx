import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types/shop";
import { Json } from "@/integrations/supabase/types";

interface UseProductsOptions {
  categorySlug?: string;
  categoryIds?: string[];
  season?: "summer" | "winter" | "all";
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  onSale?: boolean;
  isNew?: boolean;
  isFeatured?: boolean;
  search?: string;
  sortBy?: "popular" | "price-asc" | "price-desc" | "new" | "rating";
  limit?: number;
}

// Convert DB row to Product type
const mapDbToProduct = (row: {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  specifications: Json;
  price: number;
  sale_price: number | null;
  images: string[] | null;
  in_stock: boolean | null;
  stock_quantity: number | null;
  season: "summer" | "winter" | "all" | null;
  is_featured: boolean | null;
  is_new: boolean | null;
  rating_average: number | null;
  rating_count: number | null;
  category_id: string | null;
  created_at: string;
  updated_at: string;
  categories?: { slug: string } | null;
}): Product => ({
  id: row.id,
  name: row.name,
  slug: row.slug,
  description: row.description,
  specifications: (row.specifications as Record<string, string>) || {},
  price: row.price,
  sale_price: row.sale_price,
  images: row.images || [],
  in_stock: row.in_stock ?? true,
  stock_quantity: row.stock_quantity ?? 0,
  season: row.season || "all",
  is_featured: row.is_featured ?? false,
  is_new: row.is_new ?? false,
  rating_average: row.rating_average ?? 0,
  rating_count: row.rating_count ?? 0,
  category_id: row.categories?.slug || row.category_id || "",
  created_at: row.created_at,
  updated_at: row.updated_at,
});

export function useProducts(options: UseProductsOptions = {}) {
  return useQuery({
    queryKey: ["products", options],
    queryFn: async () => {
      let query = supabase
        .from("products")
        .select(`
          *,
          categories!products_category_id_fkey(slug)
        `);

      // Filter by category slug
      if (options.categorySlug) {
        const { data: category } = await supabase
          .from("categories")
          .select("id")
          .eq("slug", options.categorySlug)
          .single();
        
        if (category) {
          query = query.eq("category_id", category.id);
        }
      }

      // Filter by multiple category IDs (from slugs)
      if (options.categoryIds && options.categoryIds.length > 0) {
        const { data: categories } = await supabase
          .from("categories")
          .select("id")
          .in("slug", options.categoryIds);
        
        if (categories && categories.length > 0) {
          query = query.in("category_id", categories.map(c => c.id));
        }
      }

      // Filter by season
      if (options.season && options.season !== "all") {
        query = query.or(`season.eq.${options.season},season.eq.all`);
      }

      // Filter by price range
      if (options.minPrice !== undefined && options.minPrice > 0) {
        query = query.gte("price", options.minPrice);
      }
      if (options.maxPrice !== undefined && options.maxPrice < 1000000) {
        query = query.lte("price", options.maxPrice);
      }

      // Filter by stock
      if (options.inStock) {
        query = query.eq("in_stock", true);
      }

      // Filter by sale
      if (options.onSale) {
        query = query.not("sale_price", "is", null);
      }

      // Filter by new
      if (options.isNew) {
        query = query.eq("is_new", true);
      }

      // Filter by featured
      if (options.isFeatured) {
        query = query.eq("is_featured", true);
      }

      // Search
      if (options.search) {
        query = query.or(`name.ilike.%${options.search}%,description.ilike.%${options.search}%`);
      }

      // Sort
      switch (options.sortBy) {
        case "price-asc":
          query = query.order("price", { ascending: true });
          break;
        case "price-desc":
          query = query.order("price", { ascending: false });
          break;
        case "new":
          query = query.order("is_new", { ascending: false }).order("created_at", { ascending: false });
          break;
        case "rating":
          query = query.order("rating_average", { ascending: false });
          break;
        default:
          query = query.order("rating_count", { ascending: false });
      }

      // Limit
      if (options.limit) {
        query = query.limit(options.limit);
      }

      const { data, error } = await query;

      if (error) throw error;
      return (data || []).map(mapDbToProduct);
    },
  });
}

export function useProduct(slug: string) {
  return useQuery({
    queryKey: ["product", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select(`
          *,
          categories!products_category_id_fkey(slug, name)
        `)
        .eq("slug", slug)
        .single();

      if (error) throw error;
      return mapDbToProduct(data);
    },
    enabled: !!slug,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("sort_order", { ascending: true });

      if (error) throw error;
      
      // Get product counts for each category
      const { data: counts } = await supabase
        .from("products")
        .select("category_id");
      
      const countMap = new Map<string, number>();
      counts?.forEach(p => {
        if (p.category_id) {
          countMap.set(p.category_id, (countMap.get(p.category_id) || 0) + 1);
        }
      });

      return (data || []).map(cat => ({
        ...cat,
        count: countMap.get(cat.id) || 0,
      }));
    },
  });
}

export function useRelatedProducts(productId: string, categoryId: string | null, limit = 4) {
  return useQuery({
    queryKey: ["relatedProducts", productId, categoryId],
    queryFn: async () => {
      if (!categoryId) return [];

      // Get category UUID from slug
      const { data: category } = await supabase
        .from("categories")
        .select("id")
        .eq("slug", categoryId)
        .single();

      if (!category) return [];

      const { data, error } = await supabase
        .from("products")
        .select(`
          *,
          categories!products_category_id_fkey(slug)
        `)
        .eq("category_id", category.id)
        .neq("id", productId)
        .limit(limit);

      if (error) throw error;
      return (data || []).map(mapDbToProduct);
    },
    enabled: !!productId && !!categoryId,
  });
}
