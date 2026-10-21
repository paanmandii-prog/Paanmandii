import { createClient, createServiceClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { inventoryAdjustmentSchema } from '@/lib/validations'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const serviceClient = await createServiceClient()

  try {
    const body = await req.json()
    const parsed = inventoryAdjustmentSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })
    }

    const { product_id, quantity_change, movement_type, note } = parsed.data

    // Fetch current inventory
    const { data: inv } = await serviceClient
      .from('inventory')
      .select('id, quantity_available')
      .eq('product_id', product_id)
      .single()

    let newQuantity = quantity_change
    if (inv) {
      newQuantity = Math.max(0, inv.quantity_available + quantity_change)
      await serviceClient
        .from('inventory')
        .update({
          quantity_available: newQuantity,
          updated_at: new Date().toISOString(),
        })
        .eq('product_id', product_id)
    } else {
      await serviceClient
        .from('inventory')
        .insert({
          product_id,
          quantity_available: Math.max(0, quantity_change),
        })
    }

    // Record movement in history
    await serviceClient
      .from('inventory_movements')
      .insert({
        product_id,
        quantity_change,
        movement_type,
        note: note || `Admin inventory adjustment (${movement_type})`,
        created_by: user.id,
      })

    return NextResponse.json({
      success: true,
      new_quantity: newQuantity,
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal Server Error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
