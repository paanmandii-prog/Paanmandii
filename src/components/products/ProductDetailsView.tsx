'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { formatPrice } from '@/lib/utils'
import type { ProductWithDetails } from '@/types'
import { getTierPrice } from '@/types'
import { useCart } from '@/contexts/CartContext'
import QuantitySelector from '@/components/products/QuantitySelector'
import PriceTierTable from '@/components/products/PriceTierTable'
import {
  ShoppingBag,
  ShieldCheck,
  Truck,
  Leaf,
  Layers,
  FileText,
  AlertCircle,
  Check,
} from 'lucide-react'

interface ProductDetailsViewProps {
  product: ProductWithDetails
}

export default function ProductDetailsView({ product }: ProductDetailsViewProps) {
  const { addItem, isLoading } = useCart()
  const [quantity, setQuantity] = useState(product.min_order_qty)
  const [selectedImage, setSelectedImage] = useState<string | null>(
    product.images?.find((img) => img.is_primary)?.url ||
    product.images?.[0]?.url ||
    null
  )
  const [isAdding, setIsAdding] = useState(false)
  const [addedSuccess, setAddedSuccess] = useState(false)

  const available = product.inventory?.quantity_available ?? 0
  const isOutOfStock = available <= 0 && !product.inventory?.allow_backorder

  // Calculate current unit price based on selected quantity and price tiers
  const currentUnitPrice = getTierPrice(
    product.price_tiers || [],
    quantity,
    product.base_price_paise
  )

  const subtotalPaise = currentUnitPrice * quantity
  const taxPaise = Math.round(subtotalPaise * (product.tax_rate_percent / 100))
  const lineTotalPaise = subtotalPaise + taxPaise

  const handleAddToCart = async () => {
    if (isOutOfStock) return
    setIsAdding(true)
    try {
      await addItem(product, quantity)
      setAddedSuccess(true)
      setTimeout(() => setAddedSuccess(false), 3000)
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
      {/* Left Column: Image Gallery */}
      <div className="space-y-4">
        <div className="relative aspect-4/3 w-full overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 shadow-xs">
          {selectedImage ? (
            <Image
              src={selectedImage}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-emerald-50 text-6xl">
              🌿
            </div>
          )}

          {isOutOfStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-xs">
              <span className="rounded-xl bg-rose-600 px-4 py-2 text-sm font-bold text-white uppercase tracking-wider shadow-lg">
                Currently Out of Stock
              </span>
            </div>
          )}
        </div>

        {/* Thumbnail Carousel */}
        {product.images && product.images.length > 1 && (
          <div className="flex gap-3 overflow-x-auto pb-2">
            {product.images.map((img) => (
              <button
                key={img.id}
                type="button"
                onClick={() => setSelectedImage(img.url)}
                className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 transition ${
                  selectedImage === img.url
                    ? 'border-green-600 ring-2 ring-green-600/30'
                    : 'border-gray-200 opacity-70 hover:opacity-100'
                }`}
              >
                <Image
                  src={img.url}
                  alt={img.alt_text || product.name}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}

        {/* Wholesale Trust & Dispatch Highlights */}
        <div className="grid grid-cols-2 gap-3 pt-4">
          <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-3.5 shadow-2xs">
            <Truck className="h-5 w-5 text-green-700 shrink-0" />
            <div>
              <div className="text-xs font-bold text-gray-900">Direct Mandi Dispatch</div>
              <div className="text-[11px] text-gray-500">Fast cold-chain dispatch</div>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-3.5 shadow-2xs">
            <ShieldCheck className="h-5 w-5 text-green-700 shrink-0" />
            <div>
              <div className="text-xs font-bold text-gray-900">100% Legal & Genuine</div>
              <div className="text-[11px] text-gray-500">Graded fresh harvest</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Information & Ordering Controls */}
      <div className="space-y-6">
        <div>
          {product.category && (
            <Link
              href={`/products?category=${product.category.slug}`}
              className="mb-2 inline-flex items-center gap-1.5 text-xs font-bold tracking-wider uppercase text-green-700 hover:underline"
            >
              <Leaf className="h-3.5 w-3.5" />
              {product.category.name}
            </Link>
          )}

          <h1 className="text-2xl font-black text-gray-900 sm:text-3xl lg:text-4xl">
            {product.name}
          </h1>

          <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-gray-500">
            <span>SKU: <strong className="text-gray-700">{product.sku}</strong></span>
            {product.hsn_code && (
              <span>HSN: <strong className="text-gray-700">{product.hsn_code}</strong></span>
            )}
            <span>GST: <strong className="text-gray-700">{product.tax_rate_percent}%</strong></span>
          </div>
        </div>

        {/* Dynamic Price Box */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-2xs">
          <div className="flex items-baseline justify-between">
            <div>
              <div className="text-xs font-semibold text-gray-500 mb-1">
                Wholesale Price for {quantity} {product.unit}:
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-gray-900">
                  {formatPrice(currentUnitPrice)}
                </span>
                <span className="text-sm font-semibold text-[#52734A]">
                  / pack {product.pack_size ? `(${product.pack_size})` : `(${product.unit})`}
                </span>
              </div>
            </div>

            {product.mrp_paise && (
              <div className="text-right">
                <div className="text-xs text-gray-600">Standard MRP</div>
                <div className="text-sm text-gray-600 line-through">
                  {formatPrice(product.mrp_paise)}
                </div>
              </div>
            )}
          </div>

          {/* Line Total preview */}
          <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
            <span className="text-gray-500">Estimated Line Total ({quantity} {product.unit} + {product.tax_rate_percent}% GST):</span>
            <span className="text-sm font-bold text-green-800">
              {formatPrice(lineTotalPaise)}
            </span>
          </div>
        </div>

        {/* Price Tier Table */}
        {product.price_tiers && product.price_tiers.length > 0 && (
          <PriceTierTable
            basePricePaise={product.base_price_paise}
            unit={product.unit}
            priceTiers={product.price_tiers}
            currentQuantity={quantity}
          />
        )}

        {/* Quantity Controls & Action */}
        <div className="space-y-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-2xs">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
              Select Wholesale Quantity ({product.unit})
            </label>
            <QuantitySelector
              quantity={quantity}
              onChange={setQuantity}
              minOrderQty={product.min_order_qty}
              qtyIncrement={product.qty_increment}
              maxAvailable={product.inventory?.allow_backorder ? undefined : available}
              unit={product.unit}
            />
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={isOutOfStock || isAdding || isLoading}
              className={`w-full flex items-center justify-center gap-3 rounded-xl py-4 px-6 text-base font-bold shadow-md transition-all ${
                isOutOfStock
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : addedSuccess
                  ? 'bg-emerald-600 text-white'
                  : 'bg-green-700 text-white hover:bg-green-800 active:scale-98 hover:shadow-lg'
              }`}
            >
              {addedSuccess ? (
                <>
                  <Check className="h-5 w-5" />
                  Added to Cart!
                </>
              ) : (
                <>
                  <ShoppingBag className="h-5 w-5" />
                  {isAdding ? 'Adding to Cart...' : `Add ${quantity} ${product.unit} to Cart`}
                </>
              )}
            </button>
          </div>
        </div>

        {/* Product Description & Specifications */}
        {product.description && (
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-2xs">
            <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-gray-900 flex items-center gap-2">
              <FileText className="h-4 w-4 text-green-700" />
              Product Description & Grading
            </h3>
            <div className="prose prose-sm text-gray-600 leading-relaxed whitespace-pre-line">
              {product.description}
            </div>
          </div>
        )}

        {/* Statutory & Quality Notice */}
        <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-4 text-xs text-amber-900">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold mb-1">Mandi Quality & Freshness Guarantee</p>
              <p className="text-amber-800 leading-relaxed">
                All paan leaves are inspected for moisture, freshness, and leaf size before dispatch. Perishable leaves must be unpacked immediately upon receipt.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
