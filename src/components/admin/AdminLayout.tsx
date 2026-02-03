import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Settings, 
  LogOut,
  Menu,
  Sun,
  Snowflake,
  ChevronLeft,
  Download,
  Share,
  MessageSquare,
  WifiOff,
  FolderTree
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { OfflineIndicator } from "@/components/shop/OfflineIndicator";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSeason } from "@/hooks/use-season";
import { useAuth } from "@/hooks/use-auth";
import { usePWAInstall } from "@/hooks/use-pwa-install";
import { cn } from "@/lib/utils";
import { useState } from "react";

const navItems = [
  { title: "Обзор", url: "/admin", icon: LayoutDashboard },
  { title: "Товары", url: "/admin/products", icon: Package },
  { title: "Категории", url: "/admin/categories", icon: FolderTree },
  { title: "Заказы", url: "/admin/orders", icon: ShoppingCart },
  { title: "Отзывы", url: "/admin/reviews", icon: MessageSquare },
  { title: "Настройки", url: "/admin/settings", icon: Settings },
];

function AdminSidebar() {
  const location = useLocation();
  const { season } = useSeason();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  const { isInstallable, isInstalled, isIOS, installApp } = usePWAInstall();
  const [showIOSDialog, setShowIOSDialog] = useState(false);

  const handleInstall = async () => {
    if (isIOS) {
      setShowIOSDialog(true);
    } else {
      await installApp();
    }
  };

  return (
    <>
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

          {/* Install App button */}
          {!isInstalled && (isInstallable || isIOS) && (
            <div className="px-3 py-2">
              <Button 
                variant="outline" 
                size="sm" 
                className={cn("w-full gap-2", isCollapsed && "px-2")}
                onClick={handleInstall}
              >
                <Download className="h-4 w-4" />
                {!isCollapsed && <span>Установить</span>}
              </Button>
            </div>
          )}

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

      {/* iOS Install Instructions Dialog */}
      <Dialog open={showIOSDialog} onOpenChange={setShowIOSDialog}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              Установка на iPhone
            </DialogTitle>
            <DialogDescription className="text-left space-y-4 pt-4">
              <p>Для установки приложения на домашний экран:</p>
              <ol className="list-decimal list-inside space-y-2">
                <li className="flex items-start gap-2">
                  <span>1.</span>
                  <span>Нажмите кнопку <Share className="inline h-4 w-4" /> <strong>Поделиться</strong> внизу браузера</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>2.</span>
                  <span>Выберите <strong>«На экран Домой»</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <span>3.</span>
                  <span>Нажмите <strong>«Добавить»</strong></span>
                </li>
              </ol>
              <p className="text-sm text-muted-foreground">
                Приложение появится на вашем домашнем экране как обычное приложение.
              </p>
            </DialogDescription>
          </DialogHeader>
          <Button onClick={() => setShowIOSDialog(false)}>Понятно</Button>
        </DialogContent>
      </Dialog>
    </>
  );
}

interface AdminLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}

export function AdminLayout({ children, title, subtitle, actions }: AdminLayoutProps) {
  const { user, profile, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    window.location.href = "/";
  };

  const userInitials = profile?.display_name
    ? profile.display_name.slice(0, 2).toUpperCase()
    : user?.email?.slice(0, 2).toUpperCase() || "AD";

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-muted/30">
        <AdminSidebar />
        
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header - mobile optimized */}
          <header className="h-14 sm:h-16 border-b bg-background flex items-center justify-between px-3 sm:px-6 sticky top-0 z-10">
            <div className="flex items-center gap-2 sm:gap-4 min-w-0">
              <SidebarTrigger>
                <Menu className="h-5 w-5" />
              </SidebarTrigger>
              <div className="min-w-0">
                <h1 className="font-semibold text-base sm:text-lg truncate">{title}</h1>
                {subtitle && (
                  <p className="text-xs sm:text-sm text-muted-foreground truncate">{subtitle}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-1 sm:gap-3 shrink-0">
              {/* Actions - hidden on very small screens, shown in menu */}
              <div className="hidden sm:flex items-center gap-2">
                {actions}
              </div>
              <Button variant="ghost" size="icon" className="hidden md:flex" asChild>
                <Link to="/">
                  <ChevronLeft className="h-4 w-4" />
                </Link>
              </Button>

              {/* User menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 sm:h-9 sm:w-9">
                    <Avatar className="h-7 w-7 sm:h-8 sm:w-8">
                      <AvatarImage src={profile?.avatar_url || undefined} />
                      <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                        {userInitials}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col">
                      <span>{profile?.display_name || "Администратор"}</span>
                      <span className="text-xs font-normal text-muted-foreground truncate">
                        {user?.email}
                      </span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild className="md:hidden">
                    <Link to="/">
                      <ChevronLeft className="h-4 w-4 mr-2" />
                      На сайт
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/admin/settings">
                      <Settings className="h-4 w-4 mr-2" />
                      Настройки
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
                    <LogOut className="h-4 w-4 mr-2" />
                    Выйти
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          {/* Mobile actions bar */}
          {actions && (
            <div className="sm:hidden flex items-center gap-2 px-3 py-2 border-b bg-background">
              {actions}
            </div>
          )}

          {/* Content - mobile optimized padding */}
          <main className="flex-1 p-3 sm:p-6 overflow-x-hidden">
            {children}
          </main>
          
          {/* Offline indicator */}
          <OfflineIndicator />
        </div>
      </div>
    </SidebarProvider>
  );
}
