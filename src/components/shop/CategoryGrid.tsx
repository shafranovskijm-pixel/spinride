import { Link } from "react-router-dom";
import { 
  Bike, 
  Zap, 
  Baby, 
  Wrench, 
  Lightbulb, 
  LucideIcon,
  CircleDot,
  Car
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface CategoryItem {
  name: string;
  slug: string;
  icon: LucideIcon;
  color: string;
}

const categories: CategoryItem[] = [
  { name: "Велосипеды", slug: "bicycles", icon: Bike, color: "bg-primary/10 text-primary" },
  { name: "Электровелосипеды", slug: "e-bikes", icon: Zap, color: "bg-secondary/20 text-secondary-foreground" },
  { name: "Самокаты", slug: "scooters", icon: CircleDot, color: "bg-accent/30 text-accent-foreground" },
  { name: "Электросамокаты", slug: "e-scooters", icon: Zap, color: "bg-primary/10 text-primary" },
  { name: "BMX", slug: "bmx", icon: Bike, color: "bg-destructive/10 text-destructive" },
  { name: "Детям", slug: "kids", icon: Baby, color: "bg-secondary/20 text-secondary-foreground" },
  { name: "Аксессуары", slug: "accessories", icon: Lightbulb, color: "bg-accent/30 text-accent-foreground" },
  { name: "Запчасти", slug: "parts", icon: Wrench, color: "bg-muted text-muted-foreground" },
  { name: "Квадроциклы", slug: "atv", icon: Car, color: "bg-primary/10 text-primary" },
];

interface CategoryGridProps {
  className?: string;
}

export function CategoryGrid({ className }: CategoryGridProps) {
  return (
    <div className={cn("grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-9 gap-3", className)}>
      {categories.map((category) => {
        const Icon = category.icon;
        return (
          <Link key={category.slug} to={`/catalog/${category.slug}`}>
            <Card className="h-full hover:shadow-md transition-all hover:-translate-y-0.5 cursor-pointer">
              <CardContent className="p-3 sm:p-4 flex flex-col items-center text-center gap-2">
                <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", category.color)}>
                  <Icon className="h-6 w-6" />
                </div>
                <span className="text-xs sm:text-sm font-medium leading-tight">{category.name}</span>
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
