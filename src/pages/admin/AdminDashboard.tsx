import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { 
  Package, 
  ShoppingCart, 
  TrendingUp, 
  Users,
  ArrowUpRight,
  ArrowDownRight,
  Loader2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend
} from "recharts";
import { format, subDays, startOfDay, endOfDay } from "date-fns";
import { ru } from "date-fns/locale";

const statusLabels: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  new: { label: "Новый", variant: "default" },
  processing: { label: "В обработке", variant: "secondary" },
  confirmed: { label: "Подтверждён", variant: "outline" },
  completed: { label: "Завершён", variant: "outline" },
  cancelled: { label: "Отменён", variant: "destructive" },
};

const COLORS = ["hsl(var(--primary))", "hsl(var(--secondary))", "hsl(var(--muted-foreground))", "hsl(var(--accent))", "hsl(var(--destructive))"];

export default function AdminDashboard() {
  // Fetch orders for statistics
  const { data: orders, isLoading: ordersLoading } = useQuery({
    queryKey: ["admin-orders-stats"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  // Fetch products count
  const { data: productsCount } = useQuery({
    queryKey: ["admin-products-count"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("products")
        .select("*", { count: "exact", head: true });
      if (error) throw error;
      return count || 0;
    },
  });

  // Calculate stats
  const today = new Date();
  const todayStart = startOfDay(today);
  const todayEnd = endOfDay(today);
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

  const ordersToday = orders?.filter(o => {
    const date = new Date(o.created_at);
    return date >= todayStart && date <= todayEnd;
  }).length || 0;

  const monthlyRevenue = orders?.filter(o => {
    const date = new Date(o.created_at);
    return date >= monthStart && o.status !== "cancelled";
  }).reduce((sum, o) => sum + Number(o.total_amount), 0) || 0;

  const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
  const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);
  const lastMonthRevenue = orders?.filter(o => {
    const date = new Date(o.created_at);
    return date >= lastMonthStart && date <= lastMonthEnd && o.status !== "cancelled";
  }).reduce((sum, o) => sum + Number(o.total_amount), 0) || 0;

  const revenueChange = lastMonthRevenue > 0 
    ? Math.round(((monthlyRevenue - lastMonthRevenue) / lastMonthRevenue) * 100)
    : 0;

  // Orders by status for pie chart
  const ordersByStatus = orders?.reduce((acc, order) => {
    const status = order.status || "new";
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  const pieData = Object.entries(ordersByStatus).map(([status, count]) => ({
    name: statusLabels[status]?.label || status,
    value: count,
  }));

  // Orders over last 7 days for line chart
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(today, 6 - i);
    const dayStart = startOfDay(date);
    const dayEnd = endOfDay(date);
    const dayOrders = orders?.filter(o => {
      const orderDate = new Date(o.created_at);
      return orderDate >= dayStart && orderDate <= dayEnd;
    }) || [];
    
    return {
      date: format(date, "dd MMM", { locale: ru }),
      orders: dayOrders.length,
      revenue: dayOrders.reduce((sum, o) => sum + Number(o.total_amount), 0) / 1000,
    };
  });

  // Top products from orders
  const productSales = orders?.reduce((acc, order) => {
    const items = order.items as Array<{ name: string; quantity: number; price: number }>;
    items?.forEach(item => {
      if (!acc[item.name]) {
        acc[item.name] = { name: item.name, quantity: 0, revenue: 0 };
      }
      acc[item.name].quantity += item.quantity;
      acc[item.name].revenue += item.price * item.quantity;
    });
    return acc;
  }, {} as Record<string, { name: string; quantity: number; revenue: number }>) || {};

  const topProducts = Object.values(productSales)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5)
    .map(p => ({ ...p, revenue: p.revenue / 1000 }));

  const recentOrders = orders?.slice(0, 3) || [];

  const stats = [
    {
      title: "Товаров",
      value: productsCount || 0,
      change: "+12%",
      trend: "up" as const,
      icon: Package,
    },
    {
      title: "Заказов сегодня",
      value: ordersToday,
      change: `+${ordersToday}`,
      trend: "up" as const,
      icon: ShoppingCart,
    },
    {
      title: "Выручка за месяц",
      value: `${(monthlyRevenue / 1000).toFixed(0)}K ₽`,
      change: `${revenueChange >= 0 ? "+" : ""}${revenueChange}%`,
      trend: revenueChange >= 0 ? "up" as const : "down" as const,
      icon: TrendingUp,
    },
    {
      title: "Всего заказов",
      value: orders?.length || 0,
      change: "+18%",
      trend: "up" as const,
      icon: Users,
    },
  ];

  if (ordersLoading) {
    return (
      <AdminLayout title="Панель управления" subtitle="Загрузка...">
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Панель управления" subtitle="Добро пожаловать в админ-панель SPINRIDE">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <stat.icon className="h-5 w-5 text-primary" />
                </div>
                <div className={`flex items-center gap-1 text-sm ${
                  stat.trend === "up" ? "text-secondary" : "text-destructive"
                }`}>
                  {stat.trend === "up" ? (
                    <ArrowUpRight className="h-4 w-4" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4" />
                  )}
                  {stat.change}
                </div>
              </div>
              <div className="mt-4">
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Orders & Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Заказы за 7 дней</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={last7Days}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="date" className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <YAxis yAxisId="left" className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <YAxis yAxisId="right" orientation="right" className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                    formatter={(value: number, name: string) => [
                      name === 'orders' ? value : `${value.toFixed(1)}K ₽`,
                      name === 'orders' ? 'Заказы' : 'Выручка'
                    ]}
                  />
                  <Legend formatter={(value) => value === 'orders' ? 'Заказы' : 'Выручка (тыс. ₽)'} />
                  <Line 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="orders" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--primary))' }}
                  />
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="hsl(var(--secondary))" 
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--secondary))' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Orders by Status Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Заказы по статусам</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              {pieData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={2}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {pieData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  Нет данных о заказах
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Products & Recent Orders */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top Products Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Топ-5 товаров по выручке</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              {topProducts.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topProducts} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis type="number" className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                    <YAxis 
                      type="category" 
                      dataKey="name" 
                      width={120} 
                      className="text-xs" 
                      tick={{ fill: 'hsl(var(--muted-foreground))' }}
                      tickFormatter={(value) => value.length > 15 ? value.slice(0, 15) + '...' : value}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                      formatter={(value: number) => [`${value.toFixed(1)}K ₽`, 'Выручка']}
                    />
                    <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  Нет данных о продажах
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent orders */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Последние заказы</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/admin/orders">Все заказы</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.length > 0 ? (
                recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <p className="font-medium">{order.order_number}</p>
                      <p className="text-sm text-muted-foreground">{order.customer_name}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{Number(order.total_amount).toLocaleString()} ₽</p>
                      <Badge variant={statusLabels[order.status || "new"].variant}>
                        {statusLabels[order.status || "new"].label}
                      </Badge>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  Заказов пока нет
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick actions */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg">Быстрые действия</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button variant="outline" asChild>
            <Link to="/admin/products/new">
              <Package className="h-4 w-4 mr-2" />
              Добавить товар
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/admin/orders">
              <ShoppingCart className="h-4 w-4 mr-2" />
              Обработать заказы
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/admin/settings">
              <TrendingUp className="h-4 w-4 mr-2" />
              Настройки
            </Link>
          </Button>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
