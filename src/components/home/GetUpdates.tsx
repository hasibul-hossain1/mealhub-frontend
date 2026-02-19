import React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

function GetUpdates() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-10 motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-bottom-3 motion-safe:duration-500 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-3xl bg-primary p-6 text-primary-foreground shadow-sm motion-safe:animate-in motion-safe:fade-in-0 motion-safe:zoom-in-95 motion-safe:duration-500 sm:p-8">
        <div className="pointer-events-none absolute -top-14 -right-14 h-44 w-44 rounded-full bg-white/20 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-10 h-40 w-40 rounded-full bg-black/10 blur-2xl" />

        <div className="relative grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-xs font-semibold tracking-[0.18em] uppercase">Stay Connected</p>
            <h2 className="mt-2 text-2xl font-extrabold sm:text-3xl">Get Food Updates</h2>
            <p className="mt-2 max-w-2xl text-sm text-primary-foreground/90">
              Receive weekly offers, new arrivals, and limited-time deals in your inbox.
            </p>
          </div>

          <form className="flex w-full max-w-md flex-col gap-2 sm:flex-row">
            <Input
              type="email"
              placeholder="Your email"
              className="h-10 border-white/35 bg-white/15 text-primary-foreground placeholder:text-primary-foreground/80"
              aria-label="Email for updates"
            />
            <Button
              type="button"
              className="h-10 cursor-pointer bg-background px-6 text-foreground hover:bg-background/90"
            >
              Subscribe
            </Button>
          </form>
        </div>
      </div>
    </section>
  )
}

export default GetUpdates
