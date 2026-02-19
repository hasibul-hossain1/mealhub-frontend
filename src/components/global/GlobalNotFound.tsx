"use client"
import Link from "next/link";
import Lottie from "lottie-react";
import { Home, UtensilsCrossed } from "lucide-react";
import { Button } from "@/components/ui/button";
import notFoundLottie from "@/assets/lottie/not-found-lottie.json"

function GlobalNotFound() {
  return (
    <>
      <main className="relative min-h-svh overflow-hidden bg-linear-to-b from-background via-background to-orange-500/10">
        <div className="pointer-events-none absolute -left-28 top-10 h-80 w-80 rounded-full bg-orange-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-amber-400/20 blur-3xl" />

        <section className="relative mx-auto grid min-h-[calc(100svh-4rem)] max-w-6xl items-center gap-8 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div className="order-2 space-y-5 text-center lg:order-1 lg:text-left">
            <p className="inline-block rounded-full border border-primary/30 bg-primary/10 px-4 py-1 text-xs font-semibold tracking-[0.2em] text-primary uppercase">
              Error 404
            </p>
            <h1 className="text-4xl leading-tight font-extrabold sm:text-5xl lg:text-6xl">
              This page is
              <span className="block text-primary">off the menu.</span>
            </h1>
            <p className="mx-auto max-w-xl text-sm text-muted-foreground sm:text-base lg:mx-0">
              We looked everywhere, but this link does not exist anymore. Let us
              get you back to fresh meals and active listings.
            </p>

            <div className="flex flex-col items-center gap-3 pt-2 sm:flex-row lg:items-start">
              <Button asChild size="lg" className="w-full sm:w-auto">
                <Link href="/">
                  <Home className="mr-2 size-4" />
                  Back to Home
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="w-full sm:w-auto">
                <Link href="/meals">
                  <UtensilsCrossed className="mr-2 size-4" />
                  Browse Meals
                </Link>
              </Button>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <div className="rounded-3xl p-4 backdrop-blur-sm sm:p-6">
              <Lottie
                className="mx-auto h-72 w-full sm:h-80 lg:h-104"
                animationData={notFoundLottie}
                loop
              />
            </div>
          </div>
        </section>
      </main>
    </>
  )
}

export default GlobalNotFound