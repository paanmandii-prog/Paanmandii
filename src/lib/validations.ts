import { z } from 'zod'

// ------ Auth Schemas ------

export const loginSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export const registerSchema = z
  .object({
    full_name: z.string().min(2, 'Name must be at least 2 characters').max(100),
    email: z.string().email('Enter a valid email address'),
    mobile: z
      .string()
      .regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian mobile number'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
      .regex(/[0-9]/, 'Must contain at least one number'),
    confirm_password: z.string(),
    shop_name: z.string().max(200).optional(),
    gstin: z
      .string()
      .regex(
        /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
        'Enter a valid 15-character GSTIN'
      )
      .optional()
      .or(z.literal('')),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: 'Passwords do not match',
    path: ['confirm_password'],
  })

export const forgotPasswordSchema = z.object({
  email: z.string().email('Enter a valid email address'),
})

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
      .regex(/[0-9]/, 'Must contain at least one number'),
    confirm_password: z.string(),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: 'Passwords do not match',
    path: ['confirm_password'],
  })

// ------ Profile Schemas ------

export const profileUpdateSchema = z.object({
  full_name: z.string().min(2).max(100),
  mobile: z
    .string()
    .regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit mobile number')
    .optional()
    .or(z.literal('')),
  shop_name: z.string().max(200).optional().or(z.literal('')),
  gstin: z
    .string()
    .regex(
      /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
      'Enter a valid GSTIN'
    )
    .optional()
    .or(z.literal('')),
})

// ------ Address Schema ------

export const addressSchema = z.object({
  label: z.string().min(1).max(50).default('Home'),
  recipient_name: z.string().min(2).max(100),
  mobile: z
    .string()
    .regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit mobile number'),
  line1: z.string().min(5).max(200),
  line2: z.string().max(200).optional().or(z.literal('')),
  city: z.string().min(2).max(100),
  state: z.string().min(2).max(100),
  pincode: z.string().regex(/^[0-9]{6}$/, 'Enter a valid 6-digit PIN code'),
  landmark: z.string().max(200).optional().or(z.literal('')),
  is_default: z.boolean().default(false),
})

// ------ Cart Schemas ------

export const addToCartSchema = z.object({
  product_id: z.string().uuid(),
  quantity: z.number().int().positive(),
})

export const updateCartItemSchema = z.object({
  product_id: z.string().uuid().optional(),
  cart_item_id: z.string().uuid().optional(),
  quantity: z.number().int().min(0), // 0 = remove
})

// ------ Checkout Schema ------

export const checkoutSchema = z.discriminatedUnion('fulfillment_method', [
  z.object({
    fulfillment_method: z.literal('delivery'),
    delivery_address_id: z.string().uuid('Select a delivery address'),
    payment_method: z.enum(['cod', 'razorpay', 'upi']),
    customer_note: z.string().max(500).optional(),
  }),
  z.object({
    fulfillment_method: z.literal('pickup'),
    pickup_slot_id: z.string().uuid('Select a pickup slot'),
    payment_method: z.enum(['pay_at_shop', 'razorpay', 'upi']),
    customer_note: z.string().max(500).optional(),
  }),
])

// ------ Product Admin Schemas ------

export const productSchema = z.object({
  sku: z.string().min(1).max(50).toUpperCase(),
  name: z.string().min(2).max(200),
  slug: z.string().min(2).max(200),
  description: z.string().max(5000).optional(),
  category_id: z.string().uuid().optional().nullable(),
  unit: z.string().min(1).max(50),
  base_price_paise: z.number().int().nonnegative(),
  mrp_paise: z.number().int().nonnegative().optional().nullable(),
  min_order_qty: z.number().int().positive().default(1),
  qty_increment: z.number().int().positive().default(1),
  tax_rate_percent: z.number().min(0).max(100).default(0),
  hsn_code: z.string().max(20).optional(),
  is_active: z.boolean().default(true),
  is_featured: z.boolean().default(false),
  is_popular: z.boolean().default(false),
  meta_title: z.string().max(200).optional(),
  meta_description: z.string().max(300).optional(),
})

export const priceTierSchema = z.object({
  min_qty: z.number().int().positive(),
  max_qty: z.number().int().positive().optional().nullable(),
  price_paise: z.number().int().nonnegative(),
})

export const inventoryAdjustmentSchema = z.object({
  product_id: z.string().uuid(),
  quantity_change: z.number().int(),
  movement_type: z.enum(['received', 'adjustment', 'return']),
  note: z.string().max(500).optional(),
})

// ------ Contact Schema ------

export const contactSchema = z.object({
  name: z.string().min(2).max(100),
  mobile: z
    .string()
    .regex(/^[6-9]\d{9}$/, 'Enter a valid mobile number'),
  email: z.string().email().optional().or(z.literal('')),
  subject: z.string().min(5).max(200),
  message: z.string().min(10).max(2000),
})

// ------ Type exports ------

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>
export type AddressInput = z.infer<typeof addressSchema>
export type AddToCartInput = z.infer<typeof addToCartSchema>
export type UpdateCartItemInput = z.infer<typeof updateCartItemSchema>
export type CheckoutInput = z.infer<typeof checkoutSchema>
export type ProductInput = z.infer<typeof productSchema>
export type PriceTierInput = z.infer<typeof priceTierSchema>
export type InventoryAdjustmentInput = z.infer<typeof inventoryAdjustmentSchema>
export type ContactInput = z.infer<typeof contactSchema>
