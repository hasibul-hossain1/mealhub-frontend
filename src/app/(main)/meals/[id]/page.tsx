import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { mealService } from "@/services/meal.service"
import type { Meal } from "@/types/meal.type"
import AddToCartButton from "./components/AddToCartButton"

type MealDetailsPageProps = {
  params: Promise<{
    id: string
  }>
}

type ReviewItem = NonNullable<Meal["reviews"]>[number]

async function MealDetailsPage({ params }: MealDetailsPageProps) {
  const { id } = await params
  if (!id) {
    notFound()
  }

  const { data, error } = await mealService.getMealById(id)
  const meal = data?.data as Partial<Meal> | undefined

  if (error || !meal) {
    notFound()
  }

  const getText = (value: unknown, fallback = "Not Found") =>
    typeof value === "string" && value.trim().length > 0 ? value : fallback

  const getDate = (value: unknown) => {
    if (typeof value !== "string" || !value.trim()) return "Coming soon"
    const parsed = new Date(value)
    return Number.isNaN(parsed.getTime()) ? "Coming soon" : parsed.toLocaleDateString()
  }

  const getReviewerName = (review: ReviewItem) =>
    getText(review.user?.name ?? review.userName ?? review.name, "Anonymous user")

  const getReviewerImage = (review: ReviewItem) => {
    const image = review.user?.image ?? review.userImage ?? review.image
    return typeof image === "string" && image.trim().length > 0 ? image : ""
  }

  const getInitials = (value: string) =>
    value
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "U"

  const formatRating = (value: unknown) =>
    typeof value === "number" && Number.isFinite(value) ? value.toFixed(1) : "N/A"

  const foodName = getText(meal.foodName, "Untitled meal")
  const categoryLabel = getText(meal.category?.name, getText(meal.categoryId))
  const description = getText(meal.description)
  const imageUrl = getText(meal.imageUrl, "/test/food.png")
  const seller = meal.seller ?? null
  const reviewsList = Array.isArray(meal.reviews) ? meal.reviews : []
  const reviewsCount = reviewsList.length || meal._count?.reviews || 0
  const averageRating =
    reviewsList.length > 0
      ? reviewsList.reduce((sum, review) => sum + (Number.isFinite(review.rating) ? review.rating : 0), 0) /
      reviewsList.length
      : null
  const hasValidPrice = typeof meal.price === "number" && Number.isFinite(meal.price)
  const priceLabel = hasValidPrice ? `$${meal.price!.toFixed(2)}` : "Price pending"
  const availabilityState =
    typeof meal.isAvailable === "boolean"
      ? meal.isAvailable
        ? "Available"
        : "Unavailable"
      : "Availability pending"
  const availabilityClass =
    availabilityState === "Available"
      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300"
      : availabilityState === "Unavailable"
        ? "bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300"
        : "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300"

  return (
    <section className="mx-auto w-full max-w-6xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center gap-3">
        <Button asChild variant="outline" className="shrink-0">
          <Link href="/meals">Back to meals</Link>
        </Button>
        <h1 className="text-2xl font-extrabold sm:text-3xl">{foodName}</h1>
      </div>

      <article className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
        <div className="grid gap-0 lg:grid-cols-[1.35fr_1fr]">
          <div className="relative min-h-70 bg-muted sm:min-h-90 lg:min-h-130">
            <Image src={imageUrl} alt={foodName} fill className="object-cover" />
            <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/10 to-transparent lg:bg-linear-to-r lg:from-black/10 lg:to-transparent" />
            <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
              <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-zinc-900 uppercase">
                {categoryLabel}
              </span>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${availabilityClass}`}>
                {availabilityState}
              </span>
            </div>
          </div>

          <div className="space-y-6 p-6 sm:p-8">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Price</p>
              <p className="text-3xl font-extrabold tracking-tight">{priceLabel}</p>
            </div>

            <h3 className="text-lg font-medium">Description</h3>
            <p className="text-sm leading-6 text-muted-foreground">{description}</p>


            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-border/80 bg-muted/30 p-3">
                <p className="text-xs font-semibold text-muted-foreground">Reviews</p>
                <p className="text-sm font-medium">{reviewsCount}</p>
              </div>
              <div className="rounded-xl border border-border/80 bg-muted/30 p-3">
                <p className="text-xs font-semibold text-muted-foreground">Avg Rating</p>
                <p className="text-sm font-medium">{averageRating !== null ? formatRating(averageRating) : "N/A"}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
              <p className="text-sm text-muted-foreground">Meal details update automatically when API data changes.</p>
              <div className="flex items-center gap-2">
                <AddToCartButton availabilityState={availabilityState} hasValidPrice={hasValidPrice} id={id} />
              </div>
            </div>
          </div>
        </div>
      </article>

      <div className="grid gap-6 lg:grid-cols-2">
        <article className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-bold">Seller Information</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-border/80 bg-muted/30 p-3">
              <p className="text-xs font-semibold text-muted-foreground">Restaurant</p>
              <p className="text-sm font-medium">{getText(seller?.restaurantName, "Not set yet")}</p>
            </div>
            <div className="rounded-xl border border-border/80 bg-muted/30 p-3">
              <p className="text-xs font-semibold text-muted-foreground">Phone</p>
              <p className="text-sm font-medium">{getText(seller?.phoneNumber, "Not set yet")}</p>
            </div>
            <div className="rounded-xl border border-border/80 bg-muted/30 p-3 sm:col-span-2">
              <p className="text-xs font-semibold text-muted-foreground">Address</p>
              <p className="text-sm font-medium">{getText(seller?.address, "Not set yet")}</p>
            </div>
            <div className="rounded-xl border border-border/80 bg-muted/30 p-3 sm:col-span-2">
              <p className="text-xs font-semibold text-muted-foreground">Description</p>
              <p className="text-sm font-medium">{getText(seller?.description, "Not set yet")}</p>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${seller?.isApproved
                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300"
                  : "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300"
                }`}
            >
              {seller?.isApproved ? "Approved Seller" : "Approval Pending"}
            </span>
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${seller?.isOpen
                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300"
                  : "bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300"
                }`}
            >
              {seller?.isOpen ? "Open Now" : "Closed"}
            </span>
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${seller?.isProfileCompleted
                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300"
                  : "bg-zinc-200 text-zinc-700 dark:bg-zinc-600/30 dark:text-zinc-200"
                }`}
            >
              {seller?.isProfileCompleted ? "Profile Complete" : "Profile Incomplete"}
            </span>
          </div>
        </article>

        <article className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-lg font-bold">Customer Reviews</h2>
            <span className="text-sm text-muted-foreground">{reviewsCount} total</span>
          </div>

          {reviewsList.length > 0 ? (
            <div className="space-y-3">
              {reviewsList.slice(0, 4).map((review) => (
                <div key={review.id} className="rounded-xl border border-border/80 bg-muted/30 p-3">
                  <div className="mb-2 flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <Avatar size="sm">
                        <AvatarImage src={getReviewerImage(review)} alt={getReviewerName(review)} />
                        <AvatarFallback>{getInitials(getReviewerName(review))}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-semibold">{getReviewerName(review)}</p>
                        <p className="text-xs text-muted-foreground">Rating: {formatRating(review.rating)}</p>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">{getDate(review.createdAt)}</p>
                  </div>
                  <p className="text-sm text-muted-foreground">{getText(review.comment, "No comment provided.")}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-border p-4 text-sm text-muted-foreground">
              No reviews yet. Reviews will appear here when users submit them.
            </div>
          )}
        </article>
      </div>
    </section>
  )
}

export default MealDetailsPage
