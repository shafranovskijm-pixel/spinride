import { useEffect, useRef, useState, useCallback } from "react";
import { useSeason } from "@/hooks/use-season";
import { cn } from "@/lib/utils";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  originalX: number;
  originalY: number;
  offsetX: number;
  offsetY: number;
}

interface InteractiveParticlesProps {
  className?: string;
  count?: number;
  interactionRadius?: number;
}

export function InteractiveParticles({ 
  className, 
  count = 30,
  interactionRadius = 120 
}: InteractiveParticlesProps) {
  const { season } = useSeason();
  const containerRef = useRef<HTMLDivElement>(null);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });
  const animationRef = useRef<number>();

  // Initialize particles
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const newParticles: Particle[] = [];

    for (let i = 0; i < count; i++) {
      const x = Math.random() * rect.width;
      const y = Math.random() * rect.height;
      newParticles.push({
        id: i,
        x,
        y,
        originalX: x,
        originalY: y,
        size: Math.random() * 6 + 3,
        offsetX: 0,
        offsetY: 0,
      });
    }

    setParticles(newParticles);
  }, [count]);

  // Handle mouse movement
  const handleMouseMove = useCallback((e: MouseEvent) => {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setMousePos({ x: -1000, y: -1000 });
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [handleMouseMove, handleMouseLeave]);

  // Animate particles
  useEffect(() => {
    const animate = () => {
      setParticles(prev => prev.map(particle => {
        const dx = mousePos.x - particle.originalX;
        const dy = mousePos.y - particle.originalY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        let targetOffsetX = 0;
        let targetOffsetY = 0;

        if (distance < interactionRadius && distance > 0) {
          const force = (interactionRadius - distance) / interactionRadius;
          const angle = Math.atan2(dy, dx);
          targetOffsetX = -Math.cos(angle) * force * 30;
          targetOffsetY = -Math.sin(angle) * force * 30;
        }

        // Smooth lerp back to original position
        const newOffsetX = particle.offsetX + (targetOffsetX - particle.offsetX) * 0.1;
        const newOffsetY = particle.offsetY + (targetOffsetY - particle.offsetY) * 0.1;

        return {
          ...particle,
          offsetX: newOffsetX,
          offsetY: newOffsetY,
        };
      }));

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [mousePos, interactionRadius]);

  const particleColor = season === "winter" 
    ? "bg-blue-400/40" 
    : "bg-amber-400/40";

  return (
    <div 
      ref={containerRef}
      className={cn(
        "absolute inset-0 overflow-hidden pointer-events-auto",
        className
      )}
    >
      {particles.map(particle => (
        <div
          key={particle.id}
          className={cn(
            "absolute rounded-full transition-opacity duration-300",
            particleColor
          )}
          style={{
            left: particle.originalX + particle.offsetX,
            top: particle.originalY + particle.offsetY,
            width: particle.size,
            height: particle.size,
            transform: "translate(-50%, -50%)",
          }}
        />
      ))}
    </div>
  );
}
