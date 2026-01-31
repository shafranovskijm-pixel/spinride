import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface OrderNotification {
  type?: 'new' | 'status_change';
  order_number: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  delivery_method: string;
  delivery_address?: string;
  total_amount: number;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  new_status?: string;
  old_status?: string;
}

const statusLabels: Record<string, string> = {
  new: 'Новый',
  processing: 'В обработке',
  confirmed: 'Подтверждён',
  completed: 'Завершён',
  cancelled: 'Отменён',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const TELEGRAM_BOT_TOKEN = Deno.env.get('TELEGRAM_BOT_TOKEN');
    const TELEGRAM_CHAT_ID = Deno.env.get('TELEGRAM_CHAT_ID');

    if (!TELEGRAM_BOT_TOKEN) {
      throw new Error('TELEGRAM_BOT_TOKEN is not configured');
    }

    if (!TELEGRAM_CHAT_ID) {
      throw new Error('TELEGRAM_CHAT_ID is not configured');
    }

    const order: OrderNotification = await req.json();

    let message: string;

    if (order.type === 'status_change') {
      // Status change notification
      const oldStatusLabel = statusLabels[order.old_status || ''] || order.old_status;
      const newStatusLabel = statusLabels[order.new_status || ''] || order.new_status;
      
      const statusEmoji = {
        processing: '⏳',
        confirmed: '✅',
        completed: '🎉',
        cancelled: '❌',
      }[order.new_status || ''] || '📋';

      message = `
${statusEmoji} *Статус заказа изменён*

📦 *Заказ:* \`${order.order_number}\`
👤 *Клиент:* ${escapeMarkdown(order.customer_name)}
📞 *Телефон:* ${escapeMarkdown(order.customer_phone)}

📊 *Статус:* ${oldStatusLabel} → *${newStatusLabel}*

💰 *Сумма:* ${order.total_amount.toLocaleString('ru-RU')} ₽
      `.trim();
    } else {
      // New order notification
      const itemsList = order.items
        .map((item, i) => `  ${i + 1}. ${item.name} × ${item.quantity} — ${item.price.toLocaleString('ru-RU')} ₽`)
        .join('\n');

      message = `
🛒 *Новый заказ!*

📦 *Заказ:* \`${order.order_number}\`

👤 *Клиент:* ${escapeMarkdown(order.customer_name)}
📞 *Телефон:* ${escapeMarkdown(order.customer_phone)}
${order.customer_email ? `📧 *Email:* ${escapeMarkdown(order.customer_email)}` : ''}

🚚 *Доставка:* ${order.delivery_method === 'pickup' ? 'Самовывоз' : 'Доставка'}
${order.delivery_address ? `📍 *Адрес:* ${escapeMarkdown(order.delivery_address)}` : ''}

🛍️ *Товары:*
${itemsList}

💰 *Итого:* *${order.total_amount.toLocaleString('ru-RU')} ₽*
      `.trim();
    }

    // Send to Telegram
    const telegramResponse = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: message,
          parse_mode: 'Markdown',
        }),
      }
    );

    const telegramResult = await telegramResponse.json();

    if (!telegramResponse.ok) {
      console.error('Telegram API error:', telegramResult);
      throw new Error(`Telegram API error: ${telegramResult.description || 'Unknown error'}`);
    }

    return new Response(
      JSON.stringify({ success: true, message_id: telegramResult.result?.message_id }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error sending Telegram notification:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

// Escape special Markdown characters
function escapeMarkdown(text: string): string {
  return text.replace(/[_*`\[\]]/g, '\\$&');
}
