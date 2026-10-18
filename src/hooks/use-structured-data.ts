import { useEffect } from "react";

export function useStructuredData(id: string, data: object | null) {
  const json = data ? JSON.stringify(data).replace(/</g, "\\u003c") : null;
  useEffect(() => {
    if (!json) return;
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = id;
    script.textContent = json;
    document.head.appendChild(script);
    return () => script.remove();
  }, [id, json]);
}
