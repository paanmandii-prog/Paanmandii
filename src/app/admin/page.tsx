import { createServiceClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { formatPrice } from '@/lib/utils'
import {
  DollarSign,
  ShoppingBag,
  Clock,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Package,
} from 'lucide-react'

export default async function AdminDashboardPage() {
  const serviceClient = await createServiceClient()

  // 1. Fetch Orders for metrics
  const { data: orders } = await serviceClient
    .from('orders')
    .select('id, order_number, status, total_paise, created_at, payment_status, payment_method')
    .order('created_at', { ascending: false })

  const allOrders: any[] = orders || []
  const totalRevenuePaise = allOrders.reduce((sum: number, o: any) => sum + (o.total_paise || 0), 0)
  const pendingOrders = allOrders.filter(
    (o: any) => o.status === 'pending_confirmation' || o.status === 'confirmed' || o.status === 'preparing'
  )

  // 2. Fetch Low Stock products
  const { data: invList } = await serviceClient
    .from('inventory')
    .select(`
      id,
      quantity_available,
      product:products(id, name, unit, sku)
    `)
    .lt('quantity_available', 50)

  const lowStockCount = invList?.length || 0
  const recentOrders = allOrders.slice(0, 8)

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            Mandi Overview & Analytics
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Real-time wholesale orders, inventory alerts, and commercial revenue
          </p>
        </div>

        <div className="flex gap-2.5">
          <Link
            href="/admin/orders"
            className="rounded-xl bg-green-700 px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-green-800 transition"
          >
            Manage Orders
          </Link>
          <Link
            href="/admin/inventory"
            className="rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-xs font-bold text-gray-700 shadow-2xs hover:bg-gray-50 transition"
          >
            Adjust Stock
          </Link>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Sales</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-gray-900">
            {formatPrice(totalRevenuePaise)}
          </div>
          <div className="mt-2 text-[11px] text-gray-400">Total gross wholesale volume</div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Orders</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
              <ShoppingBag className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-gray-900">
            {allOrders.length}
          </div>
          <div className="mt-2 text-[11px] text-gray-400">Processed through PAAN MANDI</div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Pending Orders</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-700">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-amber-600">
            {pendingOrders.length}
          </div>
          <div className="mt-2 text-[11px] text-gray-400">Requires packing or dispatch</div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Low Stock Alerts</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-50 text-rose-700">
              <AlertTriangle className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-rose-600">
            {lowStockCount}
          </div>
          <div className="mt-2 text-[11px] text-gray-400">Products below buffer threshold</div>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-2xs">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-100">
          <div>
            <h2 className="text-base font-bold text-gray-900">
              Recent Mandi Orders
            </h2>
            <p className="text-xs text-gray-500">Live feed of orders received from paan shops</p>
          </div>
          <Link
            href="/admin/orders"
            className="text-xs font-bold text-green-700 hover:underline flex items-center gap-1"
          >
            View All Orders <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <p className="text-sm text-gray-500 py-6 text-center">No orders received yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-100 text-gray-500 font-semibold uppercase">
                  <th className="pb-3">Order #</th>
                  <th className="pb-3">Date</th>
                  <th className="pb-3">Payment</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Amount</th>
                  <th className="pb-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentOrders.map((order: any) => (
                  <tr key={order.id} className="hover:bg-gray-50/50 transition">
                    <td className="py-3.5 font-bold text-gray-900">
                      {order.order_number}
                    </td>
                    <td className="py-3.5 text-gray-500">
                      {new Date(order.created_at).toLocaleDateString('en-IN', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="py-3.5">
                      <span className="uppercase font-semibold text-gray-700">
                        {order.payment_method}
                      </span>{' '}
                      <span className="text-[10px] text-gray-400">({order.payment_status})</span>
                    </td>
                    <td className="py-3.5">
                      <span className="inline-block rounded-full bg-green-100 px-2.5 py-0.5 text-[10px] font-bold text-green-800 uppercase">
                        {order.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="py-3.5 text-right font-black text-gray-900">
                      {formatPrice(order.total_paise)}
                    </td>
                    <td className="py-3.5 text-right">
                      <Link
                        href={`/admin/orders`}
                        className="text-xs font-bold text-green-700 hover:underline"
                      >
                        Manage
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Content Panels Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Paan History Widget */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-2xs space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-base font-bold text-gray-900">📖 Paan History</h2>
              <p className="text-xs text-gray-500 mt-0.5">4,500 years of culture &amp; tradition</p>
            </div>
            <Link
              href="/admin/paan-history"
              className="text-xs font-bold text-amber-700 hover:underline flex items-center gap-1"
            >
              Explore Timeline <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="space-y-2">
            {[
              { era: '2500+ BCE', label: 'Ancient Origins — Harappan Era', color: 'bg-emerald-100 text-emerald-800' },
              { era: '1200–1700 CE', label: 'Mughal Golden Age', color: 'bg-amber-100 text-amber-800' },
              { era: '2000–Now', label: 'Digital Age — PAAN MANDI', color: 'bg-green-100 text-green-800' },
            ].map((item) => (
              <div
                key={item.era}
                className="flex items-center gap-3 rounded-xl bg-gray-50/70 px-4 py-3 border border-gray-100"
              >
                <span className={`rounded-full text-[10px] font-bold px-2.5 py-0.5 shrink-0 ${item.color}`}>
                  {item.era}
                </span>
                <span className="text-xs font-medium text-gray-700">{item.label}</span>
              </div>
            ))}
          </div>
          <Link
            href="/admin/paan-history"
            className="block w-full text-center rounded-xl bg-amber-50 border border-amber-200 py-2.5 text-xs font-bold text-amber-800 hover:bg-amber-100 transition"
          >
            View All 6 Eras
          </Link>
        </div>

        {/* About Us Widget */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-2xs space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-base font-bold text-gray-900">🌿 About Us</h2>
              <p className="text-xs text-gray-500 mt-0.5">Brand identity &amp; content preview</p>
            </div>
            <Link
              href="/admin/about"
              className="text-xs font-bold text-green-700 hover:underline flex items-center gap-1"
            >
              Manage Content <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="rounded-xl border border-green-100 bg-green-50/50 px-4 py-3 space-y-1">
            <p className="text-[10px] font-bold text-green-700 uppercase tracking-wider">Tagline</p>
            <p className="text-sm font-bold text-gray-900 italic">"Aapki Paan Ki Dukaan, Ab Online!"</p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {[
              { label: 'Shops Served', value: '500+' },
              { label: 'Product SKUs', value: '80+' },
              { label: 'Rating', value: '4.8★' },
              { label: 'Orders/Month', value: '2,000+' },
            ].map((s) => (
              <div key={s.label} className="rounded-xl bg-gray-50 border border-gray-100 px-3 py-2.5">
                <div className="text-base font-black text-gray-900">{s.value}</div>
                <div className="text-[10px] text-gray-400">{s.label}</div>
              </div>
            ))}
          </div>

          <Link
            href="/admin/about"
            className="block w-full text-center rounded-xl bg-green-700 py-2.5 text-xs font-bold text-white hover:bg-green-800 transition"
          >
            Edit Brand Content
          </Link>
        </div>
      </div>
    </div>
  )
}
