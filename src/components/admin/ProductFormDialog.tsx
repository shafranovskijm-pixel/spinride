import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ImageUpload } from "./ImageUpload";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Product } from "@/types/shop";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const categories = [
  { value: "bicycles", label: "Велосипеды" },
  { value: "e-bikes", label: "Электровелосипеды" },
  { value: "e-scooters", label: "Электросамокаты" },
  { value: "scooters", label: "Самокаты" },
  { value: "bmx", label: "BMX" },
  { value: "kids", label: "Детям" },
  { value: "accessories", label: "Аксессуары" },
];

const seasons = [
  { value: "all", label: "Всесезонный" },
  { value: "summer", label: "Летний" },
  { value: "winter", label: "Зимний" },
];

const productSchema = z.object({
  name: z.string().min(1, "Название обязательно").max(200, "Максимум 200 символов"),
  slug: z.string().min(1, "URL обязателен").max(100, "Максимум 100 символов")
    .regex(/^[a-z0-9-]+$/, "Только латинские буквы, цифры и дефисы"),
  description: z.string().max(2000, "Максимум 2000 символов").optional(),
  category_id: z.string().min(1, "Выберите категорию"),
  price: z.coerce.number().min(1, "Цена должна быть больше 0"),
  sale_price: z.coerce.number().min(0).optional().nullable(),
  stock_quantity: z.coerce.number().min(0, "Количество не может быть отрицательным"),
  in_stock: z.boolean(),
  season: z.enum(["all", "summer", "winter"]),
  is_featured: z.boolean(),
  is_new: z.boolean(),
  images: z.array(z.string()).optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

interface ProductFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: Product | null;
  onSuccess: () => void;
}

export function ProductFormDialog({ 
  open, 
  onOpenChange, 
  product, 
  onSuccess 
}: ProductFormDialogProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [specs, setSpecs] = useState<Array<{ key: string; value: string }>>([]);

  const isEditing = !!product;

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      category_id: "",
      price: 0,
      sale_price: null,
      stock_quantity: 0,
      in_stock: true,
      season: "all",
      is_featured: false,
      is_new: false,
      images: [],
    },
  });

  // Reset form when product changes
  useEffect(() => {
    if (product) {
      form.reset({
        name: product.name,
        slug: product.slug,
        description: product.description || "",
        category_id: product.category_id || "",
        price: product.price,
        sale_price: product.sale_price,
        stock_quantity: product.stock_quantity,
        in_stock: product.in_stock,
        season: product.season,
        is_featured: product.is_featured,
        is_new: product.is_new,
        images: product.images || [],
      });
      // Load specifications
      const specArray = Object.entries(product.specifications || {}).map(([key, value]) => ({
        key,
        value: String(value),
      }));
      setSpecs(specArray.length > 0 ? specArray : [{ key: "", value: "" }]);
    } else {
      form.reset({
        name: "",
        slug: "",
        description: "",
        category_id: "",
        price: 0,
        sale_price: null,
        stock_quantity: 0,
        in_stock: true,
        season: "all",
        is_featured: false,
        is_new: false,
        images: [],
      });
      setSpecs([{ key: "", value: "" }]);
    }
  }, [product, form]);

  // Generate slug from name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[а-яё]/g, (char) => {
        const map: Record<string, string> = {
          а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "yo",
          ж: "zh", з: "z", и: "i", й: "y", к: "k", л: "l", м: "m",
          н: "n", о: "o", п: "p", р: "r", с: "s", т: "t", у: "u",
          ф: "f", х: "h", ц: "ts", ч: "ch", ш: "sh", щ: "sch",
          ъ: "", ы: "y", ь: "", э: "e", ю: "yu", я: "ya"
        };
        return map[char] || char;
      })
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 100);
  };

  const handleNameChange = (name: string) => {
    form.setValue("name", name);
    if (!isEditing && !form.getValues("slug")) {
      form.setValue("slug", generateSlug(name));
    }
  };

  const handleImagesChange = (newImages: string[]) => {
    form.setValue("images", newImages);
  };

  const addSpec = () => {
    setSpecs([...specs, { key: "", value: "" }]);
  };

  const removeSpec = (index: number) => {
    setSpecs(specs.filter((_, i) => i !== index));
  };

  const updateSpec = (index: number, field: "key" | "value", value: string) => {
    const newSpecs = [...specs];
    newSpecs[index][field] = value;
    setSpecs(newSpecs);
  };

  const onSubmit = async (data: ProductFormData) => {
    setIsSubmitting(true);

    try {
      // Convert specs array to object
      const specifications: Record<string, string> = {};
      specs.forEach(({ key, value }) => {
        if (key.trim() && value.trim()) {
          specifications[key.trim()] = value.trim();
        }
      });

      const productData = {
        name: data.name,
        slug: data.slug,
        description: data.description || null,
        category_id: data.category_id,
        price: data.price,
        sale_price: data.sale_price || null,
        stock_quantity: data.stock_quantity,
        in_stock: data.in_stock,
        season: data.season as "all" | "summer" | "winter",
        is_featured: data.is_featured,
        is_new: data.is_new,
        images: data.images || [],
        specifications,
      };

      if (isEditing && product) {
        const { error } = await supabase
          .from("products")
          .update(productData)
          .eq("id", product.id);

        if (error) throw error;

        toast({
          title: "Товар обновлён",
          description: `${data.name} успешно обновлён`,
        });
      } else {
        const { error } = await supabase
          .from("products")
          .insert([productData]);

        if (error) throw error;

        toast({
          title: "Товар добавлен",
          description: `${data.name} успешно добавлен в каталог`,
        });
      }

      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Ошибка",
        description: error.message || "Не удалось сохранить товар",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Редактировать товар" : "Добавить товар"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Info */}
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Название *</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        onChange={(e) => handleNameChange(e.target.value)}
                        placeholder="Велосипед OCIMA #300" 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL (slug) *</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="ocima-300" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Описание</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      placeholder="Горный велосипед с алюминиевой рамой..."
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Category & Season */}
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="category_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Категория *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите категорию" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.value} value={cat.value}>
                            {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="season"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Сезон</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {seasons.map((s) => (
                          <SelectItem key={s.value} value={s.value}>
                            {s.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Price & Stock */}
            <div className="grid gap-4 sm:grid-cols-3">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Цена (₽) *</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" min={0} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sale_price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Цена со скидкой (₽)</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        type="number" 
                        min={0}
                        value={field.value ?? ""}
                        onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="stock_quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Количество</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" min={0} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Toggles */}
            <div className="flex flex-wrap gap-6">
              <FormField
                control={form.control}
                name="in_stock"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2">
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormLabel className="!mt-0">В наличии</FormLabel>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="is_new"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2">
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormLabel className="!mt-0">Новинка</FormLabel>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="is_featured"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2">
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormLabel className="!mt-0">Рекомендуем</FormLabel>
                  </FormItem>
                )}
              />
            </div>

            {/* Images */}
            <div className="space-y-3">
              <FormLabel>Изображения</FormLabel>
              <ImageUpload
                images={form.watch("images") || []}
                onImagesChange={handleImagesChange}
                maxImages={10}
              />
            </div>

            {/* Specifications */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <FormLabel>Характеристики</FormLabel>
                <Button type="button" variant="ghost" size="sm" onClick={addSpec}>
                  <Plus className="h-4 w-4 mr-1" />
                  Добавить
                </Button>
              </div>
              <div className="space-y-2">
                {specs.map((spec, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={spec.key}
                      onChange={(e) => updateSpec(index, "key", e.target.value)}
                      placeholder="Название"
                      className="flex-1"
                    />
                    <Input
                      value={spec.value}
                      onChange={(e) => updateSpec(index, "value", e.target.value)}
                      placeholder="Значение"
                      className="flex-1"
                    />
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="icon"
                      onClick={() => removeSpec(index)}
                      disabled={specs.length === 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Отмена
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Сохранение..." : isEditing ? "Сохранить" : "Добавить товар"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
