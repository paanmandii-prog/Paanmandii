import { createServiceClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { formatPrice } from '@/lib/utils'
import { Package, ExternalLink, Plus, Layers } from 'lucide-react'

export const metadata = {
  title: 'Products & Pricing | PAAN MANDI Admin',
  description: 'Manage wholesale paan leaves, tiers, and product listings.',
}

export default async function AdminProductsPage() {
  const serviceClient = await createServiceClient()

  const { data: products } = await serviceClient
    .from('products')
    .select(`
      *,
      category:categories(name, slug),
      inventory(quantity_available),
      price_tiers:product_price_tiers(id, min_qty, price_paise)
    `)
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            Wholesale Products & Pricing
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Catalog items, wholesale volume tiers, and Minimum Order Quantities (MOQ)
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50/70 text-gray-500 font-semibold uppercase">
                <th className="py-3 px-4">Product & SKU</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">MOQ & Unit</th>
                <th className="py-3 px-4">Stock Level</th>
                <th className="py-3 px-4">Volume Tiers</th>
                <th className="py-3 px-4 text-right">Base Rate</th>
                <th className="py-3 px-4 text-center">Live Preview</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products?.map((p: any) => (
                <tr key={p.id} className="hover:bg-gray-50/60 transition">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-gray-900">{p.name}</div>
                    <span className="font-mono text-[10px] text-gray-400">SKU: {p.sku}</span>
                  </td>

                  <td className="py-3.5 px-4 text-gray-700">
                    {p.category?.name || 'Unassigned'}
                  </td>

                  <td className="py-3.5 px-4 font-semibold text-gray-800">
                    {p.min_order_qty} {p.unit}
                    {p.qty_increment > 1 && (
                      <span className="text-[10px] text-gray-400 block font-normal">
                        Step: +{p.qty_increment}
                      </span>
                    )}
                  </td>

                  <td className="py-3.5 px-4">
                    <span
                      className={`font-bold inline-block rounded-md px-2 py-0.5 text-[11px] ${
                        (p.inventory?.quantity_available ?? 0) < 50
                          ? 'bg-rose-50 text-rose-700'
                          : 'bg-emerald-50 text-emerald-700'
                      }`}
                    >
                      {p.inventory?.quantity_available ?? 0} {p.unit}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-gray-600">
                    {p.price_tiers && p.price_tiers.length > 0 ? (
                      <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700">
                        {p.price_tiers.length} Tiers Configured
                      </span>
                    ) : (
                      <span className="text-gray-400 text-[10px]">Flat Base Only</span>
                    )}
                  </td>

                  <td className="py-3.5 px-4 text-right font-black text-gray-900">
                    {formatPrice(p.base_price_paise)}
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <Link
                      href={`/products/${p.slug}`}
                      target="_blank"
                      className="inline-flex p-1.5 text-gray-400 hover:text-green-700 transition"
                      title="Open storefront product page"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
