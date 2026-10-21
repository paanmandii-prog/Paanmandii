import { createServiceClient } from '@/lib/supabase/server'
import type {
  Product,
  ProductWithDetails,
  ProductPriceTier,
  Inventory,
  CartLineItem,
} from '@/types'
import { getTierPrice, roundPaise } from '@/types'

/** Compute the server-authoritative unit price for a given quantity */
export function computeUnitPrice(
  tiers: ProductPriceTier[],
  quantity: number,
  basePrice: number
): number {
  return getTierPrice(tiers, quantity, basePrice)
}

/** Compute line total including tax */
export function computeLineTotal(
  unitPrice: number,
  quantity: number,
  taxRatePercent: number
): { line_total_paise: number; tax_paise: number } {
  const subtotal = roundPaise(unitPrice * quantity)
  const tax = roundPaise(subtotal * (taxRatePercent / 100))
  return {
    line_total_paise: subtotal + tax,
    tax_paise: tax,
  }
}

/** Server-side cart recalculation — validates prices, stock, and MOQ */
export async function recalculateCart(
  rawItems: Array<{ product_id: string; quantity: number }>
): Promise<{
  items: CartLineItem[]
  errors: string[]
  subtotal_paise: number
  tax_paise: number
  total_paise: number
}> {
  const supabase = await createServiceClient()
  const errors: string[] = []
  const items: CartLineItem[] = []

  for (const raw of rawItems) {
    const { data: product, error } = await supabase
      .from('products')
      .select(`
        *,
        images:product_images(id, url, alt_text, sort_order, is_primary),
        price_tiers:product_price_tiers(id, min_qty, max_qty, price_paise),
        inventory(id, quantity_available, quantity_reserved, allow_backorder),
        category:categories(id, name, slug)
      `)
      .eq('id', raw.product_id)
      .eq('is_active', true)
      .single()

    if (error || !product) {
      errors.push(`Product ${raw.product_id} is no longer available`)
      continue
    }

    const p = product as ProductWithDetails

    // Validate minimum order quantity
    if (raw.quantity < p.min_order_qty) {
      errors.push(
        `${p.name}: minimum order quantity is ${p.min_order_qty} ${p.unit}`
      )
      continue
    }

    // Validate quantity increment
    if ((raw.quantity - p.min_order_qty) % p.qty_increment !== 0) {
      errors.push(
        `${p.name}: quantity must be in multiples of ${p.qty_increment}`
      )
      continue
    }

    // Validate stock
    const inv = p.inventory
    const available = inv?.quantity_available ?? 0
    const canBackorder = inv?.allow_backorder ?? false

    if (!canBackorder && raw.quantity > available) {
      const capped = Math.max(p.min_order_qty, Math.min(available, raw.quantity))
      if (capped < p.min_order_qty || capped === 0) {
        errors.push(`${p.name}: out of stock`)
        continue
      }
      errors.push(
        `${p.name}: only ${available} ${p.unit} available. Quantity adjusted.`
      )
      raw.quantity = capped
    }

    // Compute server-authoritative price
    const unitPrice = computeUnitPrice(
      p.price_tiers,
      raw.quantity,
      p.base_price_paise
    )

    const { line_total_paise, tax_paise } = computeLineTotal(
      unitPrice,
      raw.quantity,
      p.tax_rate_percent
    )

    const primaryImage =
      p.images?.find((img) => img.is_primary) ?? p.images?.[0] ?? null

    items.push({
      product_id: p.id,
      product_name: p.name,
      product_sku: p.sku,
      product_unit: p.unit,
      quantity: raw.quantity,
      unit_price_paise: unitPrice,
      line_total_paise,
      tax_rate_percent: p.tax_rate_percent,
      tax_paise,
      inventory_available: available,
      min_order_qty: p.min_order_qty,
      qty_increment: p.qty_increment,
      image_url: primaryImage?.url ?? null,
    })
  }

  const subtotal_paise = items.reduce(
    (sum, item) =>
      sum + roundPaise(item.unit_price_paise * item.quantity),
    0
  )
  const tax_paise = items.reduce((sum, item) => sum + item.tax_paise, 0)
  const total_paise = subtotal_paise + tax_paise

  return { items, errors, subtotal_paise, tax_paise, total_paise }
}

/** Calculate delivery fee based on configured zone */
export async function calculateDeliveryFee(
  pincode: string,
  subtotalPaise: number
): Promise<{
  zone_id: string | null
  fee_paise: number
  is_serviceable: boolean
  free_delivery: boolean
}> {
  const supabase = await createServiceClient()

  const { data: zone } = await supabase
    .from('delivery_zones')
    .select('*')
    .contains('pincodes', [pincode])
    .eq('is_active', true)
    .single()

  if (!zone) {
    return {
      zone_id: null,
      fee_paise: 0,
      is_serviceable: false,
      free_delivery: false,
    }
  }

  const freeThreshold = zone.free_delivery_threshold_paise
  const free = freeThreshold !== null && subtotalPaise >= freeThreshold

  return {
    zone_id: zone.id,
    fee_paise: free ? 0 : zone.delivery_fee_paise,
    is_serviceable: true,
    free_delivery: free,
  }
}
