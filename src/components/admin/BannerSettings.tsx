import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Image, Save, Loader2, Sun, Snowflake, Phone, MapPin, ArrowRight, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { SingleImageUpload } from "./SingleImageUpload";

interface BannerContent {
  summer: {
    title: string;
    titleLine2: string;
    titleLine3: string;
    subtitle: string;
    description: string;
    quizButtonText: string;
    imageUrl: string;
    phone: string;
    city: string;
  };
  winter: {
    title: string;
    titleLine2: string;
    titleLine3: string;
    subtitle: string;
    description: string;
    quizButtonText: string;
    imageUrl: string;
    phone: string;
    city: string;
  };
}

const defaultBannerContent: BannerContent = {
  summer: {
    title: "Велосипеды и",
    titleLine2: "самокаты",
    titleLine3: "для всей семьи",
    subtitle: "доставка по всей России.",
    description: "От городских прогулок до экстремальных поездок – найдите свой идеальный велосипед в Уссурийске!",
    quizButtonText: "🎯 Подобрать велосипед",
    imageUrl: "https://274418.selcdn.ru/cv08300-33250f0d-0664-43fc-9dbf-9d89738d114e/uploads/521356/653fe1a0-538e-4f32-802a-654787767f95.jpg",
    phone: "+7 924-788-11-11",
    city: "г. Уссурийск",
  },
  winter: {
    title: "Зимние товары",
    titleLine2: "для всей семьи",
    titleLine3: "❄️",
    subtitle: "доставка по всей России.",
    description: "Тюбинги, санки, ёлки и новогодний декор – всё для зимних радостей!",
    quizButtonText: "🎄 Подобрать подарок",
    imageUrl: "https://images.unsplash.com/photo-1545048702-79362596cdc9?w=600",
    phone: "+7 924-788-11-11",
    city: "г. Уссурийск",
  },
};

// Preview component for the banner
function BannerPreview({ content, season }: { content: BannerContent["summer"]; season: "summer" | "winter" }) {
  const isWinter = season === "winter";
  
  return (
    <div className={`relative overflow-hidden rounded-xl ${isWinter ? "bg-gradient-to-br from-sky-500 to-blue-600" : "bg-gradient-to-br from-orange-400 to-amber-500"}`}>
      <div className="relative z-10 p-4 sm:p-6">
        <div className="grid lg:grid-cols-2 gap-4 items-center">
          {/* Text */}
          <div className="space-y-2 text-white">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-black leading-tight">
              {content.title || "Заголовок"}{" "}
              <span className="block">{content.titleLine2 || "строка 2"}</span>
              <span className="block opacity-90">{content.titleLine3 || "строка 3"}</span>
            </h2>
            
            <p className="text-xs sm:text-sm opacity-80">
              {content.subtitle || "Подзаголовок"}
            </p>
            
            <p className="text-xs opacity-70 hidden sm:block">
              {content.description || "Описание..."}
            </p>
            
            <div className="flex flex-wrap gap-2 pt-2">
              <div className="bg-yellow-400 text-black text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1">
                Каталог
                <ArrowRight className="h-3 w-3" />
              </div>
              <div className="bg-white/90 text-black text-xs font-medium px-3 py-1.5 rounded-lg">
                {content.quizButtonText || "Квиз"}
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-2 text-xs opacity-80">
              <span className="flex items-center gap-1">
                <Phone className="h-3 w-3" />
                {content.phone || "+7 000-000-00-00"}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {content.city || "Город"}
              </span>
            </div>
          </div>

          {/* Image */}
          <div className="hidden lg:flex justify-center">
            {content.imageUrl ? (
              <img 
                src={content.imageUrl}
                alt="Preview"
                className="w-32 h-32 object-contain drop-shadow-lg"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/placeholder.svg";
                }}
              />
            ) : (
              <div className="w-32 h-32 bg-white/20 rounded-xl flex items-center justify-center">
                <Image className="h-12 w-12 text-white/50" />
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
      
      {/* Season indicator */}
      <div className="absolute top-2 right-2 bg-white/20 backdrop-blur-sm rounded-full p-1.5">
        {isWinter ? (
          <Snowflake className="h-4 w-4 text-white" />
        ) : (
          <Sun className="h-4 w-4 text-white" />
        )}
      </div>
    </div>
  );
}

export function BannerSettings() {
  const queryClient = useQueryClient();
  const [content, setContent] = useState<BannerContent>(defaultBannerContent);
  const [activeSeason, setActiveSeason] = useState<"summer" | "winter">("summer");
  const [showPreview, setShowPreview] = useState(true);

  const { data: savedContent, isLoading } = useQuery({
    queryKey: ["banner-settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_settings")
        .select("value")
        .eq("key", "banner_content")
        .maybeSingle();

      if (error) throw error;
      return data?.value as unknown as BannerContent | null;
    },
  });

  useEffect(() => {
    if (savedContent) {
      setContent({
        summer: { ...defaultBannerContent.summer, ...savedContent.summer },
        winter: { ...defaultBannerContent.winter, ...savedContent.winter },
      });
    }
  }, [savedContent]);

  const saveMutation = useMutation({
    mutationFn: async (newContent: BannerContent) => {
      const { data: existing } = await supabase
        .from("site_settings")
        .select("id")
        .eq("key", "banner_content")
        .maybeSingle();

      if (existing) {
        const { error } = await supabase
          .from("site_settings")
          .update({ value: newContent as unknown as Record<string, never> })
          .eq("key", "banner_content");
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("site_settings")
          .insert([{ key: "banner_content", value: newContent as unknown as Record<string, never> }]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["banner-settings"] });
      queryClient.invalidateQueries({ queryKey: ["banner-content"] });
      toast.success("Настройки баннера сохранены");
    },
    onError: (err: Error) => {
      toast.error("Ошибка: " + err.message);
    },
  });

  const updateField = (season: "summer" | "winter", field: keyof BannerContent["summer"], value: string) => {
    setContent((prev) => ({
      ...prev,
      [season]: {
        ...prev[season],
        [field]: value,
      },
    }));
  };

  const handleSave = () => {
    saveMutation.mutate(content);
  };

  const currentSeason = content[activeSeason];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Image className="h-5 w-5 text-primary" />
              Редактор баннера
            </CardTitle>
            <CardDescription>
              Настройте содержимое главного баннера для летнего и зимнего сезонов
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowPreview(!showPreview)}
            className="gap-2"
          >
            {showPreview ? (
              <>
                <EyeOff className="h-4 w-4" />
                <span className="hidden sm:inline">Скрыть</span>
              </>
            ) : (
              <>
                <Eye className="h-4 w-4" />
                <span className="hidden sm:inline">Предпросмотр</span>
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Live Preview */}
            {showPreview && (
              <div className="space-y-2">
                <Label className="text-muted-foreground text-xs uppercase tracking-wide">
                  Предпросмотр в реальном времени
                </Label>
                <BannerPreview content={currentSeason} season={activeSeason} />
              </div>
            )}

            <Tabs value={activeSeason} onValueChange={(v) => setActiveSeason(v as "summer" | "winter")}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="summer" className="gap-2">
                  <Sun className="h-4 w-4" />
                  Лето
                </TabsTrigger>
                <TabsTrigger value="winter" className="gap-2">
                  <Snowflake className="h-4 w-4" />
                  Зима
                </TabsTrigger>
              </TabsList>

              <TabsContent value={activeSeason} className="space-y-4 mt-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Заголовок (строка 1)</Label>
                    <Input
                      value={currentSeason.title}
                      onChange={(e) => updateField(activeSeason, "title", e.target.value)}
                      placeholder="Велосипеды и"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Заголовок (строка 2)</Label>
                    <Input
                      value={currentSeason.titleLine2}
                      onChange={(e) => updateField(activeSeason, "titleLine2", e.target.value)}
                      placeholder="самокаты"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Заголовок (строка 3)</Label>
                  <Input
                    value={currentSeason.titleLine3}
                    onChange={(e) => updateField(activeSeason, "titleLine3", e.target.value)}
                    placeholder="для всей семьи"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Подзаголовок</Label>
                  <Input
                    value={currentSeason.subtitle}
                    onChange={(e) => updateField(activeSeason, "subtitle", e.target.value)}
                    placeholder="доставка по всей России."
                  />
                </div>

                <div className="space-y-2">
                  <Label>Описание</Label>
                  <Textarea
                    value={currentSeason.description}
                    onChange={(e) => updateField(activeSeason, "description", e.target.value)}
                    placeholder="Описание..."
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Текст кнопки "Квиз"</Label>
                  <Input
                    value={currentSeason.quizButtonText}
                    onChange={(e) => updateField(activeSeason, "quizButtonText", e.target.value)}
                    placeholder="🎯 Подобрать велосипед"
                  />
                </div>

                <SingleImageUpload
                  imageUrl={currentSeason.imageUrl}
                  onImageChange={(url) => updateField(activeSeason, "imageUrl", url)}
                  folder={`banners/${activeSeason}`}
                  label={`Изображение баннера (${activeSeason === "summer" ? "лето" : "зима"})`}
                />

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Телефон</Label>
                    <Input
                      value={currentSeason.phone}
                      onChange={(e) => updateField(activeSeason, "phone", e.target.value)}
                      placeholder="+7 924-788-11-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Город</Label>
                    <Input
                      value={currentSeason.city}
                      onChange={(e) => updateField(activeSeason, "city", e.target.value)}
                      placeholder="г. Уссурийск"
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="pt-4 border-t">
              <Button onClick={handleSave} disabled={saveMutation.isPending}>
                {saveMutation.isPending ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Сохранить баннер
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
