"use client"
import React, { createContext, useEffect, useState } from 'react'

type CartMeal = {
    mealId: string
    quantity: number
}

type CartState = {
    items: CartMeal[]
}

type CartContextValue = {
    cart: CartState
    addToCart: (item: CartMeal) => void
}

export const CartContext = createContext<CartContextValue | undefined>(undefined)

function CartProvider({ children }: { children: React.ReactNode }) {
    const [cart, setCart] = useState(() => {
        if (typeof window === "undefined") {
            return { items: [] }
        }
        const stored = localStorage.getItem("cart")
        return stored ? JSON.parse(stored) : { items: [] }
    })

    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart))
    }, [cart])

    const addToCart = (item: CartMeal) => {
        setCart((prev: CartState) => {
            const existing = prev.items.find((i) => i.mealId === item.mealId)

            if (existing) {
                return {
                    ...prev,
                    items: prev.items.map(i =>
                        i.mealId === item.mealId
                            ? { ...i, quantity: i.quantity + 1 }
                            : i
                    )
                }
            }

            return { ...prev, items: [...prev.items, { ...item, quantity: 1 }] }
        })
    }

    return (
        <CartContext.Provider value={{ cart, addToCart }}>
            {children}
        </CartContext.Provider>
    )
}



export default CartProvider
