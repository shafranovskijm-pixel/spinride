import { Bike, Snowflake, TreePine, Gift, Zap, Star, Sparkles, Heart } from "lucide-react";
import { useSeason } from "@/hooks/use-season";
import { cn } from "@/lib/utils";

interface MarqueeStripProps {
  className?: string;
  speed?: "slow" | "normal" | "fast";
  direction?: "left" | "right";
}

const winterItems = [
  { icon: Snowflake, text: "Зимняя коллекция" },
  { icon: TreePine, text: "Ёлки и декор" },
  { icon: Gift, text: "Подарки" },
  { icon: Star, text: "Новогодние скидки" },
  { icon: Snowflake, text: "Тюбинги и санки" },
  { icon: Sparkles, text: "Праздничное настроение" },
];

const summerItems = [
  { icon: Bike, text: "Велосипеды" },
  { icon: Zap, text: "Электротранспорт" },
  { icon: Star, text: "Хиты продаж" },
  { icon: Heart, text: "Выбор покупателей" },
  { icon: Bike, text: "Самокаты" },
  { icon: Sparkles, text: "Новинки сезона" },
];

export function MarqueeStrip({ className, speed = "normal", direction = "left" }: MarqueeStripProps) {
  const { season } = useSeason();
  const items = season === "winter" ? winterItems : summerItems;
  
  const speedDuration = speed === "slow" ? "40s" : speed === "fast" ? "15s" : "25s";
  const animationDirection = direction === "right" ? "reverse" : "normal";

  // Duplicate items for seamless loop
  const duplicatedItems = [...items, ...items];

  return (
    <div className={cn("relative overflow-hidden bg-primary/5 py-3", className)}>
      <div 
        className="flex animate-marquee whitespace-nowrap"
        style={{ 
          animationDuration: speedDuration,
          animationDirection,
        }}
      >
        {duplicatedItems.map((item, index) => (
          <div 
            key={index} 
            className="flex items-center gap-2 mx-8 text-sm font-medium text-muted-foreground"
          >
            <item.icon className="h-4 w-4 text-primary" />
            <span>{item.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
