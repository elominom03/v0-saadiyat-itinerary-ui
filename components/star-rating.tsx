"use client"

import { Star } from "lucide-react"

interface StarRatingProps {
  rating: number
  reviews?: number
  size?: "sm" | "md" | "lg"
  showCount?: boolean
}

export function StarRating({ 
  rating, 
  reviews, 
  size = "md", 
  showCount = true 
}: StarRatingProps) {
  const sizeClasses = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5"
  }

  const textSizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base"
  }

  const formatReviews = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`
    }
    return count.toString()
  }

  return (
    <div className="flex items-center gap-1.5">
      <Star className={`fill-yellow-400 text-yellow-400 ${sizeClasses[size]}`} />
      <span className={`font-semibold ${textSizeClasses[size]}`}>{rating.toFixed(1)}</span>
      {showCount && reviews && (
        <span className={`text-muted-foreground ${textSizeClasses[size]}`}>
          ({formatReviews(reviews)})
        </span>
      )}
    </div>
  )
}
