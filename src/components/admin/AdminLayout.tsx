import { ReactNode } from "react";
import { Link, useLocation, Navigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Settings, 
  LogOut,
  Menu,
  Sun,
  Snowflake,
  ChevronLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { useSeason } from "@/hooks/use-season";
import { cn } from "@/lib/utils";

const navItems = [
  { title: "Обзор", url: "/admin", icon: LayoutDashboard },
  { title: "Товары", url: "/admin/products", icon: Package },
  { title: "Заказы", url: "/admin/orders", icon: ShoppingCart },
  { title: "Настройки", url: "/admin/settings", icon: Settings },
];

function AdminSidebar() {
  const location = useLocation();
  const { season } = useSeason();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon" className="border-r">
      <SidebarContent>
        {/* Logo */}
        <div className={cn(
          "flex items-center gap-2 p-4 border-b",
          isCollapsed && "justify-center"
        )}>
          <div className="w-8 h-8 rounded-lg gradient-hero flex items-center justify-center shrink-0">
            <span className="text-lg">🚴</span>
          </div>
          {!isCollapsed && (
            <span className="font-bold">
              SPIN<span className="text-primary">RIDE</span>
            </span>
          )}
        </div>

        {/* Navigation */}
        <SidebarGroup>
          {!isCollapsed && <SidebarGroupLabel>Меню</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive = location.pathname === item.url || 
                  (item.url !== "/admin" && location.pathname.startsWith(item.url));
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link to={item.url}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Season indicator */}
        <div className="mt-auto p-4 border-t">
          <div className={cn(
            "flex items-center gap-2 text-sm text-muted-foreground",
            isCollapsed && "justify-center"
          )}>
            {season === "summer" ? (
              <Sun className="h-4 w-4 text-primary" />
            ) : (
              <Snowflake className="h-4 w-4 text-primary" />
            )}
            {!isCollapsed && (
              <span>{season === "summer" ? "Летний режим" : "Зимний режим"}</span>
            )}
          </div>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}

interface AdminLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}

export function AdminLayout({ children, title, subtitle, actions }: AdminLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-muted/30">
        <AdminSidebar />
        
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="h-16 border-b bg-background flex items-center justify-between px-6">
            <div className="flex items-center gap-4">
              <SidebarTrigger>
                <Menu className="h-5 w-5" />
              </SidebarTrigger>
              <div>
                <h1 className="font-semibold text-lg">{title}</h1>
                {subtitle && (
                  <p className="text-sm text-muted-foreground">{subtitle}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              {actions}
              <Button variant="ghost" size="sm" asChild>
                <Link to="/">
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  На сайт
                </Link>
              </Button>
            </div>
          </header>

          {/* Content */}
          <main className="flex-1 p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
