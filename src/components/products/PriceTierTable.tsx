'use client'

import React from 'react'
import { formatPrice } from '@/lib/utils'
import type { ProductPriceTier } from '@/types'
import { TrendingDown, CheckCircle2 } from 'lucide-react'

interface PriceTierTableProps {
  basePricePaise: number
  unit: string
  priceTiers: ProductPriceTier[]
  currentQuantity: number
}

export default function PriceTierTable({
  basePricePaise,
  unit,
  priceTiers,
  currentQuantity,
}: PriceTierTableProps) {
  if (!priceTiers || priceTiers.length === 0) {
    return null
  }

  // Sort tiers by min_qty ascending
  const sortedTiers = [...priceTiers].sort((a, b) => a.min_qty - b.min_qty)

  return (
    <div className="rounded-xl border border-green-200 bg-green-50/50 p-4">
      <div className="flex items-center gap-2 mb-3">
        <TrendingDown className="h-4 w-4 text-green-700" />
        <h4 className="text-xs font-bold uppercase tracking-wider text-green-900">
          Wholesale Volume Tier Pricing (Save More as You Buy)
        </h4>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-green-200/80 text-green-900/70 font-semibold">
              <th className="pb-2">Order Quantity</th>
              <th className="pb-2">Rate per {unit}</th>
              <th className="pb-2 text-right">Discount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-green-100">
            {/* Base Tier */}
            <tr
              className={`transition-colors ${
                currentQuantity < sortedTiers[0].min_qty
                  ? 'bg-green-100/80 font-bold text-green-950'
                  : 'text-gray-700'
              }`}
            >
              <td className="py-2.5 flex items-center gap-1.5">
                {currentQuantity < sortedTiers[0].min_qty && (
                  <CheckCircle2 className="h-3.5 w-3.5 text-green-700" />
                )}
                1 – {sortedTiers[0].min_qty - 1} {unit}
              </td>
              <td className="py-2.5 font-semibold">{formatPrice(basePricePaise)}</td>
              <td className="py-2.5 text-right text-gray-500">—</td>
            </tr>

            {/* Discounted Tiers */}
            {sortedTiers.map((tier) => {
              const isActive =
                currentQuantity >= tier.min_qty &&
                (tier.max_qty === null || currentQuantity <= tier.max_qty)

              const savingsPaise = basePricePaise - tier.price_paise
              const savingsPercent = Math.round((savingsPaise / basePricePaise) * 100)

              return (
                <tr
                  key={tier.id}
                  className={`transition-colors ${
                    isActive
                      ? 'bg-green-100 font-bold text-green-950'
                      : 'text-gray-700'
                  }`}
                >
                  <td className="py-2.5 flex items-center gap-1.5">
                    {isActive && (
                      <CheckCircle2 className="h-3.5 w-3.5 text-green-700" />
                    )}
                    {tier.min_qty}
                    {tier.max_qty ? ` – ${tier.max_qty}` : '+'} {unit}
                  </td>
                  <td className="py-2.5 font-bold text-green-800">
                    {formatPrice(tier.price_paise)}
                  </td>
                  <td className="py-2.5 text-right">
                    {savingsPercent > 0 ? (
                      <span className="inline-block rounded-full bg-emerald-200/80 px-2 py-0.5 text-[10px] font-bold text-emerald-900">
                        Save {savingsPercent}%
                      </span>
                    ) : (
                      '—'
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
