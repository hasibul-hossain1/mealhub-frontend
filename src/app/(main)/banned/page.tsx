import Link from "next/link"
import { Button } from "@/components/ui/button"

function page() {
  const reasons = [
    {
      title: "Policy or safety violations",
      description: "Repeated misuse, abusive behavior, or violations of our marketplace policies.",
    },
    {
      title: "Payment or chargeback issues",
      description: "Unresolved disputes, suspicious payment patterns, or failed verification checks.",
    },
    {
      title: "Account integrity concerns",
      description: "Activity that appears automated, fraudulent, or not aligned with verified ownership.",
    },
  ]

  const nextSteps = [
    "Review the email sent to your account for details and required actions.",
    "Contact support if you believe this was a mistake or need clarification.",
    "Provide any requested verification so we can complete a review.",
  ]

  const appealChecklist = [
    "Your account email address",
    "Order IDs or receipts related to the issue",
    "A brief explanation and any supporting documents",
  ]

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 rounded-2xl border border-border/70 bg-linear-to-r from-rose-50 via-amber-50 to-orange-50 p-6 dark:from-rose-950/30 dark:via-amber-950/30 dark:to-orange-950/30">
        <p className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">Account Status</p>
        <h1 className="mt-2 text-2xl font-extrabold text-foreground sm:text-3xl">Your Account Has Been Restricted</h1>
        <p className="mt-3 max-w-3xl text-sm text-muted-foreground">
          Access to Tyme2eat has been temporarily blocked for this account. If you believe this is an error, our team can
          review your case.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          <Button asChild>
            <Link href="/contact">Contact Support</Link>
          </Button>
          <Button asChild variant="outline">
            <a href="mailto:support@tyme2eat.demo">Email Support</a>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <article className="rounded-2xl border border-border bg-card p-6 shadow-xs">
          <h2 className="text-lg font-bold">Why you are seeing this</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Restrictions are applied to protect customers, restaurants, and the overall marketplace experience.
          </p>
          <div className="mt-4 space-y-3">
            {reasons.map((item) => (
              <div key={item.title} className="rounded-xl border border-border/80 bg-muted/30 p-4">
                <h3 className="text-sm font-semibold">{item.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </article>

        <aside className="space-y-6">
          <article className="rounded-2xl border border-border bg-card p-6 shadow-xs">
            <h2 className="text-lg font-bold">What you can do next</h2>
            <div className="mt-3 space-y-2">
              {nextSteps.map((step, index) => (
                <div key={step} className="flex items-start gap-3 rounded-lg border border-border/70 bg-muted/30 px-3 py-2">
                  <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs font-semibold text-primary">
                    {index + 1}
                  </span>
                  <p className="text-sm text-muted-foreground">{step}</p>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-2xl border border-border bg-card p-6 shadow-xs">
            <h2 className="text-lg font-bold">Include these details</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Sharing the information below helps us locate your account faster and complete the review.
            </p>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              {appealChecklist.map((item) => (
                <li key={item} className="rounded-lg border border-border/70 bg-muted/30 px-3 py-2">
                  {item}
                </li>
              ))}
            </ul>
          </article>
        </aside>
      </div>
    </section>
  )
}

export default page
