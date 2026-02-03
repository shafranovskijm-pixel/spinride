import { Shield, Mail, Phone } from "lucide-react";
import { ShopLayout } from "@/components/shop/ShopLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { usePageContent } from "@/hooks/use-page-content";

interface PrivacySection {
  title: string;
  content: string[];
}

interface PrivacyContentData {
  sections: PrivacySection[];
  contact_email: string;
  contact_phone: string;
}

const defaultContent: PrivacyContentData = {
  sections: [
    {
      title: "1. Общие положения",
      content: [
        "Настоящая Политика конфиденциальности определяет порядок обработки и защиты персональных данных пользователей интернет-магазина SpinRide.",
        "Используя сайт и предоставляя свои персональные данные, вы соглашаетесь с условиями данной Политики.",
        "Мы обрабатываем персональные данные в соответствии с Федеральным законом № 152-ФЗ «О персональных данных»."
      ]
    },
    {
      title: "2. Сбор персональных данных",
      content: [
        "Мы собираем следующие персональные данные:",
        "• Имя и фамилия — для идентификации покупателя и оформления заказа",
        "• Номер телефона — для связи по вопросам заказа и доставки",
        "• Адрес электронной почты — для отправки подтверждения заказа и информационных сообщений",
        "• Адрес доставки — для доставки заказа",
        "Предоставление персональных данных является добровольным, однако необходимо для оформления и исполнения заказа."
      ]
    },
    {
      title: "3. Цели обработки данных",
      content: [
        "Персональные данные используются для:",
        "• Обработки и исполнения заказов",
        "• Доставки товаров по указанному адресу",
        "• Связи с покупателем по вопросам заказа",
        "• Информирования о статусе заказа",
        "• Улучшения качества обслуживания",
        "• Выполнения требований законодательства РФ"
      ]
    },
    {
      title: "4. Защита данных",
      content: [
        "Мы принимаем все необходимые организационные и технические меры для защиты персональных данных от неправомерного доступа, изменения, раскрытия или уничтожения.",
        "Доступ к персональным данным имеют только уполномоченные сотрудники, которые обязаны соблюдать конфиденциальность.",
        "Мы не передаём персональные данные третьим лицам, за исключением случаев, предусмотренных законодательством, а также для исполнения заказа (службы доставки)."
      ]
    },
    {
      title: "5. Права пользователя",
      content: [
        "Вы имеете право:",
        "• Получить информацию об обработке ваших персональных данных",
        "• Требовать уточнения или исправления ваших данных",
        "• Требовать удаления ваших персональных данных",
        "• Отозвать согласие на обработку персональных данных",
        "Для реализации своих прав свяжитесь с нами по указанным контактам."
      ]
    },
    {
      title: "6. Cookies и аналитика",
      content: [
        "Наш сайт использует cookies для улучшения работы и анализа посещаемости.",
        "Cookies — это небольшие текстовые файлы, которые сохраняются на вашем устройстве при посещении сайта.",
        "Вы можете отключить cookies в настройках браузера, однако это может повлиять на функциональность сайта."
      ]
    },
    {
      title: "7. Срок хранения данных",
      content: [
        "Персональные данные хранятся в течение срока, необходимого для достижения целей обработки, но не менее срока, установленного законодательством РФ.",
        "После достижения целей обработки данные удаляются или обезличиваются."
      ]
    },
    {
      title: "8. Изменения в политике",
      content: [
        "Мы оставляем за собой право вносить изменения в настоящую Политику конфиденциальности.",
        "Актуальная версия Политики всегда доступна на данной странице.",
        "Рекомендуем периодически проверять Политику на наличие изменений."
      ]
    }
  ],
  contact_email: "info@spinride.ru",
  contact_phone: "+7 924-788-11-11"
};

export default function PrivacyPage() {
  const { data: pageData, isLoading } = usePageContent("privacy");

  const content = (pageData?.content as PrivacyContentData) || defaultContent;
  const title = pageData?.title || "Политика конфиденциальности";
  const subtitle = pageData?.subtitle || "Защита ваших персональных данных";

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
              <Shield className="h-8 w-8 text-primary" />
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
              <CardTitle className="text-lg">Контакты для обращений</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-muted-foreground text-sm">
                По вопросам обработки персональных данных вы можете связаться с нами:
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
