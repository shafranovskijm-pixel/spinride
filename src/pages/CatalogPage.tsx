import { useState, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { 
  Filter, 
  X, 
  ChevronDown,
  SlidersHorizontal,
  Grid3X3,
  List
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ShopLayout } from "@/components/shop/ShopLayout";
import { ProductCard } from "@/components/shop/ProductCard";
import { mockProducts } from "@/data/mock-products";
import { cn } from "@/lib/utils";

const categories = [
  { slug: "bicycles", name: "Велосипеды", count: 45 },
  { slug: "e-bikes", name: "Электровелосипеды", count: 12 },
  { slug: "scooters", name: "Самокаты", count: 28 },
  { slug: "e-scooters", name: "Электросамокаты", count: 15 },
  { slug: "bmx", name: "BMX", count: 8 },
  { slug: "kids", name: "Детям", count: 35 },
  { slug: "accessories", name: "Аксессуары", count: 120 },
  { slug: "parts", name: "Запчасти", count: 200 },
  { slug: "atv", name: "Квадроциклы", count: 5 },
];

const seasons = [
  { value: "all", label: "Все сезоны" },
  { value: "summer", label: "☀️ Лето" },
  { value: "winter", label: "❄️ Зима" },
];

const sortOptions = [
  { value: "popular", label: "По популярности" },
  { value: "price-asc", label: "Сначала дешевле" },
  { value: "price-desc", label: "Сначала дороже" },
  { value: "new", label: "Сначала новинки" },
  { value: "rating", label: "По рейтингу" },
];

export default function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Get filter values from URL
  const selectedCategories = searchParams.get("categories")?.split(",").filter(Boolean) || [];
  const selectedSeason = searchParams.get("season") || "all";
  const minPrice = Number(searchParams.get("minPrice")) || 0;
  const maxPrice = Number(searchParams.get("maxPrice")) || 100000;
  const sortBy = searchParams.get("sort") || "popular";
  const searchQuery = searchParams.get("q") || "";
  const showInStock = searchParams.get("inStock") === "true";
  const showSale = searchParams.get("sale") === "true";
  const showNew = searchParams.get("new") === "true";

  // Price range for slider
  const priceRange = [minPrice, maxPrice];

  // Update URL params
  const updateFilters = (key: string, value: string | string[] | number | boolean | null) => {
    const newParams = new URLSearchParams(searchParams);
    
    if (value === null || value === "" || (Array.isArray(value) && value.length === 0)) {
      newParams.delete(key);
    } else if (Array.isArray(value)) {
      newParams.set(key, value.join(","));
    } else {
      newParams.set(key, String(value));
    }
    
    setSearchParams(newParams);
  };

  // Toggle category
  const toggleCategory = (slug: string) => {
    const newCategories = selectedCategories.includes(slug)
      ? selectedCategories.filter((c) => c !== slug)
      : [...selectedCategories, slug];
    updateFilters("categories", newCategories);
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let products = [...mockProducts];

    // Search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description?.toLowerCase().includes(query)
      );
    }

    // Categories
    if (selectedCategories.length > 0) {
      products = products.filter((p) =>
        selectedCategories.includes(p.category_id || "")
      );
    }

    // Season
    if (selectedSeason !== "all") {
      products = products.filter(
        (p) => p.season === selectedSeason || p.season === "all"
      );
    }

    // Price range
    products = products.filter((p) => {
      const price = p.sale_price ?? p.price;
      return price >= minPrice && price <= maxPrice;
    });

    // In stock
    if (showInStock) {
      products = products.filter((p) => p.in_stock);
    }

    // Sale
    if (showSale) {
      products = products.filter((p) => p.sale_price && p.sale_price < p.price);
    }

    // New
    if (showNew) {
      products = products.filter((p) => p.is_new);
    }

    // Sort
    switch (sortBy) {
      case "price-asc":
        products.sort((a, b) => (a.sale_price ?? a.price) - (b.sale_price ?? b.price));
        break;
      case "price-desc":
        products.sort((a, b) => (b.sale_price ?? b.price) - (a.sale_price ?? a.price));
        break;
      case "new":
        products.sort((a, b) => (b.is_new ? 1 : 0) - (a.is_new ? 1 : 0));
        break;
      case "rating":
        products.sort((a, b) => b.rating_average - a.rating_average);
        break;
      default:
        products.sort((a, b) => b.rating_count - a.rating_count);
    }

    return products;
  }, [
    searchQuery,
    selectedCategories,
    selectedSeason,
    minPrice,
    maxPrice,
    showInStock,
    showSale,
    showNew,
    sortBy,
  ]);

  // Active filters count
  const activeFiltersCount = [
    selectedCategories.length > 0,
    selectedSeason !== "all",
    minPrice > 0 || maxPrice < 100000,
    showInStock,
    showSale,
    showNew,
  ].filter(Boolean).length;

  // Filter sidebar content
  const FilterContent = () => (
    <div className="space-y-6">
      {/* Categories */}
      <Collapsible defaultOpen>
        <CollapsibleTrigger className="flex items-center justify-between w-full py-2 font-semibold">
          Категории
          <ChevronDown className="h-4 w-4" />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-2 space-y-2">
          {categories.map((category) => (
            <label
              key={category.slug}
              className="flex items-center gap-3 py-1 cursor-pointer hover:text-primary"
            >
              <Checkbox
                checked={selectedCategories.includes(category.slug)}
                onCheckedChange={() => toggleCategory(category.slug)}
              />
              <span className="flex-1 text-sm">{category.name}</span>
              <span className="text-xs text-muted-foreground">{category.count}</span>
            </label>
          ))}
        </CollapsibleContent>
      </Collapsible>

      {/* Season */}
      <Collapsible defaultOpen>
        <CollapsibleTrigger className="flex items-center justify-between w-full py-2 font-semibold">
          Сезон
          <ChevronDown className="h-4 w-4" />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-2 space-y-2">
          {seasons.map((season) => (
            <label
              key={season.value}
              className="flex items-center gap-3 py-1 cursor-pointer hover:text-primary"
            >
              <Checkbox
                checked={selectedSeason === season.value}
                onCheckedChange={() =>
                  updateFilters("season", season.value === "all" ? null : season.value)
                }
              />
              <span className="text-sm">{season.label}</span>
            </label>
          ))}
        </CollapsibleContent>
      </Collapsible>

      {/* Price */}
      <Collapsible defaultOpen>
        <CollapsibleTrigger className="flex items-center justify-between w-full py-2 font-semibold">
          Цена
          <ChevronDown className="h-4 w-4" />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-4 space-y-4">
          <Slider
            value={priceRange}
            min={0}
            max={100000}
            step={1000}
            onValueChange={(value) => {
              updateFilters("minPrice", value[0] > 0 ? value[0] : null);
              updateFilters("maxPrice", value[1] < 100000 ? value[1] : null);
            }}
            className="w-full"
          />
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <Label className="text-xs text-muted-foreground">От</Label>
              <Input
                type="number"
                value={minPrice}
                onChange={(e) => updateFilters("minPrice", Number(e.target.value) || null)}
                className="h-9"
              />
            </div>
            <div className="flex-1">
              <Label className="text-xs text-muted-foreground">До</Label>
              <Input
                type="number"
                value={maxPrice}
                onChange={(e) => updateFilters("maxPrice", Number(e.target.value) || null)}
                className="h-9"
              />
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Additional filters */}
      <Collapsible defaultOpen>
        <CollapsibleTrigger className="flex items-center justify-between w-full py-2 font-semibold">
          Дополнительно
          <ChevronDown className="h-4 w-4" />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-2 space-y-2">
          <label className="flex items-center gap-3 py-1 cursor-pointer hover:text-primary">
            <Checkbox
              checked={showInStock}
              onCheckedChange={(checked) => updateFilters("inStock", checked ? "true" : null)}
            />
            <span className="text-sm">Только в наличии</span>
          </label>
          <label className="flex items-center gap-3 py-1 cursor-pointer hover:text-primary">
            <Checkbox
              checked={showSale}
              onCheckedChange={(checked) => updateFilters("sale", checked ? "true" : null)}
            />
            <span className="text-sm">Со скидкой</span>
          </label>
          <label className="flex items-center gap-3 py-1 cursor-pointer hover:text-primary">
            <Checkbox
              checked={showNew}
              onCheckedChange={(checked) => updateFilters("new", checked ? "true" : null)}
            />
            <span className="text-sm">Новинки</span>
          </label>
        </CollapsibleContent>
      </Collapsible>

      {/* Clear filters */}
      {activeFiltersCount > 0 && (
        <Button variant="outline" className="w-full" onClick={clearFilters}>
          <X className="h-4 w-4 mr-2" />
          Сбросить фильтры
        </Button>
      )}
    </div>
  );

  return (
    <ShopLayout>
      <div className="container-shop py-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link to="/" className="hover:text-primary">Главная</Link>
          <span>/</span>
          <span className="text-foreground">Каталог</span>
        </nav>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Каталог</h1>
            <p className="text-muted-foreground mt-1">
              {filteredProducts.length} товар(ов)
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Mobile filter button */}
            <Sheet open={isMobileFiltersOpen} onOpenChange={setIsMobileFiltersOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="lg:hidden">
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Фильтры
                  {activeFiltersCount > 0 && (
                    <Badge className="ml-2 h-5 w-5 p-0 flex items-center justify-center">
                      {activeFiltersCount}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Фильтры</SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                  <FilterContent />
                </div>
              </SheetContent>
            </Sheet>

            {/* Sort */}
            <Select value={sortBy} onValueChange={(value) => updateFilters("sort", value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Сортировка" />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* View mode */}
            <div className="hidden sm:flex items-center border rounded-md">
              <Button
                variant={viewMode === "grid" ? "secondary" : "ghost"}
                size="icon"
                className="rounded-r-none"
                onClick={() => setViewMode("grid")}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "secondary" : "ghost"}
                size="icon"
                className="rounded-l-none"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Active filters badges */}
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {selectedCategories.map((slug) => {
              const cat = categories.find((c) => c.slug === slug);
              return (
                <Badge key={slug} variant="secondary" className="gap-1">
                  {cat?.name}
                  <button onClick={() => toggleCategory(slug)}>
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              );
            })}
            {selectedSeason !== "all" && (
              <Badge variant="secondary" className="gap-1">
                {seasons.find((s) => s.value === selectedSeason)?.label}
                <button onClick={() => updateFilters("season", null)}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {(minPrice > 0 || maxPrice < 100000) && (
              <Badge variant="secondary" className="gap-1">
                {minPrice.toLocaleString()} - {maxPrice.toLocaleString()} ₽
                <button onClick={() => {
                  updateFilters("minPrice", null);
                  updateFilters("maxPrice", null);
                }}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {showInStock && (
              <Badge variant="secondary" className="gap-1">
                В наличии
                <button onClick={() => updateFilters("inStock", null)}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {showSale && (
              <Badge variant="secondary" className="gap-1">
                Со скидкой
                <button onClick={() => updateFilters("sale", null)}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {showNew && (
              <Badge variant="secondary" className="gap-1">
                Новинки
                <button onClick={() => updateFilters("new", null)}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            <Button variant="ghost" size="sm" onClick={clearFilters} className="h-6 px-2 text-xs">
              Сбросить все
            </Button>
          </div>
        )}

        {/* Main content */}
        <div className="flex gap-8">
          {/* Desktop sidebar */}
          <aside className="hidden lg:block w-64 shrink-0">
            <FilterContent />
          </aside>

          {/* Products grid */}
          <div className="flex-1">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-16">
                <Filter className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h2 className="text-xl font-semibold mb-2">Товары не найдены</h2>
                <p className="text-muted-foreground mb-4">
                  Попробуйте изменить параметры фильтрации
                </p>
                <Button variant="outline" onClick={clearFilters}>
                  Сбросить фильтры
                </Button>
              </div>
            ) : (
              <div
                className={cn(
                  "grid gap-4 md:gap-6",
                  viewMode === "grid"
                    ? "grid-cols-2 md:grid-cols-3 xl:grid-cols-4"
                    : "grid-cols-1"
                )}
              >
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </ShopLayout>
  );
}
