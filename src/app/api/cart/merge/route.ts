import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// POST /api/cart/merge — Merge guest cart into authenticated user cart
export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const guestItems: Array<{ product_id: string; quantity: number }> = body.items || []

    if (!Array.isArray(guestItems) || guestItems.length === 0) {
      return NextResponse.json({ success: true })
    }

    // Get or create user cart
    let { data: cart } = await supabase
      .from('carts')
      .select('id')
      .eq('user_id', user.id)
      .single()

    if (!cart) {
      const { data: newCart, error: cartErr } = await supabase
        .from('carts')
        .insert({ user_id: user.id })
        .select('id')
        .single()

      if (cartErr || !newCart) {
        return NextResponse.json({ error: 'Failed to find or create cart' }, { status: 500 })
      }
      cart = newCart
    }

    // Merge each item
    for (const item of guestItems) {
      if (!item.product_id || item.quantity <= 0) continue

      const { data: existing } = await supabase
        .from('cart_items')
        .select('id, quantity')
        .eq('cart_id', cart.id)
        .eq('product_id', item.product_id)
        .single()

      if (existing) {
        // Update to higher or sum
        const newQty = Math.max(existing.quantity, item.quantity)
        await supabase
          .from('cart_items')
          .update({ quantity: newQty, updated_at: new Date().toISOString() })
          .eq('id', existing.id)
      } else {
        await supabase
          .from('cart_items')
          .insert({
            cart_id: cart.id,
            product_id: item.product_id,
            quantity: item.quantity,
          })
      }
    }

    return NextResponse.json({ success: true })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal Server Error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
