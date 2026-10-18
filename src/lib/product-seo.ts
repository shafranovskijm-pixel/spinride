import type { Product } from "@/types/shop";
import { getImageUrls } from "@/lib/image-utils";

const ORIGIN = "https://spinride.ru";

export function getProductDescription(product: Product): string {
  const text = product.description?.replace(/\s+/g, " ").trim();
  return text
    ? `${product.name} в SPINRIDE, Уссурийск. ${text}`.slice(0, 170)
    : `${product.name} в магазине SPINRIDE в Уссурийске. Цена, фотографии, характеристики и наличие в карточке товара.`;
}

export function getProductSearchImages(product: Product): string[] {
  return getImageUrls(product.images)
    .filter((image) => image !== "/placeholder.svg")
    .flatMap((image) => {
      try {
        const url = new URL(image, ORIGIN);
        return ["http:", "https:"].includes(url.protocol) ? [url.href] : [];
      } catch {
        return [];
      }
    });
}

export function getProductStructuredData(product: Product) {
  const url = `${ORIGIN}/product/${encodeURIComponent(product.slug)}`;
  const images = getProductSearchImages(product);
  const price = product.sale_price && product.sale_price < product.price
    ? product.sale_price : product.price;
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${url}#product`,
    name: product.name,
    url,
    ...(product.description?.trim() ? { description: product.description.trim() } : {}),
    ...(images.length ? { image: images } : {}),
    ...(Number.isFinite(price) && price > 0 ? {
      offers: {
        "@type": "Offer",
        url,
        priceCurrency: "RUB",
        price: price.toFixed(2),
        availability: product.in_stock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      },
    } : {}),
  };
}
