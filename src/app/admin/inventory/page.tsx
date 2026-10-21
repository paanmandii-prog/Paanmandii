import { createServiceClient } from '@/lib/supabase/server'
import AdminInventoryTable from '@/components/admin/AdminInventoryTable'
import { Layers } from 'lucide-react'

export const metadata = {
  title: 'Inventory & Stock Control | PAAN MANDI Admin',
  description: 'Manage warehouse inventory, record stock arrivals, and adjust buffer levels.',
}

export default async function AdminInventoryPage() {
  const serviceClient = await createServiceClient()

  const { data: products } = await serviceClient
    .from('products')
    .select(`
      id,
      name,
      sku,
      unit,
      category:categories(name),
      inventory(id, quantity_available, quantity_reserved, allow_backorder)
    `)
    .eq('is_active', true)
    .order('name', { ascending: true })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
          Stock & Inventory Management
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Adjust current warehouse units, log morning harvest arrivals, and prevent stock-outs
        </p>
      </div>

      <AdminInventoryTable initialItems={products || []} />
    </div>
  )
}
