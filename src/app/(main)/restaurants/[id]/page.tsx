import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { restaurantsService } from "@/services/restaurants.service"

type RestaurantMeal = {
  id: string
  foodName: string
  description: string | null
  price: number
  imageUrl: string
  isAvailable: boolean
}

type RestaurantDetails = {
  id: string
  restaurantName: string | null
  description: string | null
  address: string | null
  phoneNumber: string | null
  isOpen: boolean
  isApproved: boolean
  isProfileCompleted: boolean
  meals: RestaurantMeal[]
}

type RestaurantDetailsResponse = {
  success: boolean
  data?: RestaurantDetails
  message?: string
}

type RestaurantDetailsPageProps = {
  params: Promise<{ id: string }>
}

const fallbackImage = "/test/food.png"

function getText(value: string | null | undefined, fallback: string) {
  return typeof value === "string" && value.trim().length > 0 ? value : fallback
}

async function SellerDetailsWithMeal({ params }: RestaurantDetailsPageProps) {
  const { id } = await params

  let restaurant: RestaurantDetails | null = null
  let hasError = false

  try {
    const payload = (await restaurantsService.getSingleRestaurantsWithMeals(id)) as RestaurantDetailsResponse
    restaurant = payload?.data ?? null
  } catch {
    hasError = true
  }

  if (hasError) {
    return (
      <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-dashed border-border p-10 text-center text-rose-500">
          Failed to load restaurant details.
        </div>
      </section>
    )
  }

  if (!restaurant) {
    return (
      <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-dashed border-border p-10 text-center text-muted-foreground">
          Restaurant details not found.
        </div>
      </section>
    )
  }

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 rounded-2xl border border-border/70 bg-linear-to-r from-orange-50 via-amber-50 to-emerald-50 p-6 dark:from-orange-950/40 dark:via-amber-950/30 dark:to-emerald-950/30">
        <p className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">Restaurant Details</p>
        <h1 className="mt-2 text-2xl font-extrabold text-foreground sm:text-3xl">
          {getText(restaurant.restaurantName, "Unnamed Restaurant")}
        </h1>
        <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
          {getText(restaurant.description, "No description provided.")}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          <span
            className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
              restaurant.isOpen
                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300"
                : "bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300"
            }`}
          >
            {restaurant.isOpen ? "Open" : "Closed"}
          </span>
          <span
            className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
              restaurant.isApproved
                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300"
                : "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300"
            }`}
          >
            {restaurant.isApproved ? "Approved" : "Approval Pending"}
          </span>
          <span
            className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
              restaurant.isProfileCompleted
                ? "bg-sky-100 text-sky-700 dark:bg-sky-500/20 dark:text-sky-300"
                : "bg-zinc-200 text-zinc-700 dark:bg-zinc-600/30 dark:text-zinc-200"
            }`}
          >
            {restaurant.isProfileCompleted ? "Profile Complete" : "Profile Incomplete"}
          </span>
        </div>
      </div>

      <div className="mb-6 grid gap-4 rounded-2xl border border-border/70 bg-card p-5 text-sm sm:grid-cols-2">
        <p>
          <span className="font-semibold">Address:</span> {getText(restaurant.address, "Not provided")}
        </p>
        <p>
          <span className="font-semibold">Phone:</span> {getText(restaurant.phoneNumber, "Not provided")}
        </p>
      </div>

      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-foreground">Meals ({restaurant.meals?.length ?? 0})</h2>
        <Button asChild variant="outline" size="sm">
          <Link href="/restaurants">Back to restaurants</Link>
        </Button>
      </div>

      {!restaurant.meals?.length ? (
        <div className="rounded-2xl border border-dashed border-border p-10 text-center text-muted-foreground">
          This restaurant has no meals yet.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {restaurant.meals.map((meal) => (
            <article
              key={meal.id}
              className="group rounded-2xl border border-border bg-card p-5 shadow-xs transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="relative mb-4 aspect-16/10 overflow-hidden rounded-xl border border-border/60 bg-muted">
                <Image
                  src={meal.imageUrl || fallbackImage}
                  alt={meal.foodName}
                  fill
                  className="object-cover transition duration-300 group-hover:scale-105"
                />
              </div>

              <div className="mb-3 flex items-start justify-between gap-3">
                <h3 className="text-lg font-bold leading-tight">{meal.foodName}</h3>
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                    meal.isAvailable
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300"
                      : "bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300"
                  }`}
                >
                  {meal.isAvailable ? "Available" : "Unavailable"}
                </span>
              </div>

              <p className="mb-5 line-clamp-2 text-sm text-muted-foreground">
                {getText(meal.description, "No description available.")}
              </p>

              <div className="flex items-center justify-between">
                <p className="text-lg font-extrabold text-foreground">${meal.price.toFixed(2)}</p>
                <Button asChild size="sm">
                  <Link href={`/meals/${meal.id}`}>View Details</Link>
                </Button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}

export default SellerDetailsWithMeal
