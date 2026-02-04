import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { User, Package, Heart, LogOut, Settings, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/use-auth";
import { ShopLayout } from "@/components/shop/ShopLayout";

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, profile, isAdmin, isLoading, signOut } = useAuth();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/auth/login");
    }
  }, [user, isLoading, navigate]);

  const handleSignOut = async () => {
    await signOut();
    // signOut now handles redirect via window.location.href
  };

  if (isLoading) {
    return (
      <ShopLayout>
        <div className="container py-12 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </ShopLayout>
    );
  }

  if (!user) {
    return null;
  }

  const displayName = profile?.display_name || user.user_metadata?.full_name || user.email?.split("@")[0] || "Пользователь";
  const avatarUrl = profile?.avatar_url || user.user_metadata?.avatar_url;
  const initials = displayName.slice(0, 2).toUpperCase();

  return (
    <ShopLayout>
      <div className="container py-8 max-w-2xl">
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4" />
          Вернуться в магазин
        </Link>

        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={avatarUrl} alt={displayName} />
                <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
              </Avatar>
            </div>
            <CardTitle className="text-2xl">{displayName}</CardTitle>
            <CardDescription>{user.email}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Separator />
            
            <div className="grid gap-3">
              <Link to="/favorites">
                <Button variant="outline" className="w-full justify-start gap-3">
                  <Heart className="h-4 w-4" />
                  Избранные товары
                </Button>
              </Link>
              
              <Button variant="outline" className="w-full justify-start gap-3" disabled>
                <Package className="h-4 w-4" />
                История заказов
                <span className="ml-auto text-xs text-muted-foreground">Скоро</span>
              </Button>
              
              <Button variant="outline" className="w-full justify-start gap-3" disabled>
                <User className="h-4 w-4" />
                Редактировать профиль
                <span className="ml-auto text-xs text-muted-foreground">Скоро</span>
              </Button>

              {isAdmin && (
                <Link to="/admin">
                  <Button variant="outline" className="w-full justify-start gap-3">
                    <Settings className="h-4 w-4" />
                    Панель администратора
                  </Button>
                </Link>
              )}
            </div>

            <Separator />

            <Button 
              variant="destructive" 
              className="w-full gap-2"
              onClick={handleSignOut}
            >
              <LogOut className="h-4 w-4" />
              Выйти из аккаунта
            </Button>
          </CardContent>
        </Card>
      </div>
    </ShopLayout>
  );
}
