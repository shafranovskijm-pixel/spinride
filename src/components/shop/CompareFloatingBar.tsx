import { X, ShoppingCart, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCompare } from "@/hooks/use-compare";
import { cn } from "@/lib/utils";

export function CompareFloatingBar() {
  const { compareItems, removeFromCompare, clearCompare, count } = useCompare();

  if (count === 0) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-full max-w-xl px-4">
      <Card className="shadow-lg border-primary/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-3">
                {compareItems.slice(0, 3).map((product) => (
                  <div
                    key={product.id}
                    className="w-10 h-10 rounded-full border-2 border-background overflow-hidden bg-muted"
                  >
                    <img
                      src={product.images?.[0] || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
                {count > 3 && (
                  <div className="w-10 h-10 rounded-full border-2 border-background bg-muted flex items-center justify-center text-sm font-medium">
                    +{count - 3}
                  </div>
                )}
              </div>
              <div>
                <p className="font-medium text-sm">Сравнение</p>
                <p className="text-xs text-muted-foreground">{count} товар(а)</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={clearCompare}>
                <X className="h-4 w-4" />
              </Button>
              <Button size="sm" asChild>
                <Link to="/compare">
                  Сравнить
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
