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

export interface DeliveryContent {
  methods: { name: string; price: string; time: string }[];
  free_delivery_threshold: number;
  pickup_address: string;
  pickup_hours: string;
}

export interface AboutContent {
  description: string;
  features: string[];
  history: string;
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
  };
}

export interface PageContent {
  id: string;
  page_key: string;
  title: string;
  subtitle: string | null;
  content: WarrantyContent | DeliveryContent | AboutContent | ContactsContent;
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
    mutationFn: async ({
      id,
      title,
      subtitle,
      content,
    }: {
      id: string;
      title: string;
      subtitle: string | null;
      content: unknown;
    }) => {
      const { error } = await supabase
        .from("page_content")
        .update({ title, subtitle, content: content as any })
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
