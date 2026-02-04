/**
 * Fixes image URLs that point to old/temporary preview domains.
 * Extracts the path from lovable.app URLs and returns relative paths.
 */
export function getImageUrl(url: string | undefined): string {
  if (!url) return "/placeholder.svg";
  
  // If URL contains lovable.app preview domain, extract just the path
  if (url.includes("lovable.app/")) {
    const pathMatch = url.match(/lovable\.app(\/.*)/);
    if (pathMatch) return pathMatch[1];
  }
  
  return url;
}

/**
 * Process an array of image URLs
 */
export function getImageUrls(urls: string[] | null | undefined): string[] {
  if (!urls || urls.length === 0) return ["/placeholder.svg"];
  return urls.map(url => getImageUrl(url));
}
