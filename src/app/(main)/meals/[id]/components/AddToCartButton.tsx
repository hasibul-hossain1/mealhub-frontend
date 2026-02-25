"use client"
import { Button } from '@/components/ui/button'
import { useCart } from '@/hooks/use-cart'
import { authClient } from '@/lib/auth-client'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'
import React, { useState } from 'react'
import { toast } from 'sonner'

function AddToCartButton({ id, availabilityState, hasValidPrice }: { id: string, availabilityState: string, hasValidPrice: boolean }) {
    const { data, error, isPending } = authClient.useSession()
    const { addToCart } = useCart()
    const [isAdding, setIsAdding] = useState(false)

    const shouldDisableButton =
        availabilityState !== "Available" ||
        !hasValidPrice ||
        isPending ||
        isAdding

    const handleAddToCart = async () => {
        if (shouldDisableButton) return

        if (error) {
            toast.error(error.message || "Unable to verify your session. Please try again.")
            return
        }

        if (!data?.user) {
            toast.error("Please sign in to add items to your cart.")
            return
        }

        setIsAdding(true)
        try {
            addToCart({ mealId: id, quantity: 1 })
            toast.custom((t) => (
                <div className="bg-background border shadow-lg rounded-xl p-4 flex items-center justify-between gap-4 w-87.5">

                    <div className="flex flex-col">
                        <span className="font-medium">Item Added Successfully</span>
                        <span className="text-sm text-muted-foreground">
                            Your item has been added to cart.
                        </span>
                    </div>

                    <Button
                        size="sm"
                        onClick={() => {
                            toast.dismiss(t)
                        }}
                        asChild
                    >
                        <Link href="/dashboard/cart">
                            View Cart
                        </Link>
                    </Button>
                </div>
            ))
        } catch (addError: any) {
            toast.error(addError?.message || "Failed to add item to cart.")
        } finally {
            setIsAdding(false)
        }
    }

    return (
        <Button onClick={handleAddToCart} variant="default" className="cursor-pointer" disabled={shouldDisableButton}>
            {(isPending || isAdding) && <Loader2 className="size-4 animate-spin" />}
            {isPending ? "Checking session..." : isAdding ? "Adding..." : "Add to cart"}
        </Button>
    )
}

export default AddToCartButton
