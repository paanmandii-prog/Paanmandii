'use client'

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { CartSummary, CartLineItem, ProductWithDetails } from '@/types'
import { getTierPrice, formatPrice } from '@/types'
import { toast } from 'sonner'

interface CartContextType {
  items: CartLineItem[]
  summary: CartSummary
  isLoading: boolean
  addItem: (product: ProductWithDetails, quantity: number) => Promise<void>
  updateItem: (productId: string, quantity: number) => Promise<void>
  removeItem: (productId: string) => Promise<void>
  clearCart: () => Promise<void>
  refreshCart: () => Promise<void>
}

const CartContext = createContext<CartContextType | null>(null)

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}

const GUEST_CART_KEY = 'pm_guest_cart'

interface GuestCartItem {
  product_id: string
  quantity: number
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const supabase = createClient()
  const [items, setItems] = useState<CartLineItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const computeSummary = useCallback((cartItems: CartLineItem[]): CartSummary => {
    const subtotal_paise = cartItems.reduce((sum, item) => sum + item.line_total_paise, 0)
    const tax_paise = cartItems.reduce((sum, item) => sum + item.tax_paise, 0)
    return {
      items: cartItems,
      subtotal_paise,
      tax_paise,
      discount_paise: 0,
      delivery_fee_paise: 0, // calculated at checkout
      total_paise: subtotal_paise + tax_paise,
      item_count: cartItems.reduce((sum, item) => sum + item.quantity, 0),
    }
  }, [])

  const summary = computeSummary(items)

  const fetchCart = useCallback(async () => {
    setIsLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        // Fetch authenticated cart from server
        const res = await fetch('/api/cart')
        if (res.ok) {
          const data = await res.json()
          setItems(data.items || [])
        }
      } else {
        // Use guest cart from localStorage
        const raw = localStorage.getItem(GUEST_CART_KEY)
        if (raw) {
          const guestItems: GuestCartItem[] = JSON.parse(raw)
          // Hydrate guest cart with current product data
          const res = await fetch('/api/cart/guest', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ items: guestItems }),
          })
          if (res.ok) {
            const data = await res.json()
            setItems(data.items || [])
          }
        } else {
          setItems([])
        }
      }
    } catch (err) {
      console.error('Failed to fetch cart:', err)
    } finally {
      setIsLoading(false)
    }
  }, [supabase])

  useEffect(() => {
    fetchCart()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event) => {
      if (event === 'SIGNED_IN') {
        // Merge guest cart into user cart on login
        const raw = localStorage.getItem(GUEST_CART_KEY)
        if (raw) {
          const guestItems: GuestCartItem[] = JSON.parse(raw)
          if (guestItems.length > 0) {
            await fetch('/api/cart/merge', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ items: guestItems }),
            })
            localStorage.removeItem(GUEST_CART_KEY)
          }
        }
        await fetchCart()
      } else if (event === 'SIGNED_OUT') {
        setItems([])
        localStorage.removeItem(GUEST_CART_KEY)
      }
    })

    return () => subscription.unsubscribe()
  }, [fetchCart, supabase])

  const addItem = async (product: ProductWithDetails, quantity: number) => {
    const { data: { user } } = await supabase.auth.getUser()

    // Validate minimum quantity
    if (quantity < product.min_order_qty) {
      toast.error(`Minimum order quantity is ${product.min_order_qty} ${product.unit}`)
      return
    }

    // Validate quantity increment
    if ((quantity - product.min_order_qty) % product.qty_increment !== 0) {
      toast.error(`Quantity must be in multiples of ${product.qty_increment}`)
      return
    }

    // Validate stock
    const available = product.inventory?.quantity_available ?? 0
    if (!product.inventory?.allow_backorder && quantity > available) {
      toast.error(`Only ${available} ${product.unit} available in stock`)
      return
    }

    if (user) {
      const res = await fetch('/api/cart/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_id: product.id, quantity }),
      })
      if (res.ok) {
        await fetchCart()
        toast.success(`${product.name} added to cart`)
      } else {
        const err = await res.json()
        toast.error(err.error || 'Failed to add to cart')
      }
    } else {
      // Guest cart — store in localStorage
      const raw = localStorage.getItem(GUEST_CART_KEY)
      const guestItems: GuestCartItem[] = raw ? JSON.parse(raw) : []
      const existing = guestItems.find((i) => i.product_id === product.id)
      if (existing) {
        existing.quantity = quantity
      } else {
        guestItems.push({ product_id: product.id, quantity })
      }
      localStorage.setItem(GUEST_CART_KEY, JSON.stringify(guestItems))
      await fetchCart()
      toast.success(`${product.name} added to cart`)
    }
  }

  const updateItem = async (productId: string, quantity: number) => {
    const { data: { user } } = await supabase.auth.getUser()

    if (quantity === 0) {
      return removeItem(productId)
    }

    if (user) {
      const res = await fetch('/api/cart/items', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_id: productId, quantity }),
      })
      if (res.ok) {
        await fetchCart()
      } else {
        const err = await res.json()
        toast.error(err.error || 'Failed to update cart')
      }
    } else {
      const raw = localStorage.getItem(GUEST_CART_KEY)
      const guestItems: GuestCartItem[] = raw ? JSON.parse(raw) : []
      const idx = guestItems.findIndex((i) => i.product_id === productId)
      if (idx !== -1) {
        guestItems[idx].quantity = quantity
        localStorage.setItem(GUEST_CART_KEY, JSON.stringify(guestItems))
        await fetchCart()
      }
    }
  }

  const removeItem = async (productId: string) => {
    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
      await fetch(`/api/cart/items?product_id=${productId}`, { method: 'DELETE' })
      await fetchCart()
    } else {
      const raw = localStorage.getItem(GUEST_CART_KEY)
      const guestItems: GuestCartItem[] = raw ? JSON.parse(raw) : []
      const updated = guestItems.filter((i) => i.product_id !== productId)
      localStorage.setItem(GUEST_CART_KEY, JSON.stringify(updated))
      await fetchCart()
    }
  }

  const clearCart = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      await fetch('/api/cart', { method: 'DELETE' })
    } else {
      localStorage.removeItem(GUEST_CART_KEY)
    }
    setItems([])
  }

  return (
    <CartContext.Provider
      value={{
        items,
        summary,
        isLoading,
        addItem,
        updateItem,
        removeItem,
        clearCart,
        refreshCart: fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}
