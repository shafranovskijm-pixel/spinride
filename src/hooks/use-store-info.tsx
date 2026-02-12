import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface StoreInfo {
  name: string;
  phone: string;
  address: string;
  email: string;
}

const DEFAULT_STORE_INFO: StoreInfo = {
  name: "SPINRIDE",
  phone: "+7 924-788-11-11",
  address: "г. Уссурийск, ул. Пушкина, 13",
  email: "info@spinride.ru",
};

export function useStoreInfo() {
  return useQuery({
    queryKey: ["site-settings", "store_info"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_settings")
        .select("value")
        .eq("key", "store_info")
        .maybeSingle();

      if (error) throw error;

      if (data?.value) {
        return { ...DEFAULT_STORE_INFO, ...(data.value as unknown as Partial<StoreInfo>) };
      }
      return DEFAULT_STORE_INFO;
    },
  });
}
