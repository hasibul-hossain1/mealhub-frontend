"use client"

import { addReview } from "@/action/meal.action"
import { Button } from "@/components/ui/button"
import { Rating } from "@smastrom/react-rating"
import "@smastrom/react-rating/style.css"
import { type FormEvent, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

type ReviewPayload = {
  rating: number
  comment: string
}

type ReviewProps = {
  mealId: string
}

function Review({ mealId }: ReviewProps) {
  const router = useRouter()
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [ratingError, setRatingError] = useState<string | null>(null)
  const [commentError, setCommentError] = useState<string | null>(null)

  const getErrorMessage = (error: unknown) => {
    if (error instanceof Error && error.message) return error.message
    if (typeof error === "string" && error.trim()) return error
    if (error && typeof error === "object" && "message" in error && typeof error.message === "string") {
      return error.message
    }
    return "Failed to submit review."
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setFormError(null)
    setRatingError(null)
    setCommentError(null)

    const normalizedComment = comment.trim()
    const normalizedRating = Math.round(rating)

    if (normalizedRating < 1 || normalizedRating > 5) {
      const message = "Please select a rating between 1 and 5."
      setRatingError(message)
      setFormError(message)
      toast.error(message)
      return
    }

    if (!normalizedComment) {
      const message = "Please write a comment before submitting."
      setCommentError(message)
      setFormError(message)
      toast.error(message)
      return
    }

    const payload: ReviewPayload = {
      rating: normalizedRating,
      comment: normalizedComment,
    }

    const toastId = toast.loading("Submitting review...")
    setIsSubmitting(true)

    try {
      const { data, error } = await addReview({ id: mealId, payload })
      if (error) {
        throw error
      }
      if (!data) {
        throw new Error("Review was not created.")
      }
      toast.success("Review added successfully", { id: toastId })
      setRating(0)
      setComment("")
      setFormError(null)
      setRatingError(null)
      setCommentError(null)
      router.refresh()
    } catch (submitError: unknown) {
      const message = getErrorMessage(submitError)
      setFormError(message)
      toast.error(message, { id: toastId })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <article className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-foreground">Write a Review</h3>
        <p className="text-sm text-muted-foreground">Share your rating and comment for this meal. you can add one review.</p>
        <p className="text-xs text-muted-foreground">Meal ID: {mealId.slice(0, 8)}</p>
      </div>

      {formError && (
        <div className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
          {formError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground">Rating</label>
          <Rating
            value={rating}
            onChange={(value:any) => {
              setRating(value)
              if (Math.round(value) >= 1) {
                setRatingError(null)
              }
            }}
            style={{ maxWidth: 180 }}
            isRequired
            readOnly={isSubmitting}
          />
          {ratingError && <p className="text-xs text-rose-600">{ratingError}</p>}
        </div>

        <div className="space-y-2">
          <label htmlFor="review-comment" className="text-sm font-semibold text-foreground">
            Comment
          </label>
          <textarea
            id="review-comment"
            value={comment}
            onChange={(event) => {
              setComment(event.target.value)
              if (event.target.value.trim()) {
                setCommentError(null)
              }
            }}
            placeholder="Write your review here..."
            rows={4}
            className={`bg-background focus-visible:border-ring focus-visible:ring-ring/50 w-full rounded-md border px-3 py-2 text-sm outline-none focus-visible:ring-[3px] ${commentError ? "border-rose-400" : "border-input"
              }`}
            disabled={isSubmitting}
            aria-invalid={Boolean(commentError)}
          />
          {commentError && <p className="text-xs text-rose-600">{commentError}</p>}
        </div>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit Review"}
        </Button>
      </form>
    </article>
  )
}

export default Review
