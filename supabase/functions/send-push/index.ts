import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const VAPID_PUBLIC_KEY = Deno.env.get("VAPID_PUBLIC_KEY");
    const VAPID_PRIVATE_KEY = Deno.env.get("VAPID_PRIVATE_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) {
      console.error("VAPID keys not configured");
      return new Response(
        JSON.stringify({ error: "VAPID keys not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Parse request body
    const body = await req.json().catch(() => ({}));
    const { order_id } = body;

    // Security: Require order_id and validate against database
    if (!order_id) {
      return new Response(
        JSON.stringify({ error: "order_id is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create Supabase client with service role
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Fetch order from database to verify it exists and get real data
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("order_number, customer_name, total_amount")
      .eq("id", order_id)
      .single();

    if (orderError || !order) {
      console.error("Order not found:", order_id, orderError);
      return new Response(
        JSON.stringify({ error: "Order not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get all push subscriptions (admin users)
    const { data: subscriptions, error: fetchError } = await supabase
      .from("push_subscriptions")
      .select("*");

    if (fetchError) {
      console.error("Error fetching subscriptions:", fetchError);
      return new Response(
        JSON.stringify({ error: "Failed to fetch subscriptions" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!subscriptions || subscriptions.length === 0) {
      console.log("No push subscriptions found");
      return new Response(
        JSON.stringify({ message: "No subscriptions to notify", sent: 0 }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Found ${subscriptions.length} push subscriptions for order ${order.order_number}`);

    // Prepare notification payload using validated order data
    const notificationPayload = JSON.stringify({
      title: "🛒 Новый заказ!",
      body: `Заказ ${order.order_number} от ${order.customer_name} на ${order.total_amount?.toLocaleString("ru-RU") || "?"} ₽`,
      icon: "/pwa-192x192.png",
      badge: "/pwa-192x192.png",
      tag: `order-${order.order_number}`,
      data: { 
        url: "/admin/orders",
        order_number: order.order_number,
      },
    });

    // Send to each subscription
    const results: { success: number; failed: number; errors: string[] } = {
      success: 0,
      failed: 0,
      errors: [],
    };

    for (const sub of subscriptions) {
      try {
        // Web Push requires encrypted payload - using simplified fetch approach
        const response = await fetch(sub.endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "TTL": "86400",
          },
          body: notificationPayload,
        });

        if (response.ok || response.status === 201) {
          results.success++;
          console.log(`Push sent successfully to ${sub.endpoint.substring(0, 50)}...`);
        } else if (response.status === 410 || response.status === 404) {
          // Subscription expired or invalid - remove it
          console.log(`Removing invalid subscription: ${sub.id}`);
          await supabase.from("push_subscriptions").delete().eq("id", sub.id);
          results.failed++;
          results.errors.push(`Subscription ${sub.id} expired and removed`);
        } else {
          results.failed++;
          const errorText = await response.text();
          results.errors.push(`${sub.id}: ${response.status} - ${errorText}`);
          console.error(`Push failed for ${sub.id}:`, response.status, errorText);
        }
      } catch (error) {
        results.failed++;
        results.errors.push(`${sub.id}: ${error instanceof Error ? error.message : "Unknown error"}`);
        console.error(`Push error for ${sub.id}:`, error);
      }
    }

    console.log(`Push results: ${results.success} success, ${results.failed} failed`);

    return new Response(
      JSON.stringify({
        message: "Push notifications processed",
        sent: results.success,
        failed: results.failed,
        errors: results.errors.length > 0 ? results.errors : undefined,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Push notification error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
