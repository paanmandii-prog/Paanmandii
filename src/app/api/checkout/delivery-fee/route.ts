import { NextRequest, NextResponse } from 'next/server'
import { calculateDeliveryFee } from '@/lib/pricing'

// POST /api/checkout/delivery-fee — Calculate delivery fee for pincode
export async function POST(req: NextRequest) {
  try {
    const { pincode, subtotal_paise } = await req.json()

    if (!pincode || !/^\d{6}$/.test(pincode)) {
      return NextResponse.json({
        is_serviceable: false,
        fee_paise: 0,
        free_delivery: false,
        message: 'Enter a valid 6-digit PIN code',
      })
    }

    const result = await calculateDeliveryFee(pincode, subtotal_paise || 0)

    // Fallback: If not explicitly configured in delivery_zones table yet, provide standard wholesale shipping estimate
    if (!result.is_serviceable) {
      const isDefaultFree = (subtotal_paise || 0) >= 500000 // Free delivery over Rs. 5,000
      return NextResponse.json({
        zone_id: null,
        fee_paise: isDefaultFree ? 0 : 25000, // Rs. 250 standard wholesale freight
        is_serviceable: true,
        free_delivery: isDefaultFree,
        message: 'Standard wholesale delivery applicable',
      })
    }

    return NextResponse.json(result)
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal Server Error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
