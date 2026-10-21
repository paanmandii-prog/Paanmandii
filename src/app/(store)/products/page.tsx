import { createClient } from '@/lib/supabase/server'
import ProductCard from '@/components/products/ProductCard'
import type { Category, ProductWithDetails } from '@/types'
import { ALL_39_PRODUCTS, MASTER_CATEGORIES } from '@/lib/catalogue-data'
import Link from 'next/link'
import { SlidersHorizontal, PackageX, Sparkles, Search } from 'lucide-react'

interface ProductsPageProps {
  searchParams: Promise<{
    q?: string
    category?: string
    sort?: string
    in_stock?: string
  }>
}

export const metadata = {
  title: 'Wholesale Products Catalog | PAAN MANDI',
  description: 'Browse all 39 wholesale paan supplies, Banarasi leaves, kattha, pure chuna, gulkand, cardamom, and mukhwas at guaranteed mandi rates.',
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams
  const query = (params.q || '').toLowerCase().trim()
  const categorySlug = params.category || ''
  const sortBy = params.sort || 'featured'
  const inStockOnly = params.in_stock === 'true'

  let categories: Category[] = MASTER_CATEGORIES
  let products: ProductWithDetails[] = ALL_39_PRODUCTS

  try {
    const supabase = await createClient()

    // Fetch active categories
    const { data: dbCategories } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('sort_order')

    if (dbCategories && dbCategories.length > 0) {
      categories = dbCategories
    }

    // Try fetching products from DB
    let productsQuery = supabase
      .from('products')
      .select(`
        *,
        images:product_images(id, url, alt_text, is_primary, sort_order),
        price_tiers:product_price_tiers(id, min_qty, max_qty, price_paise),
        inventory(id, quantity_available, allow_backorder),
        category:categories(id, name, slug)
      `)

    const { data: rawProducts } = await productsQuery
    if (rawProducts && rawProducts.length >= 35) {
      products = rawProducts as ProductWithDetails[]
    }
  } catch (err) {
    console.warn('Using master catalogue fallback for /products page:', err)
  }

  // Filter by search query across English, Hindi, and SKU
  if (query) {
    products = products.filter((p) => {
      const matchName = p.name?.toLowerCase().includes(query)
      const matchNameHi = p.name_hi?.toLowerCase().includes(query)
      const matchNameEn = p.name_en?.toLowerCase().includes(query)
      const matchSku = p.sku?.toLowerCase().includes(query)
      const matchSourceId = p.source_id?.includes(query)
      return matchName || matchNameHi || matchNameEn || matchSku || matchSourceId
    })
  }

  // Filter by category slug
  if (categorySlug) {
    products = products.filter((p) => {
      if (categorySlug === 'mukhya-saman') {
        return p.category?.slug === 'mukhya-saman' || (p.source_id && parseInt(p.source_id, 10) <= 26)
      }
      if (categorySlug === 'anya-saman') {
        return p.category?.slug === 'anya-saman' || (p.source_id && parseInt(p.source_id, 10) >= 27)
      }
      return p.category?.slug === categorySlug
    })
  }

  // Filter in-stock only
  if (inStockOnly) {
    products = products.filter(
      (p) => (p.inventory?.quantity_available ?? 0) > 0 || p.inventory?.allow_backorder
    )
  }

  // Sort
  if (sortBy === 'price_asc') {
    products = [...products].sort((a, b) => a.base_price_paise - b.base_price_paise)
  } else if (sortBy === 'price_desc') {
    products = [...products].sort((a, b) => b.base_price_paise - a.base_price_paise)
  } else if (sortBy === 'name') {
    products = [...products].sort((a, b) => (a.name || '').localeCompare(b.name || ''))
  } else {
    // Default: source_id ascending
    products = [...products].sort((a, b) => {
      const idA = parseInt(a.source_id || '999', 10)
      const idB = parseInt(b.source_id || '999', 10)
      return idA - idB
    })
  }

  const currentCategory = categories.find((c) => c.slug === categorySlug)

  return (
    <div className="bg-[#F6F8F5] min-h-screen py-8 md:py-12">
      <div className="container-site">
        {/* Page Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#17643D]">
              <Sparkles className="h-4 w-4" />
              PAAN MANDI 39-Item Rate List
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-[#123F2B] sm:text-4xl">
              {currentCategory ? currentCategory.name : query ? `Search: "${query}"` : 'All Wholesale Mandi Supplies'}
            </h1>
            <p className="mt-1.5 text-sm text-[#18251D]/70">
              {products.length} products available at verified wholesale rates
            </p>
          </div>

          {/* Quick Sort Links */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[#18251D]/60">Sort by:</span>
            <div className="flex items-center gap-1 rounded-xl bg-white p-1 border border-[#E2E8F0] text-xs font-bold shadow-2xs">
              <Link
                href={{ query: { ...params, sort: 'featured' } }}
                className={`rounded-lg px-2.5 py-1.5 transition ${
                  sortBy === 'featured' ? 'bg-[#123F2B] text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Mandi Order
              </Link>
              <Link
                href={{ query: { ...params, sort: 'price_asc' } }}
                className={`rounded-lg px-2.5 py-1.5 transition ${
                  sortBy === 'price_asc' ? 'bg-[#123F2B] text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Price: Low to High
              </Link>
              <Link
                href={{ query: { ...params, sort: 'price_desc' } }}
                className={`rounded-lg px-2.5 py-1.5 transition ${
                  sortBy === 'price_desc' ? 'bg-[#123F2B] text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Price: High to Low
              </Link>
            </div>
          </div>
        </div>

        {/* Layout with Sidebar */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* Filters Sidebar */}
          <aside className="lg:col-span-1 space-y-6">
            <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-2xs">
              <div className="mb-4 flex items-center gap-2 font-bold text-[#123F2B]">
                <SlidersHorizontal className="h-4 w-4 text-[#17643D]" />
                Rate List Categories
              </div>

              <ul className="space-y-1">
                <li>
                  <Link
                    href="/products"
                    className={`flex items-center justify-between rounded-xl px-3 py-2 text-sm font-semibold transition ${
                      !categorySlug
                        ? 'bg-[#ECFDF5] text-[#123F2B] font-bold border border-[#A7F3D0]'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <span>All 39 Products (सभी सामान)</span>
                  </Link>
                </li>
                {categories.map((cat) => {
                  const isActive = categorySlug === cat.slug
                  return (
                    <li key={cat.id}>
                      <Link
                        href={`/products?category=${cat.slug}`}
                        className={`flex items-center justify-between rounded-xl px-3 py-2 text-sm font-medium transition ${
                          isActive
                            ? 'bg-[#ECFDF5] text-[#123F2B] font-bold border border-[#A7F3D0]'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                      >
                        <span>{cat.name}</span>
                      </Link>
                    </li>
                  )
                })}
              </ul>

              <div className="mt-6 pt-5 border-t border-gray-100">
                <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-500">
                  Stock Availability
                </h4>
                <Link
                  href={{
                    query: {
                      ...params,
                      in_stock: inStockOnly ? undefined : 'true',
                    },
                  }}
                  className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    readOnly
                    checked={inStockOnly}
                    className="h-4 w-4 rounded border-gray-300 text-[#17643D] focus:ring-[#17643D]"
                  />
                  <span>In Stock Only</span>
                </Link>
              </div>
            </div>

            {/* Wholesale Buyer Help Banner */}
            <div className="rounded-2xl bg-gradient-to-br from-[#123F2B] to-[#17643D] p-5 text-white shadow-md">
              <h4 className="text-sm font-bold mb-1">Bulk Mandi Dispatch</h4>
              <p className="text-xs text-white/80 leading-relaxed mb-4">
                Need wholesale crates, bundles, or vehicle-level freight dispatch for large paan shops?
              </p>
              <Link
                href="/contact"
                className="inline-block w-full text-center rounded-xl bg-white px-3 py-2 text-xs font-bold text-[#123F2B] transition hover:bg-gray-100 shadow-sm"
              >
                Wholesale Inquiry Desk
              </Link>
            </div>
          </aside>

          {/* Product Grid Area */}
          <main className="lg:col-span-3">
            {products.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center">
                <PackageX className="h-12 w-12 text-gray-400 mb-3" />
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  No products found
                </h3>
                <p className="text-sm text-gray-500 max-w-sm mb-6">
                  We could not find any items matching your selected criteria. Try adjusting your filters or search term.
                </p>
                <Link
                  href="/products"
                  className="rounded-xl bg-[#17643D] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#123F2B]"
                >
                  Clear All Filters
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
