import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface WarrantyContent {
  warranty_periods: { category: string; period: string }[];
  coverage: string[];
  requirements: string[];
  exclusions: string[];
  contact_phone: string;
  contact_email: string;
  processing_note: string;
}

export interface DeliveryMethodItem {
  icon: string;
  title: string;
  description: string;
  details: string[];
  badge?: string;
}

export interface PaymentMethodItem {
  icon: string;
  title: string;
  description: string;
  details: string;
}

export interface DeliveryZoneItem {
  region: string;
  time: string;
  price: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface DeliveryContent {
  delivery_methods: DeliveryMethodItem[];
  payment_methods: PaymentMethodItem[];
  delivery_zones: DeliveryZoneItem[];
  faq: FaqItem[];
  important_note: string;
  contact_phone: string;
  contact_hours: string;
}

export interface FeatureItem {
  icon: string;
  title: string;
  description: string;
}

export interface TeamMemberItem {
  name: string;
  role: string;
  description: string;
  avatar?: string;
}

export interface AboutContent {
  story: string[];
  features: FeatureItem[];
  team: TeamMemberItem[];
  store_image: string;
  badge_text: string;
  badge_subtext: string;
  address: string;
  phone: string;
  email: string;
  work_hours: string;
  map_url: string;
}

export interface ContactsContent {
  address: string;
  phone: string;
  email: string;
  work_hours: string;
  social: {
    telegram?: string;
    whatsapp?: string;
    vk?: string;
    instagram?: string;
  };
}

// Use unknown for content since it varies by page type
export interface PageContent {
  id: string;
  page_key: string;
  title: string;
  subtitle: string | null;
  content: unknown;
  updated_at: string;
  created_at: string;
}

export function usePageContent(pageKey: string) {
  return useQuery({
    queryKey: ["page-content", pageKey],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("page_content")
        .select("*")
        .eq("page_key", pageKey)
        .maybeSingle();

      if (error) throw error;
      return data as unknown as PageContent | null;
    },
  });
}

export function useAllPageContent() {
  return useQuery({
    queryKey: ["page-content"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("page_content")
        .select("*")
        .order("page_key");

      if (error) throw error;
      return data as unknown as PageContent[];
    },
  });
}

export function useUpdatePageContent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<PageContent> & { id: string }) => {
      const { id, title, subtitle, content } = data;
      const updateData: Record<string, unknown> = {};
      if (title !== undefined) updateData.title = title;
      if (subtitle !== undefined) updateData.subtitle = subtitle;
      if (content !== undefined) updateData.content = content;

      const { error } = await supabase
        .from("page_content")
        .update(updateData)
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["page-content"] });
      toast.success("Контент страницы сохранён");
    },
    onError: (error) => {
      console.error("Error updating page content:", error);
      toast.error("Ошибка сохранения контента");
    },
  });
}
