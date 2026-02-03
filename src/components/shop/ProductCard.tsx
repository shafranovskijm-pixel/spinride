import { Link } from "react-router-dom";
import { Heart, ShoppingCart, BarChart2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Product } from "@/types/shop";
import { useCart } from "@/hooks/use-cart";
import { useFavorites } from "@/hooks/use-favorites";
import { useCompare } from "@/hooks/use-compare";
import { InteractiveParticles } from "@/components/shop/InteractiveParticles";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const { addItem, isInCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  const { addToCompare, isInCompare, canAdd } = useCompare();

  const hasDiscount = product.sale_price && product.sale_price < product.price;
  const discountPercent = hasDiscount
    ? Math.round((1 - product.sale_price! / product.price) * 100)
    : 0;
  const displayPrice = hasDiscount ? product.sale_price! : product.price;
  const productImage = product.images?.[0] || "/placeholder.svg";

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(product.id);
  };

  const handleAddToCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isInCompare(product.id) && canAdd) {
      addToCompare(product);
    }
  };

  return (
    <Card className={cn("product-card card-shine overflow-hidden group relative", className)}>
      <InteractiveParticles count={12} interactionRadius={80} className="z-0" />
      <Link to={`/product/${product.slug}`} className="relative z-10">
        {/* Image container */}
        <div className="relative aspect-square overflow-hidden bg-muted">
          <img
            src={productImage}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1">
            {hasDiscount && (
              <Badge variant="destructive" className="text-xs font-semibold">
                -{discountPercent}%
              </Badge>
            )}
            {product.is_new && (
              <Badge className="bg-primary text-primary-foreground text-xs font-semibold">
                Новинка
              </Badge>
            )}
            {product.season !== "all" && (
              <Badge variant="secondary" className="text-xs font-semibold">
                {product.season === "summer" ? "☀️ Лето" : "❄️ Зима"}
              </Badge>
            )}
          </div>

          {/* Quick actions */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="secondary"
              size="icon"
              className={cn(
                "h-9 w-9 rounded-full shadow-md",
                isFavorite(product.id) && "bg-destructive text-destructive-foreground hover:bg-destructive/90"
              )}
              onClick={handleToggleFavorite}
            >
              <Heart className={cn("h-4 w-4", isFavorite(product.id) && "fill-current")} />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className={cn(
                "h-9 w-9 rounded-full shadow-md",
                isInCompare(product.id) && "bg-primary text-primary-foreground"
              )}
              onClick={handleAddToCompare}
              disabled={!canAdd && !isInCompare(product.id)}
            >
              <BarChart2 className="h-4 w-4" />
            </Button>
          </div>

          {/* Out of stock overlay */}
          {!product.in_stock && (
            <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
              <span className="text-muted-foreground font-medium">Нет в наличии</span>
            </div>
          )}
        </div>

        {/* Content */}
        <CardContent className="p-4">
          {/* Rating */}
          {product.rating_count > 0 && (
            <div className="flex items-center gap-1 mb-2">
              <Star className="h-4 w-4 fill-accent text-accent" />
              <span className="text-sm font-medium">{product.rating_average.toFixed(1)}</span>
              <span className="text-xs text-muted-foreground">
                ({product.rating_count})
              </span>
            </div>
          )}

          {/* Name */}
          <h3 className="font-semibold text-sm leading-tight mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>

          {/* Price and CTA */}
          <div className="flex items-end justify-between gap-2 mt-auto">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-bold">
                  {displayPrice.toLocaleString("ru-RU")} ₽
                </span>
                {hasDiscount && (
                  <span className="text-sm text-muted-foreground line-through">
                    {product.price.toLocaleString("ru-RU")} ₽
                  </span>
                )}
              </div>
            </div>
            <Button
              size="sm"
              className={cn(
                "shrink-0",
                isInCart(product.id) && "bg-secondary text-secondary-foreground"
              )}
              onClick={handleAddToCart}
              disabled={!product.in_stock}
            >
              <ShoppingCart className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
