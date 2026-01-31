import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./use-auth";
import { toast } from "sonner";

interface FavoritesContextType {
  favorites: string[];
  addFavorite: (productId: string) => void;
  removeFavorite: (productId: string) => void;
  toggleFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
  count: number;
  isLoading: boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

const FAVORITES_STORAGE_KEY = "spinride_favorites";

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  // Load favorites from localStorage (for guests)
  const loadLocalFavorites = useCallback(() => {
    const stored = localStorage.getItem(FAVORITES_STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored) as string[];
      } catch {
        localStorage.removeItem(FAVORITES_STORAGE_KEY);
      }
    }
    return [];
  }, []);

  // Save favorites to localStorage (for guests)
  const saveLocalFavorites = useCallback((items: string[]) => {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(items));
  }, []);

  // Fetch favorites from database (for authenticated users)
  const fetchDbFavorites = useCallback(async (userId: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("favorites")
        .select("product_id")
        .eq("user_id", userId);

      if (error) throw error;
      return data?.map((f) => f.product_id) || [];
    } catch (error) {
      console.error("Error fetching favorites:", error);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Sync local favorites to database when user logs in
  const syncLocalToDb = useCallback(async (userId: string, localFavorites: string[]) => {
    if (localFavorites.length === 0) return;

    try {
      // Get existing DB favorites
      const { data: existingData } = await supabase
        .from("favorites")
        .select("product_id")
        .eq("user_id", userId);

      const existingIds = existingData?.map((f) => f.product_id) || [];
      
      // Find new favorites to add (not already in DB)
      const newFavorites = localFavorites.filter((id) => !existingIds.includes(id));

      if (newFavorites.length > 0) {
        const { error } = await supabase.from("favorites").insert(
          newFavorites.map((product_id) => ({
            user_id: userId,
            product_id,
          }))
        );

        if (error) throw error;
        
        toast.success(`${newFavorites.length} товар(ов) добавлено в избранное`);
      }

      // Clear local storage after sync
      localStorage.removeItem(FAVORITES_STORAGE_KEY);
    } catch (error) {
      console.error("Error syncing favorites:", error);
    }
  }, []);

  // Load favorites based on auth state
  useEffect(() => {
    const loadFavorites = async () => {
      if (user) {
        // User is logged in - fetch from DB
        const localFavorites = loadLocalFavorites();
        const dbFavorites = await fetchDbFavorites(user.id);
        
        // If there are local favorites, sync them to DB
        if (localFavorites.length > 0) {
          await syncLocalToDb(user.id, localFavorites);
          // Refetch to get merged favorites
          const mergedFavorites = await fetchDbFavorites(user.id);
          setFavorites(mergedFavorites);
        } else {
          setFavorites(dbFavorites);
        }
      } else {
        // Guest user - use localStorage
        setFavorites(loadLocalFavorites());
      }
    };

    loadFavorites();
  }, [user, loadLocalFavorites, fetchDbFavorites, syncLocalToDb]);

  // Save to localStorage when favorites change (for guests only)
  useEffect(() => {
    if (!user && favorites.length > 0) {
      saveLocalFavorites(favorites);
    }
  }, [favorites, user, saveLocalFavorites]);

  const addFavorite = useCallback(async (productId: string) => {
    if (favorites.includes(productId)) return;

    // Optimistic update
    setFavorites((prev) => [...prev, productId]);

    if (user) {
      try {
        const { error } = await supabase.from("favorites").insert({
          user_id: user.id,
          product_id: productId,
        });

        if (error) throw error;
      } catch (error) {
        // Rollback on error
        setFavorites((prev) => prev.filter((id) => id !== productId));
        console.error("Error adding favorite:", error);
        toast.error("Не удалось добавить в избранное");
      }
    }
  }, [favorites, user]);

  const removeFavorite = useCallback(async (productId: string) => {
    // Optimistic update
    setFavorites((prev) => prev.filter((id) => id !== productId));

    if (user) {
      try {
        const { error } = await supabase
          .from("favorites")
          .delete()
          .eq("user_id", user.id)
          .eq("product_id", productId);

        if (error) throw error;
      } catch (error) {
        // Rollback on error
        setFavorites((prev) => [...prev, productId]);
        console.error("Error removing favorite:", error);
        toast.error("Не удалось удалить из избранного");
      }
    }
  }, [user]);

  const toggleFavorite = useCallback((productId: string) => {
    if (favorites.includes(productId)) {
      removeFavorite(productId);
    } else {
      addFavorite(productId);
    }
  }, [favorites, addFavorite, removeFavorite]);

  const isFavorite = useCallback((productId: string) => {
    return favorites.includes(productId);
  }, [favorites]);

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        addFavorite,
        removeFavorite,
        toggleFavorite,
        isFavorite,
        count: favorites.length,
        isLoading,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites(): FavoritesContextType {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within FavoritesProvider");
  }
  return context;
}
