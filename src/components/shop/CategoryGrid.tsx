import { Link } from "react-router-dom";
import { Bike, Zap, CircleDot, Users, Wrench, Snowflake } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSeason } from "@/hooks/use-season";

// Match the populated catalog sections. Season changes their order, not
// the assortment advertised to visitors, and requires no extra API request.
const catalogCategories = [
  {
    id: "bicycles",
    name: "Велосипеды",
    description: "Для города и прогулок",
    icon: Bike,
    image: "https://274418.selcdn.ru/cv08300-33250f0d-0664-43fc-9dbf-9d89738d114e/uploads/521356/a85a9360-a056-457c-992b-b66f659aa4c2.jpg",
    color: "from-orange-500 to-yellow-500",
  },
  {
    id: "scooters",
    name: "Самокаты",
    description: "Детские и трюковые",
    icon: CircleDot,
    image: "https://274418.selcdn.ru/cv08300-33250f0d-0664-43fc-9dbf-9d89738d114e/uploads/521356/4c80292a-0679-4945-b342-efafb7dde38b.jpg",
    color: "from-purple-500 to-indigo-500",
  },
  {
    id: "kids",
    name: "Детям",
    description: "Ролики-квады и дрифт-карт",
    icon: Users,
    image: "https://atkgcbunyakdnkfybvvp.supabase.co/storage/v1/object/public/product-images/products/1777249410451-z4mr3u6jzw.webp",
    color: "from-pink-500 to-rose-500",
  },
  {
    id: "parts",
    name: "Запчасти",
    description: "Колёса для трюковых самокатов",
    icon: Wrench,
    image: "https://atkgcbunyakdnkfybvvp.supabase.co/storage/v1/object/public/product-images/products/1778375529003-3efz8g47hpe.webp",
    color: "from-green-500 to-emerald-500",
  },
  {
    id: "elektromobil",
    name: "Электромобили",
    description: "Детские модели с пультом",
    icon: Zap,
    image: "https://atkgcbunyakdnkfybvvp.supabase.co/storage/v1/object/public/product-images/products/1775969435955-r6542t7mcw.webp",
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: "winter",
    name: "Зимние товары",
    description: "Коньки и тюбинги",
    icon: Snowflake,
    image: "/products/figure-skates.jpg",
    color: "from-blue-400 to-cyan-400",
  },
];

interface CategoryGridProps {
  className?: string;
}

export function CategoryGrid({ className }: CategoryGridProps) {
  const { season } = useSeason();
  const categories = season === "winter"
    ? [...catalogCategories.filter((category) => category.id === "winter"), ...catalogCategories.filter((category) => category.id !== "winter")]
    : catalogCategories;
  
  return (
    <div className={cn("grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 stagger-children", className)}>
      {categories.map((category, index) => (
        <Link
          key={category.id}
          to={`/catalog/${category.id}`}
          className="group relative overflow-hidden rounded-2xl aspect-[3/4] bg-card shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 card-shine corner-decoration"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          {/* Background image */}
          <div className="absolute inset-0">
            <img
              src={category.image}
              alt={category.name}
              onError={(event) => {
                event.currentTarget.onerror = null;
                event.currentTarget.src = "/placeholder.svg";
              }}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className={cn(
              "absolute inset-0 bg-gradient-to-t opacity-80 group-hover:opacity-70 transition-opacity duration-300",
              category.color
            )} />
          </div>
          
          {/* Decorative ring on hover */}
          <div className="absolute inset-2 rounded-xl border-2 border-white/0 group-hover:border-white/20 transition-all duration-300 pointer-events-none" />
          
          {/* Content */}
          <div className="absolute inset-0 p-4 flex flex-col justify-end text-white">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-3 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 group-hover:bg-white/30">
              <category.icon className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-lg leading-tight group-hover:translate-x-1 transition-transform duration-300">{category.name}</h3>
            <p className="text-sm text-white/80 line-clamp-2 mt-1 group-hover:translate-x-1 transition-transform duration-300 delay-75">{category.description}</p>
          </div>
          
          {/* Sparkle effect on hover */}
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="w-2 h-2 bg-white rounded-full animate-ping" />
          </div>
        </Link>
      ))}
    </div>
  );
}
