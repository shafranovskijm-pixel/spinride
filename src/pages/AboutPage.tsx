import { MapPin, Phone, Mail, Clock, Award, Users, Truck, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShopLayout } from "@/components/shop/ShopLayout";

const features = [
  {
    icon: Award,
    title: "10+ лет опыта",
    description: "Работаем с 2014 года и знаем всё о велосипедах и самокатах",
  },
  {
    icon: Users,
    title: "5000+ клиентов",
    description: "Тысячи довольных покупателей в Уссурийске и по всей России",
  },
  {
    icon: Truck,
    title: "Быстрая доставка",
    description: "Доставим в день заказа по городу или отправим в любой регион",
  },
  {
    icon: Shield,
    title: "Гарантия качества",
    description: "Официальная гарантия на все товары и бесплатный сервис",
  },
];

const team = [
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

export default function AboutPage() {
  return (
    <ShopLayout>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-16 md:py-24">
        <div className="container-shop relative z-10">
          <div className="max-w-3xl mx-auto text-center animate-fade-in-up">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6">
              О магазине <span className="text-primary">SPINRIDE</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              Мы — команда энтузиастов, которая помогает людям находить 
              идеальные велосипеды и самокаты для активного отдыха с 2014 года.
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
              <p>
                SPINRIDE начался с небольшого гаража в Уссурийске, где мы ремонтировали 
                велосипеды для друзей и соседей. Наша страсть к двухколёсному транспорту 
                быстро переросла в полноценный бизнес.
              </p>
              <p>
                Сегодня мы — один из крупнейших магазинов велосипедов и самокатов 
                в Приморском крае. У нас вы найдёте технику для всей семьи: 
                от детских беговелов до профессиональных горных велосипедов.
              </p>
              <p>
                Мы гордимся индивидуальным подходом к каждому клиенту. Наши консультанты — 
                не просто продавцы, а настоящие эксперты, которые помогут подобрать 
                идеальный вариант под ваши задачи и бюджет.
              </p>
            </div>
          </div>
          
          <div className="relative animate-slide-in-right">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800"
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
                  <p className="font-bold">Лучший магазин</p>
                  <p className="text-sm text-muted-foreground">Уссурийск 2023</p>
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
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover-lift card-shine border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <feature.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
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
          {team.map((member, index) => (
            <Card key={index} className="text-center hover-lift overflow-hidden">
              <CardContent className="p-6">
                <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                  <span className="text-4xl">👤</span>
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
                  <span>г. Уссурийск, ул. Пушкина, 13</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 shrink-0" />
                  <a href="tel:+79247881111" className="hover:underline font-semibold">
                    +7 924-788-11-11
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 shrink-0" />
                  <span>info@spinride.ru</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 shrink-0" />
                  <span>Пн-Вс: 10:00 - 19:00</span>
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
                <a href="tel:+79247881111">
                  <Phone className="mr-2 h-5 w-5" />
                  Позвонить
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Map placeholder */}
      <section className="container-shop pb-16">
        <div className="rounded-2xl overflow-hidden shadow-lg h-[400px] bg-muted flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <MapPin className="h-12 w-12 mx-auto mb-4 opacity-30" />
            <p className="font-medium">Карта с расположением магазина</p>
            <p className="text-sm">г. Уссурийск, ул. Пушкина, 13</p>
          </div>
        </div>
      </section>
    </ShopLayout>
  );
}
