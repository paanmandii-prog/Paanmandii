import { createClient, createServiceClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { recalculateCart, calculateDeliveryFee } from '@/lib/pricing'
import { sendOrderNotificationEmail } from '@/lib/email'
import { formatPrice } from '@/lib/utils'
import Razorpay from 'razorpay'

function getRazorpayInstance() {
  const key_id = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID
  const key_secret = process.env.RAZORPAY_KEY_SECRET

  if (key_id && key_secret && !key_id.includes('placeholder')) {
    return new Razorpay({
      key_id,
      key_secret,
    })
  }
  return null
}

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Please log in to place an order' }, { status: 401 })
  }

  const serviceClient = await createServiceClient()

  try {
    const body = await req.json()
    const {
      fulfillment_method = 'delivery',
      delivery_address,
      pickup_slot_id,
      payment_method = 'cod',
      customer_note,
      items: directItems,
    } = body

    // 1. Get cart items: either directly passed or from DB cart
    let itemsToProcess: Array<{ product_id: string; quantity: number }> = []

    if (Array.isArray(directItems) && directItems.length > 0) {
      itemsToProcess = directItems
    } else {
      const { data: cart } = await serviceClient
        .from('carts')
        .select('id')
        .eq('user_id', user.id)
        .single()

      if (cart) {
        const { data: dbItems } = await serviceClient
          .from('cart_items')
          .select('product_id, quantity')
          .eq('cart_id', cart.id)

        if (dbItems && dbItems.length > 0) {
          itemsToProcess = dbItems
        }
      }
    }

    if (itemsToProcess.length === 0) {
      return NextResponse.json({ error: 'Your cart is empty' }, { status: 400 })
    }

    // 2. Server-side authoritative recalculation
    const cartCalc = await recalculateCart(itemsToProcess)

    if (cartCalc.errors && cartCalc.errors.length > 0) {
      return NextResponse.json({
        error: 'Cart validation issue',
        details: cartCalc.errors,
      }, { status: 400 })
    }

    if (cartCalc.items.length === 0) {
      return NextResponse.json({ error: 'No valid products in cart' }, { status: 400 })
    }

    // 3. Delivery fee calculation
    let delivery_fee_paise = 0
    let zone_id: string | null = null

    if (fulfillment_method === 'delivery') {
      const pincode = delivery_address?.pincode
      if (pincode) {
        const feeResult = await calculateDeliveryFee(pincode, cartCalc.subtotal_paise)
        zone_id = feeResult.zone_id
        delivery_fee_paise = feeResult.fee_paise
      } else {
        delivery_fee_paise = cartCalc.subtotal_paise >= 500000 ? 0 : 25000 // Free over Rs 5000
      }
    }

    const subtotal_paise = cartCalc.subtotal_paise
    const tax_paise = cartCalc.tax_paise
    const discount_paise = 0
    const total_paise = subtotal_paise + tax_paise + delivery_fee_paise

    // 4. Generate order number
    const todayStr = new Date().toISOString().slice(0, 10).replace(/-/g, '')
    const randSuffix = Math.floor(1000 + Math.random() * 9000).toString()
    const order_number = `PM${todayStr}${randSuffix}`

    // 5. Insert order
    const initialStatus = payment_method === 'cod' || payment_method === 'pay_at_shop'
      ? 'confirmed'
      : 'pending_confirmation'

    const { data: order, error: orderErr } = await serviceClient
      .from('orders')
      .insert({
        order_number,
        user_id: user.id,
        status: initialStatus,
        fulfillment_method,
        delivery_address: fulfillment_method === 'delivery' ? delivery_address : null,
        delivery_zone_id: zone_id,
        pickup_slot_id: fulfillment_method === 'pickup' ? pickup_slot_id : null,
        subtotal_paise,
        tax_paise,
        discount_paise,
        delivery_fee_paise,
        total_paise,
        payment_method,
        payment_status: 'pending',
        customer_note: customer_note || null,
      })
      .select('*')
      .single()

    if (orderErr || !order) {
      console.error('Order creation error:', orderErr)
      return NextResponse.json({ error: 'Failed to create order', details: orderErr?.message }, { status: 500 })
    }

    // 6. Insert order items
    const orderItemsToInsert = cartCalc.items.map((item) => ({
      order_id: order.id,
      product_id: item.product_id,
      product_name: item.product_name,
      product_sku: item.product_sku,
      product_unit: item.product_unit,
      quantity: item.quantity,
      unit_price_paise: item.unit_price_paise,
      tax_rate_percent: item.tax_rate_percent,
      tax_paise: item.tax_paise,
      line_total_paise: item.line_total_paise,
    }))

    const { error: itemsErr } = await serviceClient
      .from('order_items')
      .insert(orderItemsToInsert)

    if (itemsErr) {
      console.error('Order items error:', itemsErr)
    }

    // 7. Record status history
    await serviceClient
      .from('order_status_history')
      .insert({
        order_id: order.id,
        from_status: null,
        to_status: initialStatus,
        note: `Order placed via ${payment_method.toUpperCase()}`,
        changed_by: user.id,
      })

    // 8. Deduct inventory & record movement
    for (const item of cartCalc.items) {
      try {
        const { data: currentInv } = await serviceClient
          .from('inventory')
          .select('quantity_available')
          .eq('product_id', item.product_id)
          .single()

        if (currentInv) {
          const newQty = Math.max(0, currentInv.quantity_available - item.quantity)
          await serviceClient
            .from('inventory')
            .update({ quantity_available: newQty, updated_at: new Date().toISOString() })
            .eq('product_id', item.product_id)

          await serviceClient
            .from('inventory_movements')
            .insert({
              product_id: item.product_id,
              quantity_change: -item.quantity,
              movement_type: 'sale',
              reference_id: order.id,
              reference_type: 'order',
              note: `Sold in order ${order.order_number}`,
            })
        }
      } catch (invErr) {
        console.warn(`Failed to deduct inventory for ${item.product_id}:`, invErr)
      }
    }

    // 9. Clear user's cart in DB
    const { data: userCart } = await serviceClient
      .from('carts')
      .select('id')
      .eq('user_id', user.id)
      .single()

    if (userCart) {
      await serviceClient
        .from('cart_items')
        .delete()
        .eq('cart_id', userCart.id)
    }

    // 10. Handle Razorpay or Online payment setup
    let razorpay_order = null
    const razorpay = getRazorpayInstance()

    if ((payment_method === 'razorpay' || payment_method === 'upi') && razorpay) {
      try {
        // Razorpay amount in paise (integer)
        razorpay_order = await razorpay.orders.create({
          amount: total_paise,
          currency: 'INR',
          receipt: order.order_number,
          notes: {
            order_id: order.id,
            user_id: user.id,
          },
        })

        // Record initial payment record
        await serviceClient.from('payments').insert({
          order_id: order.id,
          payment_method,
          status: 'pending',
          provider_order_id: razorpay_order.id,
          amount_paise: total_paise,
          currency: 'INR',
        })
      } catch (rzpErr) {
        console.error('Razorpay order creation error:', rzpErr)
        // Order remains in pending state
      }
    }

    // 11. Send notification email to store admin (paanmandii@gmail.com)
    try {
      await sendOrderNotificationEmail({
        orderNumber: order.order_number,
        customerEmail: user.email,
        fulfillmentMethod: order.fulfillment_method,
        deliveryAddress: order.delivery_address,
        items: cartCalc.items.map((it) => ({
          name: it.product_name,
          quantity: it.quantity,
          unit: it.product_unit,
          lineTotalFormatted: formatPrice(it.line_total_paise),
        })),
        subtotalFormatted: formatPrice(order.subtotal_paise),
        deliveryFeeFormatted: formatPrice(order.delivery_fee_paise),
        totalFormatted: formatPrice(order.total_paise),
        paymentMethod: order.payment_method,
        customerNote: order.customer_note,
      })
    } catch (emailErr) {
      console.warn('Failed to dispatch order notification email:', emailErr)
    }

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        order_number: order.order_number,
        total_paise: order.total_paise,
        subtotal_paise: order.subtotal_paise,
        tax_paise: order.tax_paise,
        delivery_fee_paise: order.delivery_fee_paise,
        payment_method: order.payment_method,
        status: order.status,
      },
      razorpay_order_id: razorpay_order?.id || null,
      razorpay_key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID || null,
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal Server Error'
    console.error('Checkout processing error:', err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
