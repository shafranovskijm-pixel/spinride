import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Star, Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const reviewSchema = z.object({
  author_name: z.string().min(2, "Минимум 2 символа").max(50, "Максимум 50 символов"),
  rating: z.number().min(1, "Выберите оценку").max(5),
  content: z.string().min(10, "Минимум 10 символов").max(1000, "Максимум 1000 символов"),
});

type ReviewFormData = z.infer<typeof reviewSchema>;

interface ReviewFormProps {
  productId: string;
  onSuccess: () => void;
}

export function ReviewForm({ productId, onSuccess }: ReviewFormProps) {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);

  const form = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      author_name: profile?.display_name || "",
      rating: 0,
      content: "",
    },
  });

  const rating = form.watch("rating");

  const onSubmit = async (data: ReviewFormData) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("reviews").insert({
        product_id: productId,
        user_id: user?.id || null,
        author_name: data.author_name.trim(),
        rating: data.rating,
        content: data.content.trim(),
        is_approved: false, // Requires moderation
      });

      if (error) throw error;

      toast({
        title: "Отзыв отправлен!",
        description: "Ваш отзыв будет опубликован после модерации",
      });

      form.reset();
      onSuccess();
    } catch (error: any) {
      toast({
        title: "Ошибка",
        description: error.message || "Не удалось отправить отзыв",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Оставить отзыв</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Name */}
            <FormField
              control={form.control}
              name="author_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ваше имя</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Иван Иванов" maxLength={50} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Rating */}
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Оценка</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          className="p-1 transition-transform hover:scale-110"
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          onClick={() => field.onChange(star)}
                        >
                          <Star
                            className={cn(
                              "h-7 w-7 transition-colors",
                              (hoverRating || rating) >= star
                                ? "fill-accent text-accent"
                                : "text-muted-foreground/30"
                            )}
                          />
                        </button>
                      ))}
                      {rating > 0 && (
                        <span className="ml-2 text-sm text-muted-foreground">
                          {rating === 1 && "Ужасно"}
                          {rating === 2 && "Плохо"}
                          {rating === 3 && "Нормально"}
                          {rating === 4 && "Хорошо"}
                          {rating === 5 && "Отлично!"}
                        </span>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Content */}
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Отзыв</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Расскажите о вашем опыте использования товара..."
                      rows={4}
                      maxLength={1000}
                    />
                  </FormControl>
                  <div className="flex justify-between">
                    <FormMessage />
                    <span className="text-xs text-muted-foreground">
                      {field.value.length}/1000
                    </span>
                  </div>
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Send className="h-4 w-4 mr-2" />
              )}
              Отправить отзыв
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
