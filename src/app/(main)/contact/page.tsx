import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

function page() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 rounded-2xl border border-border/70 bg-linear-to-r from-orange-50 via-amber-50 to-emerald-50 p-6 dark:from-orange-950/40 dark:via-amber-950/30 dark:to-emerald-950/30">
        <p className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">Contact</p>
        <h1 className="mt-2 text-2xl font-extrabold text-foreground sm:text-3xl">Contact Us</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Have a question, feedback, or partnership idea? Send us a message and we will get back to you soon.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <aside className="rounded-2xl border border-border bg-card p-5 shadow-xs">
          <h2 className="text-lg font-bold">Get in Touch</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Reach our support team through the channels below and we will respond as soon as possible.
          </p>

          <div className="mt-5 space-y-3 text-sm">
            <div className="rounded-xl border border-border/80 bg-muted/30 p-3">
              <p className="text-xs font-semibold text-muted-foreground">Email</p>
              <p className="mt-1 font-medium">support@mealhub.demo</p>
            </div>
            <div className="rounded-xl border border-border/80 bg-muted/30 p-3">
              <p className="text-xs font-semibold text-muted-foreground">Phone</p>
              <p className="mt-1 font-medium">+1 (555) 010-8888</p>
            </div>
            <div className="rounded-xl border border-border/80 bg-muted/30 p-3">
              <p className="text-xs font-semibold text-muted-foreground">Address</p>
              <p className="mt-1 font-medium">123 Meal Street, Food City, FC 10001</p>
            </div>
          </div>
        </aside>

        <article className="rounded-2xl border border-border bg-card p-5 shadow-xs">
          <h2 className="text-lg font-bold">Send a Message</h2>
          <p className="mt-2 text-sm text-muted-foreground">Fill out the form and we will get back to you shortly.</p>

          <form className="mt-5 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="contact-name" className="mb-2 block text-sm font-medium">
                  Name
                </label>
                <Input id="contact-name" placeholder="Your full name" />
              </div>
              <div>
                <label htmlFor="contact-email" className="mb-2 block text-sm font-medium">
                  Email
                </label>
                <Input id="contact-email" type="email" placeholder="you@example.com" />
              </div>
            </div>

            <div>
              <label htmlFor="contact-subject" className="mb-2 block text-sm font-medium">
                Subject
              </label>
              <Input id="contact-subject" placeholder="How can we help?" />
            </div>

            <div>
              <label htmlFor="contact-message" className="mb-2 block text-sm font-medium">
                Message
              </label>
              <textarea
                id="contact-message"
                rows={5}
                placeholder="Write your message..."
                className="border-input bg-background focus-visible:border-ring focus-visible:ring-ring/50 w-full rounded-md border px-3 py-2 text-sm outline-none focus-visible:ring-[3px]"
              />
            </div>

            <div className="flex items-center gap-2">
              <Button type="button">Send Message</Button>
              <Button type="reset" variant="outline">
                Reset
              </Button>
            </div>
          </form>
        </article>
      </div>
    </section>
  )
}

export default page
