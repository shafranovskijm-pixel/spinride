import { Link } from "react-router-dom";
import { 
  Package, 
  ShoppingCart, 
  TrendingUp, 
  Users,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { mockProducts } from "@/data/mock-products";

// Mock stats
const stats = [
  {
    title: "Товаров",
    value: mockProducts.length,
    change: "+12%",
    trend: "up",
    icon: Package,
  },
  {
    title: "Заказов сегодня",
    value: 5,
    change: "+3",
    trend: "up",
    icon: ShoppingCart,
  },
  {
    title: "Выручка за месяц",
    value: "125 000 ₽",
    change: "-8%",
    trend: "down",
    icon: TrendingUp,
  },
  {
    title: "Посетителей",
    value: 342,
    change: "+18%",
    trend: "up",
    icon: Users,
  },
];

// Mock recent orders
const recentOrders = [
  { id: "SR-260131-0001", customer: "Иван Петров", total: 24990, status: "new" },
  { id: "SR-260131-0002", customer: "Мария Сидорова", total: 32990, status: "processing" },
  { id: "SR-260130-0015", customer: "Алексей Козлов", total: 12990, status: "confirmed" },
];

const statusLabels: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  new: { label: "Новый", variant: "default" },
  processing: { label: "В обработке", variant: "secondary" },
  confirmed: { label: "Подтверждён", variant: "outline" },
  completed: { label: "Завершён", variant: "outline" },
  cancelled: { label: "Отменён", variant: "destructive" },
};

export default function AdminDashboard() {
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

      <div className="grid lg:grid-cols-2 gap-6">
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
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium">{order.id}</p>
                    <p className="text-sm text-muted-foreground">{order.customer}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{order.total.toLocaleString()} ₽</p>
                    <Badge variant={statusLabels[order.status].variant}>
                      {statusLabels[order.status].label}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Быстрые действия</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" variant="outline" asChild>
              <Link to="/admin/products/new">
                <Package className="h-4 w-4 mr-2" />
                Добавить товар
              </Link>
            </Button>
            <Button className="w-full justify-start" variant="outline" asChild>
              <Link to="/admin/orders">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Обработать заказы
              </Link>
            </Button>
            <Button className="w-full justify-start" variant="outline" asChild>
              <Link to="/admin/settings">
                <TrendingUp className="h-4 w-4 mr-2" />
                Настроить сезон
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
