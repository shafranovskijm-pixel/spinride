import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { 
  Check, 
  X, 
  Star, 
  RefreshCw, 
  AlertCircle,
  MessageSquare
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface Review {
  id: string;
  author_name: string;
  rating: number;
  content: string | null;
  is_approved: boolean;
  created_at: string;
  product_id: string;
  products?: {
    name: string;
    slug: string;
  } | null;
}

export default function AdminReviews() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("pending");

  const { data: reviews = [], isLoading, error, refetch } = useQuery({
    queryKey: ["admin-reviews"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reviews")
        .select(`
          id,
          author_name,
          rating,
          content,
          is_approved,
          created_at,
          product_id,
          products:product_id (
            name,
            slug
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return (data || []) as Review[];
    },
  });

  const pendingReviews = reviews.filter((r) => !r.is_approved);
  const approvedReviews = reviews.filter((r) => r.is_approved);

  const handleApprove = async (reviewId: string) => {
    try {
      const { error } = await supabase
        .from("reviews")
        .update({ is_approved: true })
        .eq("id", reviewId);

      if (error) throw error;

      toast({
        title: "Отзыв одобрен",
        description: "Отзыв теперь виден на сайте",
      });

      queryClient.invalidateQueries({ queryKey: ["admin-reviews"] });
    } catch (error: any) {
      toast({
        title: "Ошибка",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleReject = async (reviewId: string) => {
    try {
      const { error } = await supabase
        .from("reviews")
        .delete()
        .eq("id", reviewId);

      if (error) throw error;

      toast({
        title: "Отзыв удалён",
        description: "Отзыв был удалён",
      });

      queryClient.invalidateQueries({ queryKey: ["admin-reviews"] });
    } catch (error: any) {
      toast({
        title: "Ошибка",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const ReviewCard = ({ review }: { review: Review }) => (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-medium">{review.author_name}</span>
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={cn(
                      "h-3 w-3",
                      star <= review.rating
                        ? "fill-accent text-accent"
                        : "text-muted-foreground/30"
                    )}
                  />
                ))}
              </div>
              <Badge variant={review.is_approved ? "default" : "secondary"}>
                {review.is_approved ? "Опубликован" : "На модерации"}
              </Badge>
            </div>

            {review.products && (
              <p className="text-sm text-muted-foreground mb-2">
                Товар:{" "}
                <a
                  href={`/product/${review.products.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  {review.products.name}
                </a>
              </p>
            )}

            {review.content && (
              <p className="text-sm whitespace-pre-wrap mb-2">{review.content}</p>
            )}

            <p className="text-xs text-muted-foreground">
              {format(new Date(review.created_at), "d MMMM yyyy, HH:mm", { locale: ru })}
            </p>
          </div>

          <div className="flex gap-2 shrink-0">
            {!review.is_approved && (
              <Button
                size="sm"
                variant="outline"
                className="text-primary border-primary hover:bg-primary hover:text-primary-foreground"
                onClick={() => handleApprove(review.id)}
              >
                <Check className="h-4 w-4" />
              </Button>
            )}
            <Button
              size="sm"
              variant="outline"
              className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
              onClick={() => handleReject(review.id)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <AdminLayout
      title="Отзывы"
      subtitle={`${pendingReviews.length} на модерации, ${approvedReviews.length} опубликовано`}
      actions={
        <Button variant="outline" size="icon" onClick={() => refetch()}>
          <RefreshCw className="h-4 w-4" />
        </Button>
      }
    >
      {isLoading && (
        <div className="text-center py-12">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">Загрузка отзывов...</p>
        </div>
      )}

      {error && (
        <div className="text-center py-12">
          <AlertCircle className="h-8 w-8 mx-auto mb-4 text-destructive" />
          <p className="text-destructive">Ошибка загрузки отзывов</p>
          <Button variant="outline" className="mt-4" onClick={() => refetch()}>
            Попробовать снова
          </Button>
        </div>
      )}

      {!isLoading && !error && (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="pending" className="gap-2">
              На модерации
              {pendingReviews.length > 0 && (
                <Badge variant="destructive" className="ml-1">
                  {pendingReviews.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="approved">
              Опубликованные ({approvedReviews.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="mt-6">
            {pendingReviews.length === 0 ? (
              <div className="text-center py-12">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground/30" />
                <p className="text-muted-foreground">Нет отзывов на модерации</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingReviews.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="approved" className="mt-6">
            {approvedReviews.length === 0 ? (
              <div className="text-center py-12">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground/30" />
                <p className="text-muted-foreground">Нет опубликованных отзывов</p>
              </div>
            ) : (
              <div className="space-y-4">
                {approvedReviews.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}
    </AdminLayout>
  );
}
