import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY")!;
const BASE = "https://spinride.ru";

const STATIC_PAGES = [
  { path: "/", freq: "daily", priority: "1.0" },
  { path: "/catalog", freq: "daily", priority: "0.9" },
  { path: "/quiz", freq: "monthly", priority: "0.7" },
  { path: "/about", freq: "monthly", priority: "0.6" },
  { path: "/delivery", freq: "monthly", priority: "0.6" },
  { path: "/warranty", freq: "monthly", priority: "0.6" },
  { path: "/contacts", freq: "monthly", priority: "0.6" },
  { path: "/privacy", freq: "yearly", priority: "0.3" },
  { path: "/terms", freq: "yearly", priority: "0.3" },
];

function escapeXml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function urlEntry(loc: string, freq: string, priority: string) {
  return `  <url>\n    <loc>${escapeXml(loc)}</loc>\n    <changefreq>${freq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
}

Deno.serve(async () => {
  const supabase = createClient(supabaseUrl, supabaseKey);

  const [{ data: categories }, { data: products }] = await Promise.all([
    supabase.from("categories").select("slug").order("sort_order"),
    supabase.from("products").select("slug"),
  ]);

  const entries: string[] = [];

  for (const p of STATIC_PAGES) {
    entries.push(urlEntry(BASE + p.path, p.freq, p.priority));
  }

  for (const c of categories ?? []) {
    entries.push(urlEntry(`${BASE}/catalog/${c.slug}`, "weekly", "0.8"));
  }

  for (const p of products ?? []) {
    entries.push(urlEntry(`${BASE}/product/${p.slug}`, "weekly", "0.7"));
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join("\n")}\n</urlset>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
});
