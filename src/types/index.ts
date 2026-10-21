// ============================================================
// Shared TypeScript types for PAAN MANDI
// ============================================================

// ------ Database Enums ------

export type UserRole = 'customer' | 'staff' | 'admin' | 'super_admin'
export type OrderStatus =
  | 'pending_confirmation'
  | 'confirmed'
  | 'preparing'
  | 'ready_for_pickup'
  | 'out_for_delivery'
  | 'completed'
  | 'cancelled'
  | 'payment_failed'
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded' | 'partial_refund'
export type PaymentMethod = 'cod' | 'pay_at_shop' | 'razorpay' | 'upi'
export type FulfillmentMethod = 'delivery' | 'pickup'
export type InventoryMovementType =
  | 'received'
  | 'sale'
  | 'adjustment'
  | 'return'
  | 'reserved'
  | 'released'

// ------ Database Row Types ------

export interface Profile {
  id: string
  full_name: string
  mobile: string | null
  shop_name: string | null
  gstin: string | null
  avatar_url: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  image_url: string | null
  parent_id: string | null
  sort_order: number
  is_active: boolean
  requires_legal_verification: boolean
  created_at: string
  updated_at: string
}

export interface Product {
  id: string
  sku: string
  name: string
  slug: string
  description: string | null
  category_id: string | null
  unit: string
  base_price_paise: number
  mrp_paise: number | null
  min_order_qty: number
  qty_increment: number
  tax_rate_percent: number
  hsn_code: string | null
  is_active: boolean
  is_featured: boolean
  is_popular: boolean
  requires_legal_verification: boolean
  weight_grams: number | null
  dimensions_cm: Record<string, number> | null
  tags: string[]
  meta_title: string | null
  meta_description: string | null
  source_id?: string | null
  name_hi?: string | null
  name_en?: string | null
  unit_confirmed?: boolean
  pack_size?: string | null
  pack_size_hi?: string | null
  compliance_status?: 'approved' | 'review_required' | 'restricted' | 'rejected'
  compliance_notes?: string | null
  image_status?: 'photographed' | 'representative' | 'placeholder' | 'needs_owner_photo'
  publication_status?: 'published' | 'draft' | 'archived'
  created_at: string
  updated_at: string
}

export interface ProductImage {
  id: string
  product_id: string
  url: string
  alt_text: string | null
  sort_order: number
  is_primary: boolean
  created_at: string
}

export interface ProductPriceTier {
  id: string
  product_id: string
  min_qty: number
  max_qty: number | null
  price_paise: number
  created_at: string
  updated_at: string
}

export interface Inventory {
  id: string
  product_id: string
  quantity_available: number
  quantity_reserved: number
  low_stock_threshold: number
  allow_backorder: boolean
  updated_at: string
}

export interface CartItem {
  id: string
  cart_id: string
  product_id: string
  quantity: number
  created_at: string
  updated_at: string
  // Joined fields
  product?: ProductWithDetails
}

export interface Address {
  id: string
  user_id: string
  label: string
  recipient_name: string
  mobile: string
  line1: string
  line2: string | null
  city: string
  state: string
  pincode: string
  landmark: string | null
  is_default: boolean
  created_at: string
  updated_at: string
}

export interface Order {
  id: string
  order_number: string
  user_id: string
  status: OrderStatus
  fulfillment_method: FulfillmentMethod
  delivery_address: Address | null
  delivery_zone_id: string | null
  delivery_instructions: string | null
  pickup_slot_id: string | null
  pickup_instructions: string | null
  subtotal_paise: number
  tax_paise: number
  discount_paise: number
  delivery_fee_paise: number
  total_paise: number
  payment_method: PaymentMethod
  payment_status: PaymentStatus
  customer_note: string | null
  admin_note: string | null
  cancelled_reason: string | null
  refund_amount_paise: number
  created_at: string
  updated_at: string
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string | null
  product_name: string
  product_sku: string
  product_unit: string
  quantity: number
  unit_price_paise: number
  tax_rate_percent: number
  tax_paise: number
  line_total_paise: number
  created_at: string
}

export interface OrderStatusHistory {
  id: string
  order_id: string
  from_status: OrderStatus | null
  to_status: OrderStatus
  note: string | null
  changed_by: string | null
  created_at: string
}

export interface Payment {
  id: string
  order_id: string
  payment_method: PaymentMethod
  status: PaymentStatus
  provider_order_id: string | null
  provider_payment_id: string | null
  provider_signature: string | null
  amount_paise: number
  currency: string
  refund_amount_paise: number
  refund_id: string | null
  error_code: string | null
  error_description: string | null
  created_at: string
  updated_at: string
}

export interface DeliveryZone {
  id: string
  name: string
  pincodes: string[]
  delivery_fee_paise: number
  free_delivery_threshold_paise: number | null
  estimated_days_min: number | null
  estimated_days_max: number | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface PickupSlot {
  id: string
  day_of_week: number | null
  slot_date: string | null
  slot_start: string
  slot_end: string
  capacity: number
  is_available: boolean
  created_at: string
}

// ------ Composite/Application Types ------

export interface ProductWithDetails extends Product {
  images: ProductImage[]
  price_tiers: ProductPriceTier[]
  inventory: Inventory | null
  category: Category | null
}

export interface CartWithItems {
  id: string
  user_id: string | null
  session_id: string | null
  items: CartItemWithProduct[]
  created_at: string
  updated_at: string
}

export interface CartItemWithProduct extends CartItem {
  product: ProductWithDetails
}

export interface CartSummary {
  items: CartLineItem[]
  subtotal_paise: number
  tax_paise: number
  discount_paise: number
  delivery_fee_paise: number
  total_paise: number
  item_count: number
}

export interface CartLineItem {
  product_id: string
  product_name: string
  product_sku: string
  product_unit: string
  quantity: number
  unit_price_paise: number
  line_total_paise: number
  tax_rate_percent: number
  tax_paise: number
  inventory_available: number
  min_order_qty: number
  qty_increment: number
  image_url: string | null
}

export interface CheckoutPayload {
  fulfillment_method: FulfillmentMethod
  delivery_address_id?: string
  pickup_slot_id?: string
  payment_method: PaymentMethod
  customer_note?: string
}

export interface OrderWithDetails extends Order {
  items: OrderItem[]
  status_history: OrderStatusHistory[]
  payment: Payment | null
}

// ------ Money Utilities ------

/** Convert paise to INR string e.g. 25000 => "₹250.00" */
export function formatPrice(paise: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(paise / 100)
}

/** Get applicable tier price for a given quantity */
export function getTierPrice(
  tiers: ProductPriceTier[],
  quantity: number,
  basePrice: number
): number {
  if (!tiers || tiers.length === 0) return basePrice

  const sorted = [...tiers].sort((a, b) => b.min_qty - a.min_qty)
  const tier = sorted.find((t) => quantity >= t.min_qty)
  return tier ? tier.price_paise : basePrice
}

/** Round paise to nearest integer */
export function roundPaise(value: number): number {
  return Math.round(value)
}

// ------ Order Status Helpers ------

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending_confirmation: 'Pending Confirmation',
  confirmed: 'Confirmed',
  preparing: 'Preparing',
  ready_for_pickup: 'Ready for Pickup',
  out_for_delivery: 'Out for Delivery',
  completed: 'Completed',
  cancelled: 'Cancelled',
  payment_failed: 'Payment Failed',
}

export const VALID_TRANSITIONS: Partial<Record<OrderStatus, OrderStatus[]>> = {
  pending_confirmation: ['confirmed', 'cancelled', 'payment_failed'],
  confirmed: ['preparing', 'cancelled'],
  preparing: ['ready_for_pickup', 'out_for_delivery', 'cancelled'],
  ready_for_pickup: ['completed', 'cancelled'],
  out_for_delivery: ['completed', 'cancelled'],
}

export function canTransition(from: OrderStatus, to: OrderStatus): boolean {
  return VALID_TRANSITIONS[from]?.includes(to) ?? false
}
