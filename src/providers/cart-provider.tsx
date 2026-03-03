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
    cart: CartState;
    addToCart: (item: CartMeal) => void
    clearCart: () => void;
    removeItemById:(id:string)=>void
    increment: (id: string) => void
    decrement: (id: string) => void
}

export const CartContext = createContext<CartContextValue | undefined>(undefined)

const emptyCart: CartState = { items: [] }

const normalizeCart = (value: unknown): CartState => {
    if (
        typeof value === "object" &&
        value !== null &&
        "items" in value &&
        Array.isArray((value as CartState).items)
    ) {
        return value as CartState
    }
    return emptyCart
}

function CartProvider({ children }: { children: React.ReactNode }) {
    const [cart, setCart] = useState<CartState>(() => {
        if (typeof window === "undefined") {
            return emptyCart
        }
        const stored = localStorage.getItem("cart")
        if (!stored) {
            return emptyCart
        }
        try {
            return normalizeCart(JSON.parse(stored))
        } catch {
            return emptyCart
        }
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

    const clearCart = () => {
        setCart(emptyCart)
    }

    const removeItemById = (id: string) => {
        setCart((prev) => ({
            ...prev,
            items: prev.items.filter((item) => item.mealId !== id),
        }))
    }

    const increment = (id: string) => {
        setCart((prev) => ({
            ...prev,
            items: prev.items.map((item) =>
                item.mealId === id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            ),
        }))
    }

    const decrement = (id: string) => {
        setCart((prev) => ({
            ...prev,
            items: prev.items.map((item) =>
               ( item.mealId === id && item.quantity > 1)
                    ? { ...item, quantity: item.quantity - 1 }
                    : item
            ),
        }))
    }

    return (
        <CartContext.Provider value={{ cart, addToCart, clearCart, removeItemById, increment, decrement }}>
            {children}
        </CartContext.Provider>
    )
}



export default CartProvider
