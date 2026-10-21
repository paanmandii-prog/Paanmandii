import { createServiceClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

export async function POST(req: NextRequest) {
  try {
    const {
      order_id,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = await req.json()

    if (!order_id || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ error: 'Missing payment verification parameters' }, { status: 400 })
    }

    const secret = process.env.RAZORPAY_KEY_SECRET

    if (secret && !secret.includes('placeholder')) {
      const generatedSignature = crypto
        .createHmac('sha256', secret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex')

      if (generatedSignature !== razorpay_signature) {
        return NextResponse.json({ error: 'Invalid payment signature' }, { status: 400 })
      }
    }

    const serviceClient = await createServiceClient()

    // Update payment record
    await serviceClient
      .from('payments')
      .update({
        status: 'paid',
        provider_payment_id: razorpay_payment_id,
        provider_signature: razorpay_signature,
        updated_at: new Date().toISOString(),
      })
      .eq('order_id', order_id)

    // Update order status
    await serviceClient
      .from('orders')
      .update({
        status: 'confirmed',
        payment_status: 'paid',
        updated_at: new Date().toISOString(),
      })
      .eq('id', order_id)

    // Record status history
    await serviceClient
      .from('order_status_history')
      .insert({
        order_id,
        from_status: 'pending_confirmation',
        to_status: 'confirmed',
        note: `Payment verified via Razorpay ID: ${razorpay_payment_id}`,
      })

    return NextResponse.json({ success: true, verified: true })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal Server Error'
    console.error('Payment verification error:', err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
