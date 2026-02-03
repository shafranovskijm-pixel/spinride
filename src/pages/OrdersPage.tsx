import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShopLayout } from "@/components/shop/ShopLayout";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Package, ShoppingBag, Clock, CheckCircle, XCircle, Truck, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface Order {
  id: string;
  order_number: string;
  created_at: string;
  status: "new" | "processing" | "confirmed" | "completed" | "cancelled";
  total_amount: number;
  items: OrderItem[];
  delivery_method: string;
  delivery_address?: string;
}

const statusConfig = {
  new: { label: "Новый", color: "bg-blue-500", icon: Clock },
  processing: { label: "В обработке", color: "bg-yellow-500", icon: AlertCircle },
  confirmed: { label: "Подтверждён", color: "bg-purple-500", icon: CheckCircle },
  completed: { label: "Завершён", color: "bg-green-500", icon: Truck },
  cancelled: { label: "Отменён", color: "bg-red-500", icon: XCircle },
};

export default function OrdersPage() {
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth/login");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      setOrders(data?.map(order => ({
        ...order,
        items: Array.isArray(order.items) ? (order.items as unknown as OrderItem[]) : []
      })) || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading || isLoading) {
    return (
      <ShopLayout>
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <Skeleton className="h-10 w-48 mb-8" />
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-40 w-full" />
            ))}
          </div>
        </div>
      </ShopLayout>
    );
  }

  return (
    <ShopLayout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center gap-3 mb-8">
          <Package className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Мои заказы</h1>
        </div>

        {orders.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold mb-2">У вас пока нет заказов</h2>
              <p className="text-muted-foreground mb-4">
                Самое время что-нибудь заказать!
              </p>
              <Button onClick={() => navigate("/catalog")}>
                Перейти в каталог
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const status = statusConfig[order.status] || statusConfig.new;
              const StatusIcon = status.icon;
              
              return (
                <Card key={order.id}>
                  <CardHeader className="pb-2">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <span>Заказ {order.order_number}</span>
                      </CardTitle>
                      <Badge className={`${status.color} text-white flex items-center gap-1 w-fit`}>
                        <StatusIcon className="h-3 w-3" />
                        {status.label}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(order.created_at), "d MMMM yyyy, HH:mm", { locale: ru })}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {order.items.slice(0, 3).map((item, index) => (
                        <div key={index} className="flex items-center gap-3">
                          {item.image ? (
                            <img 
                              src={item.image} 
                              alt={item.name} 
                              className="w-12 h-12 object-cover rounded"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-muted rounded flex items-center justify-center">
                              <Package className="h-6 w-6 text-muted-foreground" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{item.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {item.quantity} шт. × {item.price.toLocaleString()} ₽
                            </p>
                          </div>
                        </div>
                      ))}
                      {order.items.length > 3 && (
                        <p className="text-sm text-muted-foreground">
                          и ещё {order.items.length - 3} товар(а)...
                        </p>
                      )}
                    </div>
                    
                    <div className="mt-4 pt-4 border-t flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          {order.delivery_method === "pickup" ? "Самовывоз" : "Доставка"}
                          {order.delivery_address && `: ${order.delivery_address}`}
                        </p>
                      </div>
                      <p className="font-bold text-lg">
                        {order.total_amount.toLocaleString()} ₽
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </ShopLayout>
  );
}
