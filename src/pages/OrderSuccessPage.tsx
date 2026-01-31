import { Link } from "react-router-dom";
import { Check, Phone, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShopLayout } from "@/components/shop/ShopLayout";

export default function OrderSuccessPage() {
  return (
    <ShopLayout>
      <div className="container-shop py-20">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-secondary flex items-center justify-center">
              <Check className="h-8 w-8 text-secondary-foreground" />
            </div>
            
            <h1 className="text-2xl font-bold mb-2">Заявка отправлена!</h1>
            <p className="text-muted-foreground mb-6">
              Спасибо за ваш заказ. Наш менеджер свяжется с вами в ближайшее время для подтверждения.
            </p>

            <div className="flex items-center justify-center gap-2 p-4 bg-muted rounded-lg mb-6">
              <Phone className="h-5 w-5 text-primary" />
              <span className="font-medium">+7 (999) 123-45-67</span>
            </div>

            <div className="space-y-3">
              <Button className="w-full" asChild>
                <Link to="/catalog">
                  Продолжить покупки
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <Link to="/">
                  На главную
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </ShopLayout>
  );
}
