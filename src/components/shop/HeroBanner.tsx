import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSeason } from "@/hooks/use-season";

export function HeroBanner() {
  const { season, config } = useSeason();

  return (
    <section className="relative overflow-hidden">
      {/* Background with gradient */}
      <div className="absolute inset-0 gradient-hero opacity-10" />
      
      {/* Content */}
      <div className="container-shop relative py-12 md:py-20 lg:py-28">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Text */}
          <div className="space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <span>{season === "summer" ? "☀️" : "❄️"}</span>
              <span>{config.accent}</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              {config.heroTitle}
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-lg mx-auto lg:mx-0">
              {config.heroSubtitle}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button size="lg" asChild className="gradient-cta text-primary-foreground border-0">
                <Link to="/catalog">
                  Перейти в каталог
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/quiz">
                  🎯 Подобрать велосипед
                </Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="flex justify-center lg:justify-start gap-8 pt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">200+</div>
                <div className="text-sm text-muted-foreground">Моделей</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">5★</div>
                <div className="text-sm text-muted-foreground">Рейтинг</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">1000+</div>
                <div className="text-sm text-muted-foreground">Клиентов</div>
              </div>
            </div>
          </div>

          {/* Image/Illustration placeholder */}
          <div className="hidden lg:flex justify-center items-center">
            <div className="relative w-full max-w-md aspect-square">
              <div className="absolute inset-0 gradient-hero rounded-full opacity-20 animate-pulse-soft" />
              <div className="absolute inset-4 bg-card rounded-3xl shadow-xl flex items-center justify-center">
                <span className="text-9xl animate-float">
                  {season === "summer" ? "🚴" : "🛷"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute -bottom-1 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
