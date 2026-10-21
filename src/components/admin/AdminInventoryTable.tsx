'use client'

import React, { useState } from 'react'
import { Plus, Minus, Check, Loader2, AlertTriangle, Layers } from 'lucide-react'
import { toast } from 'sonner'

interface AdminInventoryTableProps {
  initialItems: any[]
}

export default function AdminInventoryTable({ initialItems }: AdminInventoryTableProps) {
  const [items, setItems] = useState(initialItems)
  const [adjustingId, setAdjustingId] = useState<string | null>(null)
  const [customDelta, setCustomDelta] = useState<Record<string, number>>({})

  const handleAdjust = async (productId: string, change: number, type: 'received' | 'adjustment' | 'return') => {
    setAdjustingId(productId)
    try {
      const res = await fetch('/api/admin/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_id: productId,
          quantity_change: change,
          movement_type: type,
          note: `Manual stock adjustment: ${change > 0 ? '+' : ''}${change}`,
        }),
      })

      if (res.ok) {
        const data = await res.json()
        setItems((prev) =>
          prev.map((item) =>
            item.id === productId
              ? {
                  ...item,
                  inventory: {
                    ...item.inventory,
                    quantity_available: data.new_quantity,
                  },
                }
              : item
          )
        )
        toast.success(`Inventory updated! New stock: ${data.new_quantity}`)
        setCustomDelta((prev) => ({ ...prev, [productId]: 0 }))
      } else {
        const err = await res.json()
        toast.error(err.error || 'Failed to update stock')
      }
    } catch {
      toast.error('Network error adjusting stock')
    } finally {
      setAdjustingId(null)
    }
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-2xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50/70 text-gray-500 font-semibold uppercase">
              <th className="py-3 px-4">Item & SKU</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Available Stock</th>
              <th className="py-3 px-4">Stock Status</th>
              <th className="py-3 px-4 text-right">Quick Stock In (Received)</th>
              <th className="py-3 px-4 text-right">Quick Stock Out (Damaged)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {items.map((product) => {
              const qty = product.inventory?.quantity_available ?? 0
              const isAdjusting = adjustingId === product.id
              const isLow = qty < 50

              return (
                <tr key={product.id} className="hover:bg-gray-50/60 transition">
                  <td className="py-3.5 px-4 font-bold text-gray-900">
                    <div>{product.name}</div>
                    <span className="font-mono text-[10px] text-gray-400 font-normal">
                      SKU: {product.sku}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-gray-600">
                    {product.category?.name || 'General'}
                  </td>

                  <td className="py-3.5 px-4 font-black text-gray-900 text-sm">
                    {qty} <span className="text-xs font-normal text-gray-500">{product.unit}</span>
                  </td>

                  <td className="py-3.5 px-4">
                    {isLow ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-bold text-rose-700">
                        <AlertTriangle className="h-3 w-3" />
                        Low Buffer
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                        <Check className="h-3 w-3" />
                        In Stock
                      </span>
                    )}
                  </td>

                  {/* Stock In Quick Actions */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="inline-flex items-center gap-1">
                      <button
                        type="button"
                        disabled={isAdjusting}
                        onClick={() => handleAdjust(product.id, 50, 'received')}
                        className="rounded-lg bg-green-50 px-2.5 py-1 text-xs font-bold text-green-700 hover:bg-green-100 transition disabled:opacity-40"
                      >
                        +50
                      </button>
                      <button
                        type="button"
                        disabled={isAdjusting}
                        onClick={() => handleAdjust(product.id, 200, 'received')}
                        className="rounded-lg bg-green-700 px-2.5 py-1 text-xs font-bold text-white hover:bg-green-800 transition disabled:opacity-40"
                      >
                        +200
                      </button>
                    </div>
                  </td>

                  {/* Stock Out Quick Actions */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="inline-flex items-center gap-1">
                      <button
                        type="button"
                        disabled={isAdjusting || qty < 10}
                        onClick={() => handleAdjust(product.id, -10, 'adjustment')}
                        className="rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-bold text-gray-700 hover:bg-gray-200 transition disabled:opacity-40"
                      >
                        -10
                      </button>
                      <button
                        type="button"
                        disabled={isAdjusting || qty < 50}
                        onClick={() => handleAdjust(product.id, -50, 'adjustment')}
                        className="rounded-lg bg-rose-50 px-2.5 py-1 text-xs font-bold text-rose-700 hover:bg-rose-100 transition disabled:opacity-40"
                      >
                        -50
                      </button>
                      {isAdjusting && (
                        <Loader2 className="ml-1 h-3.5 w-3.5 animate-spin text-green-700" />
                      )}
                    </div>
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
