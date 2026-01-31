import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  Pencil, 
  Trash2,
  Eye
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { mockProducts } from "@/data/mock-products";
import { Product } from "@/types/shop";

const categories = [
  { value: "all", label: "Все категории" },
  { value: "bicycles", label: "Велосипеды" },
  { value: "e-bikes", label: "Электровелосипеды" },
  { value: "scooters", label: "Самокаты" },
  { value: "e-scooters", label: "Электросамокаты" },
  { value: "bmx", label: "BMX" },
  { value: "kids", label: "Детям" },
];

export default function AdminProducts() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [products] = useState<Product[]>(mockProducts);

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === "all" || product.category_id === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <AdminLayout 
      title="Товары" 
      subtitle={`${products.length} товаров в каталоге`}
      actions={
        <Button asChild>
          <Link to="/admin/products/new">
            <Plus className="h-4 w-4 mr-2" />
            Добавить товар
          </Link>
        </Button>
      }
    >
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Поиск товаров..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Категория" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat.value} value={cat.value}>
                {cat.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="border rounded-lg bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Фото</TableHead>
              <TableHead>Название</TableHead>
              <TableHead>Категория</TableHead>
              <TableHead className="text-right">Цена</TableHead>
              <TableHead className="text-center">Наличие</TableHead>
              <TableHead className="text-center">Сезон</TableHead>
              <TableHead className="w-[60px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted">
                    <img
                      src={product.images?.[0] || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium line-clamp-1">{product.name}</p>
                    <p className="text-sm text-muted-foreground">{product.slug}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {categories.find(c => c.value === product.category_id)?.label || product.category_id}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div>
                    <p className="font-medium">
                      {(product.sale_price ?? product.price).toLocaleString()} ₽
                    </p>
                    {product.sale_price && (
                      <p className="text-sm text-muted-foreground line-through">
                        {product.price.toLocaleString()} ₽
                      </p>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  {product.in_stock ? (
                    <Badge variant="outline" className="bg-secondary/20 text-secondary-foreground">
                      {product.stock_quantity} шт
                    </Badge>
                  ) : (
                    <Badge variant="destructive">Нет</Badge>
                  )}
                </TableCell>
                <TableCell className="text-center">
                  {product.season === "summer" && "☀️"}
                  {product.season === "winter" && "❄️"}
                  {product.season === "all" && "🔄"}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
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
                      <DropdownMenuItem>
                        <Pencil className="h-4 w-4 mr-2" />
                        Редактировать
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Удалить
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Товары не найдены</p>
        </div>
      )}
    </AdminLayout>
  );
}
