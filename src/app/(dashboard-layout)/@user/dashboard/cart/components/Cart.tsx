"use client"
import {
  BadgeCheck,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  Truck,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/hooks/use-cart"
import { useEffect, useState } from "react"
import { Meal } from "@/types/meal.type"
import { getCartMeal } from "@/action/meal.action"
import Image from "next/image"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { createOrder } from "@/action/order.action"
import { toast } from "sonner"

type CartPayload = {
  success: boolean
  data: Meal[]
  message: string
}

type CartViewItem = Meal & {
  qty: number
}

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
})

function Cart() {
  const { cart, clearCart, removeItemById, increment, decrement } = useCart()
  const [cartItems, setCartItems] = useState<CartViewItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [fetchError, setFetchError] = useState<string | null>(null)
  const [address, setAddress] = useState("")

  useEffect(() => {
    if (cart.items.length === 0) {
      setCartItems([])
      setFetchError(null)
      return
    }

    let isMounted = true;

    (async () => {
      try {
        setIsLoading(true)
        setFetchError(null)
        const response = await getCartMeal(cart.items)

        if (!isMounted) return

        if (response.error) {
          throw new Error("Failed to load cart meals")
        }

        const payload = response.data as CartPayload | null
        const meals = Array.isArray(payload?.data) ? payload.data : []

        const quantityMap = new Map(
          cart.items.map((item) => [item.mealId, item.quantity])
        )

        const normalizedMeals = meals.map((meal) => ({
          ...meal,
          qty: quantityMap.get(meal.id) ?? 1,
        }))

        setCartItems(normalizedMeals)
      } catch (error) {
        if (!isMounted) return
        setCartItems([])
        setFetchError(
          error instanceof Error ? error.message : "Failed to load cart items"
        )
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    })();
    return () => {
      isMounted = false
    }
  }, [cart.items])

  const subtotal = cartItems.reduce((total, item) => total + item.price * item.qty, 0)
  const delivery = subtotal > 35 ? 0 : 4.5
  const tax = subtotal * 0.00
  const total = subtotal + delivery + tax
  const kitchens = new Set(cartItems.map((item) => item.sellerId)).size

  const handleOrder = async () => {
    if (!address.trim()) {
      toast.error("Please make sure you added address")
      return
    }

    if (cart.items.length === 0) {
      toast.error("Your cart is empty.")
      return
    }

    const toastId = toast.loading("Please wait, placing your order...")

    try {
      const orderPayload = {
        address: address.trim(),
        items: cart.items
      }
      await createOrder(orderPayload)
      clearCart()
      toast.success("Order placed successfully.", { id: toastId })
    } catch (error: unknown) {
      toast.error(
        error instanceof Error ? error.message : "Order failed to place.",
        { id: toastId }
      )
    }



  }

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
                      <p className="text-sm text-muted-foreground">
                        {cartItems.length} meals from {kitchens} kitchens
                      </p>
                    </div>
                  </div>
                  <Button onClick={clearCart} variant="ghost" size="sm" className="text-xs">Clear cart</Button>
                </div>

                <div className="mt-6 flex flex-col gap-5">
                  {isLoading && (
                    <p className="text-sm text-muted-foreground">Loading cart meals...</p>
                  )}
                  {!isLoading && fetchError && (
                    <p className="text-sm text-red-500">{fetchError}</p>
                  )}
                  {!isLoading && !fetchError && cartItems.length === 0 && (
                    <p className="text-sm text-muted-foreground">Your cart is empty.</p>
                  )}
                  {cartItems.map((item) => (
                    <article
                      key={item.id}
                      className="flex flex-col gap-4 rounded-2xl border border-border/60 p-4 sm:flex-row sm:items-center"
                    >
                      <div className="flex items-start gap-4">
                        <Image
                          src={item.imageUrl}
                          alt={item.foodName}
                          className="h-20 w-20 shrink-0 rounded-2xl object-cover"
                          width={80}
                          height={80}
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-base font-semibold text-foreground">{item.foodName}</h3>
                          </div>
                          <p className="text-sm mt-2 text-muted-foreground">{item.description || "No description"}</p>
                        </div>
                      </div>
                      <div className="flex flex-1 items-center justify-between gap-4 sm:justify-end">
                        <div className="flex items-center gap-3 rounded-full border border-border/60 px-3 py-1">
                          <button
                            type="button"
                            disabled={item.qty <= 1}
                            onClick={() => decrement(item.id)}
                            className="text-muted-foreground disabled:cursor-not-allowed disabled:opacity-40"
                            aria-label={`Decrease quantity of ${item.foodName}`}
                          >
                            <Minus className="size-4" />
                          </button>
                          <span className="text-sm font-semibold text-foreground">{item.qty}</span>
                          <button
                            type="button"
                            onClick={() => increment(item.id)}
                            className="text-muted-foreground"
                            aria-label={`Increase quantity of ${item.foodName}`}
                          >
                            <Plus className="size-4" />
                          </button>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-base font-semibold text-foreground">
                            {currency.format(item.price * item.qty)}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeItemById(item.id)}
                            className="text-muted-foreground"
                            aria-label={`Remove ${item.foodName} from cart`}
                          >
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
                <div className="flex items-center gap-3">
                  <span className="inline-flex size-10 items-center justify-center rounded-full bg-sky-100 text-sky-700">
                    <Truck className="size-5" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-foreground">Delivery address</p>
                    <p className="text-xs text-muted-foreground">{address ? address : "Please set your current address."}</p>
                  </div>
                </div>
                <>
                  <Dialog>
                    <form>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="mt-4 w-full">Change address</Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-sm">
                        <DialogHeader>
                          <DialogTitle></DialogTitle>
                          <DialogDescription>
                            Make changes to your profile here. Click save when you&apos;re
                            done.
                          </DialogDescription>
                        </DialogHeader>
                        <div>
                          <Input value={address} onChange={(e) => setAddress(e.currentTarget.value)} />
                        </div>
                        <DialogFooter>
                          <DialogClose asChild>
                            <Button type="submit">Ok</Button>
                          </DialogClose>
                          {/* <Button variant="outline">Cancel</Button> */}
                        </DialogFooter>
                      </DialogContent>
                    </form>
                  </Dialog>

                </>
              </div>
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
                <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50/70 p-3">
                  <div className="flex items-center gap-2">
                    <BadgeCheck className="size-4 text-emerald-700" />
                    <p className="text-xs font-semibold uppercase tracking-widest text-emerald-700">
                      Cash on Delivery
                    </p>
                  </div>
                  <p className="mt-1 text-xs text-emerald-800">
                    Pay with cash when your order arrives at your doorstep.
                  </p>
                </div>
                <Button onClick={handleOrder} className="mt-5 w-full">Proceed to checkout</Button>
                <p className="mt-3 text-xs text-muted-foreground">By placing your order, you agree to MealHub policies.</p>
              </div>




            </aside>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Cart
