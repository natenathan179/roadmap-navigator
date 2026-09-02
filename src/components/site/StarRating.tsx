import { Star } from "lucide-react";

export function StarRating({ rating, className = "" }: { rating: number; className?: string }) {
  return (
    <div className={`flex items-center gap-0.5 ${className}`} aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={i <= rating ? "h-4 w-4 fill-accent text-accent" : "h-4 w-4 text-border"}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}
