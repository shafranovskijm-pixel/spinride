import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface SEOData {
  title: string;
  description: string;
  keywords: string[];
  og_image: string;
}

const DEFAULT_SEO: SEOData = {
  title: "SPINRIDE — велосипеды и самокаты в Уссурийске",
  description: "Велосипеды, самокаты и товары для активного отдыха в магазине SPINRIDE в Уссурийске. Каталог моделей, цены, характеристики и контакты магазина.",
  keywords: [],
  og_image: "https://storage.googleapis.com/gpt-engineer-file-uploads/PTpM50g6m7PLHlVz6xEAe06wJ5E3/social-images/social-1770129750318-Screenshot_15.jpg",
};

let cachedSEO: SEOData | null = null;

export function useSEO() {
  const [seoData, setSeoData] = useState<SEOData>(cachedSEO || DEFAULT_SEO);
  const [isLoading, setIsLoading] = useState(!cachedSEO);

  useEffect(() => {
    if (cachedSEO) {
      setSeoData(cachedSEO);
      return;
    }

    const fetchSEO = async () => {
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
          
          const seo: SEOData = {
            title: parsed.title || DEFAULT_SEO.title,
            description: parsed.description || DEFAULT_SEO.description,
            keywords: Array.isArray(parsed.keywords) ? parsed.keywords : [],
            og_image: parsed.og_image || DEFAULT_SEO.og_image,
          };
          
          cachedSEO = seo;
          setSeoData(seo);
        }
      } catch (error) {
        console.error("Error fetching SEO:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSEO();
  }, []);

  return { seoData, isLoading };
}

// Hook to update document head with SEO data
export function useDocumentSEO(
  pageTitle?: string,
  pageDescription?: string,
  options?: { image?: string; type?: string }
) {
  const { seoData } = useSEO();
  const image = options?.image || seoData.og_image;
  const type = options?.type || "website";

  useEffect(() => {
    // Update title
    const title = pageTitle 
      ? `${pageTitle} | ${seoData.title.split("—")[0].trim()}`
      : seoData.title;
    document.title = title;

    // Update meta description
    const description = pageDescription || seoData.description;
    const setMeta = (attribute: "name" | "property", key: string, value: string) => {
      const matches = Array.from(document.head.querySelectorAll<HTMLMetaElement>(`meta[${attribute}="${key}"]`));
      let meta = matches[0];
      matches.slice(1).forEach((duplicate) => duplicate.remove());
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute(attribute, key);
        document.head.appendChild(meta);
      }
      meta.setAttribute("content", value);
    };
    setMeta("name", "description", description);

    // Update keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (seoData.keywords.length > 0) {
      if (!metaKeywords) {
        metaKeywords = document.createElement("meta");
        metaKeywords.setAttribute("name", "keywords");
        document.head.appendChild(metaKeywords);
      }
      metaKeywords.setAttribute("content", seoData.keywords.join(", "));
    }

    // Update OG tags
    setMeta("property", "og:title", title);
    setMeta("property", "og:description", description);
    setMeta("property", "og:type", type);
    setMeta("name", "twitter:title", title);
    setMeta("name", "twitter:description", description);
    if (image) {
      setMeta("property", "og:image", image);
      setMeta("name", "twitter:image", image);
    }
  }, [seoData, pageTitle, pageDescription, image, type]);
}
