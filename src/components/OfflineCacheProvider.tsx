import { useOfflineCache } from '@/hooks/use-offline-cache';

export function OfflineCacheProvider({ children }: { children: React.ReactNode }) {
  // Initialize offline caching
  useOfflineCache();
  
  return <>{children}</>;
}
