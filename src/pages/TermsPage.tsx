import { FileText, Mail, Phone } from "lucide-react";
import { ShopLayout } from "@/components/shop/ShopLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { usePageContent } from "@/hooks/use-page-content";

interface TermsSection {
  title: string;
  content: string[];
}

interface TermsContentData {
  sections: TermsSection[];
  contact_email: string;
  contact_phone: string;
}

const defaultContent: TermsContentData = {
  sections: [
    {
      title: "1. Общие положения",
      content: [
        "Настоящие Условия использования регулируют отношения между интернет-магазином SpinRide (далее — Продавец) и покупателем (далее — Покупатель).",
        "Оформляя заказ на сайте, Покупатель подтверждает своё согласие с настоящими Условиями.",
        "Продавец оставляет за собой право вносить изменения в настоящие Условия без предварительного уведомления."
      ]
    },
    {
      title: "2. Оформление заказа",
      content: [
        "Заказ оформляется через корзину на сайте или по телефону.",
        "Для оформления заказа необходимо указать контактные данные и адрес доставки.",
        "После оформления заказа Покупатель получает подтверждение на указанный email или по телефону.",
        "Продавец вправе связаться с Покупателем для уточнения деталей заказа.",
        "Заказ считается подтверждённым после согласования всех условий с менеджером."
      ]
    },
    {
      title: "3. Цены и оплата",
      content: [
        "Цены на товары указаны в российских рублях и включают НДС (при наличии).",
        "Продавец оставляет за собой право изменять цены на товары до момента оформления заказа.",
        "Оплата производится одним из доступных способов:",
        "• Наличными при получении (для самовывоза и курьерской доставки)",
        "• Банковской картой онлайн",
        "• Банковским переводом (для юридических лиц)"
      ]
    },
    {
      title: "4. Доставка",
      content: [
        "Доставка осуществляется по территории Российской Федерации.",
        "Сроки и стоимость доставки зависят от региона и выбранного способа доставки.",
        "Продавец не несёт ответственности за задержки доставки, вызванные действиями транспортных компаний или форс-мажорными обстоятельствами.",
        "При получении заказа Покупатель обязан проверить целостность упаковки и товара.",
        "Подробная информация о доставке представлена на странице «Доставка и оплата»."
      ]
    },
    {
      title: "5. Возврат и обмен",
      content: [
        "Возврат товара надлежащего качества возможен в течение 14 дней с момента получения.",
        "Товар должен сохранить товарный вид, потребительские свойства, заводскую упаковку и все ярлыки.",
        "Возврат денежных средств осуществляется в течение 10 рабочих дней после получения товара Продавцом.",
        "Товары, бывшие в употреблении, возврату не подлежат, за исключением случаев обнаружения заводского брака.",
        "Для оформления возврата свяжитесь с нами по указанным контактам."
      ]
    },
    {
      title: "6. Гарантия",
      content: [
        "На все товары распространяется гарантия производителя.",
        "Гарантийный срок указан в карточке товара и гарантийном талоне.",
        "Гарантия не распространяется на повреждения, вызванные неправильной эксплуатацией, механическими повреждениями или естественным износом.",
        "Подробная информация о гарантии представлена на странице «Гарантия»."
      ]
    },
    {
      title: "7. Ограничение ответственности",
      content: [
        "Продавец не несёт ответственности за:",
        "• Неправильное использование товара Покупателем",
        "• Ущерб, причинённый в результате использования товара не по назначению",
        "• Действия третьих лиц",
        "• Форс-мажорные обстоятельства",
        "Максимальная ответственность Продавца ограничивается стоимостью приобретённого товара."
      ]
    },
    {
      title: "8. Разрешение споров",
      content: [
        "Все споры и разногласия решаются путём переговоров.",
        "В случае невозможности достижения соглашения споры подлежат рассмотрению в суде по месту нахождения Продавца в соответствии с законодательством РФ.",
        "До обращения в суд Покупатель обязан направить претензию Продавцу. Срок рассмотрения претензии — 10 рабочих дней."
      ]
    },
    {
      title: "9. Заключительные положения",
      content: [
        "Настоящие Условия вступают в силу с момента их публикации на сайте.",
        "Если какое-либо положение настоящих Условий признаётся недействительным, это не влияет на действительность остальных положений.",
        "Актуальная версия Условий всегда доступна на данной странице."
      ]
    }
  ],
  contact_email: "info@spinride.ru",
  contact_phone: "+7 924-788-11-11"
};

export default function TermsPage() {
  const { data: pageData, isLoading } = usePageContent("terms");

  const content = (pageData?.content as TermsContentData) || defaultContent;
  const title = pageData?.title || "Условия использования";
  const subtitle = pageData?.subtitle || "Правила использования сайта и оформления заказов";

  if (isLoading) {
    return (
      <ShopLayout>
        <div className="container py-8 space-y-6">
          <div className="text-center space-y-2">
            <Skeleton className="h-10 w-64 mx-auto" />
            <Skeleton className="h-5 w-96 mx-auto" />
          </div>
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-48" />
              </CardHeader>
              <CardContent className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
            </Card>
          ))}
        </div>
      </ShopLayout>
    );
  }

  return (
    <ShopLayout>
      <div className="container py-8 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="p-3 bg-primary/10 rounded-full">
              <FileText className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-bold">{title}</h1>
          <p className="text-muted-foreground">{subtitle}</p>
        </div>

        {/* Content sections */}
        <div className="max-w-3xl mx-auto space-y-4">
          {content.sections.map((section, index) => (
            <Card key={index}>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{section.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {section.content.map((paragraph, pIndex) => (
                  <p key={pIndex} className="text-muted-foreground text-sm leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </CardContent>
            </Card>
          ))}

          {/* Contact card */}
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Контакты</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-muted-foreground text-sm">
                По вопросам, связанным с условиями использования, вы можете связаться с нами:
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href={`mailto:${content.contact_email}`}
                  className="flex items-center gap-2 text-primary hover:underline"
                >
                  <Mail className="h-4 w-4" />
                  {content.contact_email}
                </a>
                <a
                  href={`tel:${content.contact_phone.replace(/[^+\d]/g, "")}`}
                  className="flex items-center gap-2 text-primary hover:underline"
                >
                  <Phone className="h-4 w-4" />
                  {content.contact_phone}
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ShopLayout>
  );
}
