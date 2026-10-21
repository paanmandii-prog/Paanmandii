'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { formatPrice } from '@/lib/utils'
import type { ProductWithDetails } from '@/types'
import { useCart } from '@/contexts/CartContext'
import { useLanguage } from '@/contexts/LanguageContext'
import { ShoppingBag, Check, AlertCircle, ShieldAlert, Sparkles } from 'lucide-react'

interface ProductCardProps {
  product: ProductWithDetails
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem, isLoading } = useCart()
  const { language, t } = useLanguage()
  const [isAdding, setIsAdding] = React.useState(false)
  const [justAdded, setJustAdded] = React.useState(false)

  const primaryImage =
    product.images?.find((img) => img.is_primary)?.url ||
    product.images?.[0]?.url ||
    '/images/product-fallback.webp'

  const available = product.inventory?.quantity_available ?? 0
  const isOutOfStock = available <= 0 && !product.inventory?.allow_backorder
  const isComplianceLocked = product.compliance_status === 'review_required' || product.is_active === false

  const handleQuickAdd = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (isOutOfStock || isComplianceLocked) return

    setIsAdding(true)
    try {
      await addItem(product, product.min_order_qty || 1)
      setJustAdded(true)
      setTimeout(() => setJustAdded(false), 2000)
    } finally {
      setIsAdding(false)
    }
  }

  // Display names based on active language
  const primaryName = language === 'hi'
    ? (product.name_hi || product.name)
    : (product.name_en || product.name)

  const secondaryName = language === 'hi'
    ? (product.name_en || product.name)
    : (product.name_hi || null)

  return (
    <div className="product-card group relative flex flex-col bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl overflow-hidden transition-all duration-300 hover:border-[#17643D] hover:shadow-lg hover:-translate-y-1">
      {/* Product Image Link */}
      <Link
        href={`/products/${product.slug}`}
        className="relative block aspect-square w-full overflow-hidden bg-radial from-[#FFFFFF] to-[#F6F8F5]"
      >
        <Image
          src={primaryImage}
          alt={primaryName}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-contain p-2 transition-transform duration-500 group-hover:scale-105"
        />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-start justify-between gap-1 pointer-events-none">
          {/* Source Item Number & SKU */}
          {product.source_id && (
            <span className="rounded-md bg-[#123F2B] text-[#FFFFFF] px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase shadow-2xs">
              #{product.source_id}
            </span>
          )}

          <div className="flex flex-col items-end gap-1">
            {product.is_popular && !isComplianceLocked && (
              <span className="rounded-full bg-[#ECFDF5] border border-[#A7F3D0] text-[#123F2B] px-2 py-0.5 text-[10px] font-bold tracking-wide flex items-center gap-1 shadow-2xs">
                <Sparkles className="h-2.5 w-2.5 text-[#17643D]" />
                {language === 'hi' ? 'लोकप्रिय' : 'Bestseller'}
              </span>
            )}
            {isComplianceLocked && (
              <span className="rounded-full bg-red-50 border border-red-200 text-red-700 px-2 py-0.5 text-[10px] font-bold tracking-wide flex items-center gap-1 shadow-2xs">
                <ShieldAlert className="h-3 w-3" />
                {language === 'hi' ? 'समीक्षाधीन' : 'Restricted'}
              </span>
            )}
            {isOutOfStock && !isComplianceLocked && (
              <span className="rounded-full bg-gray-100 border border-gray-300 text-gray-700 px-2 py-0.5 text-[10px] font-medium tracking-wide">
                {t('outOfStock')}
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* Product Information */}
      <div className="flex flex-1 flex-col p-4 justify-between gap-3 bg-[#FFFFFF]">
        <div className="space-y-1.5">
          {/* Category & SKU header */}
          <div className="flex items-center justify-between gap-1 text-[11px] text-gray-500">
            <span className="font-semibold text-[#2F855A] truncate max-w-[130px]">
              {product.category?.name || 'Mandi'}
            </span>
            <span className="font-mono text-[10px] text-gray-400">
              {product.sku}
            </span>
          </div>

          {/* Bilingual Product Titles */}
          <Link href={`/products/${product.slug}`} className="block group-hover:text-[#17643D] transition-colors">
            <h3 className="font-bold text-[15px] sm:text-[16px] text-[#18251D] leading-snug line-clamp-1">
              {primaryName}
            </h3>
            {secondaryName && secondaryName !== primaryName && (
              <p className="text-xs text-gray-500 font-medium line-clamp-1 mt-0.5">
                {secondaryName}
              </p>
            )}
          </Link>

          {/* Unit Confirmation Status Tag */}
          <div>
            {!product.unit_confirmed ? (
              <span
                className="badge-unconfirmed"
                title={t('unitUnconfirmedTooltip')}
              >
                <AlertCircle className="h-3 w-3 text-amber-600 shrink-0" />
                <span>{t('unitUnconfirmedBadge')}</span>
              </span>
            ) : (
              <span className="text-[11px] text-gray-600 font-medium">
                {product.unit}
              </span>
            )}
          </div>
        </div>

        {/* Price & Action Footer */}
        <div className="pt-3 border-t border-[#E2E8F0] flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="font-sans text-lg sm:text-xl font-black text-[#123F2B]">
                {formatPrice(product.base_price_paise)}
              </span>
              <span className="text-[11px] font-semibold text-[#52734A]">
                {language === 'hi' ? 'प्रति पैक' : 'per pack'}
              </span>
            </div>
            <div className="text-[11px] text-gray-500 font-medium">
              {language === 'hi'
                ? (product.pack_size_hi || product.pack_size || product.unit)
                : (product.pack_size || product.unit)}
            </div>
          </div>

          {/* Quick Add Button or Restricted Status */}
          {isComplianceLocked ? (
            <button
              disabled
              className="inline-flex items-center gap-1 rounded-xl bg-gray-100 text-gray-400 px-3 py-2 text-[11px] font-semibold cursor-not-allowed border border-gray-200"
              title={t('complianceRestrictedMsg')}
            >
              <ShieldAlert className="h-3.5 w-3.5" />
              <span>{language === 'hi' ? 'प्रतिबंधित' : 'Locked'}</span>
            </button>
          ) : (
            <button
              onClick={handleQuickAdd}
              disabled={isOutOfStock || isAdding || isLoading}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#17643D] text-[#FFFFFF] px-3.5 py-2 text-[12px] font-bold transition-all hover:bg-[#123F2B] active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed shadow-2xs hover:shadow-xs"
              aria-label={`Add ${primaryName} to cart`}
            >
              {justAdded ? (
                <>
                  <Check className="h-3.5 w-3.5 text-[#C49746]" />
                  <span>{t('added')}</span>
                </>
              ) : isAdding ? (
                <span>...</span>
              ) : (
                <>
                  <ShoppingBag className="h-3.5 w-3.5" />
                  <span>{t('addToCart')}</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
