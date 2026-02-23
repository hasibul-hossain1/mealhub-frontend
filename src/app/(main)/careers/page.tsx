import Link from "next/link"
import { Button } from "@/components/ui/button"

function page() {
  const openings = [
    {
      id: "eng-001",
      title: "Frontend Engineer",
      team: "Engineering",
      location: "Remote",
      type: "Full-time",
      summary: "Build fast, accessible interfaces across web and mobile experiences.",
    },
    {
      id: "ops-002",
      title: "Operations Associate",
      team: "Operations",
      location: "Dhaka",
      type: "Full-time",
      summary: "Coordinate partner onboarding and maintain service quality standards.",
    },
    {
      id: "mkt-003",
      title: "Growth Marketing Specialist",
      team: "Marketing",
      location: "Hybrid",
      type: "Full-time",
      summary: "Run data-driven campaigns to acquire and retain loyal customers.",
    },
    {
      id: "sup-004",
      title: "Customer Support Executive",
      team: "Support",
      location: "On-site",
      type: "Shift-based",
      summary: "Help customers and restaurants resolve issues with empathy and speed.",
    },
  ]

  const benefits = [
    "Competitive salary and annual performance review",
    "Flexible work setup with hybrid and remote options",
    "Learning budget for courses, books, and certifications",
    "Health and wellness support",
    "Team retreats and regular knowledge-sharing sessions",
  ]

  const process = ["Application Review", "Initial Interview", "Technical/Role Assessment", "Final Interview", "Offer"]

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 rounded-2xl border border-border/70 bg-linear-to-r from-emerald-50 via-sky-50 to-orange-50 p-6 dark:from-emerald-950/30 dark:via-sky-950/30 dark:to-orange-950/30">
        <p className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">Careers</p>
        <h1 className="mt-2 text-2xl font-extrabold text-foreground sm:text-3xl">Join the MealHub Team</h1>
        <p className="mt-3 max-w-3xl text-sm text-muted-foreground">
          We are building a reliable food platform for customers and restaurants. Explore open roles and help us create
          a better ordering experience every day.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          <Button asChild>
            <Link href="#open-roles">View Open Roles</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/contact">Contact Hiring Team</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <article id="open-roles" className="rounded-2xl border border-border bg-card p-6 shadow-xs">
          <h2 className="text-lg font-bold">Open Positions</h2>
          <p className="mt-2 text-sm text-muted-foreground">Demo roles for UI showcase. Replace with real vacancies.</p>
          <div className="mt-4 space-y-3">
            {openings.map((job) => (
              <div key={job.id} className="rounded-xl border border-border/80 bg-muted/30 p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <h3 className="text-base font-semibold">{job.title}</h3>
                    <p className="text-xs text-muted-foreground">
                      {job.team} • {job.location} • {job.type}
                    </p>
                  </div>
                  <Button size="sm" variant="outline" type="button">
                    Apply
                  </Button>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{job.summary}</p>
              </div>
            ))}
          </div>
        </article>

        <aside className="space-y-6">
          <article className="rounded-2xl border border-border bg-card p-6 shadow-xs">
            <h2 className="text-lg font-bold">Benefits</h2>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              {benefits.map((item) => (
                <li key={item} className="rounded-lg border border-border/70 bg-muted/30 px-3 py-2">
                  {item}
                </li>
              ))}
            </ul>
          </article>

          <article className="rounded-2xl border border-border bg-card p-6 shadow-xs">
            <h2 className="text-lg font-bold">Hiring Process</h2>
            <div className="mt-3 space-y-2">
              {process.map((step, index) => (
                <div key={step} className="flex items-center gap-3 rounded-lg border border-border/70 bg-muted/30 px-3 py-2">
                  <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs font-semibold text-primary">
                    {index + 1}
                  </span>
                  <p className="text-sm text-muted-foreground">{step}</p>
                </div>
              ))}
            </div>
          </article>
        </aside>
      </div>
    </section>
  )
}

export default page
