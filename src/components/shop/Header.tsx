import { Link } from "react-router-dom";
import { ShoppingCart, Heart, Search, Menu, X, User, Phone } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useCart } from "@/hooks/use-cart";
import { useFavorites } from "@/hooks/use-favorites";
import { useSeason } from "@/hooks/use-season";
import { SearchAutocomplete } from "./SearchAutocomplete";

const navigation = [
  { name: "Каталог", href: "/catalog" },
  { name: "Велосипеды", href: "/catalog/bicycles" },
  { name: "Электро", href: "/catalog/e-bikes" },
  { name: "Самокаты", href: "/catalog/scooters" },
  { name: "BMX", href: "/catalog/bmx" },
  { name: "Детям", href: "/catalog/kids" },
];

export function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { itemCount } = useCart();
  const { count: favoritesCount } = useFavorites();
  const { season } = useSeason();

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
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <span className="font-black text-2xl tracking-tight text-secondary">
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
              <Button variant="ghost" size="icon" className="relative text-white hover:text-primary hover:bg-white/10">
                <Heart className="h-5 w-5" />
                {favoritesCount > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
                  >
                    {favoritesCount}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* Cart */}
            <Link to="/cart">
              <Button variant="ghost" size="icon" className="relative text-white hover:text-primary hover:bg-white/10">
                <ShoppingCart className="h-5 w-5" />
                {itemCount > 0 && (
                  <Badge 
                    className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs bg-primary text-primary-foreground"
                  >
                    {itemCount}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* User/Admin */}
            <Link to="/admin">
              <Button variant="ghost" size="icon" className="text-white hover:text-primary hover:bg-white/10">
                <User className="h-5 w-5" />
              </Button>
            </Link>

            {/* Mobile menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden text-white hover:text-primary hover:bg-white/10">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 bg-foreground border-white/10">
                <div className="flex flex-col gap-1 mt-8">
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
                      🎯 Подобрать велосипед
                    </Link>
                  </div>
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
              className="text-sm font-medium text-white/70 hover:text-primary transition-colors"
            >
              {item.name}
            </Link>
          ))}
          <Link
            to="/quiz"
            className="ml-auto text-sm font-bold text-primary hover:underline"
          >
            🎯 Подобрать велосипед
          </Link>
        </nav>
      </div>
    </header>
  );
}
