import { Star, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

interface Review {
  id: string;
  author_name: string;
  rating: number;
  content: string | null;
  created_at: string;
}

interface ReviewListProps {
  reviews: Review[];
  isLoading?: boolean;
}

function ReviewCard({ review }: { review: Review }) {
  const initials = review.author_name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-primary/10 text-primary text-sm">
              {initials}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="font-medium truncate">{review.author_name}</span>
              <span className="text-xs text-muted-foreground shrink-0">
                {format(new Date(review.created_at), "d MMM yyyy", { locale: ru })}
              </span>
            </div>

            {/* Stars */}
            <div className="flex items-center gap-0.5 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={cn(
                    "h-4 w-4",
                    star <= review.rating
                      ? "fill-accent text-accent"
                      : "text-muted-foreground/30"
                  )}
                />
              ))}
            </div>

            {/* Content */}
            {review.content && (
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {review.content}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ReviewSkeleton() {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-16 w-full" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function ReviewList({ reviews, isLoading }: ReviewListProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <ReviewSkeleton />
        <ReviewSkeleton />
        <ReviewSkeleton />
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <User className="h-12 w-12 mx-auto mb-4 opacity-30" />
        <p>Пока нет отзывов</p>
        <p className="text-sm">Будьте первым, кто оставит отзыв!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <ReviewCard key={review.id} review={review} />
      ))}
    </div>
  );
}
