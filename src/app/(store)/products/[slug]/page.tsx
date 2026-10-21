import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import ProductDetailsView from '@/components/products/ProductDetailsView'
import ProductCard from '@/components/products/ProductCard'
import type { ProductWithDetails } from '@/types'
import { ChevronRight } from 'lucide-react'

interface ProductPageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: product } = await supabase
    .from('products')
    .select('name, description, meta_title, meta_description')
    .eq('slug', slug)
    .single()

  if (!product) {
    return { title: 'Product Not Found | PAAN MANDI' }
  }

  return {
    title: product.meta_title || `${product.name} (Wholesale)`,
    description: product.meta_description || product.description?.slice(0, 160) || 'Wholesale paan shop supplies.',
  }
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: product, error } = await supabase
    .from('products')
    .select(`
      *,
      images:product_images(id, url, alt_text, is_primary, sort_order),
      price_tiers:product_price_tiers(id, min_qty, max_qty, price_paise),
      inventory(id, quantity_available, allow_backorder),
      category:categories(id, name, slug)
    `)
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (error || !product) {
    notFound()
  }

  // Fetch related products in the same category
  const { data: relatedRaw } = await supabase
    .from('products')
    .select(`
      *,
      images:product_images(id, url, alt_text, is_primary, sort_order),
      price_tiers:product_price_tiers(id, min_qty, max_qty, price_paise),
      inventory(id, quantity_available, allow_backorder),
      category:categories(id, name, slug)
    `)
    .eq('category_id', product.category_id)
    .neq('id', product.id)
    .eq('is_active', true)
    .limit(4)

  const relatedProducts = (relatedRaw as ProductWithDetails[]) || []

  return (
    <div className="bg-gray-50/60 min-h-screen py-6 md:py-10">
      <div className="container-site">
        {/* Breadcrumb Trail */}
        <nav className="mb-6 flex items-center gap-2 text-xs font-medium text-gray-500">
          <Link href="/" className="hover:text-green-700 transition">
            Home
          </Link>
          <ChevronRight className="h-3 w-3 text-gray-400" />
          <Link href="/products" className="hover:text-green-700 transition">
            Products
          </Link>
          {product.category && (
            <>
              <ChevronRight className="h-3 w-3 text-gray-400" />
              <Link
                href={`/products?category=${product.category.slug}`}
                className="hover:text-green-700 transition"
              >
                {product.category.name}
              </Link>
            </>
          )}
          <ChevronRight className="h-3 w-3 text-gray-400" />
          <span className="text-gray-900 font-semibold truncate max-w-[200px]">
            {product.name}
          </span>
        </nav>

        {/* Product Details Section */}
        <ProductDetailsView product={product as ProductWithDetails} />

        {/* Related Wholesale Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 pt-12 border-t border-gray-200">
            <h2 className="mb-6 text-2xl font-extrabold tracking-tight text-gray-900">
              Related Wholesale Supplies
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
