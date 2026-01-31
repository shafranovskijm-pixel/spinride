import { Link } from "react-router-dom";
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ShopLayout } from "@/components/shop/ShopLayout";
import { useCart } from "@/hooks/use-cart";

export default function CartPage() {
  const { items, itemCount, total, updateQuantity, removeItem, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <ShopLayout>
        <div className="container-shop py-20 text-center">
          <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold mb-2">Корзина пуста</h1>
          <p className="text-muted-foreground mb-6">
            Добавьте товары из каталога
          </p>
          <Button asChild>
            <Link to="/catalog">Перейти в каталог</Link>
          </Button>
        </div>
      </ShopLayout>
    );
  }

  return (
    <ShopLayout>
      <div className="container-shop py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl md:text-3xl font-bold">
            Корзина <span className="text-muted-foreground font-normal">({itemCount})</span>
          </h1>
          <Button variant="ghost" size="sm" onClick={clearCart}>
            Очистить
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map(({ product, quantity }) => {
              const hasDiscount = product.sale_price && product.sale_price < product.price;
              const displayPrice = hasDiscount ? product.sale_price! : product.price;
              const itemTotal = displayPrice * quantity;

              return (
                <Card key={product.id}>
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      {/* Image */}
                      <Link to={`/product/${product.slug}`} className="shrink-0">
                        <div className="w-24 h-24 rounded-lg overflow-hidden bg-muted">
                          <img
                            src={product.images?.[0] || "/placeholder.svg"}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </Link>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <Link to={`/product/${product.slug}`}>
                          <h3 className="font-semibold hover:text-primary line-clamp-2">
                            {product.name}
                          </h3>
                        </Link>
                        
                        <div className="flex items-baseline gap-2 mt-1">
                          <span className="font-bold">
                            {displayPrice.toLocaleString("ru-RU")} ₽
                          </span>
                          {hasDiscount && (
                            <span className="text-sm text-muted-foreground line-through">
                              {product.price.toLocaleString("ru-RU")} ₽
                            </span>
                          )}
                        </div>

                        {/* Mobile: quantity and total */}
                        <div className="flex items-center justify-between mt-3 sm:hidden">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => updateQuantity(product.id, quantity - 1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center font-medium">{quantity}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => updateQuantity(product.id, quantity + 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          <span className="font-bold">
                            {itemTotal.toLocaleString("ru-RU")} ₽
                          </span>
                        </div>
                      </div>

                      {/* Desktop: quantity */}
                      <div className="hidden sm:flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(product.id, quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center font-medium">{quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(product.id, quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>

                      {/* Desktop: total and remove */}
                      <div className="hidden sm:flex flex-col items-end justify-between">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          onClick={() => removeItem(product.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <span className="font-bold">
                          {itemTotal.toLocaleString("ru-RU")} ₽
                        </span>
                      </div>
                    </div>

                    {/* Mobile: remove button */}
                    <div className="sm:hidden mt-3 pt-3 border-t">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-muted-foreground hover:text-destructive"
                        onClick={() => removeItem(product.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Удалить
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <h2 className="text-lg font-bold mb-4">Итого</h2>
                
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Товаров:</span>
                    <span>{itemCount} шт.</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Доставка:</span>
                    <span>Бесплатно</span>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="flex justify-between items-center mb-6">
                  <span className="text-lg font-bold">Итого:</span>
                  <span className="text-2xl font-bold text-primary">
                    {total.toLocaleString("ru-RU")} ₽
                  </span>
                </div>

                <Button size="lg" className="w-full gradient-cta text-primary-foreground" asChild>
                  <Link to="/checkout">
                    Оформить заказ
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>

                <p className="text-xs text-muted-foreground text-center mt-4">
                  Нажимая кнопку, вы соглашаетесь с условиями обработки персональных данных
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ShopLayout>
  );
}
