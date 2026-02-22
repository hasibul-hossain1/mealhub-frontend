import Image from "next/image"
import Link from "next/link"
import { Fragment } from "react"
import { Button } from "@/components/ui/button"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { env } from "@/env"
import { mealService } from "@/services/meal.service"
import type { Meal, MealCategory, MealsResponse } from "@/types/meal.type"
import AutoQueryNumberInput from "./components/AutoQueryNumberInput"
import AutoQuerySelect from "./components/AutoQuerySelect"
import SearchMeal from "./components/SearchMeal"

const availabilityOptions = ["all", "available", "unavailable"] as const
const fallbackImage = "/test/food.png"
type SortBy = "createdAt" | "price" | "foodName"
type SortOrder = "asc" | "desc"

type BrowseMeal = {
  id: string
  foodName: string
  description: string
  price: number
  image: string
  isAvailable: boolean
  categoryId: string
  categoryName: string
}

type MealsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

function toSingleValue(value: string | string[] | undefined) {
  if (Array.isArray(value)) {
    return value[0]
  }

  return value
}

function toNumber(value: string | undefined, fallback: number) {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

function toPositiveInt(value: string | undefined, fallback: number) {
  const parsed = Number(value)
  if (!Number.isInteger(parsed) || parsed < 1) {
    return fallback
  }
  return parsed
}

function extractMealList(payload: MealsResponse | null): Meal[] {
  return payload?.data?.data ?? []
}

function extractCategoryList(payload: unknown): MealCategory[] {
  if (Array.isArray(payload)) {
    return payload as MealCategory[]
  }

  if (payload && typeof payload === "object" && "data" in payload) {
    return extractCategoryList((payload as { data?: unknown }).data)
  }

  return []
}

function mapToBrowseMeal(meal: Meal): BrowseMeal | null {
  if (!meal.id || !meal.foodName || typeof meal.price !== "number") {
    return null
  }

  return {
    id: meal.id,
    foodName: meal.foodName,
    description: meal.description ?? "No description available.",
    price: Number.isFinite(meal.price) ? meal.price : 0,
    image: meal.imageUrl || fallbackImage,
    isAvailable: Boolean(meal.isAvailable),
    categoryId: meal.categoryId ?? "Uncategorized",
    categoryName: meal.category?.name ?? "Uncategorized",
  }
}

async function MealsPage({ searchParams }: MealsPageProps) {
  const resolvedSearchParams = await searchParams
  const search = toSingleValue(resolvedSearchParams.search) ?? ""
  const selectedCategory = toSingleValue(resolvedSearchParams.category) ?? "All"
  const availability =
    (toSingleValue(resolvedSearchParams.availability) as (typeof availabilityOptions)[number] | undefined) ?? "all"
  const sortBy = (toSingleValue(resolvedSearchParams.sortBy) as SortBy | undefined) ?? "createdAt"
  const sortOrder = (toSingleValue(resolvedSearchParams.sortOrder) as SortOrder | undefined) ?? "desc"
  const available =
    availability === "available"
      ? "true"
      : availability === "unavailable"
        ? "false"
        : undefined

  const selectedMinPrice = toSingleValue(resolvedSearchParams.minPrice)
  const selectedMaxPrice = toSingleValue(resolvedSearchParams.maxPrice)
  const selectedPage = toPositiveInt(toSingleValue(resolvedSearchParams.page), 1)

  const [{ data, error }, categoryResponse] = await Promise.all([
    mealService.getMeals({
      page: String(selectedPage),
      search: search || undefined,
      category: selectedCategory === "All" ? undefined : selectedCategory,
      minPrice: selectedMinPrice || undefined,
      maxPrice: selectedMaxPrice || undefined,
      available,
      sortBy,
      sortOrder,
    }),
    fetch(`${env.BACKEND_URL}/meals/categories`, { cache: "no-store" })
      .then((res) => res.json())
      .catch(() => null),
  ])

  if (error) {
    return (
      <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-dashed border-border p-10 text-center text-rose-500">
          Failed to load meals.
        </div>
      </section>
    )
  }

  const allMeals = extractMealList(data)
    .map(mapToBrowseMeal)
    .filter((meal): meal is BrowseMeal => Boolean(meal))

  const apiCategories = extractCategoryList(categoryResponse)
  const categoriesFromApi = apiCategories
    .filter((category): category is MealCategory => Boolean(category?.name && category.name.trim().length > 0))
    .map((category) => {
      const name = category.name.trim()
      return { label: name, value: name }
    })

  const categoryOptions = [...categoriesFromApi]
  if (selectedCategory !== "All" && !categoryOptions.some((item) => item.value === selectedCategory)) {
    categoryOptions.push({ label: selectedCategory, value: selectedCategory })
  }

  const categories = [
    { label: "All", value: "All" },
    ...Array.from(new Map(categoryOptions.map((item) => [item.value, item])).values()),
  ]
  const priceFloor = allMeals.length ? Math.floor(Math.min(...allMeals.map((meal) => meal.price))) : 0
  const priceCeil = allMeals.length ? Math.ceil(Math.max(...allMeals.map((meal) => meal.price))) : 0

  const minPrice = toNumber(selectedMinPrice, priceFloor)
  const maxPrice = toNumber(selectedMaxPrice, priceCeil)
  const pagination = data?.data?.pagination
  const currentPage = toPositiveInt(String(pagination?.page ?? selectedPage), 1)
  const totalPages = Math.max(1, toPositiveInt(String(pagination?.totalPage ?? 1), 1))
  const totalMeals = pagination?.total ?? allMeals.length

  const buildPageHref = (page: number) => {
    const params = new URLSearchParams()
    Object.entries(resolvedSearchParams).forEach(([key, value]) => {
      if (key === "page") {
        return
      }
      const singleValue = toSingleValue(value)
      if (singleValue) {
        params.set(key, singleValue)
      }
    })

    if (page > 1) {
      params.set("page", String(page))
    }

    const query = params.toString()
    return query ? `/meals?${query}` : "/meals"
  }

  const pageNumbers = Array.from(
    new Set(
      [1, currentPage - 1, currentPage, currentPage + 1, totalPages].filter(
        (page): page is number => page >= 1 && page <= totalPages,
      ),
    ),
  ).sort((a, b) => a - b)

  const filteredMeals = allMeals.filter((meal) => {
    const matchesCategory = selectedCategory === "All" || meal.categoryName === selectedCategory
    const matchesMinPrice = meal.price >= minPrice
    const matchesMaxPrice = meal.price <= maxPrice
    const matchesAvailability =
      availability === "all" ||
      (availability === "available" && meal.isAvailable) ||
      (availability === "unavailable" && !meal.isAvailable)

    return matchesCategory && matchesMinPrice && matchesMaxPrice && matchesAvailability
  })

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 rounded-2xl border border-border/70 bg-linear-to-r from-orange-50 via-amber-50 to-emerald-50 p-6 dark:from-orange-950/40 dark:via-amber-950/30 dark:to-emerald-950/30">
        <p className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">MealHub Menu</p>
        <h1 className="mt-2 text-2xl font-extrabold text-foreground sm:text-3xl">Explore All Meals</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Browse meals, then narrow your list by category, price range and availability.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <aside className="h-fit rounded-2xl border border-border/70 bg-card p-4 shadow-xs lg:sticky lg:top-20">
          <div className="mb-5">
            <h2 className="text-base font-bold text-foreground">Filters</h2>
            <p className="text-sm text-muted-foreground">Narrow down meals quickly.</p>
          </div>

          <div className="space-y-5">
            <div>
              <label htmlFor="meal-search" className="mb-2 block text-sm font-medium">
                Search Meal
              </label>
              <SearchMeal key={`search-${search}`} />
            </div>

            <div>
              <label htmlFor="meal-category" className="mb-2 block text-sm font-medium">
                Category
              </label>
              <AutoQuerySelect
                key={`category-${selectedCategory}`}
                id="meal-category"
                name="category"
                options={categories}
                defaultValue={selectedCategory}
                deleteValue="All"
                className="border-input bg-background focus-visible:border-ring focus-visible:ring-ring/50 h-9 w-full rounded-md border px-3 text-sm outline-none focus-visible:ring-[3px]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="meal-sort-by" className="mb-2 block text-sm font-medium">
                  Sort By
                </label>
                <AutoQuerySelect
                  key={`sort-by-${sortBy}`}
                  id="meal-sort-by"
                  name="sortBy"
                  options={[
                    { label: "Newest", value: "createdAt" },
                    { label: "Price", value: "price" },
                    { label: "Name", value: "foodName" },
                  ]}
                  defaultValue={sortBy}
                  deleteValue="createdAt"
                  className="border-input bg-background focus-visible:border-ring focus-visible:ring-ring/50 h-9 w-full rounded-md border px-3 text-sm outline-none focus-visible:ring-[3px]"
                />
              </div>
              <div>
                <label htmlFor="meal-sort-order" className="mb-2 block text-sm font-medium">
                  Order
                </label>
                <AutoQuerySelect
                  key={`sort-order-${sortOrder}`}
                  id="meal-sort-order"
                  name="sortOrder"
                  options={[
                    { label: "Descending", value: "desc" },
                    { label: "Ascending", value: "asc" },
                  ]}
                  defaultValue={sortOrder}
                  deleteValue="desc"
                  className="border-input bg-background focus-visible:border-ring focus-visible:ring-ring/50 h-9 w-full rounded-md border px-3 text-sm outline-none focus-visible:ring-[3px]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="meal-min-price" className="mb-2 block text-sm font-medium">
                  Min Price
                </label>
                <AutoQueryNumberInput
                  key={`min-price-${minPrice}-${priceFloor}-${priceCeil}`}
                  id="meal-min-price"
                  name="minPrice"
                  defaultValue={priceFloor}
                  min={priceFloor}
                  max={priceCeil}
                  step={1}
                />
              </div>
              <div>
                <label htmlFor="meal-max-price" className="mb-2 block text-sm font-medium">
                  Max Price
                </label>
                <AutoQueryNumberInput
                  key={`max-price-${maxPrice}-${priceFloor}-${priceCeil}`}
                  id="meal-max-price"
                  name="maxPrice"
                  defaultValue={priceCeil}
                  min={priceFloor}
                  max={priceCeil}
                  step={1}
                />
              </div>
            </div>

            <div>
              <label htmlFor="meal-availability" className="mb-2 block text-sm font-medium">
                Availability
              </label>
              <AutoQuerySelect
                key={`availability-${availability}`}
                id="meal-availability"
                name="availability"
                options={availabilityOptions.map((option) => ({
                  value: option,
                  label: option.charAt(0).toUpperCase() + option.slice(1),
                }))}
                defaultValue={availability}
                deleteValue="all"
                className="border-input bg-background focus-visible:border-ring focus-visible:ring-ring/50 h-9 w-full rounded-md border px-3 text-sm capitalize outline-none focus-visible:ring-[3px]"
              />
            </div>
            <Button asChild variant="outline" className="w-full">
              <Link href="/meals">Reset Filters</Link>
            </Button>
          </div>
        </aside>

        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-foreground">Meals ({totalMeals})</h2>
            <p className="text-sm text-muted-foreground">
              ${minPrice} - ${maxPrice}
            </p>
          </div>

          {filteredMeals.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border p-10 text-center text-muted-foreground">
              No meals match your filters. Try adjusting search or price range.
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {filteredMeals.map((meal) => (
                <article
                  key={meal.id}
                  className="group rounded-2xl border border-border bg-card p-5 shadow-xs transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="relative mb-4 aspect-16/10 overflow-hidden rounded-xl border border-border/60 bg-muted">
                    <Image
                      src={meal.image}
                      alt={meal.foodName}
                      fill
                      className="object-cover transition duration-300 group-hover:scale-105"
                    />
                  </div>

                  <div className="mb-3 flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold tracking-wide text-primary uppercase">{meal.categoryName}</p>
                      <h3 className="mt-1 text-lg font-bold leading-tight">{meal.foodName}</h3>
                    </div>
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

                  <p className="mb-5 line-clamp-2 text-sm text-muted-foreground">{meal.description}</p>

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

          {totalPages > 1 ? (
            <Pagination className="mt-8">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href={buildPageHref(Math.max(1, currentPage - 1))}
                    aria-disabled={currentPage === 1}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : undefined}
                  />
                </PaginationItem>

                {pageNumbers.map((page, index) => (
                  <Fragment key={page}>
                    {index > 0 && pageNumbers[index - 1] !== page - 1 ? (
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                    ) : null}
                    <PaginationItem>
                      <PaginationLink href={buildPageHref(page)} isActive={currentPage === page}>
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  </Fragment>
                ))}

                <PaginationItem>
                  <PaginationNext
                    href={buildPageHref(Math.min(totalPages, currentPage + 1))}
                    aria-disabled={currentPage === totalPages}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : undefined}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          ) : null}
        </div>
      </div>
    </section>
  )
}

export default MealsPage
