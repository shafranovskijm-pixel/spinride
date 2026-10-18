import { Link } from "react-router-dom";
import { ArrowRight, TrendingUp, Sparkles, Sun, Snowflake, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ShopLayout } from "@/components/shop/ShopLayout";
import { HeroBanner } from "@/components/shop/HeroBanner";
import { CategoryGrid } from "@/components/shop/CategoryGrid";
import { ProductCard } from "@/components/shop/ProductCard";
import { SectionDivider } from "@/components/shop/SectionDivider";
import { FloatingIcons } from "@/components/shop/FloatingIcons";
import { MarqueeStrip } from "@/components/shop/MarqueeStrip";
import { InteractiveParticles } from "@/components/shop/InteractiveParticles";
import { useSeason } from "@/hooks/use-season";
import { useProducts } from "@/hooks/use-products";
import { useDocumentSEO } from "@/hooks/use-seo";
import { cn } from "@/lib/utils";

export default function Index() {
  const { season } = useSeason();
  
  // Apply SEO settings
  useDocumentSEO(
    "Велосипеды и самокаты в Уссурийске",
    "Велосипеды, трюковые самокаты, детская техника и зимние товары в SPINRIDE. Каталог моделей с ценами и характеристиками. Магазин в Уссурийске, ул. Пушкина, 13."
  );
  
  // Fetch products from database
  const { data: featuredProducts = [], isLoading: featuredLoading } = useProducts({
    isFeatured: true,
    limit: 4,
  });
  
  const { data: newProducts = [], isLoading: newLoading } = useProducts({
    isNew: true,
    limit: 4,
  });
  
  const { data: seasonalProducts = [], isLoading: seasonalLoading } = useProducts({
    season: season,
    limit: 4,
  });

  const ProductSection = ({ 
    products, 
    isLoading, 
    title, 
    icon, 
    link, 
    linkText,
    showDecor = false
  }: { 
    products: typeof featuredProducts;
    isLoading: boolean;
    title: string;
    icon: React.ReactNode;
    link: string;
    linkText: string;
    showDecor?: boolean;
  }) => (
    <section className={cn(
      "py-12 relative",
      showDecor && "bg-gradient-to-b from-primary/[0.02] via-primary/[0.04] to-primary/[0.02]"
    )}>
      <InteractiveParticles count={40} />
      {showDecor && <FloatingIcons density="low" />}
      <div className="container-shop relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            {icon}
            <h2 className="text-2xl font-bold">{title}</h2>
          </div>
          <Link to={link} className="text-sm text-primary hover:underline flex items-center gap-1 underline-animate">
            {linkText} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 stagger-children">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );

  return (
    <ShopLayout>
      {/* Hero */}
      <HeroBanner />

      {/* Decorative divider after hero */}
      <SectionDivider variant="wave" />

      {/* Categories with floating background */}
      <section className="container-shop py-12 relative">
        <InteractiveParticles count={50} />
        <FloatingIcons density="low" />
        <div className="flex items-center justify-between mb-6 relative z-10">
          <h2 className="text-2xl font-bold animate-fade-in-up">Категории</h2>
          <Link to="/catalog" className="text-sm text-primary hover:underline flex items-center gap-1 underline-animate">
            Все категории <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <CategoryGrid className="relative z-10" />
      </section>

      {/* Marquee promotional strip */}
      <MarqueeStrip />

      {/* Seasonal Products */}
      <ProductSection
        products={seasonalProducts}
        isLoading={seasonalLoading}
        title={season === "summer" ? "Летняя коллекция" : "Зимняя коллекция"}
        icon={season === "summer" ? (
          <Sun className="h-6 w-6 text-primary animate-spin-slow" />
        ) : (
          <Snowflake className="h-6 w-6 text-primary animate-bounce-subtle" />
        )}
        link={`/catalog?season=${season}`}
        linkText="Все товары"
      />

      {/* Featured Products */}
      <ProductSection
        products={featuredProducts}
        isLoading={featuredLoading}
        title="Популярное"
        icon={<TrendingUp className="h-6 w-6 text-primary" />}
        link="/catalog?featured=true"
        linkText="Все популярные"
        showDecor={true}
      />

      {/* New Arrivals */}
      {(newLoading || newProducts.length > 0) && (
        <ProductSection
          products={newProducts}
          isLoading={newLoading}
          title="Новинки"
          icon={<Sparkles className="h-6 w-6 text-primary animate-pulse" />}
          link="/catalog?new=true"
          linkText="Все новинки"
          showDecor={true}
        />
      )}

      {/* Bike Finder CTA */}
      <section className="container-shop py-12">
        <div className="gradient-hero rounded-2xl p-8 md:p-12 text-center text-white relative overflow-hidden hover-lift">
          {/* Decorative elements */}
          <div className="absolute top-4 left-4 w-20 h-20 rounded-full bg-white/10 animate-pulse-soft" />
          <div className="absolute bottom-4 right-4 w-32 h-32 rounded-full bg-white/5 animate-float" />
          
          <h2 className="text-2xl md:text-3xl font-bold mb-4 relative z-10">
            Не знаете, что выбрать?
          </h2>
          <p className="text-lg mb-6 opacity-90 max-w-lg mx-auto relative z-10">
            Пройдите короткий тест и мы подберём идеальный велосипед или самокат под ваши задачи
          </p>
          <Button size="lg" variant="secondary" asChild className="btn-ripple hover:scale-105 transition-transform relative z-10">
            <Link to="/quiz">
              🎯 Подобрать за 2 минуты
            </Link>
          </Button>
        </div>
      </section>

      {/* Trust signals */}
      <section className="container-shop py-12 relative">
        <InteractiveParticles count={50} />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 stagger-children relative z-10">
          <div className="text-center p-4 hover-lift rounded-xl">
            <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center icon-bounce">
              <span className="text-2xl">🚚</span>
            </div>
            <h3 className="font-semibold mb-1">Доставка</h3>
            <p className="text-sm text-muted-foreground">Быстрая доставка по городу и краю</p>
          </div>
          <div className="text-center p-4 hover-lift rounded-xl">
            <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center icon-bounce">
              <span className="text-2xl">🛡️</span>
            </div>
            <h3 className="font-semibold mb-1">Гарантия</h3>
            <p className="text-sm text-muted-foreground">Официальная гарантия на все товары</p>
          </div>
          <div className="text-center p-4 hover-lift rounded-xl">
            <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center icon-bounce">
              <span className="text-2xl">💳</span>
            </div>
            <h3 className="font-semibold mb-1">Оплата</h3>
            <p className="text-sm text-muted-foreground">Наличные, карты, рассрочка</p>
          </div>
          <div className="text-center p-4 hover-lift rounded-xl">
            <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center icon-bounce">
              <span className="text-2xl">🔧</span>
            </div>
            <h3 className="font-semibold mb-1">Сервис</h3>
            <p className="text-sm text-muted-foreground">Сборка, настройка, обслуживание</p>
          </div>
        </div>
      </section>
    </ShopLayout>
  );
}
