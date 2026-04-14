"use client"

import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"
import Link from "next/link"

export default function OrderSuccessPage() {
  return (
    <section className="min-h-screen w-full bg-muted/30 flex items-center justify-center">
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute -left-16 top-10 h-56 w-56 rounded-full bg-linear-to-br from-emerald-200/70 via-teal-200/50 to-transparent blur-3xl" />
        <div className="pointer-events-none absolute -right-20 top-0 h-72 w-72 rounded-full bg-linear-to-br from-emerald-200/60 via-teal-200/40 to-transparent blur-3xl" />

        <div className="mx-auto flex w-full max-w-lg flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-border/60 bg-background p-8 shadow-sm text-center">
            <div className="flex justify-center mb-6">
              <div className="inline-flex size-20 items-center justify-center rounded-full bg-emerald-100">
                <CheckCircle className="size-10 text-emerald-600" />
              </div>
            </div>

            <h1 className="text-3xl font-black text-foreground mb-2">Payment Successful!</h1>
            <p className="text-muted-foreground mb-6">
              Your order has been placed successfully. You will receive a confirmation email shortly with your order details.
            </p>

            <div className="rounded-2xl border border-border/60 bg-muted p-4 mb-6 text-left">
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">Order Status:</span> Processing
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                <span className="font-semibold text-foreground">Payment Method:</span> Stripe
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <Link href="/dashboard/orders">
                <Button className="w-full">View My Orders</Button>
              </Link>
              <Link href="/meals">
                <Button variant="outline" className="w-full">Continue Shopping</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
