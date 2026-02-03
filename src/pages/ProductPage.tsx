import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { 
  ChevronLeft, 
  ChevronRight, 
  Heart, 
  ShoppingCart, 
  BarChart2, 
  Star, 
  Truck, 
  Shield, 
  Check,
  Minus,
  Plus,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShopLayout } from "@/components/shop/ShopLayout";
import { ProductCard } from "@/components/shop/ProductCard";
import { ReviewForm } from "@/components/shop/ReviewForm";
import { ReviewList } from "@/components/shop/ReviewList";
import { useCart } from "@/hooks/use-cart";
import { useFavorites } from "@/hooks/use-favorites";
import { useCompare } from "@/hooks/use-compare";
import { useProduct, useRelatedProducts } from "@/hooks/use-products";
import { useDocumentSEO } from "@/hooks/use-seo";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const [quantity, setQuantity] = useState(1);
  const [currentImage, setCurrentImage] = useState(0);
  
  const { addItem, isInCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  const { addToCompare, isInCompare, canAdd } = useCompare();

  // Fetch product from database
  const { data: product, isLoading: productLoading, error } = useProduct(slug || "");

  // Fetch related products
  const { data: relatedProducts = [] } = useRelatedProducts(
    product?.id || "",
    product?.category_id || null
  );

  // Fetch reviews from Supabase
  const { data: reviews = [], isLoading: reviewsLoading, refetch: refetchReviews } = useQuery({
    queryKey: ["reviews", product?.id],
    queryFn: async () => {
      if (!product?.id) return [];
      
      const { data, error } = await supabase
        .from("reviews")
        .select("id, author_name, rating, content, created_at")
        .eq("product_id", product.id)
        .eq("is_approved", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!product?.id,
  });

  // Loading state
  if (productLoading) {
    return (
      <ShopLayout>
        <div className="container-shop py-20 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </ShopLayout>
    );
  }
  
  // Not found state
  if (!product || error) {
    return (
      <ShopLayout>
        <div className="container-shop py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Товар не найден</h1>
          <Button asChild>
            <Link to="/catalog">Вернуться в каталог</Link>
          </Button>
        </div>
      </ShopLayout>
    );
  }

  const hasDiscount = product.sale_price && product.sale_price < product.price;
  const displayPrice = hasDiscount ? product.sale_price! : product.price;
  const discountPercent = hasDiscount
    ? Math.round((1 - product.sale_price! / product.price) * 100)
    : 0;
  
  const images = product.images?.length ? product.images : ["/placeholder.svg"];

  const handleAddToCart = () => {
    addItem(product, quantity);
  };

  // Calculate average rating from reviews
  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : product.rating_average;
  
  const reviewCount = reviews.length || product.rating_count;

  return (
    <ShopLayout>
      <div className="container-shop py-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link to="/" className="hover:text-primary">Главная</Link>
          <ChevronRight className="h-4 w-4" />
          <Link to="/catalog" className="hover:text-primary">Каталог</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground line-clamp-1">{product.name}</span>
        </nav>

        {/* Product */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Images */}
          <div className="space-y-4">
            {/* Main image */}
            <div className="relative aspect-square bg-muted rounded-xl overflow-hidden">
              <img
                src={images[currentImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              
              {/* Navigation arrows */}
              {images.length > 1 && (
                <>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="absolute left-4 top-1/2 -translate-y-1/2"
                    onClick={() => setCurrentImage(prev => prev === 0 ? images.length - 1 : prev - 1)}
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="absolute right-4 top-1/2 -translate-y-1/2"
                    onClick={() => setCurrentImage(prev => prev === images.length - 1 ? 0 : prev + 1)}
                  >
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </>
              )}

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {hasDiscount && (
                  <Badge variant="destructive">-{discountPercent}%</Badge>
                )}
                {product.is_new && (
                  <Badge className="bg-primary">Новинка</Badge>
                )}
              </div>
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImage(idx)}
                    className={cn(
                      "w-20 h-20 rounded-lg overflow-hidden shrink-0 border-2 transition-colors",
                      currentImage === idx ? "border-primary" : "border-transparent"
                    )}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="space-y-6">
            {/* Name and rating */}
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">{product.name}</h1>
              {reviewCount > 0 && (
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          "h-4 w-4",
                          i < Math.round(averageRating)
                            ? "fill-accent text-accent"
                            : "text-muted"
                        )}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium">{averageRating.toFixed(1)}</span>
                  <span className="text-sm text-muted-foreground">
                    ({reviewCount} отзывов)
                  </span>
                </div>
              )}
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold">
                {displayPrice.toLocaleString("ru-RU")} ₽
              </span>
              {hasDiscount && (
                <span className="text-xl text-muted-foreground line-through">
                  {product.price.toLocaleString("ru-RU")} ₽
                </span>
              )}
            </div>

            {/* Stock status */}
            <div className="flex items-center gap-2">
              {product.in_stock ? (
                <>
                  <Check className="h-5 w-5 text-green-500" />
                  <span className="text-green-600 font-medium">В наличии</span>
                  <span className="text-muted-foreground">({product.stock_quantity} шт.)</span>
                </>
              ) : (
                <span className="text-muted-foreground">Нет в наличии</span>
              )}
            </div>

            <Separator />

            {/* Quantity and actions */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium">Количество:</span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(q => Math.min(product.stock_quantity, q + 1))}
                    disabled={quantity >= product.stock_quantity}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  size="lg"
                  className="flex-1 gradient-cta text-primary-foreground"
                  onClick={handleAddToCart}
                  disabled={!product.in_stock}
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  {isInCart(product.id) ? "В корзине" : "В корзину"}
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className={cn(isFavorite(product.id) && "bg-destructive/10 border-destructive text-destructive")}
                  onClick={() => toggleFavorite(product.id)}
                >
                  <Heart className={cn("h-5 w-5", isFavorite(product.id) && "fill-current")} />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className={cn(isInCompare(product.id) && "bg-primary/10 border-primary text-primary")}
                  onClick={() => canAdd && addToCompare(product)}
                  disabled={!canAdd && !isInCompare(product.id)}
                >
                  <BarChart2 className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Benefits */}
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="flex items-center gap-3 text-sm">
                <Truck className="h-5 w-5 text-primary" />
                <span>Доставка по городу</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Shield className="h-5 w-5 text-primary" />
                <span>Гарантия 1 год</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="specs" className="mt-12">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="specs">Характеристики</TabsTrigger>
            <TabsTrigger value="description">Описание</TabsTrigger>
            <TabsTrigger value="reviews">Отзывы ({reviewCount})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="specs" className="mt-6">
            <div className="max-w-2xl">
              {Object.entries(product.specifications || {}).map(([key, value]) => (
                <div key={key} className="flex py-3 border-b last:border-0">
                  <span className="w-1/2 text-muted-foreground">{key}</span>
                  <span className="w-1/2 font-medium">{value}</span>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="description" className="mt-6">
            <div className="prose max-w-2xl">
              <p>{product.description || "Описание товара отсутствует."}</p>
            </div>
          </TabsContent>
          
          <TabsContent value="reviews" className="mt-6">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Reviews list */}
              <div className="lg:col-span-2">
                <ReviewList reviews={reviews} isLoading={reviewsLoading} />
              </div>

              {/* Review form */}
              <div>
                <ReviewForm productId={product.id} onSuccess={refetchReviews} />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Related products */}
        {relatedProducts.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold mb-6">Похожие товары</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </ShopLayout>
  );
}
