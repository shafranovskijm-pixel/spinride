import { Link } from "react-router-dom";
import { ArrowRight, Phone, MapPin, Snowflake } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSeason } from "@/hooks/use-season";

export function HeroBanner() {
  const { season } = useSeason();
  const isWinter = season === "winter";

  return (
    <section className="relative overflow-hidden min-h-[600px] lg:min-h-[700px]">
      {/* Background with diagonal shape */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 gradient-hero clip-hero" />
        {/* Decorative circles */}
        <div className="circle-decoration w-[400px] h-[400px] -top-20 -left-20 opacity-20" />
        <div className="circle-decoration w-[600px] h-[600px] -top-40 -right-40 opacity-15" />
        <div className="circle-decoration w-[300px] h-[300px] bottom-20 left-1/4 opacity-10" />
      </div>
      
      {/* Floating particles / snowflakes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {isWinter ? (
          // Snowflakes for winter
          <>
            <Snowflake className="absolute text-white/30 h-6 w-6 animate-float" style={{ top: '15%', left: '8%', animationDelay: '0s' }} />
            <Snowflake className="absolute text-white/20 h-8 w-8 animate-float" style={{ top: '25%', left: '20%', animationDelay: '0.5s' }} />
            <Snowflake className="absolute text-white/25 h-5 w-5 animate-float" style={{ top: '40%', left: '12%', animationDelay: '1s' }} />
            <Snowflake className="absolute text-white/30 h-7 w-7 animate-float" style={{ top: '20%', right: '15%', animationDelay: '0.3s' }} />
            <Snowflake className="absolute text-white/20 h-6 w-6 animate-float" style={{ top: '50%', right: '10%', animationDelay: '0.8s' }} />
            <Snowflake className="absolute text-white/25 h-4 w-4 animate-float" style={{ top: '65%', right: '20%', animationDelay: '1.2s' }} />
            <Snowflake className="absolute text-white/15 h-5 w-5 animate-float" style={{ top: '70%', left: '25%', animationDelay: '0.7s' }} />
            <Snowflake className="absolute text-white/20 h-6 w-6 animate-float" style={{ top: '55%', left: '45%', animationDelay: '1.5s' }} />
          </>
        ) : (
          // Particles for summer
          <>
            <div className="particle" style={{ top: '20%', left: '10%' }} />
            <div className="particle" style={{ top: '60%', left: '5%' }} />
            <div className="particle" style={{ top: '30%', right: '15%' }} />
            <div className="particle" style={{ top: '70%', right: '10%' }} />
            <div className="particle" style={{ top: '50%', left: '50%' }} />
          </>
        )}
      </div>
      
      {/* Content */}
      <div className="container-shop relative z-10 py-12 md:py-16 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Text */}
          <div className="space-y-6 text-center lg:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black leading-[1.1] text-foreground animate-fade-in-up">
              {isWinter ? (
                <>
                  Зимние товары{" "}
                  <span className="block animate-fade-in-up" style={{ animationDelay: '0.1s' }}>для всей семьи</span>
                  <span className="block text-foreground/90 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>❄️</span>
                </>
              ) : (
                <>
                  Велосипеды и{" "}
                  <span className="block animate-fade-in-up" style={{ animationDelay: '0.1s' }}>самокаты</span>
                  <span className="block text-foreground/90 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>для всей семьи</span>
                </>
              )}
            </h1>
            
            <p className="text-lg md:text-xl text-foreground/70 max-w-lg mx-auto lg:mx-0 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              доставка по всей России.
            </p>
            
            <p className="text-base md:text-lg font-medium text-foreground/80 max-w-lg mx-auto lg:mx-0 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              {isWinter 
                ? "Тюбинги, санки, ёлки и новогодний декор – всё для зимних радостей!"
                : "От городских прогулок до экстремальных поездок – найдите свой идеальный велосипед в Уссурийске!"
              }
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
              <Button 
                size="lg" 
                asChild 
                className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold text-base px-8 py-6 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 btn-ripple animate-glow-pulse"
              >
                <Link to="/catalog">
                  Перейти в каталог
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                asChild 
                className="bg-background/90 hover:bg-background font-bold text-base px-8 py-6 rounded-xl border-2 hover:-translate-y-1 transition-all duration-300"
              >
                <Link to="/quiz">
                  {isWinter ? "🎄 Подобрать подарок" : "🎯 Подобрать велосипед"}
                </Link>
              </Button>
            </div>

            {/* Contact info */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-6 text-foreground/80">
              <a 
                href="tel:+79247881111" 
                className="flex items-center gap-2 hover:text-secondary transition-colors font-semibold"
              >
                <Phone className="h-5 w-5" />
                <span>+7 924-788-11-11</span>
              </a>
              <span className="hidden sm:block text-foreground/40">•</span>
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                <span>г. Уссурийск</span>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="hidden lg:flex justify-center items-center relative">
            <div className="relative w-full max-w-xl">
              {/* Decorative background blob */}
              <div className="absolute inset-0 bg-background/50 rounded-[3rem] blob animate-pulse-soft" />
              
              {/* Product image */}
              <div className="relative z-10 p-8">
                <img 
                  src={isWinter 
                    ? "https://images.unsplash.com/photo-1545048702-79362596cdc9?w=600"
                    : "https://274418.selcdn.ru/cv08300-33250f0d-0664-43fc-9dbf-9d89738d114e/uploads/521356/653fe1a0-538e-4f32-802a-654787767f95.jpg"
                  }
                  alt={isWinter ? "Новогодняя ёлка" : "Велосипед CRONUS"}
                  className="w-full h-auto object-contain drop-shadow-2xl animate-float"
                />
              </div>
              
              {/* Price badge */}
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-card shadow-2xl rounded-2xl p-4 flex items-center gap-4 border animate-scale-in" style={{ animationDelay: '0.6s' }}>
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center">
                  <span className="text-3xl">{isWinter ? "🎄" : "🚴"}</span>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">от</p>
                  <p className="text-2xl font-bold text-primary">{isWinter ? "390 ₽" : "7 700 ₽"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
