import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { ArrowRight, Layers } from 'lucide-react'
import type { Category } from '@/types'

const CATEGORY_EMOJIS: Record<string, string> = {
  'paan-leaves': '🌿',
  'kattha-chuna': '🟤',
  'supari': '🥜',
  'paan-packaging': '📦',
  'paan-shop-supplies': '🛍️',
}

export const metadata = {
  title: 'Wholesale Categories | PAAN MANDI',
  description: 'Browse wholesale paan categories: Paan Leaves, Kattha, Chuna, Supari, and Paan Packaging boxes.',
}

export default async function CategoriesPage() {
  const supabase = await createClient()

  const { data: rawCategories } = await supabase
    .from('categories')
    .select(`
      *,
      products:products(count)
    `)
    .eq('is_active', true)
    .order('sort_order')

  const categories = (rawCategories as Array<Category & { products: [{ count: number }] }>) || []

  return (
    <div className="bg-gray-50/60 min-h-screen py-10 md:py-16">
      <div className="container-site">
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-green-100 px-3.5 py-1 text-xs font-bold text-green-800">
            <Layers className="h-3.5 w-3.5" />
            Product Categories
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Wholesale Categories
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Source high-grade paan leaves, fresh preparation ingredients, and bulk packaging materials directly from Mandi suppliers.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => {
            const emoji = CATEGORY_EMOJIS[cat.slug] || '🍃'
            const count = cat.products?.[0]?.count ?? 0

            return (
              <Link
                key={cat.id}
                href={`/products?category=${cat.slug}`}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-gray-200 bg-white p-7 shadow-xs transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-green-300"
              >
                <div>
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-green-50 text-3xl shadow-inner group-hover:scale-110 transition-transform">
                    {emoji}
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 group-hover:text-green-700 transition-colors">
                    {cat.name}
                  </h2>
                  <p className="mt-2 text-sm text-gray-500 leading-relaxed">
                    {cat.description || 'Wholesale supplier stock ready for instant order.'}
                  </p>
                </div>

                <div className="mt-6 flex items-center justify-between pt-4 border-t border-gray-100 text-xs font-semibold text-green-700">
                  <span>{count} products available</span>
                  <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    View Catalog <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
