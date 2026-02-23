import Link from "next/link"
import { Button } from "@/components/ui/button"

function page() {
  const values = [
    {
      title: "Quality First",
      text: "Every listed partner is reviewed for food quality, hygiene, and service reliability.",
    },
    {
      title: "Fast Delivery",
      text: "We focus on reducing wait times through smart order routing and active partner support.",
    },
    {
      title: "Customer Trust",
      text: "Transparent ratings and real feedback help customers choose meals with confidence.",
    },
  ]

  const milestones = [
    { label: "Partner Restaurants", value: "500+" },
    { label: "Meals Delivered", value: "120K+" },
    { label: "Average Rating", value: "4.8/5" },
    { label: "Cities Covered", value: "40+" },
  ]

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 rounded-2xl border border-border/70 bg-linear-to-r from-orange-50 via-amber-50 to-emerald-50 p-6 dark:from-orange-950/40 dark:via-amber-950/30 dark:to-emerald-950/30">
        <p className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">About MealHub</p>
        <h1 className="mt-2 text-2xl font-extrabold text-foreground sm:text-3xl">Making Food Ordering Simple and Reliable</h1>
        <p className="mt-3 max-w-3xl text-sm text-muted-foreground">
          MealHub connects customers with trusted restaurants, helping people discover great food and get it delivered
          quickly. We are building a platform focused on quality meals, smooth ordering, and dependable service.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          <Button asChild>
            <Link href="/meals">Explore Meals</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/contact">Contact Us</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <article className="rounded-2xl border border-border bg-card p-6 shadow-xs">
          <h2 className="text-lg font-bold">Our Mission</h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Our mission is to make daily food ordering effortless for customers and growth-focused for restaurants. We
            help local food businesses reach more people while ensuring users can find meals they love without friction.
          </p>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            From discovery to checkout, we continuously improve performance, clarity, and trust across every step of
            the experience.
          </p>
        </article>

        <aside className="rounded-2xl border border-border bg-card p-6 shadow-xs">
          <h2 className="text-lg font-bold">Why People Choose Us</h2>
          <div className="mt-4 space-y-3">
            {values.map((item) => (
              <div key={item.title} className="rounded-xl border border-border/80 bg-muted/30 p-3">
                <h3 className="text-sm font-semibold">{item.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{item.text}</p>
              </div>
            ))}
          </div>
        </aside>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {milestones.map((item) => (
          <div key={item.label} className="rounded-xl border border-border bg-card p-4 text-center shadow-xs">
            <p className="text-2xl font-extrabold text-foreground">{item.value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{item.label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default page
