import {
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  Truck,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

const cartItems = [
  {
    id: 1,
    name: "Smoky Chipotle Chicken Bowl",
    restaurant: "Urban Harvest",
    size: "Regular",
    price: 12.5,
    qty: 2,
    tag: "Chef's pick",
    heat: "Medium heat",
  },
  {
    id: 2,
    name: "Citrus Salmon Bento",
    restaurant: "Coastal Kitchen",
    size: "Large",
    price: 16,
    qty: 1,
    tag: "New",
    heat: "Low heat",
  },
  {
    id: 3,
    name: "Garden Veggie Ramen",
    restaurant: "Nori House",
    size: "Regular",
    price: 11.25,
    qty: 1,
    tag: "Popular",
    heat: "No spice",
  },
]

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
})

function Cart() {
  const subtotal = cartItems.reduce((total, item) => total + item.price * item.qty, 0)
  const delivery = subtotal > 35 ? 0 : 4.5
  const tax = subtotal * 0.08
  const total = subtotal + delivery + tax

  return (
    <section className="min-h-screen w-full bg-muted/30">
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute -left-16 top-10 h-56 w-56 rounded-full bg-linear-to-br from-orange-200/70 via-amber-200/50 to-transparent blur-3xl" />
        <div className="pointer-events-none absolute -right-20 top-0 h-72 w-72 rounded-full bg-linear-to-br from-emerald-200/60 via-teal-200/40 to-transparent blur-3xl" />
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
          <header className="rounded-3xl border border-border/60 bg-background/80 p-6 shadow-sm backdrop-blur">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">MealHub Cart</p>
                <h1 className="mt-2 text-3xl font-black text-foreground sm:text-4xl">Your cart is almost ready</h1>
                <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                  Review your meals, tweak portions, and checkout in seconds. Your items are reserved for
                  25 minutes.
                </p>
              </div>
            </div>
          </header>

          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
            <div className="flex flex-col gap-6">
              <div className="rounded-3xl border border-border/60 bg-background p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex size-10 items-center justify-center rounded-full bg-amber-100 text-amber-700">
                      <ShoppingBag className="size-5" />
                    </span>
                    <div>
                      <h2 className="text-lg font-bold text-foreground">Items in your cart</h2>
                      <p className="text-sm text-muted-foreground">{cartItems.length} meals from 3 kitchens</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="text-xs">Clear cart</Button>
                </div>

                <div className="mt-6 flex flex-col gap-5">
                  {cartItems.map((item) => (
                    <article
                      key={item.id}
                      className="flex flex-col gap-4 rounded-2xl border border-border/60 p-4 sm:flex-row sm:items-center"
                    >
                      <div className="flex items-start gap-4">
                        <div className="h-20 w-20 shrink-0 rounded-2xl bg-linear-to-br from-amber-100 via-orange-100 to-rose-100" />
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-base font-semibold text-foreground">{item.name}</h3>
                          </div>
                          <p className="text-sm mt-2 text-muted-foreground">{item.restaurant}</p>
                        </div>
                      </div>
                      <div className="flex flex-1 items-center justify-between gap-4 sm:justify-end">
                        <div className="flex items-center gap-3 rounded-full border border-border/60 px-3 py-1">
                          <button className="text-muted-foreground">
                            <Minus className="size-4" />
                          </button>
                          <span className="text-sm font-semibold text-foreground">{item.qty}</span>
                          <button className="text-muted-foreground">
                            <Plus className="size-4" />
                          </button>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-base font-semibold text-foreground">
                            {currency.format(item.price * item.qty)}
                          </span>
                          <button className="text-muted-foreground">
                            <Trash2 className="size-4" />
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </div>

            <aside className="flex flex-col gap-6">
              <div className="rounded-3xl border border-border/60 bg-background p-6 shadow-sm">
                <h3 className="text-base font-bold text-foreground">Order summary</h3>
                <div className="mt-4 space-y-3 text-sm">
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span className="font-semibold text-foreground">{currency.format(subtotal)}</span>
                  </div>
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span>Delivery</span>
                    <span className="font-semibold text-foreground">{delivery === 0 ? "Free" : currency.format(delivery)}</span>
                  </div>
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span>Tax</span>
                    <span className="font-semibold text-foreground">{currency.format(tax)}</span>
                  </div>
                </div>
                <Separator className="my-4" />
                <div className="flex items-center justify-between text-base font-semibold text-foreground">
                  <span>Total</span>
                  <span>{currency.format(total)}</span>
                </div>
                <Button className="mt-5 w-full">Proceed to checkout</Button>
                <p className="mt-3 text-xs text-muted-foreground">By placing your order, you agree to MealHub policies.</p>
              </div>

             

              <div className="rounded-3xl border border-border/60 bg-background p-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <span className="inline-flex size-10 items-center justify-center rounded-full bg-sky-100 text-sky-700">
                    <Truck className="size-5" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-foreground">Delivery address</p>
                    <p className="text-xs text-muted-foreground">124 Market Street, San Francisco</p>
                  </div>
                </div>
                <Button variant="outline" className="mt-4 w-full">Change address</Button>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Cart
