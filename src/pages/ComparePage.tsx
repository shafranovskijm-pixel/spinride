import { Link } from "react-router-dom";
import { ArrowLeft, X, ShoppingCart, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShopLayout } from "@/components/shop/ShopLayout";
import { useCompare } from "@/hooks/use-compare";
import { useCart } from "@/hooks/use-cart";
import { cn } from "@/lib/utils";

export default function ComparePage() {
  const { compareItems, removeFromCompare, clearCompare, count } = useCompare();
  const { addItem } = useCart();

  // Get all unique specification keys from all products
  const allSpecKeys = Array.from(
    new Set(
      compareItems.flatMap((product) => Object.keys(product.specifications || {}))
    )
  );

  // Common specs to always show first
  const prioritySpecs = ["Размер колёс", "Рама", "Скоростей", "Мощность", "Батарея", "Запас хода", "Макс. скорость"];
  
  // Sort specs: priority first, then alphabetically
  const sortedSpecKeys = [
    ...prioritySpecs.filter((key) => allSpecKeys.includes(key)),
    ...allSpecKeys.filter((key) => !prioritySpecs.includes(key)).sort(),
  ];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ru-RU").format(price) + " ₽";
  };

  if (count === 0) {
    return (
      <ShopLayout>
        <div className="container-shop py-12">
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
              <span className="text-5xl">⚖️</span>
            </div>
            <h1 className="text-2xl font-bold mb-2">Нет товаров для сравнения</h1>
            <p className="text-muted-foreground mb-6">
              Добавьте товары для сравнения из каталога
            </p>
            <Button asChild>
              <Link to="/catalog">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Перейти в каталог
              </Link>
            </Button>
          </div>
        </div>
      </ShopLayout>
    );
  }

  return (
    <ShopLayout>
      <div className="container-shop py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Сравнение товаров</h1>
            <p className="text-muted-foreground">{count} товар(а) в сравнении</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={clearCompare}>
              <Trash2 className="h-4 w-4 mr-2" />
              Очистить
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link to="/catalog">
                <Plus className="h-4 w-4 mr-2" />
                Добавить
              </Link>
            </Button>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="overflow-x-auto -mx-4 px-4">
          <div className="min-w-[640px]">
            {/* Products Header Row */}
            <div className="grid gap-4 mb-6" style={{ gridTemplateColumns: `200px repeat(${count}, 1fr)` }}>
              <div className="sticky left-0 bg-background z-10" />
              {compareItems.map((product) => (
                <Card key={product.id} className="relative overflow-hidden">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 z-10 h-8 w-8 bg-background/80 hover:bg-destructive hover:text-destructive-foreground"
                    onClick={() => removeFromCompare(product.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  <CardContent className="p-4">
                    {/* Image */}
                    <Link to={`/product/${product.slug}`} className="block mb-4">
                      <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                        <img
                          src={product.images?.[0] || "/placeholder.svg"}
                          alt={product.name}
                          className="w-full h-full object-cover hover:scale-105 transition-transform"
                        />
                      </div>
                    </Link>

                    {/* Badges */}
                    <div className="flex flex-wrap gap-1 mb-2">
                      {product.is_new && (
                        <Badge className="new-badge">Новинка</Badge>
                      )}
                      {product.sale_price && (
                        <Badge variant="destructive">Скидка</Badge>
                      )}
                    </div>

                    {/* Name */}
                    <Link 
                      to={`/product/${product.slug}`}
                      className="font-semibold text-sm hover:text-primary transition-colors line-clamp-2 mb-2"
                    >
                      {product.name}
                    </Link>

                    {/* Price */}
                    <div className="mb-4">
                      {product.sale_price ? (
                        <div className="flex items-baseline gap-2">
                          <span className="text-lg font-bold text-destructive">
                            {formatPrice(product.sale_price)}
                          </span>
                          <span className="text-sm text-muted-foreground line-through">
                            {formatPrice(product.price)}
                          </span>
                        </div>
                      ) : (
                        <span className="text-lg font-bold">
                          {formatPrice(product.price)}
                        </span>
                      )}
                    </div>

                    {/* Rating */}
                    {product.rating_count > 0 && (
                      <div className="flex items-center gap-1 mb-4 text-sm">
                        <span className="text-primary">★</span>
                        <span className="font-medium">{product.rating_average.toFixed(1)}</span>
                        <span className="text-muted-foreground">({product.rating_count})</span>
                      </div>
                    )}

                    {/* Add to cart */}
                    <Button 
                      className="w-full" 
                      size="sm"
                      onClick={() => addItem(product)}
                      disabled={!product.in_stock}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      {product.in_stock ? "В корзину" : "Нет в наличии"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Specifications Table */}
            <div className="border rounded-xl overflow-hidden bg-card">
              {/* Stock Status */}
              <div 
                className="grid gap-4 border-b"
                style={{ gridTemplateColumns: `200px repeat(${count}, 1fr)` }}
              >
                <div className="p-4 font-medium bg-muted/50 sticky left-0">
                  Наличие
                </div>
                {compareItems.map((product) => (
                  <div key={product.id} className="p-4 flex items-center">
                    {product.in_stock ? (
                      <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                        ✓ В наличии
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/30">
                        ✗ Нет в наличии
                      </Badge>
                    )}
                  </div>
                ))}
              </div>

              {/* Season */}
              <div 
                className="grid gap-4 border-b"
                style={{ gridTemplateColumns: `200px repeat(${count}, 1fr)` }}
              >
                <div className="p-4 font-medium bg-muted/50 sticky left-0">
                  Сезон
                </div>
                {compareItems.map((product) => (
                  <div key={product.id} className="p-4">
                    <Badge variant="secondary">
                      {product.season === "summer" ? "☀️ Лето" : 
                       product.season === "winter" ? "❄️ Зима" : "🌓 Всесезон"}
                    </Badge>
                  </div>
                ))}
              </div>

              {/* Dynamic Specifications */}
              {sortedSpecKeys.map((specKey, index) => (
                <div 
                  key={specKey}
                  className={cn(
                    "grid gap-4",
                    index < sortedSpecKeys.length - 1 && "border-b"
                  )}
                  style={{ gridTemplateColumns: `200px repeat(${count}, 1fr)` }}
                >
                  <div className="p-4 font-medium bg-muted/50 sticky left-0">
                    {specKey}
                  </div>
                  {compareItems.map((product) => {
                    const value = product.specifications?.[specKey];
                    return (
                      <div 
                        key={product.id} 
                        className={cn(
                          "p-4",
                          value ? "text-foreground" : "text-muted-foreground"
                        )}
                      >
                        {value || "—"}
                      </div>
                    );
                  })}
                </div>
              ))}

              {/* Description */}
              <div 
                className="grid gap-4"
                style={{ gridTemplateColumns: `200px repeat(${count}, 1fr)` }}
              >
                <div className="p-4 font-medium bg-muted/50 sticky left-0">
                  Описание
                </div>
                {compareItems.map((product) => (
                  <div key={product.id} className="p-4 text-sm text-muted-foreground">
                    {product.description || "—"}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ShopLayout>
  );
}
