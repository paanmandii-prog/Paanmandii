import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { formatPrice } from '@/lib/utils'
import {
  ShoppingBag,
  Clock,
  CheckCircle,
  Truck,
  Package,
  XCircle,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react'

export const metadata = {
  title: 'Order History | PAAN MANDI',
  description: 'View and track your PAAN MANDI wholesale supply orders.',
}

const STATUS_BADGES: Record<string, { label: string; color: string }> = {
  pending_confirmation: { label: 'Pending Confirmation', color: 'bg-amber-100 text-amber-800' },
  confirmed: { label: 'Confirmed', color: 'bg-blue-100 text-blue-800' },
  preparing: { label: 'Preparing', color: 'bg-purple-100 text-purple-800' },
  ready_for_pickup: { label: 'Ready for Pickup', color: 'bg-indigo-100 text-indigo-800' },
  out_for_delivery: { label: 'Out for Delivery', color: 'bg-cyan-100 text-cyan-800' },
  completed: { label: 'Delivered', color: 'bg-emerald-100 text-emerald-800' },
  cancelled: { label: 'Cancelled', color: 'bg-rose-100 text-rose-800' },
  payment_failed: { label: 'Payment Failed', color: 'bg-rose-100 text-rose-800' },
}

export default async function OrderHistoryPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?redirect=/account/orders')
  }

  const { data: orders } = await supabase
    .from('orders')
    .select(`
      *,
      order_items(id, product_name, quantity, product_unit, line_total_paise)
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="bg-gray-50/60 min-h-screen py-8 md:py-12">
      <div className="container-site max-w-4xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900">
              Wholesale Order History
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              Track past and current shipments from the Mandi
            </p>
          </div>

          <Link
            href="/account"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-green-700"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Account Overview
          </Link>
        </div>

        {!orders || orders.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center">
            <ShoppingBag className="mx-auto h-12 w-12 text-gray-400 mb-3" />
            <h3 className="text-lg font-bold text-gray-900 mb-1">No Orders Placed Yet</h3>
            <p className="text-sm text-gray-500 max-w-sm mx-auto mb-6">
              When you purchase wholesale supplies, your invoices and trackable dispatches will appear here.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 rounded-xl bg-green-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-green-800 transition"
            >
              Start Wholesale Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const badge = STATUS_BADGES[order.status] || {
                label: order.status,
                color: 'bg-gray-100 text-gray-800',
              }
              const dateStr = new Date(order.created_at).toLocaleDateString('en-IN', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })

              return (
                <div
                  key={order.id}
                  className="rounded-2xl border border-gray-200 bg-white p-5 shadow-2xs hover:shadow-sm transition"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
                    <div>
                      <div className="text-xs text-gray-500">Order Reference</div>
                      <div className="text-base font-black text-gray-900">
                        {order.order_number}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${badge.color}`}>
                        {badge.label}
                      </span>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs text-gray-500">{dateStr}</span>
                    </div>
                  </div>

                  <div className="py-4">
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      Items Ordered ({order.order_items?.length || 0})
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {order.order_items?.map((item: any) => (
                        <span
                          key={item.id}
                          className="rounded-lg bg-gray-50 border border-gray-100 px-2.5 py-1 text-xs text-gray-700"
                        >
                          {item.product_name} × <strong>{item.quantity} {item.product_unit}</strong>
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex items-baseline gap-2">
                      <span className="text-xs text-gray-500">Total Amount:</span>
                      <span className="text-lg font-black text-green-800">
                        {formatPrice(order.total_paise)}
                      </span>
                      <span className="text-[11px] text-gray-400">
                        ({order.payment_method?.toUpperCase()} • {order.payment_status})
                      </span>
                    </div>

                    <Link
                      href={`/account/orders/${order.id}`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-green-700 hover:text-green-800 hover:underline"
                    >
                      View Invoice Details
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
