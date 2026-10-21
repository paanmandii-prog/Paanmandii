import { createServiceClient } from '@/lib/supabase/server'
import AdminOrdersTable from '@/components/admin/AdminOrdersTable'

export const metadata = {
  title: 'Order Management | PAAN MANDI Admin',
  description: 'Fulfill, confirm, dispatch, and track wholesale supply orders.',
}

export default async function AdminOrdersPage() {
  const serviceClient = await createServiceClient()

  const { data: orders } = await serviceClient
    .from('orders')
    .select(`
      *,
      order_items(id, product_name, quantity, product_unit, line_total_paise)
    `)
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
          Wholesale Order Management
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Review buyer orders, update fulfillment stages, and monitor payment verification
        </p>
      </div>

      <AdminOrdersTable initialOrders={orders || []} />
    </div>
  )
}
