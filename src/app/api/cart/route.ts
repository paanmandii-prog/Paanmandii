import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { recalculateCart } from '@/lib/pricing'

// GET /api/cart — Get current user's cart with server-computed prices
export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Get or create cart
  let { data: cart } = await supabase
    .from('carts')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (!cart) {
    const { data: newCart } = await supabase
      .from('carts')
      .insert({ user_id: user.id })
      .select('id')
      .single()
    cart = newCart
  }

  if (!cart) {
    return NextResponse.json({ items: [], subtotal_paise: 0, total_paise: 0 })
  }

  // Get cart items
  const { data: cartItems } = await supabase
    .from('cart_items')
    .select('product_id, quantity')
    .eq('cart_id', cart.id)

  if (!cartItems || cartItems.length === 0) {
    return NextResponse.json({
      cart_id: cart.id,
      items: [],
      subtotal_paise: 0,
      tax_paise: 0,
      total_paise: 0,
      item_count: 0,
    })
  }

  // Server-side recalculation — never trust client prices
  const result = await recalculateCart(cartItems)

  return NextResponse.json({
    cart_id: cart.id,
    ...result,
    item_count: result.items.reduce((sum, i) => sum + i.quantity, 0),
  })
}

// DELETE /api/cart — Clear cart
export async function DELETE() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: cart } = await supabase
    .from('carts')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (cart) {
    await supabase.from('cart_items').delete().eq('cart_id', cart.id)
  }

  return NextResponse.json({ success: true })
}
