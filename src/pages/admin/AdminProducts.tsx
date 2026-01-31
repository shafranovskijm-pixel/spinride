import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  Pencil, 
  Trash2,
  Eye,
  RefreshCw,
  AlertCircle
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ProductFormDialog } from "@/components/admin/ProductFormDialog";
import { ProductListMobile } from "@/components/admin/ProductListMobile";
import { Product } from "@/types/shop";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const categories = [
  { value: "all", label: "Все категории" },
  { value: "bicycles", label: "Велосипеды" },
  { value: "e-bikes", label: "Электровелосипеды" },
  { value: "e-scooters", label: "Электросамокаты" },
  { value: "scooters", label: "Самокаты" },
  { value: "bmx", label: "BMX" },
  { value: "kids", label: "Детям" },
  { value: "accessories", label: "Аксессуары" },
];

export default function AdminProducts() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteProduct, setDeleteProduct] = useState<Product | null>(null);

  // Fetch products from Supabase
  const { data: products = [], isLoading, error, refetch } = useQuery({
    queryKey: ["admin-products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Transform to match Product type
      return data.map((p): Product => ({
        id: p.id,
        category_id: p.category_id,
        name: p.name,
        slug: p.slug,
        description: p.description,
        specifications: (p.specifications as Record<string, string>) || {},
        price: Number(p.price),
        sale_price: p.sale_price ? Number(p.sale_price) : null,
        images: p.images || [],
        in_stock: p.in_stock ?? true,
        stock_quantity: p.stock_quantity ?? 0,
        season: (p.season as "summer" | "winter" | "all") || "all",
        is_featured: p.is_featured ?? false,
        is_new: p.is_new ?? false,
        rating_average: Number(p.rating_average) || 0,
        rating_count: p.rating_count || 0,
        created_at: p.created_at,
        updated_at: p.updated_at,
      }));
    },
  });

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === "all" || product.category_id === category;
    return matchesSearch && matchesCategory;
  });

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleAdd = () => {
    setEditingProduct(null);
    setIsFormOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteProduct) return;

    try {
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", deleteProduct.id);

      if (error) throw error;

      toast({
        title: "Товар удалён",
        description: `${deleteProduct.name} успешно удалён`,
      });

      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
    } catch (error: any) {
      toast({
        title: "Ошибка",
        description: error.message || "Не удалось удалить товар",
        variant: "destructive",
      });
    } finally {
      setDeleteProduct(null);
    }
  };

  const handleFormSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ["admin-products"] });
  };

  return (
    <AdminLayout 
      title="Товары" 
      subtitle={`${products.length} товаров в каталоге`}
      actions={
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="outline" size="icon" onClick={() => refetch()} className="shrink-0">
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button onClick={handleAdd} className="flex-1 sm:flex-initial">
            <Plus className="h-4 w-4 mr-2" />
            <span className="sm:inline">Добавить товар</span>
          </Button>
        </div>
      }
    >
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div className="relative flex-1 sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Поиск товаров..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 text-base"
          />
        </div>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-full sm:w-[180px]">
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

      {/* Loading/Error states */}
      {isLoading && (
        <div className="text-center py-12">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">Загрузка товаров...</p>
        </div>
      )}

      {error && (
        <div className="text-center py-12">
          <AlertCircle className="h-8 w-8 mx-auto mb-4 text-destructive" />
          <p className="text-destructive">Ошибка загрузки товаров</p>
          <Button variant="outline" className="mt-4" onClick={() => refetch()}>
            Попробовать снова
          </Button>
        </div>
      )}

      {/* Mobile List */}
      {!isLoading && !error && filteredProducts.length > 0 && (
        <div className="sm:hidden">
          <ProductListMobile
            products={filteredProducts}
            categories={categories}
            onEdit={handleEdit}
            onDelete={setDeleteProduct}
          />
        </div>
      )}

      {/* Desktop Table */}
      {!isLoading && !error && filteredProducts.length > 0 && (
        <div className="hidden sm:block border rounded-lg bg-background overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Фото</TableHead>
                <TableHead>Название</TableHead>
                <TableHead className="hidden md:table-cell">Категория</TableHead>
                <TableHead className="text-right">Цена</TableHead>
                <TableHead className="text-center hidden lg:table-cell">Наличие</TableHead>
                <TableHead className="text-center hidden lg:table-cell">Сезон</TableHead>
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
                      <p className="text-sm text-muted-foreground line-clamp-1">{product.slug}</p>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
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
                  <TableCell className="text-center hidden lg:table-cell">
                    {product.in_stock ? (
                      <Badge variant="outline" className="bg-secondary/20 text-secondary-foreground">
                        {product.stock_quantity} шт
                      </Badge>
                    ) : (
                      <Badge variant="destructive">Нет</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-center hidden lg:table-cell">
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
                        <DropdownMenuItem onClick={() => handleEdit(product)}>
                          <Pencil className="h-4 w-4 mr-2" />
                          Редактировать
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-destructive"
                          onClick={() => setDeleteProduct(product)}
                        >
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
      )}

      {!isLoading && !error && filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Товары не найдены</p>
          <Button className="mt-4" onClick={handleAdd}>
            <Plus className="h-4 w-4 mr-2" />
            Добавить первый товар
          </Button>
        </div>
      )}

      {/* Product Form Dialog */}
      <ProductFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        product={editingProduct}
        onSuccess={handleFormSuccess}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteProduct} onOpenChange={() => setDeleteProduct(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить товар?</AlertDialogTitle>
            <AlertDialogDescription>
              Вы уверены, что хотите удалить "{deleteProduct?.name}"? 
              Это действие нельзя отменить.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Удалить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}
