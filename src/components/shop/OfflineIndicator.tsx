import { WifiOff, RefreshCw, Cloud, CloudOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useOnlineStatus } from '@/hooks/use-online-status';
import { cn } from '@/lib/utils';

export function OfflineIndicator() {
  const { isOnline, isSyncing, pendingCount, processQueue } = useOnlineStatus();

  // Don't show anything if online and nothing pending
  if (isOnline && pendingCount === 0 && !isSyncing) {
    return null;
  }

  return (
    <div
      className={cn(
        'fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-full px-4 py-2 shadow-lg transition-all duration-300',
        isOnline 
          ? 'bg-primary text-primary-foreground' 
          : 'bg-destructive text-destructive-foreground'
      )}
    >
      {isOnline ? (
        <>
          {isSyncing ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin" />
              <span className="text-sm font-medium">Синхронизация...</span>
            </>
          ) : pendingCount > 0 ? (
            <>
              <Cloud className="h-4 w-4" />
              <span className="text-sm font-medium">
                Ожидает синхронизации
              </span>
              <Badge variant="secondary" className="ml-1">
                {pendingCount}
              </Badge>
              <Button 
                size="sm" 
                variant="ghost" 
                className="h-6 px-2 text-xs"
                onClick={() => processQueue()}
              >
                Синхронизировать
              </Button>
            </>
          ) : null}
        </>
      ) : (
        <>
          <WifiOff className="h-4 w-4" />
          <span className="text-sm font-medium">Офлайн</span>
          {pendingCount > 0 && (
            <Badge variant="secondary" className="ml-1 bg-white/20">
              {pendingCount} в очереди
            </Badge>
          )}
        </>
      )}
    </div>
  );
}

// Compact version for header
export function OfflineStatusBadge() {
  const { isOnline, isSyncing, pendingCount } = useOnlineStatus();

  if (isOnline && pendingCount === 0 && !isSyncing) {
    return null;
  }

  return (
    <div
      className={cn(
        'flex items-center gap-1.5 rounded-full px-2 py-1 text-xs font-medium',
        isOnline 
          ? 'bg-primary/10 text-primary' 
          : 'bg-destructive/10 text-destructive'
      )}
    >
      {isOnline ? (
        isSyncing ? (
          <>
            <RefreshCw className="h-3 w-3 animate-spin" />
            <span>Синхронизация</span>
          </>
        ) : (
          <>
            <CloudOff className="h-3 w-3" />
            <span>{pendingCount}</span>
          </>
        )
      ) : (
        <>
          <WifiOff className="h-3 w-3" />
          <span>Офлайн</span>
        </>
      )}
    </div>
  );
}
