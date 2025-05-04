"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/context/auth-context"
import { Star, ThumbsUp, User } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { format } from "date-fns"

interface ReviewsSectionProps {
  menuItemId: number
  reviews: any[]
  setReviews: (reviews: any[]) => void
}

export default function ReviewsSection({ menuItemId, reviews, setReviews }: ReviewsSectionProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [rating, setRating] = useState(5)
  const [reviewText, setReviewText] = useState("")
  const [hoveredStar, setHoveredStar] = useState(0)

  const handleSubmitReview = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please login to submit a review",
        variant: "destructive",
      })
      router.push(`/login?redirect=/menu/${menuItemId}`)
      return
    }

    if (rating === 0) {
      toast({
        title: "Rating required",
        description: "Please select a rating before submitting",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSubmitting(true)

      // Call the add_review function
      const { data, error } = await supabase.rpc("add_review", {
        p_menu_item_id: menuItemId,
        p_rating: rating,
        p_review_text: reviewText,
      })

      if (error) throw error

      // Fetch the newly created review with user details
      const { data: newReview, error: fetchError } = await supabase
        .from("review_details")
        .select("*")
        .eq("id", data)
        .single()

      if (fetchError) throw fetchError

      // Add the new review to the list
      setReviews([newReview, ...reviews])

      // Reset form
      setRating(5)
      setReviewText("")

      toast({
        title: "Review submitted",
        description: "Thank you for your feedback!",
      })
    } catch (error: any) {
      console.error("Error submitting review:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to submit review. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleVoteHelpful = async (reviewId: number) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please login to vote on reviews",
        variant: "destructive",
      })
      router.push(`/login?redirect=/menu/${menuItemId}`)
      return
    }

    try {
      // Call the vote_review_helpful function
      const { error } = await supabase.rpc("vote_review_helpful", {
        p_review_id: reviewId,
      })

      if (error) throw error

      // Update the review in the list
      setReviews(
        reviews.map((review) =>
          review.id === reviewId ? { ...review, helpful_votes: (review.helpful_votes || 0) + 1 } : review,
        ),
      )

      toast({
        title: "Vote recorded",
        description: "Thank you for your feedback!",
      })
    } catch (error: any) {
      console.error("Error voting on review:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to record vote. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-8">
      {/* Review Form */}
      <Card className="border-2 border-primary/20">
        <CardContent className="pt-6">
          <h3 className="mb-4 text-xl font-semibold">Write a Review</h3>

          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-medium">Your Rating:</span>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredStar(star)}
                    onMouseLeave={() => setHoveredStar(0)}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`h-6 w-6 transition-all ${
                        star <= (hoveredStar || rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <Textarea
              placeholder="Share your experience with this dish..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              className="min-h-[100px] border-primary/20"
            />

            <div className="mt-4 flex justify-end">
              <Button
                onClick={handleSubmitReview}
                disabled={isSubmitting}
                className="bg-primary hover:bg-primary/90 transition-transform hover:scale-105"
              >
                {isSubmitting ? "Submitting..." : "Submit Review"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reviews List */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold">Customer Reviews ({reviews.length})</h3>

        {reviews.length === 0 ? (
          <div className="rounded-lg border border-dashed p-8 text-center">
            <p className="text-muted-foreground">No reviews yet. Be the first to review this item!</p>
          </div>
        ) : (
          <AnimatePresence>
            {reviews.map((review, index) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="rounded-lg border bg-card p-4 shadow-sm"
              >
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={review.avatar_url || "/placeholder.svg"} />
                      <AvatarFallback>
                        <User className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{review.reviewer_name}</div>
                      <div className="text-xs text-muted-foreground">
                        {format(new Date(review.created_at), "MMM d, yyyy")}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${
                          star <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <p className="mb-3 text-sm">{review.review_text}</p>

                {review.is_verified && (
                  <div className="mb-3">
                    <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-400">
                      Verified Purchase
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleVoteHelpful(review.id)}
                    className="text-xs hover:bg-muted transition-all"
                  >
                    <ThumbsUp className="mr-1 h-3 w-3" />
                    Helpful ({review.helpful_votes || 0})
                  </Button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  )
}
