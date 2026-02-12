import { useState, useEffect } from "react";
import { Bell, BellOff, BellRing, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

// Extend ServiceWorkerRegistration to include pushManager (Web Push API)
interface PushServiceWorkerRegistration extends ServiceWorkerRegistration {
  pushManager: PushManager;
}

// VAPID public key from environment
const VAPID_PUBLIC_KEY = "BE1o7iDQKgenj79UhKKpfX9oStS919wl_p35oP3DRUxSbd0HT3-1FIjHd-EIIHOvI5eWB5fc8J52s0DSbH_clt8";

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, "+")
    .replace(/_/g, "/");
  
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export function PushNotificationSettings() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [permissionState, setPermissionState] = useState<NotificationPermission>("default");

  useEffect(() => {
    checkSubscriptionStatus();
  }, [user]);

  const checkSubscriptionStatus = async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      // Check browser permission
      if ("Notification" in window) {
        setPermissionState(Notification.permission);
      }

      // Check if service worker is registered
      if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
        setIsLoading(false);
        return;
      }

      const registration = await navigator.serviceWorker.ready as PushServiceWorkerRegistration;
      const subscription = await registration.pushManager.getSubscription();

      if (subscription) {
        // Check if subscription exists in database
        const { data } = await supabase
          .from("push_subscriptions")
          .select("id")
          .eq("user_id", user.id)
          .eq("endpoint", subscription.endpoint)
          .maybeSingle();

        setIsSubscribed(!!data);
      } else {
        setIsSubscribed(false);
      }
    } catch (error) {
      console.error("Error checking subscription:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const subscribe = async () => {
    if (!user) {
      toast({
        title: "Ошибка",
        description: "Необходимо авторизоваться",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Request notification permission
      const permission = await Notification.requestPermission();
      setPermissionState(permission);

      if (permission !== "granted") {
        toast({
          title: "Уведомления заблокированы",
          description: "Разрешите уведомления в настройках браузера",
          variant: "destructive",
        });
        return;
      }

      // Get service worker registration
      const registration = await navigator.serviceWorker.ready as PushServiceWorkerRegistration;

      // Subscribe to push
      const applicationServerKey = urlBase64ToUint8Array(VAPID_PUBLIC_KEY);
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: applicationServerKey.buffer as ArrayBuffer,
      });

      // Extract keys
      const p256dh = subscription.getKey("p256dh");
      const auth = subscription.getKey("auth");

      if (!p256dh || !auth) {
        throw new Error("Failed to get subscription keys");
      }

      // Convert ArrayBuffer to base64
      const p256dhBase64 = btoa(String.fromCharCode(...new Uint8Array(p256dh as ArrayBuffer)));
      const authBase64 = btoa(String.fromCharCode(...new Uint8Array(auth as ArrayBuffer)));

      // Save to database
      const { error } = await supabase.from("push_subscriptions").insert({
        user_id: user.id,
        endpoint: subscription.endpoint,
        p256dh: p256dhBase64,
        auth: authBase64,
      });

      if (error) throw error;

      setIsSubscribed(true);
      toast({
        title: "Уведомления включены ✓",
        description: "Вы будете получать уведомления о новых заказах",
      });
    } catch (error) {
      console.error("Subscribe error:", error);
      toast({
        title: "Ошибка подписки",
        description: error instanceof Error ? error.message : "Попробуйте ещё раз",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const unsubscribe = async () => {
    if (!user) return;

    setIsProcessing(true);

    try {
      const registration = await navigator.serviceWorker.ready as PushServiceWorkerRegistration;
      const subscription = await registration.pushManager.getSubscription();

      if (subscription) {
        // Unsubscribe from push
        await subscription.unsubscribe();

        // Remove from database
        await supabase
          .from("push_subscriptions")
          .delete()
          .eq("user_id", user.id)
          .eq("endpoint", subscription.endpoint);
      }

      setIsSubscribed(false);
      toast({
        title: "Уведомления отключены",
        description: "Вы больше не будете получать push-уведомления",
      });
    } catch (error) {
      console.error("Unsubscribe error:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось отключить уведомления",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const testNotification = async () => {
    setIsProcessing(true);

    try {
      const { data, error } = await supabase.functions.invoke("send-push", {
        body: {
          order_number: "TEST-001",
          customer_name: "Тестовый клиент",
          total_amount: 15000,
        },
      });

      if (error) throw error;

      toast({
        title: "Тестовое уведомление отправлено",
        description: `Отправлено: ${data?.sent || 0}, Ошибок: ${data?.failed || 0}`,
      });
    } catch (error) {
      console.error("Test push error:", error);
      toast({
        title: "Ошибка теста",
        description: error instanceof Error ? error.message : "Проверьте консоль",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Check if push is supported
  const isPushSupported = "serviceWorker" in navigator && "PushManager" in window;

  if (!isPushSupported) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BellOff className="h-5 w-5 text-muted-foreground" />
            Push-уведомления
          </CardTitle>
          <CardDescription>
            Push-уведомления не поддерживаются в вашем браузере
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-primary" />
          Push-уведомления
          {isSubscribed && (
            <Badge variant="secondary" className="ml-2">
              Активно
            </Badge>
          )}
        </CardTitle>
        <CardDescription>
          Получайте мгновенные уведомления о новых заказах прямо в браузере
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                {isSubscribed ? (
                  <BellRing className="h-8 w-8 text-secondary" />
                ) : (
                  <BellOff className="h-8 w-8 text-muted-foreground" />
                )}
                <div>
                  <p className="font-medium">
                    {isSubscribed ? "Уведомления включены" : "Уведомления отключены"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {isSubscribed
                      ? "Вы получаете уведомления о новых заказах"
                      : "Включите, чтобы не пропустить заказы"}
                  </p>
                </div>
              </div>

              <Button
                variant={isSubscribed ? "outline" : "default"}
                onClick={isSubscribed ? unsubscribe : subscribe}
                disabled={isProcessing || permissionState === "denied"}
              >
                {isProcessing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : isSubscribed ? (
                  "Отключить"
                ) : (
                  "Включить"
                )}
              </Button>
            </div>

            {permissionState === "denied" && (
              <p className="text-sm text-destructive">
                Уведомления заблокированы в настройках браузера. Разрешите их, чтобы подписаться.
              </p>
            )}

            {isSubscribed && (
              <Button
                variant="secondary"
                size="sm"
                onClick={testNotification}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Bell className="h-4 w-4 mr-2" />
                )}
                Отправить тестовое уведомление
              </Button>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
