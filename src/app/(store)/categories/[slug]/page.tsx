import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import ProductCard from '@/components/products/ProductCard'
import type { ProductWithDetails } from '@/types'
import { ChevronRight, Leaf, PackageX } from 'lucide-react'

interface CategoryPageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: cat } = await supabase
    .from('categories')
    .select('name, description')
    .eq('slug', slug)
    .single()

  if (!cat) return { title: 'Category Not Found | PAAN MANDI' }

  return {
    title: `${cat.name} Wholesale Mandi | PAAN MANDI`,
    description: cat.description || `Buy wholesale ${cat.name} online at bulk Mandi prices.`,
  }
}

export default async function CategoryDetailPage({ params }: CategoryPageProps) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: category } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (!category) {
    notFound()
  }

  const { data: rawProducts } = await supabase
    .from('products')
    .select(`
      *,
      images:product_images(id, url, alt_text, is_primary, sort_order),
      price_tiers:product_price_tiers(id, min_qty, max_qty, price_paise),
      inventory(id, quantity_available, allow_backorder),
      category:categories(id, name, slug)
    `)
    .eq('category_id', category.id)
    .eq('is_active', true)
    .order('is_popular', { ascending: false })
    .order('base_price_paise', { ascending: true })

  const products = (rawProducts as ProductWithDetails[]) || []

  return (
    <div className="bg-gray-50/60 min-h-screen py-8 md:py-12">
      <div className="container-site">
        {/* Breadcrumb Trail */}
        <nav className="mb-6 flex items-center gap-2 text-xs font-medium text-gray-500">
          <Link href="/" className="hover:text-green-700 transition">Home</Link>
          <ChevronRight className="h-3 w-3 text-gray-400" />
          <Link href="/categories" className="hover:text-green-700 transition">Categories</Link>
          <ChevronRight className="h-3 w-3 text-gray-400" />
          <span className="text-gray-900 font-semibold">{category.name}</span>
        </nav>

        {/* Category Hero Banner */}
        <div className="mb-10 rounded-3xl bg-gradient-to-r from-green-800 to-emerald-900 p-8 text-white shadow-md sm:p-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur-xs mb-3">
            <Leaf className="h-3.5 w-3.5" />
            Wholesale Department
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">
            {category.name}
          </h1>
          {category.description && (
            <p className="mt-3 max-w-2xl text-base text-green-100/90 leading-relaxed">
              {category.description}
            </p>
          )}
        </div>

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center">
            <PackageX className="h-12 w-12 text-gray-400 mb-3" />
            <h3 className="text-lg font-bold text-gray-900 mb-1">
              No products found in this category
            </h3>
            <p className="text-sm text-gray-500 max-w-sm mb-6">
              Check back soon as new seasonal harvest arrives from the Mandi.
            </p>
            <Link
              href="/products"
              className="rounded-xl bg-green-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-green-800"
            >
              Browse All Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
