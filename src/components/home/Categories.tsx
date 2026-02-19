import React from "react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

const foodCategories = [
  {
    id: 1,
    name: "Street Bites",
    description: "Fast and crispy favorites",
  },
  {
    id: 2,
    name: "Spice Route",
    description: "Bold flavors and curries",
  },
  {
    id: 3,
    name: "Healthy Bowl",
    description: "Fresh greens and grain bowls",
  },
  {
    id: 4,
    name: "Sweet Fix",
    description: "Desserts and bakery picks",
  },
]

function Categories() {
  return (
    <section className="mx-auto mt-40 w-full max-w-7xl px-4 py-10 motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-bottom-3 motion-safe:duration-500 sm:mt-40 sm:px-6 lg:mt-40 lg:px-8">
      <div className="mb-6 flex items-end justify-between motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-bottom-2 motion-safe:duration-500">
        <div>
          <h2 className="mt-1 text-2xl font-extrabold text-foreground sm:text-3xl lg:text-5xl">Browse Food Categories</h2>
          <p className="mt-1 text-sm text-muted-foreground">Choose a category to discover dishes faster.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-4">
        {foodCategories.map((category) => (
          <article
            key={category.id}
            style={{ animationDelay: `${category.id * 70}ms` }}
            className="rounded-xl border border-border bg-card p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-bottom-2 motion-safe:duration-500"
          >
            <div className="mb-3 h-24 w-full overflow-hidden rounded-lg border border-border bg-muted/40">
              <Image
                src="/test/biriani.jpg"
                className="h-full w-full object-cover object-center transition-transform duration-500 hover:scale-105"
                alt="Categories image"
                width={300}
                height={200}
              />
            </div>
            <h3 className="text-sm font-semibold text-foreground sm:text-base">{category.name}</h3>
            <p className="mt-1 text-xs text-muted-foreground sm:text-sm">{category.description}</p>
            <Button className="mt-3 h-8 w-full text-xs sm:text-sm cursor-pointer">Explore</Button>
          </article>
        ))}
      </div>
    </section>
  )
}

export default Categories
