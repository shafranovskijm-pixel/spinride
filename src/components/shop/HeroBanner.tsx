import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Phone, MapPin, Snowflake, Sun, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSeason } from "@/hooks/use-season";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect, useCallback } from "react";

interface BannerContent {
  title: string;
  titleLine2: string;
  titleLine3: string;
  subtitle: string;
  description: string;
  quizButtonText: string;
  imageUrl: string;
  phone: string;
  city: string;
}

interface BannerSettings {
  summer: BannerContent;
  winter: BannerContent;
}

const winterSliderImages = [
  "/hero/slide-1.jpg",
  "/hero/slide-2.jpg",
  "/hero/slide-3.jpg",
  "/hero/slide-4.jpg",
  "/hero/slide-5.jpg",
];

const defaultContent: BannerSettings = {
  summer: {
    title: "Велосипеды и",
    titleLine2: "самокаты",
    titleLine3: "для всей семьи",
    subtitle: "доставка по всей России.",
    description: "От городских прогулок до экстремальных поездок – найдите свой идеальный велосипед в Уссурийске!",
    quizButtonText: "🎯 Подобрать велосипед",
    imageUrl: "https://274418.selcdn.ru/cv08300-33250f0d-0664-43fc-9dbf-9d89738d114e/uploads/521356/653fe1a0-538e-4f32-802a-654787767f95.jpg",
    phone: "+7 924-788-11-11",
    city: "г. Уссурийск",
  },
  winter: {
    title: "Зимние товары",
    titleLine2: "для всей семьи",
    titleLine3: "❄️",
    subtitle: "доставка по всей России.",
    description: "Тюбинги, санки, ёлки и новогодний декор – всё для зимних радостей!",
    quizButtonText: "🎄 Подобрать подарок",
    imageUrl: "/hero/slide-1.jpg",
    phone: "+7 924-788-11-11",
    city: "г. Уссурийск",
  },
};

export function HeroBanner() {
  const { season, toggleSeason } = useSeason();
  const isWinter = season === "winter";
  const [currentSlide, setCurrentSlide] = useState(0);

  const { data: bannerSettings } = useQuery({
    queryKey: ["banner-content"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_settings")
        .select("value")
        .eq("key", "banner_content")
        .maybeSingle();

      if (error) throw error;
      return data?.value as unknown as BannerSettings | null;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const content = bannerSettings
    ? { ...defaultContent[season], ...(bannerSettings[season] || {}) }
    : defaultContent[season];

  // Auto-slide for winter
  useEffect(() => {
    if (!isWinter) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % winterSliderImages.length);
    }, 7000);

    return () => clearInterval(interval);
  }, [isWinter]);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % winterSliderImages.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + winterSliderImages.length) % winterSliderImages.length);
  }, []);

  const currentImage = isWinter ? winterSliderImages[currentSlide] : content.imageUrl;

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
              {content.title}{" "}
              <span className="block animate-fade-in-up" style={{ animationDelay: '0.1s' }}>{content.titleLine2}</span>
              <span className="block text-foreground/90 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>{content.titleLine3}</span>
            </h1>
            
            <p className="text-lg md:text-xl text-foreground/70 max-w-lg mx-auto lg:mx-0 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              {content.subtitle}
            </p>
            
            <p className="text-base md:text-lg font-medium text-foreground/80 max-w-lg mx-auto lg:mx-0 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              {content.description}
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
                  {content.quizButtonText}
                </Link>
              </Button>
            </div>

            {/* Season Toggle Button */}
            <div className="flex justify-center lg:justify-start pt-2 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleSeason}
                className="gap-2 text-foreground/70 hover:text-foreground hover:bg-foreground/10 rounded-full px-4"
              >
                {isWinter ? (
                  <>
                    <Sun className="h-4 w-4 text-secondary" />
                    <span>Перейти к летним товарам</span>
                  </>
                ) : (
                  <>
                    <Snowflake className="h-4 w-4 text-primary" />
                    <span>Перейти к зимним товарам</span>
                  </>
                )}
              </Button>
            </div>

            {/* Contact info */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4 text-foreground/80">
              <a 
                href={`tel:${content.phone.replace(/[^+\d]/g, '')}`}
                className="flex items-center gap-2 hover:text-secondary transition-colors font-semibold"
              >
                <Phone className="h-5 w-5" />
                <span>{content.phone}</span>
              </a>
              <span className="hidden sm:block text-foreground/40">•</span>
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                <span>{content.city}</span>
              </div>
            </div>
          </div>

          {/* Hero Image with Slider */}
          <div className="hidden lg:flex justify-center items-center relative">
            <div className="relative w-full max-w-xl">
              {/* Decorative rings */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-[400px] h-[400px] rounded-full border-2 border-primary/20 animate-pulse-soft" />
                <div className="absolute w-[320px] h-[320px] rounded-full border border-secondary/30 animate-spin-slow" style={{ animationDuration: '20s' }} />
                <div className="absolute w-[240px] h-[240px] rounded-full border border-primary/15 animate-spin-slow" style={{ animationDuration: '15s', animationDirection: 'reverse' }} />
              </div>
              
              {/* Floating icons decoration */}
              <div className="absolute -top-4 -left-4 w-16 h-16 bg-secondary/20 rounded-2xl flex items-center justify-center animate-float shadow-lg" style={{ animationDelay: '0.2s' }}>
                <span className="text-2xl">{isWinter ? "⛷️" : "🚴"}</span>
              </div>
              <div className="absolute -top-8 right-12 w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center animate-float shadow-lg" style={{ animationDelay: '0.5s' }}>
                <span className="text-xl">{isWinter ? "🎿" : "🛴"}</span>
              </div>
              <div className="absolute top-1/4 -right-6 w-14 h-14 bg-secondary/15 rounded-2xl flex items-center justify-center animate-float shadow-lg" style={{ animationDelay: '0.8s' }}>
                <span className="text-xl">{isWinter ? "❄️" : "⚡"}</span>
              </div>
              <div className="absolute bottom-1/4 -left-8 w-12 h-12 bg-primary/15 rounded-xl flex items-center justify-center animate-float shadow-lg" style={{ animationDelay: '1.1s' }}>
                <span className="text-lg">{isWinter ? "🧤" : "🎯"}</span>
              </div>
              
              {/* Decorative background blob */}
              <div className="absolute inset-0 bg-gradient-to-br from-background/60 via-primary/5 to-secondary/10 rounded-[3rem] blob animate-pulse-soft" />
              
              {/* Product image with slider */}
              <div className="relative z-10 p-8">
                <img 
                  src={currentImage}
                  alt={isWinter ? "Зимние товары" : "Велосипед"}
                  className="w-full h-auto object-contain drop-shadow-2xl animate-float rounded-2xl"
                  key={currentSlide}
                />
              </div>

              {/* Slider controls for winter */}
              {isWinter && (
                <>
                  <button
                    onClick={prevSlide}
                    className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-background/80 hover:bg-background shadow-lg flex items-center justify-center transition-all hover:scale-110"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={nextSlide}
                    className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-background/80 hover:bg-background shadow-lg flex items-center justify-center transition-all hover:scale-110"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}
              
              {/* Slide indicators */}
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                {isWinter ? (
                  winterSliderImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`w-3 h-3 rounded-full transition-all ${
                        index === currentSlide 
                          ? 'bg-primary scale-125' 
                          : 'bg-primary/40 hover:bg-primary/60'
                      }`}
                    />
                  ))
                ) : (
                  <>
                    <div className="w-3 h-3 rounded-full bg-primary/40 animate-pulse" style={{ animationDelay: '0s' }} />
                    <div className="w-3 h-3 rounded-full bg-secondary/50 animate-pulse" style={{ animationDelay: '0.2s' }} />
                    <div className="w-3 h-3 rounded-full bg-primary/40 animate-pulse" style={{ animationDelay: '0.4s' }} />
                  </>
                )}
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
