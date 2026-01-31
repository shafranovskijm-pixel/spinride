import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

interface SearchResult {
  id: string;
  name: string;
  slug: string;
  price: number;
  sale_price: number | null;
  images: string[] | null;
  category_id: string | null;
  in_stock: boolean | null;
}

interface SearchAutocompleteProps {
  variant?: "desktop" | "mobile";
  onClose?: () => void;
  className?: string;
}

export function SearchAutocomplete({ 
  variant = "desktop", 
  onClose,
  className 
}: SearchAutocompleteProps) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Debounced search
  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("products")
          .select("id, name, slug, price, sale_price, images, category_id, in_stock")
          .ilike("name", `%${query}%`)
          .limit(8);

        if (error) throw error;
        setResults(data || []);
        setIsOpen(true);
      } catch (error) {
        console.error("Search error:", error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || results.length === 0) {
      if (e.key === "Enter" && query.length >= 2) {
        handleSearch();
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev));
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0) {
          handleSelectProduct(results[selectedIndex]);
        } else {
          handleSearch();
        }
        break;
      case "Escape":
        setIsOpen(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const handleSearch = () => {
    if (query.trim()) {
      navigate(`/catalog?search=${encodeURIComponent(query.trim())}`);
      setQuery("");
      setIsOpen(false);
      onClose?.();
    }
  };

  const handleSelectProduct = (product: SearchResult) => {
    navigate(`/product/${product.slug}`);
    setQuery("");
    setIsOpen(false);
    setSelectedIndex(-1);
    onClose?.();
  };

  const handleClear = () => {
    setQuery("");
    setResults([]);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const displayPrice = (product: SearchResult) => {
    const price = product.sale_price ?? product.price;
    return price.toLocaleString("ru-RU");
  };

  const isDesktop = variant === "desktop";

  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none z-10" />
        <Input
          ref={inputRef}
          type="text"
          placeholder="Поиск велосипедов, самокатов..."
          className={cn(
            "pl-10 pr-10",
            isDesktop 
              ? "bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:bg-white focus:text-foreground focus:placeholder:text-muted-foreground transition-colors" 
              : "bg-white text-foreground"
          )}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setSelectedIndex(-1);
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => query.length >= 2 && results.length > 0 && setIsOpen(true)}
          autoFocus={!isDesktop}
        />
        {query && (
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7",
              isDesktop ? "text-white/70 hover:text-white hover:bg-white/10" : ""
            )}
            onClick={handleClear}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <X className="h-4 w-4" />
            )}
          </Button>
        )}
      </div>

      {/* Dropdown results */}
      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card border rounded-lg shadow-xl overflow-hidden z-50 max-h-[400px] overflow-y-auto">
          {results.map((product, index) => (
            <button
              key={product.id}
              className={cn(
                "w-full flex items-center gap-3 p-3 text-left transition-colors",
                index === selectedIndex ? "bg-accent" : "hover:bg-muted",
                index !== results.length - 1 && "border-b"
              )}
              onClick={() => handleSelectProduct(product)}
              onMouseEnter={() => setSelectedIndex(index)}
            >
              {/* Image */}
              <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted shrink-0">
                <img
                  src={product.images?.[0] || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm line-clamp-1">{product.name}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-sm font-bold text-primary">
                    {displayPrice(product)} ₽
                  </span>
                  {product.sale_price && (
                    <span className="text-xs text-muted-foreground line-through">
                      {product.price.toLocaleString("ru-RU")} ₽
                    </span>
                  )}
                  {!product.in_stock && (
                    <Badge variant="secondary" className="text-xs">
                      Нет в наличии
                    </Badge>
                  )}
                </div>
              </div>
            </button>
          ))}
          
          {/* Show all results */}
          <button
            className={cn(
              "w-full p-3 text-center text-sm font-medium text-primary hover:bg-muted transition-colors border-t",
              selectedIndex === -1 && query.length >= 2 && "bg-accent/50"
            )}
            onClick={handleSearch}
          >
            Показать все результаты для "{query}"
          </button>
        </div>
      )}

      {/* No results message */}
      {isOpen && query.length >= 2 && results.length === 0 && !isLoading && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card border rounded-lg shadow-xl p-4 text-center z-50">
          <p className="text-muted-foreground text-sm">
            По запросу "{query}" ничего не найдено
          </p>
          <Button
            variant="link"
            className="mt-1 text-primary"
            onClick={() => navigate("/catalog")}
          >
            Смотреть весь каталог
          </Button>
        </div>
      )}
    </div>
  );
}
