import { useSeason } from "@/hooks/use-season";
import { cn } from "@/lib/utils";

interface SectionDividerProps {
  variant?: "wave" | "curve" | "zigzag";
  flip?: boolean;
  className?: string;
}

export function SectionDivider({ variant = "wave", flip = false, className }: SectionDividerProps) {
  const { season } = useSeason();
  
  const gradientColors = season === "winter" 
    ? { from: "hsl(210 100% 50%)", to: "hsl(200 80% 60%)" }
    : { from: "hsl(42 100% 50%)", to: "hsl(35 100% 55%)" };

  const renderPath = () => {
    switch (variant) {
      case "curve":
        return (
          <path 
            d="M0,0 Q720,100 1440,0 L1440,100 L0,100 Z" 
            fill="url(#dividerGradient)"
          />
        );
      case "zigzag":
        return (
          <path 
            d="M0,50 L120,0 L240,50 L360,0 L480,50 L600,0 L720,50 L840,0 L960,50 L1080,0 L1200,50 L1320,0 L1440,50 L1440,100 L0,100 Z" 
            fill="url(#dividerGradient)"
          />
        );
      default: // wave
        return (
          <path 
            d="M0,50 C240,100 480,0 720,50 C960,100 1200,0 1440,50 L1440,100 L0,100 Z" 
            fill="url(#dividerGradient)"
          />
        );
    }
  };

  return (
    <div 
      className={cn(
        "relative w-full overflow-hidden pointer-events-none select-none",
        flip && "rotate-180",
        className
      )}
      style={{ height: variant === "zigzag" ? "60px" : "80px", marginTop: "-1px" }}
    >
      <svg
        viewBox="0 0 1440 100"
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full"
        style={{ opacity: 0.15 }}
      >
        <defs>
          <linearGradient id="dividerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={gradientColors.from} />
            <stop offset="100%" stopColor={gradientColors.to} />
          </linearGradient>
        </defs>
        {renderPath()}
      </svg>
    </div>
  );
}
