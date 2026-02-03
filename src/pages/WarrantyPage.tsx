import { ShopLayout } from "@/components/shop/ShopLayout";
import { Shield, CheckCircle, Clock, Phone, Mail } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { usePageContent, WarrantyContent } from "@/hooks/use-page-content";

export default function WarrantyPage() {
  const { data: page, isLoading } = usePageContent("warranty");
  const content = page?.content as WarrantyContent | undefined;

  if (isLoading) {
    return (
      <ShopLayout>
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="text-center mb-8">
            <Skeleton className="h-16 w-16 rounded-full mx-auto mb-4" />
            <Skeleton className="h-8 w-48 mx-auto mb-2" />
            <Skeleton className="h-4 w-64 mx-auto" />
          </div>
          <div className="grid gap-6 md:grid-cols-2 mb-8">
            <Skeleton className="h-48" />
            <Skeleton className="h-48" />
          </div>
        </div>
      </ShopLayout>
    );
  }

  return (
    <ShopLayout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <Shield className="h-16 w-16 text-primary mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2">{page?.title || "Гарантия"}</h1>
          <p className="text-muted-foreground">
            {page?.subtitle || "Мы гарантируем качество всех товаров в нашем магазине"}
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
              {content?.warranty_periods?.map((item, index) => (
                <div key={index} className={`flex justify-between ${index < (content.warranty_periods?.length || 0) - 1 ? 'border-b pb-2' : ''}`}>
                  <span>{item.category}</span>
                  <span className="font-semibold">{item.period}</span>
                </div>
              ))}
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
                {content?.coverage?.map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-primary mt-1 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
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
                {content?.requirements?.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Гарантия не распространяется на:</h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                {content?.exclusions?.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
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
              {content?.contact_phone && (
                <a 
                  href={`tel:${content.contact_phone.replace(/\D/g, '')}`}
                  className="flex items-center gap-2 text-primary hover:underline"
                >
                  <Phone className="h-5 w-5" />
                  {content.contact_phone}
                </a>
              )}
              {content?.contact_email && (
                <a 
                  href={`mailto:${content.contact_email}`}
                  className="flex items-center gap-2 text-primary hover:underline"
                >
                  <Mail className="h-5 w-5" />
                  {content.contact_email}
                </a>
              )}
            </div>
            {content?.processing_note && (
              <p className="text-sm text-muted-foreground mt-4">
                {content.processing_note}
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </ShopLayout>
  );
}
