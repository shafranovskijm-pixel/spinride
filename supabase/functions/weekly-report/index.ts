import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const TELEGRAM_BOT_TOKEN = Deno.env.get('TELEGRAM_BOT_TOKEN');
    const TELEGRAM_CHAT_ID = Deno.env.get('TELEGRAM_CHAT_ID');
    const TELEGRAM_OWNER_CHAT_ID = Deno.env.get('TELEGRAM_OWNER_CHAT_ID');
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    if (!TELEGRAM_BOT_TOKEN) throw new Error('TELEGRAM_BOT_TOKEN is not configured');

    const chatIds = [TELEGRAM_CHAT_ID, TELEGRAM_OWNER_CHAT_ID].filter(Boolean) as string[];
    if (chatIds.length === 0) throw new Error('No Telegram chat IDs configured');

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Date range: last 7 days
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const weekAgoISO = weekAgo.toISOString();

    const formatDate = (d: Date) => d.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' });
    const periodLabel = `${formatDate(weekAgo)} — ${formatDate(now)}`;

    // 1. New products added this week
    const { count: newProductsCount } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', weekAgoISO);

    // 2. Total products + breakdown by category
    const { data: products } = await supabase
      .from('products')
      .select('id, category_id');

    const { data: categories } = await supabase
      .from('categories')
      .select('id, name')
      .order('sort_order', { ascending: true });

    const totalProducts = products?.length ?? 0;
    const categoryMap = new Map<string, string>();
    categories?.forEach(c => categoryMap.set(c.id, c.name));

    const categoryCounts = new Map<string, number>();
    let uncategorized = 0;
    products?.forEach(p => {
      if (p.category_id && categoryMap.has(p.category_id)) {
        const name = categoryMap.get(p.category_id)!;
        categoryCounts.set(name, (categoryCounts.get(name) ?? 0) + 1);
      } else {
        uncategorized++;
      }
    });

    // 3. Orders this week (not cancelled)
    const { data: orders } = await supabase
      .from('orders')
      .select('*')
      .gte('created_at', weekAgoISO)
      .neq('status', 'cancelled');

    const ordersCount = orders?.length ?? 0;
    let totalRevenue = 0;
    let totalItems = 0;
    const productSales = new Map<string, number>();

    orders?.forEach(order => {
      totalRevenue += Number(order.total_amount) || 0;
      const items = order.items as Array<{ name: string; quantity: number; price: number }>;
      if (Array.isArray(items)) {
        items.forEach(item => {
          const qty = item.quantity || 0;
          totalItems += qty;
          const name = item.name || 'Без названия';
          productSales.set(name, (productSales.get(name) ?? 0) + qty);
        });
      }
    });

    // Top 5 products by sales
    const top5 = [...productSales.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    // Build category breakdown lines
    const categoryLines = [...categoryCounts.entries()]
      .map(([name, count]) => `• ${escapeMarkdown(name)}: ${count}`)
      .join('\n');
    const uncategorizedLine = uncategorized > 0 ? `\n  • Прочее: ${uncategorized}` : '';

    // Build top 5 lines
    let top5Lines = '  Нет продаж за неделю';
    if (top5.length > 0) {
      top5Lines = top5
        .map(([ name, qty ], i) => `  ${i + 1}. ${escapeMarkdown(name)} — ${qty} шт.`)
        .join('\n');
    }

    const message = `📊 *Еженедельный отчёт* (${escapeMarkdown(periodLabel)})

🛍 *Товары за неделю:*
Добавлено новых: ${newProductsCount ?? 0}

📦 *Всего на сайте:* ${totalProducts}
${categoryLines}${uncategorizedLine}

💰 *Продажи за неделю:*
Заказов: ${ordersCount}
Продано позиций: ${totalItems}
Выручка: ${totalRevenue.toLocaleString('ru-RU')} ₽

🏆 *Топ-5 товаров:*
${top5Lines}`.trim();

    // Send to all chat IDs
    const results = [];
    for (const chatId of chatIds) {
      const telegramResponse = await fetch(
        `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            text: message,
            parse_mode: 'Markdown',
          }),
        }
      );

      const result = await telegramResponse.json();
      if (!telegramResponse.ok) {
        console.error(`Telegram error for chat ${chatId}:`, result);
      }
      results.push({ chatId, ok: telegramResponse.ok, message_id: result.result?.message_id });
    }

    console.log('Weekly report sent:', results);

    return new Response(
      JSON.stringify({ success: true, results }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error sending weekly report:', error);
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

function escapeMarkdown(text: string): string {
  return text.replace(/[_*`\[\]]/g, '\\$&');
}
