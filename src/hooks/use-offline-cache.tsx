import { useEffect, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { 
  cacheProducts, 
  getCachedProducts, 
  cacheCategories, 
  getCachedCategories,
  isCacheStale 
} from '@/lib/offline-db';
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/types/shop';
import { Json } from '@/integrations/supabase/types';

// Map DB row to Product type
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

export function useOfflineCache() {
  const queryClient = useQueryClient();

  // Prefetch and cache data for offline use
  const prefetchData = useCallback(async () => {
    try {
      // Check if cache is stale (older than 1 hour)
      const productsStale = await isCacheStale('products', 60 * 60 * 1000);
      const categoriesStale = await isCacheStale('categories', 60 * 60 * 1000);

      // Fetch and cache products
      if (productsStale) {
        const { data: products } = await supabase
          .from('products')
          .select(`*, categories!products_category_id_fkey(slug)`);
        
        if (products) {
          const mappedProducts = products.map(mapDbToProduct);
          await cacheProducts(mappedProducts);
          console.log(`[Offline] Cached ${products.length} products`);
        }
      }

      // Fetch and cache categories
      if (categoriesStale) {
        const { data: categories } = await supabase
          .from('categories')
          .select('*')
          .order('sort_order', { ascending: true });
        
        if (categories) {
          await cacheCategories(categories);
          console.log(`[Offline] Cached ${categories.length} categories`);
        }
      }
    } catch (error) {
      console.warn('[Offline] Failed to prefetch data:', error);
    }
  }, []);

  // Load cached data into React Query when offline
  const loadCachedData = useCallback(async () => {
    if (!navigator.onLine) {
      try {
        const [cachedProducts, cachedCategories] = await Promise.all([
          getCachedProducts(),
          getCachedCategories(),
        ]);

        if (cachedProducts.length > 0) {
          queryClient.setQueryData(['products', {}], cachedProducts);
          console.log(`[Offline] Loaded ${cachedProducts.length} cached products`);
        }

        if (cachedCategories.length > 0) {
          queryClient.setQueryData(['categories'], cachedCategories);
          console.log(`[Offline] Loaded ${cachedCategories.length} cached categories`);
        }
      } catch (error) {
        console.warn('[Offline] Failed to load cached data:', error);
      }
    }
  }, [queryClient]);

  // Prefetch data on mount and when coming online
  useEffect(() => {
    prefetchData();

    const handleOnline = () => {
      prefetchData();
    };

    const handleOffline = () => {
      loadCachedData();
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Also load cached data immediately if offline
    if (!navigator.onLine) {
      loadCachedData();
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [prefetchData, loadCachedData]);

  return {
    prefetchData,
    loadCachedData,
  };
}
