import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { 
  Season, 
  SeasonMode, 
  getEffectiveSeason, 
  applySeason, 
  fetchSeasonMode,
  seasonConfig
} from "@/lib/season";

type SeasonConfig = {
  heroTitle: string;
  heroSubtitle: string;
  bannerImage: string;
  accent: string;
};

interface SeasonContextType {
  season: Season;
  mode: SeasonMode;
  isLoading: boolean;
  config: SeasonConfig;
}

const SeasonContext = createContext<SeasonContextType | undefined>(undefined);

export function SeasonProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<SeasonMode>("auto");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadSeason() {
      const fetchedMode = await fetchSeasonMode();
      setMode(fetchedMode);
      const effectiveSeason = getEffectiveSeason(fetchedMode);
      applySeason(effectiveSeason);
      setIsLoading(false);
    }
    
    loadSeason();
  }, []);

  const season = getEffectiveSeason(mode);
  const config = seasonConfig[season];

  return (
    <SeasonContext.Provider value={{ season, mode, isLoading, config }}>
      <div className="season-transition">
        {children}
      </div>
    </SeasonContext.Provider>
  );
}

export function useSeason(): SeasonContextType {
  const context = useContext(SeasonContext);
  if (!context) {
    throw new Error("useSeason must be used within SeasonProvider");
  }
  return context;
}
