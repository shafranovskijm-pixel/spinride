import { ShopLayout } from "@/components/shop/ShopLayout";
import { Shield, CheckCircle, Clock, Phone, Mail } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function WarrantyPage() {
  return (
    <ShopLayout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <Shield className="h-16 w-16 text-primary mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2">Гарантия</h1>
          <p className="text-muted-foreground">
            Мы гарантируем качество всех товаров в нашем магазине
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Сроки гарантии
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between border-b pb-2">
                <span>Снегокаты и снежные тюбинги</span>
                <span className="font-semibold">1 год</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span>Ледянки и санки</span>
                <span className="font-semibold">6 месяцев</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span>Снежколепы и аксессуары</span>
                <span className="font-semibold">3 месяца</span>
              </div>
              <div className="flex justify-between">
                <span>Электротранспорт</span>
                <span className="font-semibold">1 год</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-primary" />
                Что покрывает гарантия
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-primary mt-1 shrink-0" />
                  <span>Заводской брак материалов</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-primary mt-1 shrink-0" />
                  <span>Дефекты сборки и пошива</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-primary mt-1 shrink-0" />
                  <span>Неисправность механизмов</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-primary mt-1 shrink-0" />
                  <span>Расхождение швов при нормальной эксплуатации</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Условия гарантийного обслуживания</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Для обращения по гарантии необходимо:</h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Сохранить чек или накладную о покупке</li>
                <li>Предоставить товар в чистом виде</li>
                <li>Описать характер неисправности</li>
                <li>Обратиться в течение гарантийного срока</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Гарантия не распространяется на:</h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Механические повреждения по вине покупателя</li>
                <li>Естественный износ при интенсивном использовании</li>
                <li>Повреждения из-за несоблюдения условий эксплуатации</li>
                <li>Следы ненадлежащего хранения</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Как обратиться по гарантии</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <a 
                href="tel:+79991234567" 
                className="flex items-center gap-2 text-primary hover:underline"
              >
                <Phone className="h-5 w-5" />
                +7 (999) 123-45-67
              </a>
              <a 
                href="mailto:warranty@spinride.ru" 
                className="flex items-center gap-2 text-primary hover:underline"
              >
                <Mail className="h-5 w-5" />
                warranty@spinride.ru
              </a>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              Срок рассмотрения гарантийного обращения — до 14 рабочих дней. 
              При подтверждении гарантийного случая товар будет отремонтирован или заменён на аналогичный.
            </p>
          </CardContent>
        </Card>
      </div>
    </ShopLayout>
  );
}
