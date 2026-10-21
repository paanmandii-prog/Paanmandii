'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useCart } from '@/contexts/CartContext'
import { formatPrice } from '@/lib/utils'
import {
  ShoppingBag,
  Trash2,
  ArrowRight,
  Minus,
  Plus,
  Truck,
  ShieldCheck,
  AlertTriangle,
  ArrowLeft,
} from 'lucide-react'

const FREE_DELIVERY_THRESHOLD_PAISE = 500000 // Rs. 5,000

export default function CartPage() {
  const { items, summary, isLoading, updateItem, removeItem, clearCart } = useCart()

  if (isLoading) {
    return (
      <div className="container-site py-20 flex flex-col items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-green-700 border-t-transparent mb-4" />
        <p className="text-sm font-medium text-gray-500">Loading wholesale cart...</p>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="bg-gray-50/60 min-h-[70vh] flex items-center justify-center py-16">
        <div className="container-site max-w-lg text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-700">
            <ShoppingBag className="h-10 w-10" />
          </div>
          <h1 className="text-2xl font-black text-gray-900 mb-2">
            Your Cart is Empty
          </h1>
          <p className="text-sm text-gray-500 mb-8 leading-relaxed">
            You haven't added any wholesale paan leaves or shop supplies to your cart yet. Explore our Mandi collection to get started.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 rounded-xl bg-green-700 px-6 py-3.5 text-sm font-bold text-white shadow-md transition hover:bg-green-800 hover:shadow-lg"
          >
            Browse Wholesale Catalog
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    )
  }

  // Free delivery calculation
  const subtotal = summary.subtotal_paise
  const progressPercent = Math.min(100, Math.round((subtotal / FREE_DELIVERY_THRESHOLD_PAISE) * 100))
  const remainingForFree = Math.max(0, FREE_DELIVERY_THRESHOLD_PAISE - subtotal)

  return (
    <div className="bg-gray-50/60 min-h-screen py-8 md:py-12">
      <div className="container-site">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-gray-900 sm:text-3xl">
              Wholesale Shopping Cart
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              Review items, verify volume tiers, and proceed to checkout
            </p>
          </div>

          <button
            onClick={() => clearCart()}
            className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:underline inline-flex items-center gap-1 self-start"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Clear entire cart
          </button>
        </div>

        {/* Free Shipping Progress Bar */}
        <div className="mb-8 rounded-2xl border border-green-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold text-gray-800 mb-2">
            <div className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-green-700" />
              {remainingForFree > 0 ? (
                <span>
                  Add <strong className="text-green-800">{formatPrice(remainingForFree)}</strong> more to qualify for <strong>FREE Wholesale Shipping</strong>!
                </span>
              ) : (
                <span className="text-green-800 font-bold">
                  🎉 Congratulations! Your order qualifies for FREE Wholesale Shipping!
                </span>
              )}
            </div>
            <span className="text-gray-500">{progressPercent}%</span>
          </div>

          <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
            <div
              className="h-full rounded-full bg-green-600 transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.product_id}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border border-gray-200 bg-white p-4 sm:p-5 shadow-2xs"
              >
                {/* Product info & image */}
                <div className="flex items-center gap-4">
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-gray-100 bg-gray-50">
                    {item.image_url ? (
                      <Image
                        src={item.image_url}
                        alt={item.product_name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-2xl">
                        🌿
                      </div>
                    )}
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-gray-900 sm:text-base">
                      {item.product_name}
                    </h3>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                      <span>SKU: {item.product_sku}</span>
                      <span>•</span>
                      <span>Rate: <strong className="text-gray-900">{formatPrice(item.unit_price_paise)}</strong>/{item.product_unit}</span>
                    </div>
                    {item.tax_rate_percent > 0 && (
                      <span className="mt-1 inline-block text-[11px] text-gray-500">
                        GST: {item.tax_rate_percent}% ({formatPrice(item.tax_paise)})
                      </span>
                    )}
                  </div>
                </div>

                {/* Quantity Controls & Line Total */}
                <div className="flex w-full sm:w-auto items-center justify-between sm:justify-end gap-6 pt-3 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                  {/* Stepper */}
                  <div className="inline-flex items-center rounded-xl border border-gray-200 bg-gray-50">
                    <button
                      type="button"
                      onClick={() => updateItem(item.product_id, item.quantity - item.qty_increment)}
                      disabled={item.quantity <= item.min_order_qty}
                      className="flex h-9 w-9 items-center justify-center rounded-l-xl text-gray-600 transition hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="min-w-12 text-center text-xs font-bold text-gray-900">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateItem(item.product_id, item.quantity + item.qty_increment)}
                      className="flex h-9 w-9 items-center justify-center rounded-r-xl text-gray-600 transition hover:bg-gray-200"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  {/* Line Total */}
                  <div className="text-right min-w-[90px]">
                    <div className="text-sm font-black text-gray-900 sm:text-base">
                      {formatPrice(item.line_total_paise)}
                    </div>
                    <div className="text-[10px] text-gray-500">
                      incl. GST
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={() => removeItem(item.product_id)}
                    className="p-1.5 text-gray-400 hover:text-rose-600 transition"
                    title="Remove item"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}

            <div className="pt-2">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 text-xs font-bold text-green-700 hover:underline"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Continue Shopping
              </Link>
            </div>
          </div>

          {/* Cart Summary Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-2xl border border-gray-200 bg-white p-6 shadow-xs">
              <h2 className="text-base font-bold uppercase tracking-wider text-gray-900 mb-4 pb-3 border-b border-gray-100">
                Order Summary
              </h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({summary.item_count} items)</span>
                  <span className="font-semibold text-gray-900">{formatPrice(summary.subtotal_paise)}</span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>Estimated GST (Applicable Taxes)</span>
                  <span className="font-semibold text-gray-900">{formatPrice(summary.tax_paise)}</span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>Estimated Shipping</span>
                  <span className="font-semibold text-gray-900">
                    {remainingForFree === 0 ? (
                      <span className="text-green-700 font-bold uppercase text-xs">Free</span>
                    ) : (
                      'Calculated at checkout'
                    )}
                  </span>
                </div>

                <div className="pt-3 border-t border-gray-100 flex justify-between items-baseline">
                  <span className="text-base font-bold text-gray-900">Total Amount</span>
                  <span className="text-2xl font-black text-green-800">
                    {formatPrice(summary.total_paise)}
                  </span>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <Link
                  href="/checkout"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-green-700 py-4 px-6 text-base font-bold text-white shadow-md transition hover:bg-green-800 hover:shadow-lg active:scale-98"
                >
                  Proceed to Checkout
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <div className="flex items-center justify-center gap-2 text-[11px] text-gray-500 text-center">
                  <ShieldCheck className="h-4 w-4 text-green-700" />
                  <span>Secure wholesale checkout with GST invoice</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
