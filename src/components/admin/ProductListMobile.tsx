import { Link } from "react-router-dom";
import { MoreHorizontal, Pencil, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Product } from "@/types/shop";

interface ProductListMobileProps {
  products: Product[];
  categories: Array<{ value: string; label: string }>;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export function ProductListMobile({ 
  products, 
  categories, 
  onEdit, 
  onDelete 
}: ProductListMobileProps) {
  return (
    <div className="space-y-3">
      {products.map((product) => (
        <div 
          key={product.id} 
          className="bg-background border rounded-lg p-3 flex gap-3"
        >
          {/* Image */}
          <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted shrink-0">
            <img
              src={product.images?.[0] || "/placeholder.svg"}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="font-medium text-sm line-clamp-1">{product.name}</p>
                <p className="text-xs text-muted-foreground line-clamp-1">
                  {categories.find(c => c.value === product.category_id)?.label || product.category_id}
                </p>
              </div>
              
              {/* Actions */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link to={`/product/${product.slug}`}>
                      <Eye className="h-4 w-4 mr-2" />
                      Просмотр
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onEdit(product)}>
                    <Pencil className="h-4 w-4 mr-2" />
                    Редактировать
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="text-destructive"
                    onClick={() => onDelete(product)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Удалить
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Price & Status row */}
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center gap-1">
                <span className="font-semibold text-sm">
                  {(product.sale_price ?? product.price).toLocaleString()} ₽
                </span>
                {product.sale_price && (
                  <span className="text-xs text-muted-foreground line-through">
                    {product.price.toLocaleString()}
                  </span>
                )}
              </div>
              
              <div className="flex items-center gap-1 ml-auto">
                {product.in_stock ? (
                  <Badge variant="outline" className="text-xs px-1.5 py-0">
                    {product.stock_quantity} шт
                  </Badge>
                ) : (
                  <Badge variant="destructive" className="text-xs px-1.5 py-0">
                    Нет
                  </Badge>
                )}
                <span className="text-sm">
                  {product.season === "summer" && "☀️"}
                  {product.season === "winter" && "❄️"}
                  {product.season === "all" && "🔄"}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
