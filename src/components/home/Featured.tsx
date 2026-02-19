import React from "react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

function Featured() {
  const featuredFoods = [
    { id: 1, name: "Smoky Grill Burger", subtitle: "Beef patty, cheddar, house sauce", price: "$9.90", rating: "4.8" },
    { id: 2, name: "Loaded Chicken Bowl", subtitle: "Rice, grilled chicken, fresh salsa", price: "$8.50", rating: "4.7" },
    { id: 3, name: "Creamy Alfredo Pasta", subtitle: "Parmesan cream, herbs, garlic", price: "$10.25", rating: "4.6" },
    { id: 4, name: "Chocolate Lava Slice", subtitle: "Warm center, cocoa dust, cream", price: "$6.30", rating: "4.9" },
  ]

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-10 motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-bottom-3 motion-safe:duration-500 sm:px-6 lg:px-8">
      <div className="mb-6 motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-bottom-2 motion-safe:duration-500">
        <p className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">Today&apos;s Picks</p>
        <h2 className="mt-1 text-2xl font-extrabold text-foreground sm:text-3xl">Featured Food</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {featuredFoods.map((food) => (
          <article
            key={food.id}
            style={{ animationDelay: `${food.id * 80}ms` }}
            className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition hover:border-primary/40 hover:shadow-md motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-bottom-2 motion-safe:duration-500"
          >
            <div className="grid grid-cols-1 sm:grid-cols-[160px_1fr]">
              <div className="h-36 w-full overflow-hidden border-b border-border bg-muted/40 sm:h-full sm:border-r sm:border-b-0">
                <Image
                  src="/test/food.png"
                  width={320}
                  height={320}
                  alt="Food image"
                  className="h-full w-full object-cover object-center transition-transform duration-500 hover:scale-105"
                />
              </div>
              <div className="p-4">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <h3 className="text-base font-semibold text-foreground">{food.name}</h3>
                  <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                    {food.rating} ★
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{food.subtitle}</p>

                <div className="mt-4 flex items-center justify-between">
                  <p className="text-base font-bold text-foreground">{food.price}</p>
                  <Button size="sm" className="cursor-pointer">Order now</Button>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default Featured
