import React from "react"

const highlights = [
  {
    id: 1,
    title: "Fast Delivery",
    text: "Fresh meals delivered quickly across your area.",
  },
  {
    id: 2,
    title: "Best Value Deals",
    text: "Daily combos and offers curated for your budget.",
  },
  {
    id: 3,
    title: "Trusted Kitchens",
    text: "Verified partners and quality-focused preparation.",
  },
]

function WhyChooseUs() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-10 motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-bottom-3 motion-safe:duration-500 sm:px-6 lg:px-8">
      <div className="rounded-3xl border border-border bg-muted/30 p-6 motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-bottom-2 motion-safe:duration-500 sm:p-8">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <p className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">Why Tyme2eat</p>
            <h2 className="mt-2 text-2xl font-extrabold text-foreground sm:text-3xl">Built for Daily Cravings</h2>
            <p className="mt-3 max-w-xl text-sm text-muted-foreground">
              From lunch rush to late-night orders, we keep food discovery and delivery simple, fast, and dependable.
            </p>

            <div className="mt-6 grid grid-cols-3 gap-3">
              <div className="rounded-xl border border-border bg-background p-3 text-center transition-transform duration-300 hover:-translate-y-0.5">
                <p className="text-xl font-extrabold text-foreground sm:text-2xl">20m</p>
                <p className="mt-1 text-xs text-muted-foreground">Avg Delivery</p>
              </div>
              <div className="rounded-xl border border-border bg-background p-3 text-center transition-transform duration-300 hover:-translate-y-0.5">
                <p className="text-xl font-extrabold text-foreground sm:text-2xl">500+</p>
                <p className="mt-1 text-xs text-muted-foreground">Partner Kitchens</p>
              </div>
              <div className="rounded-xl border border-border bg-background p-3 text-center transition-transform duration-300 hover:-translate-y-0.5">
                <p className="text-xl font-extrabold text-foreground sm:text-2xl">4.8</p>
                <p className="mt-1 text-xs text-muted-foreground">User Rating</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {highlights.map((item) => (
              <article
                key={item.id}
                style={{ animationDelay: `${item.id * 90}ms` }}
                className="rounded-xl border border-border bg-card p-4 shadow-xs transition hover:-translate-y-0.5 motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-right-2 motion-safe:duration-500"
              >
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs font-bold text-primary">
                    {item.id}
                  </span>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground sm:text-base">{item.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{item.text}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default WhyChooseUs
