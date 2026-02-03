import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Heart, Search, Menu, X, User, Phone, LogOut, Settings, Package, ChevronDown } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCart } from "@/hooks/use-cart";
import { useFavorites } from "@/hooks/use-favorites";
import { useSeason } from "@/hooks/use-season";
import { useAuth } from "@/hooks/use-auth";
import { SearchAutocomplete } from "./SearchAutocomplete";

const summerNavigation = [
  { name: "Каталог", href: "/catalog" },
  { name: "Велосипеды", href: "/catalog/bicycles" },
  { name: "Электро", href: "/catalog/e-bikes" },
  { name: "Самокаты", href: "/catalog/scooters" },
  { name: "BMX", href: "/catalog/bmx" },
  { name: "Детям", href: "/catalog/kids" },
];

const winterNavigation = [
  { name: "Каталог", href: "/catalog" },
  { name: "Тюбинги", href: "/catalog/tubing" },
  { name: "Ёлки", href: "/catalog/christmas-trees" },
  { name: "Декор", href: "/catalog/decor" },
  { name: "Праздник", href: "/catalog/party" },
  { name: "Детям", href: "/catalog/kids" },
];

const getInitials = (name: string | null, email: string) => {
  if (name) {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  }
  return email[0].toUpperCase();
};

export function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { itemCount } = useCart();
  const { count: favoritesCount } = useFavorites();
  const { season } = useSeason();
  const { user, profile, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();

  const navigation = season === "winter" ? winterNavigation : summerNavigation;
  const quizText = season === "winter" ? "🎁 Подобрать подарок" : "🎯 Подобрать велосипед";

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const displayName = profile?.display_name || user?.email?.split('@')[0] || '';

  return (
    <header className="sticky top-0 z-50 w-full bg-foreground">
      {/* Top bar with phone */}
      <div className="hidden lg:block border-b border-white/10">
        <div className="container-shop flex h-10 items-center justify-between text-sm text-white/80">
          <div className="flex items-center gap-6">
            <Link to="/about" className="hover:text-primary transition-colors">О магазине</Link>
            <Link to="/delivery" className="hover:text-primary transition-colors">Доставка и оплата</Link>
            <Link to="/contacts" className="hover:text-primary transition-colors">Контакты</Link>
          </div>
          <a href="tel:+79247881111" className="flex items-center gap-2 hover:text-primary transition-colors font-semibold text-primary">
            <Phone className="h-4 w-4" />
            +7 924-788-11-11
          </a>
        </div>
      </div>

      <div className="container-shop">
        {/* Main header */}
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0 group">
            <span className="font-black text-2xl tracking-tight text-secondary group-hover:scale-105 transition-transform">
              SPIN<span className="text-primary">RIDE</span>
            </span>
          </Link>

          {/* Search - Desktop with Autocomplete */}
          <div className="hidden md:flex flex-1 max-w-lg">
            <SearchAutocomplete variant="desktop" />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Mobile search toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-white hover:text-primary hover:bg-white/10"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              {isSearchOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
            </Button>

            {/* Favorites */}
            <Link to="/favorites">
              <Button variant="ghost" size="icon" className="relative text-white hover:text-primary hover:bg-white/10 hover:scale-110 transition-all">
                <Heart className="h-5 w-5" />
                {favoritesCount > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs animate-scale-in"
                  >
                    {favoritesCount}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* Cart */}
            <Link to="/cart">
              <Button variant="ghost" size="icon" className="relative text-white hover:text-primary hover:bg-white/10 hover:scale-110 transition-all">
                <ShoppingCart className="h-5 w-5" />
                {itemCount > 0 && (
                  <Badge 
                    className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs bg-primary text-primary-foreground animate-scale-in"
                  >
                    {itemCount}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* User/Auth */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="flex items-center gap-2 text-white hover:text-primary hover:bg-white/10 px-2"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={profile?.avatar_url || undefined} alt={displayName} />
                      <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                        {getInitials(profile?.display_name || null, user.email || 'U')}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden lg:inline-block max-w-24 truncate text-sm font-medium">
                      {displayName}
                    </span>
                    <ChevronDown className="h-4 w-4 hidden lg:block" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-popover">
                  <div className="px-2 py-1.5 text-sm font-medium truncate text-foreground">
                    {user.email}
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link to="/profile" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Мой профиль
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link to="/orders" className="flex items-center gap-2">
                      <Package className="h-4 w-4" />
                      Мои заказы
                    </Link>
                  </DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem asChild className="cursor-pointer">
                      <Link to="/admin" className="flex items-center gap-2">
                        <Settings className="h-4 w-4" />
                        Админ-панель
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={handleSignOut}
                    className="cursor-pointer text-destructive focus:text-destructive"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Выйти
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/auth/login">
                <Button variant="ghost" size="icon" className="text-white hover:text-primary hover:bg-white/10">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
            )}

            {/* Mobile menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden text-white hover:text-primary hover:bg-white/10">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 bg-foreground border-white/10">
                <div className="flex flex-col gap-1 mt-8">
                  {/* User section */}
                  {user ? (
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 mb-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={profile?.avatar_url || undefined} alt={displayName} />
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {getInitials(profile?.display_name || null, user.email || 'U')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium truncate">{displayName}</p>
                        <p className="text-white/60 text-sm truncate">{user.email}</p>
                      </div>
                    </div>
                  ) : (
                    <Link 
                      to="/auth/login" 
                      className="flex items-center gap-3 p-4 rounded-xl bg-primary/10 text-primary font-bold mb-4"
                    >
                      <User className="h-5 w-5" />
                      Войти в аккаунт
                    </Link>
                  )}

                  {/* Phone */}
                  <a 
                    href="tel:+79247881111" 
                    className="flex items-center gap-3 p-4 rounded-xl bg-primary/10 text-primary font-bold mb-4"
                  >
                    <Phone className="h-5 w-5" />
                    +7 924-788-11-11
                  </a>
                  
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className="text-lg font-medium text-white hover:text-primary transition-colors p-3 rounded-lg hover:bg-white/5"
                    >
                      {item.name}
                    </Link>
                  ))}
                  
                  <div className="border-t border-white/10 mt-4 pt-4">
                    <Link
                      to="/quiz"
                      className="flex items-center gap-2 text-lg font-medium text-primary p-3"
                    >
                      {quizText}
                    </Link>
                  </div>

                  {/* User menu items for mobile */}
                  {user && (
                    <div className="border-t border-white/10 mt-4 pt-4 flex flex-col gap-1">
                      <Link
                        to="/profile"
                        className="flex items-center gap-3 text-white hover:text-primary p-3 rounded-lg hover:bg-white/5"
                      >
                        <User className="h-5 w-5" />
                        Мой профиль
                      </Link>
                      <Link
                        to="/orders"
                        className="flex items-center gap-3 text-white hover:text-primary p-3 rounded-lg hover:bg-white/5"
                      >
                        <Package className="h-5 w-5" />
                        Мои заказы
                      </Link>
                      {isAdmin && (
                        <Link
                          to="/admin"
                          className="flex items-center gap-3 text-white hover:text-primary p-3 rounded-lg hover:bg-white/5"
                        >
                          <Settings className="h-5 w-5" />
                          Админ-панель
                        </Link>
                      )}
                      <button
                        onClick={handleSignOut}
                        className="flex items-center gap-3 text-destructive p-3 rounded-lg hover:bg-white/5 w-full text-left"
                      >
                        <LogOut className="h-5 w-5" />
                        Выйти
                      </button>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Mobile search bar with autocomplete */}
        {isSearchOpen && (
          <div className="md:hidden pb-4">
            <SearchAutocomplete 
              variant="mobile" 
              onClose={() => setIsSearchOpen(false)} 
            />
          </div>
        )}

        {/* Desktop navigation */}
        <nav className="hidden lg:flex h-12 items-center gap-8">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className="text-sm font-medium text-white/70 hover:text-primary transition-colors underline-animate"
            >
              {item.name}
            </Link>
          ))}
          <Link
            to="/quiz"
            className="ml-auto text-sm font-bold text-primary hover:scale-105 transition-transform"
          >
            {quizText}
          </Link>
        </nav>
      </div>
    </header>
  );
}
