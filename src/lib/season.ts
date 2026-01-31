import { supabase } from "@/integrations/supabase/client";

export type Season = "summer" | "winter";
export type SeasonMode = "auto" | "summer" | "winter";

/**
 * Determines current season based on calendar month
 * Summer: May (5) - September (9)
 * Winter: October (10) - April (4)
 */
export function getCalendarSeason(): Season {
  const month = new Date().getMonth() + 1; // 1-12
  return month >= 5 && month <= 9 ? "summer" : "winter";
}

/**
 * Gets effective season based on mode
 */
export function getEffectiveSeason(mode: SeasonMode): Season {
  if (mode === "auto") {
    return getCalendarSeason();
  }
  return mode;
}

/**
 * Applies season class to document root
 */
export function applySeason(season: Season): void {
  const root = document.documentElement;
  
  if (season === "winter") {
    root.classList.add("winter");
  } else {
    root.classList.remove("winter");
  }
}

/**
 * Fetches season mode from database
 */
export async function fetchSeasonMode(): Promise<SeasonMode> {
  try {
    const { data, error } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", "season_mode")
      .single();
    
    if (error || !data) {
      return "auto";
    }
    
    const value = data.value as string;
    if (value === "summer" || value === "winter" || value === "auto") {
      return value;
    }
    
    return "auto";
  } catch {
    return "auto";
  }
}

/**
 * Updates season mode in database (admin only)
 */
export async function updateSeasonMode(mode: SeasonMode): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("site_settings")
      .update({ value: JSON.stringify(mode) })
      .eq("key", "season_mode");
    
    return !error;
  } catch {
    return false;
  }
}

/**
 * Season-specific content helpers
 */
export const seasonConfig = {
  summer: {
    heroTitle: "Лето на двух колёсах",
    heroSubtitle: "Велосипеды и самокаты для активного отдыха",
    bannerImage: "/images/summer-banner.jpg",
    accent: "Летняя коллекция",
  },
  winter: {
    heroTitle: "Зимние приключения",
    heroSubtitle: "Санки, тюбинги и зимний транспорт",
    bannerImage: "/images/winter-banner.jpg",
    accent: "Зимняя коллекция",
  },
} as const;
