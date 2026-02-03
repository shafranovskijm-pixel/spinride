import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Send, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ShopLayout } from "@/components/shop/ShopLayout";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { addToSyncQueue } from "@/lib/offline-db";
import { formatPhone, isValidPhone } from "@/hooks/use-phone-mask";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, total, clearCart, itemCount } = useCart();
  const { toast } = useToast();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    delivery: "pickup",
    address: "",
    notes: "",
  });

  if (items.length === 0) {
    return (
      <ShopLayout>
        <div className="container-shop py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Корзина пуста</h1>
          <Button asChild>
            <Link to="/catalog">Перейти в каталог</Link>
          </Button>
        </div>
      </ShopLayout>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.phone.trim()) {
      toast({
        title: "Заполните обязательные поля",
        description: "Укажите имя и телефон",
        variant: "destructive",
      });
      return;
    }

    if (!isValidPhone(formData.phone)) {
      toast({
        title: "Некорректный номер телефона",
        description: "Введите номер в формате +7 (XXX) XXX-XX-XX",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    const orderItems = items.map(({ product, quantity }) => ({
      product_id: product.id,
      name: product.name,
      price: product.sale_price ?? product.price,
      quantity,
      image: product.images?.[0],
    }));

    const orderData = {
      customer_name: formData.name.trim(),
      customer_phone: formData.phone.trim(),
      customer_email: formData.email.trim() || null,
      delivery_method: formData.delivery,
      delivery_address: formData.delivery === "delivery" ? formData.address.trim() : null,
      items: orderItems,
      total_amount: total,
      notes: formData.notes.trim() || null,
    };

    // Check if offline
    if (!navigator.onLine) {
      try {
        await addToSyncQueue({
          type: 'order',
          action: 'create',
          data: orderData,
        });

        clearCart();
        toast({
          title: "Заказ сохранён офлайн ✓",
          description: "Будет отправлен при восстановлении сети",
        });
        navigate("/order-success");
      } catch (error) {
        console.error("Offline save error:", error);
        toast({
          title: "Ошибка сохранения",
          description: "Попробуйте ещё раз",
          variant: "destructive",
        });
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    try {
      const { data: insertedOrder, error } = await supabase.from("orders").insert([{
        order_number: `SR-${Date.now()}`, // Will be overwritten by trigger
        ...orderData,
        items: JSON.parse(JSON.stringify(orderItems)),
      }]).select('order_number').single();

      if (error) throw error;

      // Send Telegram notification (non-blocking)
      supabase.functions.invoke('telegram-notify', {
        body: {
          order_number: insertedOrder?.order_number || 'N/A',
          customer_name: formData.name.trim(),
          customer_phone: formData.phone.trim(),
          customer_email: formData.email.trim() || undefined,
          delivery_method: formData.delivery,
          delivery_address: formData.delivery === "delivery" ? formData.address.trim() : undefined,
          total_amount: total,
          items: orderItems.map(item => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      }).catch(err => {
        // Don't block order on notification failure
        console.error('Telegram notification failed:', err);
      });

      clearCart();
      toast({
        title: "Заявка отправлена! ✓",
        description: "Мы свяжемся с вами в ближайшее время",
      });
      navigate("/order-success");
    } catch (error) {
      console.error("Order error:", error);
      
      // If network error, save offline
      if (error instanceof Error && error.message.includes('fetch')) {
        try {
          await addToSyncQueue({
            type: 'order',
            action: 'create',
            data: orderData,
          });

          clearCart();
          toast({
            title: "Заказ сохранён офлайн ✓",
            description: "Будет отправлен при восстановлении сети",
          });
          navigate("/order-success");
          return;
        } catch (offlineError) {
          console.error("Offline save fallback error:", offlineError);
        }
      }
      
      toast({
        title: "Ошибка при оформлении",
        description: "Попробуйте ещё раз или позвоните нам",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ShopLayout>
      <div className="container-shop py-8">
        <Button variant="ghost" size="sm" asChild className="mb-6">
          <Link to="/cart">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Вернуться в корзину
          </Link>
        </Button>

        <h1 className="text-2xl md:text-3xl font-bold mb-8">Оформление заказа</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Contact info */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-lg font-bold mb-4">Контактные данные</h2>
                  
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Имя *</Label>
                      <Input
                        id="name"
                        placeholder="Ваше имя"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Телефон *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+7 (999) 123-45-67"
                        value={formData.phone}
                        onChange={(e) => setFormData(prev => ({ ...prev, phone: formatPhone(e.target.value) }))}
                        required
                        className={formData.phone && !isValidPhone(formData.phone) ? "border-destructive" : ""}
                      />
                      {formData.phone && !isValidPhone(formData.phone) && (
                        <p className="text-xs text-destructive">Введите полный номер телефона</p>
                      )}
                    </div>
                    <div className="sm:col-span-2 space-y-2">
                      <Label htmlFor="email">Email (для уведомлений)</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="email@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Delivery */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-lg font-bold mb-4">Способ получения</h2>
                  
                  <RadioGroup
                    value={formData.delivery}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, delivery: value }))}
                  >
                    <div className="flex items-start space-x-3 p-4 border rounded-lg">
                      <RadioGroupItem value="pickup" id="pickup" className="mt-1" />
                      <div className="flex-1">
                        <Label htmlFor="pickup" className="font-medium cursor-pointer">
                          Самовывоз из магазина
                        </Label>
                        <p className="text-sm text-muted-foreground mt-1">
                          г. Уссурийск, ул. Комсомольская, 29
                        </p>
                        <p className="text-sm text-secondary mt-1 font-medium">Бесплатно</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3 p-4 border rounded-lg mt-3">
                      <RadioGroupItem value="delivery" id="delivery" className="mt-1" />
                      <div className="flex-1">
                        <Label htmlFor="delivery" className="font-medium cursor-pointer">
                          Доставка по городу
                        </Label>
                        <p className="text-sm text-muted-foreground mt-1">
                          Курьером до двери
                        </p>
                        <p className="text-sm text-secondary mt-1 font-medium">От 300 ₽</p>
                      </div>
                    </div>
                  </RadioGroup>

                  {formData.delivery === "delivery" && (
                    <div className="mt-4 space-y-2">
                      <Label htmlFor="address">Адрес доставки *</Label>
                      <Textarea
                        id="address"
                        placeholder="Улица, дом, квартира"
                        value={formData.address}
                        onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                        required={formData.delivery === "delivery"}
                      />
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Notes */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-lg font-bold mb-4">Комментарий к заказу</h2>
                  <Textarea
                    placeholder="Дополнительные пожелания..."
                    value={formData.notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardContent className="p-6">
                  <h2 className="text-lg font-bold mb-4">Ваш заказ</h2>
                  
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {items.map(({ product, quantity }) => (
                      <div key={product.id} className="flex gap-3">
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted shrink-0">
                          <img
                            src={product.images?.[0] || "/placeholder.svg"}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium line-clamp-1">{product.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {quantity} × {(product.sale_price ?? product.price).toLocaleString("ru-RU")} ₽
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Separator className="my-4" />

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Товаров:</span>
                      <span>{itemCount} шт.</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Доставка:</span>
                      <span>{formData.delivery === "pickup" ? "Бесплатно" : "от 300 ₽"}</span>
                    </div>
                  </div>

                  <Separator className="my-4" />

                  <div className="flex justify-between items-center mb-6">
                    <span className="text-lg font-bold">Итого:</span>
                    <span className="text-2xl font-bold text-primary">
                      {total.toLocaleString("ru-RU")} ₽
                    </span>
                  </div>

                  <Button 
                    type="submit" 
                    size="lg" 
                    className="w-full gradient-cta text-primary-foreground"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      "Отправка..."
                    ) : (
                      <>
                        <Send className="mr-2 h-5 w-5" />
                        Отправить заявку
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-muted-foreground text-center mt-4">
                    После оформления менеджер свяжется с вами для подтверждения
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </ShopLayout>
  );
}
