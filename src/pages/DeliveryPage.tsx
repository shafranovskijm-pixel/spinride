import { ShopLayout } from "@/components/shop/ShopLayout";
import { 
  Truck, 
  MapPin, 
  Clock, 
  CreditCard, 
  Banknote, 
  Shield, 
  Package,
  Phone,
  CheckCircle2,
  Info
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const deliveryMethods = [
  {
    icon: Truck,
    title: "Курьерская доставка",
    description: "Доставим заказ прямо до двери",
    details: [
      "По Уссурийску — бесплатно при заказе от 5 000 ₽",
      "По Уссурийску — 300 ₽ при заказе до 5 000 ₽",
      "По Приморскому краю — от 500 ₽ (зависит от расстояния)",
      "Срок: 1-2 рабочих дня по городу",
    ],
    badge: "Популярно",
  },
  {
    icon: MapPin,
    title: "Самовывоз из магазина",
    description: "Заберите заказ в удобное время",
    details: [
      "Адрес: г. Уссурийск, ул. Примерная, 123",
      "Бесплатно при любой сумме заказа",
      "Готовность заказа: в течение 2 часов",
      "Работаем: Пн-Сб 10:00-19:00, Вс 11:00-17:00",
    ],
    badge: "Бесплатно",
  },
  {
    icon: Package,
    title: "Транспортная компания",
    description: "Доставка в любой регион России",
    details: [
      "СДЭК, ПЭК, Деловые линии",
      "Стоимость рассчитывается индивидуально",
      "Срок: 3-14 дней в зависимости от региона",
      "Отправка в течение 1-2 рабочих дней после оплаты",
    ],
  },
];

const paymentMethods = [
  {
    icon: CreditCard,
    title: "Банковская карта",
    description: "Visa, MasterCard, МИР",
    details: "Безопасная оплата через защищённое соединение. Поддерживаем карты всех российских банков.",
  },
  {
    icon: Banknote,
    title: "Наличные",
    description: "При получении заказа",
    details: "Оплата курьеру или в магазине при самовывозе. Сдача с крупных купюр.",
  },
  {
    icon: Shield,
    title: "СБП (Система быстрых платежей)",
    description: "Моментальный перевод",
    details: "Переводите оплату напрямую с вашего банковского приложения по QR-коду или номеру телефона.",
  },
];

const faqItems = [
  {
    question: "Как узнать статус моего заказа?",
    answer: "После оформления заказа вы получите SMS и email с номером заказа. Отслеживать статус можно в личном кабинете или позвонив нам по телефону +7 924-788-11-11.",
  },
  {
    question: "Можно ли изменить адрес доставки после оформления?",
    answer: "Да, вы можете изменить адрес доставки, позвонив нам до момента отправки заказа. После передачи заказа в службу доставки изменение адреса может быть платным.",
  },
  {
    question: "Что делать, если товар пришёл повреждённым?",
    answer: "При получении обязательно осмотрите товар. Если обнаружили повреждения — не принимайте заказ и свяжитесь с нами. Мы организуем замену или вернём деньги.",
  },
  {
    question: "Есть ли гарантия на товары?",
    answer: "Да, на все велосипеды и электротранспорт действует гарантия от 1 года. На аксессуары — от 14 дней до 6 месяцев в зависимости от категории.",
  },
  {
    question: "Можно ли вернуть товар?",
    answer: "Вы можете вернуть товар надлежащего качества в течение 14 дней с момента покупки при сохранении товарного вида и упаковки. Для возврата свяжитесь с нами.",
  },
  {
    question: "Как оплатить заказ в рассрочку?",
    answer: "Мы сотрудничаем с банками-партнёрами. При оформлении заказа выберите опцию 'Рассрочка' — менеджер свяжется с вами для оформления.",
  },
];

export default function DeliveryPage() {
  return (
    <ShopLayout>
      <div className="container-shop py-8 md:py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Доставка и оплата
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Выберите удобный способ получения и оплаты вашего заказа. 
            Мы доставляем по всей России!
          </p>
        </div>

        {/* Delivery section */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-primary/10">
              <Truck className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-2xl font-bold">Способы доставки</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {deliveryMethods.map((method) => (
              <Card key={method.title} className="relative overflow-hidden">
                {method.badge && (
                  <Badge className="absolute top-4 right-4 bg-primary">
                    {method.badge}
                  </Badge>
                )}
                <CardHeader>
                  <div className="p-3 rounded-xl bg-muted w-fit mb-2">
                    <method.icon className="h-6 w-6 text-foreground" />
                  </div>
                  <CardTitle className="text-lg">{method.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {method.description}
                  </p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {method.details.map((detail, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Delivery info banner */}
          <div className="mt-6 p-4 rounded-lg bg-accent/50 border border-accent flex items-start gap-3">
            <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium mb-1">Важная информация</p>
              <p className="text-muted-foreground">
                Крупногабаритные товары (велосипеды, электросамокаты) доставляются в разобранном виде. 
                При необходимости наши специалисты могут собрать товар за дополнительную плату (от 500 ₽).
              </p>
            </div>
          </div>
        </section>

        <Separator className="my-12" />

        {/* Payment section */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-primary/10">
              <CreditCard className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-2xl font-bold">Способы оплаты</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {paymentMethods.map((method) => (
              <Card key={method.title}>
                <CardHeader>
                  <div className="p-3 rounded-xl bg-muted w-fit mb-2">
                    <method.icon className="h-6 w-6 text-foreground" />
                  </div>
                  <CardTitle className="text-lg">{method.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {method.description}
                  </p>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{method.details}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Security badge */}
          <div className="mt-6 flex items-center justify-center gap-4 p-4 rounded-lg bg-muted">
            <Shield className="h-8 w-8 text-primary" />
            <div>
              <p className="font-medium">Безопасные платежи</p>
              <p className="text-sm text-muted-foreground">
                Все транзакции защищены SSL-шифрованием
              </p>
            </div>
          </div>
        </section>

        <Separator className="my-12" />

        {/* Delivery zones */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-primary/10">
              <Clock className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-2xl font-bold">Сроки и стоимость</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-muted">
                  <th className="text-left p-4 font-semibold rounded-tl-lg">Регион</th>
                  <th className="text-left p-4 font-semibold">Срок доставки</th>
                  <th className="text-left p-4 font-semibold rounded-tr-lg">Стоимость</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-4">г. Уссурийск</td>
                  <td className="p-4">1-2 дня</td>
                  <td className="p-4">
                    <span className="text-primary font-medium">Бесплатно</span> от 5 000 ₽
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="p-4">Приморский край</td>
                  <td className="p-4">2-5 дней</td>
                  <td className="p-4">от 500 ₽</td>
                </tr>
                <tr className="border-b">
                  <td className="p-4">Дальний Восток</td>
                  <td className="p-4">5-10 дней</td>
                  <td className="p-4">от 800 ₽</td>
                </tr>
                <tr className="border-b">
                  <td className="p-4">Сибирь, Урал</td>
                  <td className="p-4">7-12 дней</td>
                  <td className="p-4">от 1 200 ₽</td>
                </tr>
                <tr>
                  <td className="p-4 rounded-bl-lg">Центральная Россия, Москва</td>
                  <td className="p-4">10-14 дней</td>
                  <td className="p-4 rounded-br-lg">от 1 500 ₽</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <Separator className="my-12" />

        {/* FAQ section */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-primary/10">
              <Info className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-2xl font-bold">Частые вопросы</h2>
          </div>

          <Accordion type="single" collapsible className="w-full">
            {faqItems.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        {/* Contact CTA */}
        <section className="text-center p-8 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/30 border">
          <h3 className="text-xl font-bold mb-2">Остались вопросы?</h3>
          <p className="text-muted-foreground mb-4">
            Наши менеджеры с радостью помогут вам с оформлением заказа
          </p>
          <a 
            href="tel:+79247881111" 
            className="inline-flex items-center gap-2 text-xl font-bold text-primary hover:underline"
          >
            <Phone className="h-5 w-5" />
            +7 924-788-11-11
          </a>
          <p className="text-sm text-muted-foreground mt-2">
            Пн-Сб 10:00-19:00, Вс 11:00-17:00
          </p>
        </section>
      </div>
    </ShopLayout>
  );
}
