import { Link } from "react-router-dom";
import { ArrowLeft, Heart, Trash2, ShoppingCart, Scale } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShopLayout } from "@/components/shop/ShopLayout";
import { useFavorites } from "@/hooks/use-favorites";
import { useCart } from "@/hooks/use-cart";
import { useCompare } from "@/hooks/use-compare";
import { mockProducts } from "@/data/mock-products";
import { cn } from "@/lib/utils";

export default function FavoritesPage() {
  const { favorites, removeFavorite, count } = useFavorites();
  const { addItem } = useCart();
  const { addToCompare, isInCompare, canAdd } = useCompare();

  // Get full product data for favorites
  const favoriteProducts = mockProducts.filter((product) =>
    favorites.includes(product.id)
  );

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ru-RU").format(price) + " ₽";
  };

  const clearAllFavorites = () => {
    favorites.forEach((id) => removeFavorite(id));
  };

  if (count === 0) {
    return (
      <ShopLayout>
        <div className="container-shop py-12">
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
              <Heart className="h-12 w-12 text-muted-foreground" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Список избранного пуст</h1>
            <p className="text-muted-foreground mb-6">
              Добавляйте понравившиеся товары, нажимая на сердечко
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
            <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
              <Heart className="h-8 w-8 text-destructive fill-destructive" />
              Избранное
            </h1>
            <p className="text-muted-foreground">{count} товар(а) в избранном</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={clearAllFavorites}>
              <Trash2 className="h-4 w-4 mr-2" />
              Очистить всё
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link to="/catalog">
                Добавить ещё
              </Link>
            </Button>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favoriteProducts.map((product) => (
            <Card 
              key={product.id} 
              className="group relative overflow-hidden product-card"
            >
              {/* Remove button */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-3 right-3 z-10 h-9 w-9 bg-background/80 hover:bg-destructive hover:text-destructive-foreground rounded-full shadow-sm"
                onClick={() => removeFavorite(product.id)}
              >
                <Heart className="h-5 w-5 fill-destructive text-destructive" />
              </Button>

              <CardContent className="p-4">
                {/* Image */}
                <Link to={`/product/${product.slug}`} className="block mb-4">
                  <div className="aspect-square rounded-xl overflow-hidden bg-muted">
                    <img
                      src={product.images?.[0] || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </Link>

                {/* Badges */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {product.is_new && (
                    <Badge className="new-badge">Новинка</Badge>
                  )}
                  {product.sale_price && (
                    <Badge variant="destructive">
                      -{Math.round((1 - product.sale_price / product.price) * 100)}%
                    </Badge>
                  )}
                  {!product.in_stock && (
                    <Badge variant="secondary">Нет в наличии</Badge>
                  )}
                </div>

                {/* Name */}
                <Link 
                  to={`/product/${product.slug}`}
                  className="font-semibold hover:text-primary transition-colors line-clamp-2 mb-2 block"
                >
                  {product.name}
                </Link>

                {/* Rating */}
                {product.rating_count > 0 && (
                  <div className="flex items-center gap-1 mb-3 text-sm">
                    <span className="text-primary">★</span>
                    <span className="font-medium">{product.rating_average.toFixed(1)}</span>
                    <span className="text-muted-foreground">({product.rating_count})</span>
                  </div>
                )}

                {/* Price */}
                <div className="mb-4">
                  {product.sale_price ? (
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl font-bold text-destructive">
                        {formatPrice(product.sale_price)}
                      </span>
                      <span className="text-sm text-muted-foreground line-through">
                        {formatPrice(product.price)}
                      </span>
                    </div>
                  ) : (
                    <span className="text-xl font-bold">
                      {formatPrice(product.price)}
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button 
                    className="flex-1" 
                    size="sm"
                    onClick={() => addItem(product)}
                    disabled={!product.in_stock}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    {product.in_stock ? "В корзину" : "Нет в наличии"}
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className={cn(
                      "shrink-0",
                      isInCompare(product.id) && "bg-secondary text-secondary-foreground"
                    )}
                    onClick={() => addToCompare(product)}
                    disabled={!canAdd && !isInCompare(product.id)}
                    title={isInCompare(product.id) ? "В сравнении" : "Добавить к сравнению"}
                  >
                    <Scale className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick actions */}
        <div className="mt-12 p-6 bg-muted/50 rounded-2xl text-center">
          <h3 className="font-semibold text-lg mb-2">Хотите сравнить товары?</h3>
          <p className="text-muted-foreground mb-4">
            Добавьте товары к сравнению, чтобы выбрать лучший вариант
          </p>
          <Button asChild variant="outline">
            <Link to="/compare">
              <Scale className="h-4 w-4 mr-2" />
              Перейти к сравнению
            </Link>
          </Button>
        </div>
      </div>
    </ShopLayout>
  );
}
