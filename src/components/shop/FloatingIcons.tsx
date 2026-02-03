import { Bike, Snowflake, TreePine, Gift, Zap, CircleDot } from "lucide-react";
import { useSeason } from "@/hooks/use-season";
import { cn } from "@/lib/utils";

interface FloatingIconsProps {
  className?: string;
  density?: "low" | "medium" | "high";
}

const winterIcons = [Snowflake, TreePine, Gift, Snowflake, TreePine];
const summerIcons = [Bike, Zap, CircleDot, Bike, Zap];

export function FloatingIcons({ className, density = "medium" }: FloatingIconsProps) {
  const { season } = useSeason();
  const icons = season === "winter" ? winterIcons : summerIcons;
  
  const iconCount = density === "low" ? 3 : density === "high" ? 8 : 5;
  
  const positions = [
    { top: "5%", left: "5%", size: 80, delay: 0, duration: 15 },
    { top: "15%", right: "10%", size: 60, delay: 2, duration: 18 },
    { top: "40%", left: "8%", size: 100, delay: 4, duration: 20 },
    { top: "60%", right: "5%", size: 70, delay: 1, duration: 16 },
    { top: "80%", left: "15%", size: 50, delay: 3, duration: 14 },
    { top: "25%", left: "80%", size: 40, delay: 5, duration: 17 },
    { top: "70%", right: "20%", size: 90, delay: 2.5, duration: 19 },
    { top: "50%", left: "50%", size: 55, delay: 1.5, duration: 21 },
  ].slice(0, iconCount);

  return (
    <div className={cn("absolute inset-0 overflow-hidden pointer-events-none", className)}>
      {positions.map((pos, index) => {
        const Icon = icons[index % icons.length];
        return (
          <div
            key={index}
            className="absolute animate-float-gentle"
            style={{
              top: pos.top,
              left: pos.left,
              right: pos.right,
              animationDelay: `${pos.delay}s`,
              animationDuration: `${pos.duration}s`,
            }}
          >
            <Icon 
              className="text-primary/[0.06] dark:text-primary/[0.04]" 
              style={{ 
                width: pos.size, 
                height: pos.size,
              }}
              strokeWidth={1}
            />
          </div>
        );
      })}
    </div>
  );
}
