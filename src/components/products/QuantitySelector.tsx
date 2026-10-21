'use client'

import React from 'react'
import { Minus, Plus } from 'lucide-react'

interface QuantitySelectorProps {
  quantity: number
  onChange: (qty: number) => void
  minOrderQty: number
  qtyIncrement: number
  maxAvailable?: number
  unit: string
}

export default function QuantitySelector({
  quantity,
  onChange,
  minOrderQty,
  qtyIncrement,
  maxAvailable,
  unit,
}: QuantitySelectorProps) {
  const handleDecrement = () => {
    const next = quantity - qtyIncrement
    if (next >= minOrderQty) {
      onChange(next)
    }
  }

  const handleIncrement = () => {
    const next = quantity + qtyIncrement
    if (maxAvailable === undefined || next <= maxAvailable) {
      onChange(next)
    }
  }

  const handleManualChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10)
    if (isNaN(val)) return

    // Ensure it's at least minOrderQty
    let safeVal = Math.max(minOrderQty, val)
    if (maxAvailable !== undefined && safeVal > maxAvailable) {
      safeVal = maxAvailable
    }
    // Snap to nearest increment
    const remainder = (safeVal - minOrderQty) % qtyIncrement
    if (remainder !== 0) {
      safeVal = safeVal - remainder + qtyIncrement
    }
    onChange(safeVal)
  }

  // Quick preset multiples
  const presets = [
    minOrderQty,
    minOrderQty * 2,
    minOrderQty * 5,
    minOrderQty * 10,
  ].filter((p, idx, arr) => arr.indexOf(p) === idx && (maxAvailable === undefined || p <= maxAvailable))

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        <div className="inline-flex items-center rounded-xl border border-gray-300 bg-white shadow-xs">
          <button
            type="button"
            onClick={handleDecrement}
            disabled={quantity <= minOrderQty}
            className="flex h-11 w-11 items-center justify-center rounded-l-xl text-gray-600 transition hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Decrease quantity"
          >
            <Minus className="h-4 w-4" />
          </button>

          <input
            type="number"
            value={quantity}
            onChange={handleManualChange}
            min={minOrderQty}
            step={qtyIncrement}
            max={maxAvailable}
            className="h-11 w-20 border-x border-gray-200 text-center font-bold text-gray-900 focus:outline-hidden"
          />

          <button
            type="button"
            onClick={handleIncrement}
            disabled={maxAvailable !== undefined && quantity + qtyIncrement > maxAvailable}
            className="flex h-11 w-11 items-center justify-center rounded-r-xl text-gray-600 transition hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Increase quantity"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>

        <span className="text-sm font-medium text-gray-600">
          {unit}
        </span>
      </div>

      {/* Quick Select Buttons */}
      <div className="flex flex-wrap items-center gap-1.5 pt-1">
        <span className="text-xs text-gray-600 mr-1">Quick Add:</span>
        {presets.map((preset) => (
          <button
            key={preset}
            type="button"
            onClick={() => onChange(preset)}
            className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
              quantity === preset
                ? 'bg-green-700 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {preset} {unit}
          </button>
        ))}
      </div>
    </div>
  )
}
