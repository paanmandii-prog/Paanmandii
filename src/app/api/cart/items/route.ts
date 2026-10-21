import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { addToCartSchema, updateCartItemSchema } from '@/lib/validations'

// POST /api/cart/items — Add item to cart
export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const parsed = addToCartSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })
    }

    const { product_id, quantity } = parsed.data

    // Find or create cart
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
        return NextResponse.json({ error: 'Failed to create cart' }, { status: 500 })
      }
      cart = newCart
    }

    // Check if item exists in cart
    const { data: existingItem } = await supabase
      .from('cart_items')
      .select('id, quantity')
      .eq('cart_id', cart.id)
      .eq('product_id', product_id)
      .single()

    if (existingItem) {
      const newQty = existingItem.quantity + quantity
      const { error: updateErr } = await supabase
        .from('cart_items')
        .update({ quantity: newQty, updated_at: new Date().toISOString() })
        .eq('id', existingItem.id)

      if (updateErr) {
        return NextResponse.json({ error: 'Failed to update cart' }, { status: 500 })
      }
    } else {
      const { error: insertErr } = await supabase
        .from('cart_items')
        .insert({
          cart_id: cart.id,
          product_id,
          quantity,
        })

      if (insertErr) {
        return NextResponse.json({ error: 'Failed to add item to cart' }, { status: 500 })
      }
    }

    return NextResponse.json({ success: true })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal Server Error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

// PATCH /api/cart/items — Update item quantity
export async function PATCH(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const parsed = updateCartItemSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })
    }

    const { product_id, cart_item_id, quantity } = parsed.data

    const { data: cart } = await supabase
      .from('carts')
      .select('id')
      .eq('user_id', user.id)
      .single()

    if (!cart) {
      return NextResponse.json({ error: 'Cart not found' }, { status: 404 })
    }

    if (quantity <= 0) {
      if (cart_item_id) {
        await supabase
          .from('cart_items')
          .delete()
          .eq('id', cart_item_id)
      } else if (product_id) {
        await supabase
          .from('cart_items')
          .delete()
          .eq('cart_id', cart.id)
          .eq('product_id', product_id)
      }
    } else {
      if (cart_item_id) {
        await supabase
          .from('cart_items')
          .update({
            quantity,
            updated_at: new Date().toISOString(),
          })
          .eq('id', cart_item_id)
      } else if (product_id) {
        await supabase
          .from('cart_items')
          .upsert(
            {
              cart_id: cart.id,
              product_id,
              quantity,
              updated_at: new Date().toISOString(),
            },
            { onConflict: 'cart_id,product_id' }
          )
      }
    }

    return NextResponse.json({ success: true })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal Server Error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

// DELETE /api/cart/items?product_id=xxx — Remove item
export async function DELETE(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const product_id = searchParams.get('product_id')

  if (!product_id) {
    return NextResponse.json({ error: 'Product ID required' }, { status: 400 })
  }

  const { data: cart } = await supabase
    .from('carts')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (cart) {
    await supabase
      .from('cart_items')
      .delete()
      .eq('cart_id', cart.id)
      .eq('product_id', product_id)
  }

  return NextResponse.json({ success: true })
}
