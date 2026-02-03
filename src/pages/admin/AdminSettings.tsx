import { useState, useEffect } from "react";
import { Sun, Snowflake, RefreshCw, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { PushNotificationSettings } from "@/components/admin/PushNotificationSettings";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { getCalendarSeason, applySeason, SeasonMode } from "@/lib/season";
import { cn } from "@/lib/utils";

export default function AdminSettings() {
  const [seasonMode, setSeasonMode] = useState<SeasonMode>("auto");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const calendarSeason = getCalendarSeason();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from("site_settings")
        .select("value")
        .eq("key", "season_mode")
        .maybeSingle();

      if (error) throw error;
      
      if (data) {
        const value = typeof data.value === "string" 
          ? data.value.replace(/"/g, "") 
          : data.value;
        if (value === "auto" || value === "summer" || value === "winter") {
          setSeasonMode(value);
        }
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from("site_settings")
        .update({ value: JSON.stringify(seasonMode) })
        .eq("key", "season_mode");

      if (error) throw error;

      // Apply the season immediately
      const effectiveSeason = seasonMode === "auto" ? calendarSeason : seasonMode;
      applySeason(effectiveSeason);

      toast({
        title: "Настройки сохранены",
        description: `Режим сезона: ${seasonMode === "auto" ? "Автоматический" : seasonMode === "summer" ? "Лето" : "Зима"}`,
      });
    } catch (error) {
      console.error("Error saving settings:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось сохранить настройки",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const effectiveSeason = seasonMode === "auto" ? calendarSeason : seasonMode;

  return (
    <AdminLayout title="Настройки" subtitle="Управление настройками сайта">
      <div className="max-w-2xl space-y-6">
        {/* Push notifications */}
        <PushNotificationSettings />
        
        {/* Season settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {effectiveSeason === "summer" ? (
                <Sun className="h-5 w-5 text-primary" />
              ) : (
                <Snowflake className="h-5 w-5 text-primary" />
              )}
              Сезонный режим
            </CardTitle>
            <CardDescription>
              Настройте, как сайт определяет текущий сезон для отображения тематического дизайна и товаров
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {loading ? (
              <div className="text-center py-4 text-muted-foreground">Загрузка...</div>
            ) : (
              <>
                <RadioGroup value={seasonMode} onValueChange={(v) => setSeasonMode(v as SeasonMode)}>
                  <div 
                    className={cn(
                      "flex items-start space-x-4 p-4 border rounded-lg cursor-pointer hover:bg-muted/50",
                      seasonMode === "auto" && "ring-2 ring-primary bg-primary/5"
                    )}
                    onClick={() => setSeasonMode("auto")}
                  >
                    <RadioGroupItem value="auto" id="auto" className="mt-1" />
                    <div className="flex-1">
                      <Label htmlFor="auto" className="font-medium cursor-pointer flex items-center gap-2">
                        <RefreshCw className="h-4 w-4" />
                        Автоматически
                      </Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        Лето: май — сентябрь, Зима: октябрь — апрель.
                        <br />
                        <span className="text-xs">
                          Сейчас по календарю: <strong>{calendarSeason === "summer" ? "Лето" : "Зима"}</strong>
                        </span>
                      </p>
                    </div>
                  </div>

                  <div 
                    className={cn(
                      "flex items-start space-x-4 p-4 border rounded-lg cursor-pointer hover:bg-muted/50",
                      seasonMode === "summer" && "ring-2 ring-primary bg-primary/5"
                    )}
                    onClick={() => setSeasonMode("summer")}
                  >
                    <RadioGroupItem value="summer" id="summer" className="mt-1" />
                    <div className="flex-1">
                      <Label htmlFor="summer" className="font-medium cursor-pointer flex items-center gap-2">
                        <Sun className="h-4 w-4 text-primary" />
                        Летний режим
                      </Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        Оранжево-зелёные акценты, летние товары на главной
                      </p>
                    </div>
                  </div>

                  <div 
                    className={cn(
                      "flex items-start space-x-4 p-4 border rounded-lg cursor-pointer hover:bg-muted/50",
                      seasonMode === "winter" && "ring-2 ring-primary bg-primary/5"
                    )}
                    onClick={() => setSeasonMode("winter")}
                  >
                    <RadioGroupItem value="winter" id="winter" className="mt-1" />
                    <div className="flex-1">
                      <Label htmlFor="winter" className="font-medium cursor-pointer flex items-center gap-2">
                        <Snowflake className="h-4 w-4 text-blue-500" />
                        Зимний режим
                      </Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        Синие тона, зимние товары на главной
                      </p>
                    </div>
                  </div>
                </RadioGroup>

                    <div className="pt-4 border-t">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="font-medium">Предпросмотр</p>
                          <p className="text-sm text-muted-foreground">
                            Текущий активный сезон: <strong>{effectiveSeason === "summer" ? "Лето ☀️" : "Зима ❄️"}</strong>
                          </p>
                        </div>
                        <div 
                          className={cn(
                            "w-20 h-12 rounded-lg flex items-center justify-center text-2xl",
                            effectiveSeason === "summer" 
                              ? "bg-gradient-to-r from-primary to-secondary" 
                              : "bg-gradient-to-r from-accent to-primary"
                          )}
                        >
                          {effectiveSeason === "summer" ? "☀️" : "❄️"}
                        </div>
                      </div>

                  <Button onClick={saveSettings} disabled={saving}>
                    <Save className="h-4 w-4 mr-2" />
                    {saving ? "Сохранение..." : "Сохранить настройки"}
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Store info */}
        <Card>
          <CardHeader>
            <CardTitle>Информация о магазине</CardTitle>
            <CardDescription>
              Контактные данные и адрес магазина
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Название:</span>
                <span className="font-medium">SPINRIDE</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Телефон:</span>
                <span className="font-medium">+7 (999) 123-45-67</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Адрес:</span>
                <span className="font-medium">г. Уссурийск, ул. Комсомольская, 29</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Email:</span>
                <span className="font-medium">info@spinride.ru</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
