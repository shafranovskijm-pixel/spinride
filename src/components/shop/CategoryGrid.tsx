import { Link } from "react-router-dom";
import { Bike, Zap, CircleDot, Users, Wrench, Snowflake, TreePine, Gift } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSeason } from "@/hooks/use-season";

const summerCategories = [
  {
    id: "bicycles",
    name: "Велосипеды",
    description: "Горные, городские, шоссейные",
    icon: Bike,
    image: "https://274418.selcdn.ru/cv08300-33250f0d-0664-43fc-9dbf-9d89738d114e/uploads/521356/a85a9360-a056-457c-992b-b66f659aa4c2.jpg",
    color: "from-orange-500 to-yellow-500",
  },
  {
    id: "e-bikes",
    name: "Электро",
    description: "Электровелосипеды и питбайки",
    icon: Zap,
    image: "https://274418.selcdn.ru/cv08300-33250f0d-0664-43fc-9dbf-9d89738d114e/uploads/521356/2a228bf0-4281-423c-bace-a1623d0491d2.jpg",
    color: "from-purple-500 to-indigo-500",
  },
  {
    id: "e-scooters",
    name: "Электросамокаты",
    description: "Городские и мощные",
    icon: Zap,
    image: "https://274418.selcdn.ru/cv08300-33250f0d-0664-43fc-9dbf-9d89738d114e/uploads/521356/71a81878-4e51-4aa1-a085-2d1b94cce964.jpg",
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: "bmx",
    name: "BMX",
    description: "Трюковые велосипеды",
    icon: CircleDot,
    image: "https://274418.selcdn.ru/cv08300-33250f0d-0664-43fc-9dbf-9d89738d114e/uploads/521356/c2af4791-f230-41bb-ba52-52baf0f9a8f3.jpg",
    color: "from-red-500 to-orange-500",
  },
  {
    id: "kids",
    name: "Детям",
    description: "Велосипеды и самокаты",
    icon: Users,
    image: "https://274418.selcdn.ru/cv08300-33250f0d-0664-43fc-9dbf-9d89738d114e/uploads/521356/51a66775-8baa-41eb-9c29-c68ff12ba6f9.jpg",
    color: "from-pink-500 to-rose-500",
  },
  {
    id: "accessories",
    name: "Аксессуары",
    description: "Фонари, замки, запчасти",
    icon: Wrench,
    image: "/categories/bike-accessories.jpg",
    color: "from-green-500 to-emerald-500",
  },
];

const winterCategories = [
  {
    id: "winter",
    name: "Тюбинги и санки",
    description: "Для весёлого катания с горок",
    icon: Snowflake,
    image: "/categories/tubing-sleds.jpg",
    color: "from-blue-400 to-cyan-400",
  },
  {
    id: "decor",
    name: "Ёлки",
    description: "Искусственные ёлки всех размеров",
    icon: TreePine,
    image: "/categories/christmas-trees.jpg",
    color: "from-green-600 to-emerald-500",
  },
  {
    id: "party",
    name: "Декор для дома",
    description: "Гирлянды, шары, украшения",
    icon: Gift,
    image: "/categories/home-decor.jpg",
    color: "from-red-500 to-pink-500",
  },
  {
    id: "kids",
    name: "Детям",
    description: "Санки, ледянки, снегокаты",
    icon: Users,
    image: "/categories/kids.jpg",
    color: "from-pink-400 to-rose-400",
  },
  {
    id: "accessories",
    name: "Аксессуары",
    description: "Всё для зимнего отдыха",
    icon: Wrench,
    image: "/categories/accessories.jpg",
    color: "from-slate-500 to-gray-500",
  },
  {
    id: "bicycles",
    name: "Велосипеды",
    description: "Фэтбайки для зимы",
    icon: Bike,
    image: "/categories/bicycles.jpg",
    color: "from-orange-400 to-yellow-400",
  },
];

interface CategoryGridProps {
  className?: string;
}

export function CategoryGrid({ className }: CategoryGridProps) {
  const { season } = useSeason();
  const categories = season === "winter" ? winterCategories : summerCategories;
  
  return (
    <div className={cn("grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 stagger-children", className)}>
      {categories.map((category, index) => (
        <Link
          key={category.id}
          to={`/catalog/${category.id}`}
          className="group relative overflow-hidden rounded-2xl aspect-[3/4] bg-card shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 card-shine"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          {/* Background image */}
          <div className="absolute inset-0">
            <img
              src={category.image}
              alt={category.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className={cn(
              "absolute inset-0 bg-gradient-to-t opacity-80 group-hover:opacity-70 transition-opacity duration-300",
              category.color
            )} />
          </div>
          
          {/* Content */}
          <div className="absolute inset-0 p-4 flex flex-col justify-end text-white">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-3 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
              <category.icon className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-lg leading-tight group-hover:translate-x-1 transition-transform duration-300">{category.name}</h3>
            <p className="text-sm text-white/80 line-clamp-2 mt-1 group-hover:translate-x-1 transition-transform duration-300 delay-75">{category.description}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
