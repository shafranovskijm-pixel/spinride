import { MapPin, Phone, Mail, Clock, Award, Users, Truck, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShopLayout } from "@/components/shop/ShopLayout";
import { Skeleton } from "@/components/ui/skeleton";
import { usePageContent } from "@/hooks/use-page-content";
import { useDocumentSEO } from "@/hooks/use-seo";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Award,
  Users,
  Truck,
  Shield,
};

const defaultFeatures = [
  {
    icon: "Award",
    title: "10+ лет опыта",
    description: "Работаем с 2014 года и знаем всё о велосипедах и самокатах",
  },
  {
    icon: "Users",
    title: "5000+ клиентов",
    description: "Тысячи довольных покупателей в Уссурийске и по всей России",
  },
  {
    icon: "Truck",
    title: "Быстрая доставка",
    description: "Доставим в день заказа по городу или отправим в любой регион",
  },
  {
    icon: "Shield",
    title: "Гарантия качества",
    description: "Официальная гарантия на все товары и бесплатный сервис",
  },
];

const defaultTeam = [
  {
    name: "Александр",
    role: "Основатель",
    description: "Увлечённый велосипедист с 15-летним стажем",
  },
  {
    name: "Мария",
    role: "Менеджер по продажам",
    description: "Поможет подобрать идеальный велосипед",
  },
  {
    name: "Дмитрий",
    role: "Сервис-инженер",
    description: "Мастер по ремонту и настройке техники",
  },
];

const defaultStory = [
  "SPINRIDE начался с небольшого гаража в Уссурийске, где мы ремонтировали велосипеды для друзей и соседей. Наша страсть к двухколёсному транспорту быстро переросла в полноценный бизнес.",
  "Сегодня мы — один из крупнейших магазинов велосипедов и самокатов в Приморском крае. У нас вы найдёте технику для всей семьи: от детских беговелов до профессиональных горных велосипедов.",
  "Мы гордимся индивидуальным подходом к каждому клиенту. Наши консультанты — не просто продавцы, а настоящие эксперты, которые помогут подобрать идеальный вариант под ваши задачи и бюджет.",
];

export default function AboutPage() {
  const { data: pageContent, isLoading } = usePageContent("about");
  useDocumentSEO("О магазине SPINRIDE в Уссурийске", "Магазин SPINRIDE в Уссурийске: велосипеды, самокаты и товары для активного отдыха. Информация о магазине, адрес и контакты.");
  
  const content = pageContent?.content as any || {};
  const title = pageContent?.title || "О магазине SPINRIDE";
  const subtitle = pageContent?.subtitle || "Мы — команда энтузиастов, которая помогает людям находить идеальные велосипеды и самокаты для активного отдыха с 2014 года.";
  
  const features = content.features?.length > 0 ? content.features : defaultFeatures;
  const team = content.team?.length > 0 ? content.team : defaultTeam;
  const story = content.story?.length > 0 ? content.story : defaultStory;
  const storeImage = content.store_image || "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800";
  const badgeText = content.badge_text || "Лучший магазин";
  const badgeSubtext = content.badge_subtext || "Уссурийск 2023";
  
  // Contact info
  const address = content.address || "г. Уссурийск, ул. Пушкина, 13";
  const phone = content.phone || "+7 924-788-11-11";
  const email = content.email || "info@spinride.ru";
  const workHours = content.work_hours || "Пн-Вс: 10:00 - 19:00";
  const mapUrl = content.map_url || "https://yandex.ru/map-widget/v1/?um=constructor%3A8c9c5e9e7b0f9c8e9c9e9c9e9c9e9c9e&amp;source=constructor&amp;ll=131.9513%2C43.8047&amp;z=16&amp;pt=131.9513%2C43.8047%2Cpm2rdm";

  if (isLoading) {
    return (
      <ShopLayout>
        <div className="container-shop py-16">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <Skeleton className="h-12 w-96 mx-auto mb-4" />
            <Skeleton className="h-6 w-full max-w-xl mx-auto" />
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-40 rounded-lg" />
            ))}
          </div>
        </div>
      </ShopLayout>
    );
  }

  return (
    <ShopLayout>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-16 md:py-24">
        <div className="container-shop relative z-10">
          <div className="max-w-3xl mx-auto text-center animate-fade-in-up">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6">
              {title.includes("SPINRIDE") ? (
                <>О магазине <span className="text-primary">SPINRIDE</span></>
              ) : (
                title
              )}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              {subtitle}
            </p>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-48 h-48 bg-secondary/10 rounded-full blur-3xl" />
      </section>

      {/* Story */}
      <section className="container-shop py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 animate-slide-in-left">
            <h2 className="text-3xl md:text-4xl font-bold">Наша история</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              {story.map((paragraph: string, index: number) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>
          
          <div className="relative animate-slide-in-right">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src={storeImage}
                alt="Магазин SPINRIDE"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Floating badge */}
            <div className="absolute -bottom-6 -left-6 bg-card shadow-xl rounded-2xl p-4 border animate-float">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">🏆</span>
                </div>
                <div>
                  <p className="font-bold">{badgeText}</p>
                  <p className="text-sm text-muted-foreground">{badgeSubtext}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-muted/50 py-16">
        <div className="container-shop">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 animate-fade-in-up">
            Почему выбирают нас
          </h2>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 stagger-children">
            {features.map((feature: any, index: number) => {
              const IconComponent = ICON_MAP[feature.icon] || Award;
              return (
                <Card key={index} className="text-center hover-lift card-shine border-0 shadow-lg">
                  <CardContent className="p-6">
                    <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
                      <IconComponent className="h-7 w-7 text-primary" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="container-shop py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 animate-fade-in-up">
          Наша команда
        </h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          Профессионалы, которые любят своё дело и готовы помочь вам с выбором
        </p>
        
        <div className="grid md:grid-cols-3 gap-8 stagger-children">
          {team.map((member: any, index: number) => (
            <Card key={index} className="text-center hover-lift overflow-hidden">
              <CardContent className="p-6">
                <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center overflow-hidden">
                  {member.avatar ? (
                    <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-4xl">👤</span>
                  )}
                </div>
                <h3 className="font-bold text-xl mb-1">{member.name}</h3>
                <p className="text-primary font-medium text-sm mb-3">{member.role}</p>
                <p className="text-sm text-muted-foreground">{member.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Contact CTA */}
      <section className="container-shop py-16">
        <div className="gradient-hero rounded-3xl p-8 md:p-12 relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-4 right-4 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
          <div className="absolute bottom-4 left-4 w-24 h-24 bg-white/10 rounded-full blur-xl" />
          
          <div className="relative z-10 grid lg:grid-cols-2 gap-8 items-center">
            <div className="text-white">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Приходите к нам!
              </h2>
              <p className="text-white/80 mb-6 text-lg">
                Будем рады видеть вас в нашем магазине. 
                Посмотрите технику вживую и получите консультацию.
              </p>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 shrink-0" />
                  <span>{address}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 shrink-0" />
                  <a href={`tel:${phone.replace(/[^\d+]/g, "")}`} className="hover:underline font-semibold">
                    {phone}
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 shrink-0" />
                  <span>{email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 shrink-0" />
                  <span>{workHours}</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 lg:justify-end">
              <Button 
                size="lg" 
                variant="secondary" 
                asChild
                className="font-bold hover:scale-105 transition-transform"
              >
                <Link to="/catalog">
                  Перейти в каталог
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                asChild
                className="bg-white/10 border-white/30 text-white hover:bg-white/20 font-bold"
              >
                <a href={`tel:${phone.replace(/[^\d+]/g, "")}`}>
                  <Phone className="mr-2 h-5 w-5" />
                  Позвонить
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="container-shop pb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 animate-fade-in-up">
          Как нас найти
        </h2>
        <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
          {address} — ждём вас {workHours.toLowerCase().replace("пн-вс:", "ежедневно")}
        </p>
        <div className="rounded-2xl overflow-hidden shadow-lg h-[400px] md:h-[500px]">
          <iframe
            src={mapUrl}
            width="100%"
            height="100%"
            frameBorder="0"
            allowFullScreen
            title="Расположение магазина SPINRIDE"
            className="w-full h-full"
            loading="lazy"
          />
        </div>
        <div className="mt-4 flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="outline" asChild>
            <a 
              href={`https://yandex.ru/maps/?text=${encodeURIComponent(address)}`}
              target="_blank" 
              rel="noopener noreferrer"
            >
              <MapPin className="mr-2 h-4 w-4" />
              Открыть в Яндекс.Картах
            </a>
          </Button>
          <Button variant="outline" asChild>
            <a 
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`}
              target="_blank" 
              rel="noopener noreferrer"
            >
              <MapPin className="mr-2 h-4 w-4" />
              Открыть в Google Maps
            </a>
          </Button>
        </div>
      </section>
    </ShopLayout>
  );
}
