import Link from "next/link"
import { Button } from "@/components/ui/button"
import { restaurantsService } from "@/services/restaurants.service"

type Restaurant = {
  id: string
  restaurantName: string | null
  description: string | null
  address: string | null
  phoneNumber: string | null
  isProfileCompleted: boolean
  isApproved: boolean
  isOpen: boolean
}

type RestaurantsResponse = {
  success: boolean
  data: Restaurant[]
  message?: string
}

type RestaurantsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

function toSingleValue(value: string | string[] | undefined) {
  if (Array.isArray(value)) return value[0]
  return value
}

function getText(value: string | null | undefined, fallback: string) {
  return typeof value === "string" && value.trim().length > 0 ? value : fallback
}

async function page({ searchParams }: RestaurantsPageProps) {
  const resolvedSearchParams = await searchParams
  const visibility = toSingleValue(resolvedSearchParams.visibility) ?? "all"

  let restaurants: Restaurant[] = []
  let hasError = false

  try {
    const payload = (await restaurantsService.getAllRestaurants()) as RestaurantsResponse
    restaurants = Array.isArray(payload?.data) ? payload.data : []
  } catch {
    hasError = true
  }

  const filteredRestaurants = restaurants.filter((restaurant) => {
    if (visibility === "open") return restaurant.isOpen
    if (visibility === "closed") return !restaurant.isOpen
    return true
  })

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 rounded-2xl border border-border/70 bg-linear-to-r from-emerald-50 via-cyan-50 to-orange-50 p-6 dark:from-emerald-950/30 dark:via-cyan-950/30 dark:to-orange-950/30">
        <p className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">Partners</p>
        <h1 className="mt-2 text-2xl font-extrabold text-foreground sm:text-3xl">Browse Restaurants</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Discover partner restaurants and filter them by current visibility status.
        </p>
      </div>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card p-4">
        <div>
          <p className="text-sm font-semibold text-foreground">Visibility</p>
          <p className="text-xs text-muted-foreground">Show all, only open, or only closed restaurants.</p>
        </div>
        <form className="flex items-center gap-2">
          <select
            id="restaurant-visibility"
            name="visibility"
            defaultValue={visibility}
            className="border-input bg-background focus-visible:border-ring focus-visible:ring-ring/50 h-9 rounded-md border px-3 text-sm outline-none focus-visible:ring-[3px]"
          >
            <option value="all">All</option>
            <option value="open">Open</option>
            <option value="closed">Closed</option>
          </select>
          <Button type="submit" size="sm">
            Apply
          </Button>
          <Button asChild type="button" variant="outline" size="sm">
            <Link href="/restaurants">Reset</Link>
          </Button>
        </form>
      </div>

      {hasError ? (
        <div className="rounded-2xl border border-dashed border-border p-10 text-center text-rose-500">
          Failed to load restaurants.
        </div>
      ) : filteredRestaurants.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-10 text-center text-muted-foreground">
          No restaurants found for this visibility filter.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredRestaurants.map((restaurant) => (
            <article key={restaurant.id} className="rounded-2xl border border-border bg-card p-5 shadow-xs">
              <div className="mb-3 flex items-start justify-between gap-3">
                <h2 className="text-lg font-bold leading-tight">
                  {getText(restaurant.restaurantName, "Unnamed Restaurant")}
                </h2>
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                    restaurant.isOpen
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300"
                      : "bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300"
                  }`}
                >
                  {restaurant.isOpen ? "Open" : "Closed"}
                </span>
              </div>

              <p className="mb-4 line-clamp-3 text-sm text-muted-foreground">
                {getText(restaurant.description, "No description provided.")}
              </p>

              <div className="space-y-2 text-sm">
                <p>
                  <span className="font-semibold">Address:</span> {getText(restaurant.address, "Not provided")}
                </p>
                <p>
                  <span className="font-semibold">Phone:</span> {getText(restaurant.phoneNumber, "Not provided")}
                </p>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
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

              <div className="mt-4">
                <Button asChild size="sm">
                  <Link href={`/restaurants/${restaurant.id}`}>View details</Link>
                </Button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}

export default page
