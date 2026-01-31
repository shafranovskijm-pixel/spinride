import { Link } from "react-router-dom";
import { ArrowRight, TrendingUp, Sparkles, Sun, Snowflake } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ShopLayout } from "@/components/shop/ShopLayout";
import { HeroBanner } from "@/components/shop/HeroBanner";
import { CategoryGrid } from "@/components/shop/CategoryGrid";
import { ProductCard } from "@/components/shop/ProductCard";
import { useSeason } from "@/hooks/use-season";
import { mockProducts, getFeaturedProducts, getNewProducts, getSeasonalProducts } from "@/data/mock-products";

export default function Index() {
  const { season } = useSeason();
  
  const featuredProducts = getFeaturedProducts();
  const newProducts = getNewProducts();
  const seasonalProducts = getSeasonalProducts(season);

  return (
    <ShopLayout>
      {/* Hero */}
      <HeroBanner />

      {/* Categories */}
      <section className="container-shop py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Категории</h2>
          <Link to="/catalog" className="text-sm text-primary hover:underline flex items-center gap-1">
            Все категории <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <CategoryGrid />
      </section>

      {/* Seasonal Products */}
      <section className="container-shop py-12">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            {season === "summer" ? (
              <Sun className="h-6 w-6 text-primary" />
            ) : (
              <Snowflake className="h-6 w-6 text-primary" />
            )}
            <h2 className="text-2xl font-bold">
              {season === "summer" ? "Летняя коллекция" : "Зимняя коллекция"}
            </h2>
          </div>
          <Link to={`/catalog?season=${season}`} className="text-sm text-primary hover:underline flex items-center gap-1">
            Все товары <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {seasonalProducts.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="container-shop py-12">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <TrendingUp className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold">Популярное</h2>
          </div>
          <Link to="/catalog?featured=true" className="text-sm text-primary hover:underline flex items-center gap-1">
            Все популярные <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {featuredProducts.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* New Arrivals */}
      {newProducts.length > 0 && (
        <section className="container-shop py-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Sparkles className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold">Новинки</h2>
            </div>
            <Link to="/catalog?new=true" className="text-sm text-primary hover:underline flex items-center gap-1">
              Все новинки <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {newProducts.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* Bike Finder CTA */}
      <section className="container-shop py-12">
        <div className="gradient-hero rounded-2xl p-8 md:p-12 text-center text-white">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Не знаете, что выбрать?
          </h2>
          <p className="text-lg mb-6 opacity-90 max-w-lg mx-auto">
            Пройдите короткий тест и мы подберём идеальный велосипед или самокат под ваши задачи
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link to="/quiz">
              🎯 Подобрать за 2 минуты
            </Link>
          </Button>
        </div>
      </section>

      {/* Trust signals */}
      <section className="container-shop py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center p-4">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-2xl">🚚</span>
            </div>
            <h3 className="font-semibold mb-1">Доставка</h3>
            <p className="text-sm text-muted-foreground">Быстрая доставка по городу и краю</p>
          </div>
          <div className="text-center p-4">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-2xl">🛡️</span>
            </div>
            <h3 className="font-semibold mb-1">Гарантия</h3>
            <p className="text-sm text-muted-foreground">Официальная гарантия на все товары</p>
          </div>
          <div className="text-center p-4">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-2xl">💳</span>
            </div>
            <h3 className="font-semibold mb-1">Оплата</h3>
            <p className="text-sm text-muted-foreground">Наличные, карты, рассрочка</p>
          </div>
          <div className="text-center p-4">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center">
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
