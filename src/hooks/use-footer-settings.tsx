import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface FooterSettings {
  description: string;
  phone: string;
  address: string;
  email: string;
  work_hours: string;
  social: {
    telegram?: string;
    instagram?: string;
    vk?: string;
    whatsapp?: string;
  };
  catalog_links: {
    title: string;
    url: string;
  }[];
  info_links: {
    title: string;
    url: string;
    highlight?: boolean;
  }[];
  copyright_text: string;
}

const DEFAULT_FOOTER: FooterSettings = {
  description: "Велосипеды и самокаты для всей семьи. От городских прогулок до экстремальных поездок.",
  phone: "+7 924-788-11-11",
  address: "г. Уссурийск, ул. Пушкина, 13",
  email: "info@spinride.ru",
  work_hours: "Пн-Вс: 10:00 - 19:00",
  social: {
    telegram: "https://t.me/actionprim",
    instagram: "https://instagram.com/spinride",
  },
  catalog_links: [
    { title: "Велосипеды", url: "/catalog/bicycles" },
    { title: "Электровелосипеды", url: "/catalog/e-bikes" },
    { title: "Электросамокаты", url: "/catalog/e-scooters" },
    { title: "BMX", url: "/catalog/bmx" },
    { title: "Детям", url: "/catalog/kids" },
    { title: "Аксессуары", url: "/catalog/accessories" },
  ],
  info_links: [
    { title: "О магазине", url: "/about" },
    { title: "Доставка и оплата", url: "/delivery" },
    { title: "Гарантия", url: "/warranty" },
    { title: "Контакты", url: "/contacts" },
    { title: "🎯 Подобрать велосипед", url: "/quiz", highlight: true },
  ],
  copyright_text: "SPINRIDE. Все права защищены.",
};

export function useFooterSettings() {
  return useQuery({
    queryKey: ["site-settings", "footer"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_settings")
        .select("value")
        .eq("key", "footer")
        .maybeSingle();

      if (error) throw error;
      
      if (data?.value) {
        return { ...DEFAULT_FOOTER, ...(data.value as unknown as Partial<FooterSettings>) };
      }
      return DEFAULT_FOOTER;
    },
  });
}

export function useUpdateFooterSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (settings: FooterSettings) => {
      // Check if footer settings exist
      const { data: existing } = await supabase
        .from("site_settings")
        .select("id")
        .eq("key", "footer")
        .maybeSingle();

      if (existing) {
        const { error } = await supabase
          .from("site_settings")
          .update({ value: settings as any })
          .eq("key", "footer");
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("site_settings")
          .insert({ key: "footer", value: settings as any });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["site-settings", "footer"] });
      toast.success("Настройки футера сохранены");
    },
    onError: (error) => {
      console.error("Error saving footer settings:", error);
      toast.error("Ошибка сохранения настроек");
    },
  });
}
