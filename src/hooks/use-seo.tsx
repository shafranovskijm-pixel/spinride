import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

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
            og_image: parsed.og_image || "",
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
export function useDocumentSEO(pageTitle?: string, pageDescription?: string) {
  const { seoData } = useSEO();

  useEffect(() => {
    // Update title
    const title = pageTitle 
      ? `${pageTitle} | ${seoData.title.split("—")[0].trim()}`
      : seoData.title;
    document.title = title;

    // Update meta description
    const description = pageDescription || seoData.description;
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", description);
    }

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
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute("content", title);
    }

    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) {
      ogDescription.setAttribute("content", description);
    }

    if (seoData.og_image) {
      const ogImage = document.querySelector('meta[property="og:image"]');
      if (ogImage) {
        ogImage.setAttribute("content", seoData.og_image);
      }

      const twitterImage = document.querySelector('meta[name="twitter:image"]');
      if (twitterImage) {
        twitterImage.setAttribute("content", seoData.og_image);
      }
    }
  }, [seoData, pageTitle, pageDescription]);
}
