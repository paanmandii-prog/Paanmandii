import { NextRequest, NextResponse } from 'next/server'
import { recalculateCart } from '@/lib/pricing'

// POST /api/cart/guest — Hydrate guest cart items with authoritative prices
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const rawItems: Array<{ product_id: string; quantity: number }> = body.items || []

    if (!Array.isArray(rawItems) || rawItems.length === 0) {
      return NextResponse.json({
        items: [],
        subtotal_paise: 0,
        tax_paise: 0,
        total_paise: 0,
        item_count: 0,
      })
    }

    const result = await recalculateCart(rawItems)

    return NextResponse.json({
      ...result,
      item_count: result.items.reduce((sum, i) => sum + i.quantity, 0),
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal Server Error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
