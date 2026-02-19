import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { getMealById } from "@/lib/meals"

type MealDetailsPageProps = {
  params: Promise<{
    id: string
  }>
}

async function MealDetailsPage({ params }: MealDetailsPageProps) {
  const { id } = await params
  const mealId = Number(id)

  if (!Number.isInteger(mealId)) {
    notFound()
  }

  const meal = getMealById(mealId)

  if (!meal) {
    notFound()
  }

  return (
    <section className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between gap-3">
        <h1 className="text-2xl font-extrabold sm:text-3xl">{meal.name}</h1>
        <Button asChild variant="outline">
          <Link href="/meals">Back to meals</Link>
        </Button>
      </div>

      <article className="overflow-hidden rounded-2xl border border-border bg-card shadow-xs">
        <div className="relative aspect-video w-full bg-muted">
          <Image src={meal.image} alt={meal.name} fill className="object-cover" />
        </div>

        <div className="space-y-4 p-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary uppercase">
              {meal.category}
            </span>
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                meal.isAvailable
                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300"
                  : "bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300"
              }`}
            >
              {meal.isAvailable ? "Available" : "Unavailable"}
            </span>
          </div>

          <p className="text-sm text-muted-foreground">{meal.description}</p>
          <p className="text-2xl font-extrabold text-foreground">${meal.price.toFixed(2)}</p>
        </div>
      </article>
    </section>
  )
}

export default MealDetailsPage
