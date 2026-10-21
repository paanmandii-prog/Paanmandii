'use client'

import React, { useState } from 'react'
import { formatPrice } from '@/lib/utils'
import { Search, Filter, Loader2, Check, ChevronDown } from 'lucide-react'
import { toast } from 'sonner'

interface AdminOrdersTableProps {
  initialOrders: any[]
}

const ORDER_STATUSES = [
  'pending_confirmation',
  'confirmed',
  'preparing',
  'ready_for_pickup',
  'out_for_delivery',
  'completed',
  'cancelled',
]

export default function AdminOrdersTable({ initialOrders }: AdminOrdersTableProps) {
  const [orders, setOrders] = useState(initialOrders)
  const [search, setSearch] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId)
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })

      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
        )
        toast.success(`Order status updated to ${newStatus.replace(/_/g, ' ')}`)
      } else {
        const err = await res.json()
        toast.error(err.error || 'Failed to update status')
      }
    } catch {
      toast.error('Network error updating order')
    } finally {
      setUpdatingId(null)
    }
  }

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      !search ||
      o.order_number?.toLowerCase().includes(search.toLowerCase()) ||
      o.delivery_address?.recipient_name?.toLowerCase().includes(search.toLowerCase()) ||
      o.delivery_address?.shop_name?.toLowerCase().includes(search.toLowerCase())

    const matchesStatus =
      selectedStatus === 'all' || o.status === selectedStatus

    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-4">
      {/* Search & Status Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search order #, buyer, or shop..."
            className="w-full rounded-xl border border-gray-300 bg-white pl-10 pr-4 py-2 text-xs text-gray-900 focus:border-green-600 focus:outline-hidden"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 text-xs">
          <button
            onClick={() => setSelectedStatus('all')}
            className={`rounded-xl px-3 py-1.5 font-semibold transition ${
              selectedStatus === 'all'
                ? 'bg-gray-900 text-white'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            All ({orders.length})
          </button>
          {['pending_confirmation', 'confirmed', 'preparing', 'out_for_delivery', 'completed'].map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`rounded-xl px-3 py-1.5 font-semibold capitalize whitespace-nowrap transition ${
                selectedStatus === st
                  ? 'bg-green-700 text-white'
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {st.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50/70 text-gray-500 font-semibold uppercase">
                <th className="py-3 px-4">Order #</th>
                <th className="py-3 px-4">Buyer & Shop</th>
                <th className="py-3 px-4">Date & Method</th>
                <th className="py-3 px-4">Fulfillment Status</th>
                <th className="py-3 px-4 text-right">Invoice Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-500">
                    No orders match your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const addr = order.delivery_address
                  const isUpdating = updatingId === order.id

                  return (
                    <tr key={order.id} className="hover:bg-gray-50/60 transition">
                      <td className="py-4 px-4 font-bold text-gray-900">
                        <div>{order.order_number}</div>
                        <span className="text-[10px] text-gray-400 font-normal">
                          {order.order_items?.length || 0} line items
                        </span>
                      </td>

                      <td className="py-4 px-4">
                        <div className="font-bold text-gray-900">
                          {addr?.recipient_name || 'Buyer'}
                        </div>
                        {addr?.shop_name && (
                          <div className="text-[11px] text-green-800 font-semibold">
                            {addr.shop_name}
                          </div>
                        )}
                        <div className="text-[11px] text-gray-500">
                          {addr?.city || 'Varanasi'}, PIN {addr?.pincode || '221001'}
                        </div>
                      </td>

                      <td className="py-4 px-4 text-gray-600">
                        <div>
                          {new Date(order.created_at).toLocaleDateString('en-IN', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                        <div className="text-[10px] uppercase font-bold text-gray-500 mt-0.5">
                          {order.fulfillment_method} • {order.payment_method}
                        </div>
                      </td>

                      {/* Status Selector Dropdown */}
                      <td className="py-4 px-4">
                        <div className="relative inline-flex items-center">
                          <select
                            value={order.status}
                            disabled={isUpdating}
                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                            className="rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-xs font-bold text-gray-800 shadow-2xs focus:border-green-600 focus:outline-hidden disabled:opacity-50"
                          >
                            {ORDER_STATUSES.map((st) => (
                              <option key={st} value={st}>
                                {st.replace(/_/g, ' ').toUpperCase()}
                              </option>
                            ))}
                          </select>
                          {isUpdating && (
                            <Loader2 className="ml-2 h-3.5 w-3.5 animate-spin text-green-700" />
                          )}
                        </div>
                      </td>

                      <td className="py-4 px-4 text-right">
                        <div className="font-black text-gray-900 text-sm">
                          {formatPrice(order.total_paise)}
                        </div>
                        <div className="text-[10px] text-gray-400">
                          Payment: {order.payment_status}
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
