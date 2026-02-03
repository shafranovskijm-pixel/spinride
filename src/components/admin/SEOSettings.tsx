import { useState, useEffect } from "react";
import { Search, Save, Plus, X, Loader2, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface SEOData {
  title: string;
  description: string;
  keywords: string[];
  og_image: string;
}

const DEFAULT_SEO: SEOData = {
  title: "SPINRIDE — магазин самокатов и велосипедов",
  description: "Купить самокат или велосипед. Широкий выбор, доступные цены.",
  keywords: [],
  og_image: "",
};

export function SEOSettings() {
  const { toast } = useToast();
  const [seoData, setSeoData] = useState<SEOData>(DEFAULT_SEO);
  const [newKeyword, setNewKeyword] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchSEOSettings();
  }, []);

  const fetchSEOSettings = async () => {
    try {
      const { data, error } = await supabase
        .from("site_settings")
        .select("value")
        .eq("key", "seo_global")
        .maybeSingle();

      if (error) throw error;

      if (data?.value) {
        const parsed = typeof data.value === "string" 
          ? JSON.parse(data.value) 
          : data.value;
        setSeoData({
          title: parsed.title || DEFAULT_SEO.title,
          description: parsed.description || DEFAULT_SEO.description,
          keywords: Array.isArray(parsed.keywords) ? parsed.keywords : [],
          og_image: parsed.og_image || "",
        });
      }
    } catch (error) {
      console.error("Error fetching SEO settings:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить SEO-настройки",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const saveSEOSettings = async () => {
    setIsSaving(true);
    try {
      // First check if record exists
      const { data: existing } = await supabase
        .from("site_settings")
        .select("id")
        .eq("key", "seo_global")
        .maybeSingle();

      let error;
      if (existing) {
        // Update existing
        const result = await supabase
          .from("site_settings")
          .update({ value: seoData as unknown as Record<string, unknown>, updated_at: new Date().toISOString() })
          .eq("key", "seo_global");
        error = result.error;
      } else {
        // Insert new
        const result = await supabase
          .from("site_settings")
          .insert({ key: "seo_global", value: seoData as unknown as Record<string, unknown> });
        error = result.error;
      }

      if (error) throw error;

      toast({
        title: "SEO-настройки сохранены ✓",
        description: "Изменения применены к сайту",
      });
    } catch (error) {
      console.error("Error saving SEO settings:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось сохранить настройки",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const addKeyword = () => {
    const keyword = newKeyword.trim().toLowerCase();
    if (keyword && !seoData.keywords.includes(keyword)) {
      if (keyword.length > 50) {
        toast({
          title: "Слишком длинное слово",
          description: "Максимум 50 символов",
          variant: "destructive",
        });
        return;
      }
      setSeoData(prev => ({
        ...prev,
        keywords: [...prev.keywords, keyword],
      }));
      setNewKeyword("");
    }
  };

  const removeKeyword = (keyword: string) => {
    setSeoData(prev => ({
      ...prev,
      keywords: prev.keywords.filter(k => k !== keyword),
    }));
  };

  const handleKeywordKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addKeyword();
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5 text-primary" />
          SEO-настройки
        </CardTitle>
        <CardDescription>
          Управление мета-тегами и ключевыми словами для поисковой оптимизации
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Title */}
        <div className="space-y-2">
          <Label htmlFor="seo-title">
            Заголовок сайта (title)
            <span className="text-xs text-muted-foreground ml-2">
              {seoData.title.length}/60 символов
            </span>
          </Label>
          <Input
            id="seo-title"
            value={seoData.title}
            onChange={(e) => setSeoData(prev => ({ ...prev, title: e.target.value.slice(0, 70) }))}
            placeholder="SPINRIDE — магазин самокатов и велосипедов"
            maxLength={70}
          />
          {seoData.title.length > 60 && (
            <p className="text-xs text-destructive">
              Рекомендуется до 60 символов для корректного отображения в поиске
            </p>
          )}
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="seo-description">
            Описание (meta description)
            <span className="text-xs text-muted-foreground ml-2">
              {seoData.description.length}/160 символов
            </span>
          </Label>
          <Textarea
            id="seo-description"
            value={seoData.description}
            onChange={(e) => setSeoData(prev => ({ ...prev, description: e.target.value.slice(0, 200) }))}
            placeholder="Описание сайта для поисковых систем..."
            rows={3}
            maxLength={200}
          />
          {seoData.description.length > 160 && (
            <p className="text-xs text-destructive">
              Рекомендуется до 160 символов
            </p>
          )}
        </div>

        {/* Keywords */}
        <div className="space-y-2">
          <Label>
            Ключевые слова
            <span className="text-xs text-muted-foreground ml-2">
              ({seoData.keywords.length} слов)
            </span>
          </Label>
          
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                onKeyDown={handleKeywordKeyDown}
                placeholder="Добавить ключевое слово..."
                className="pl-9"
                maxLength={50}
              />
            </div>
            <Button 
              type="button" 
              variant="secondary" 
              onClick={addKeyword}
              disabled={!newKeyword.trim()}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {seoData.keywords.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {seoData.keywords.map((keyword) => (
                <Badge 
                  key={keyword} 
                  variant="secondary"
                  className="pl-3 pr-1 py-1 flex items-center gap-1"
                >
                  {keyword}
                  <button
                    type="button"
                    onClick={() => removeKeyword(keyword)}
                    className="ml-1 p-0.5 hover:bg-muted rounded"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}

          <p className="text-xs text-muted-foreground">
            Добавьте слова, по которым пользователи могут искать ваш магазин
          </p>
        </div>

        {/* OG Image */}
        <div className="space-y-2">
          <Label htmlFor="seo-og-image">
            Изображение для соцсетей (Open Graph)
          </Label>
          <Input
            id="seo-og-image"
            value={seoData.og_image}
            onChange={(e) => setSeoData(prev => ({ ...prev, og_image: e.target.value }))}
            placeholder="https://example.com/og-image.jpg"
            type="url"
          />
          <p className="text-xs text-muted-foreground">
            Рекомендуемый размер: 1200×630 пикселей
          </p>
        </div>

        {/* Preview */}
        <div className="border rounded-lg p-4 bg-muted/30 space-y-2">
          <p className="text-xs text-muted-foreground font-medium">Предпросмотр в Google:</p>
          <div className="space-y-1">
            <p className="text-primary text-lg leading-tight line-clamp-1">
              {seoData.title || "Заголовок сайта"}
            </p>
            <p className="text-xs text-secondary">spinride.lovable.app</p>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {seoData.description || "Описание сайта..."}
            </p>
          </div>
        </div>

        {/* Save button */}
        <Button onClick={saveSEOSettings} disabled={isSaving} className="w-full sm:w-auto">
          {isSaving ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          Сохранить SEO-настройки
        </Button>
      </CardContent>
    </Card>
  );
}
