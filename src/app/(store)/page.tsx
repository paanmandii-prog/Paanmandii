import { createClient } from '@/lib/supabase/server'
import type { Category, ProductWithDetails } from '@/types'
import HomeInteractive from '@/components/home/HomeInteractive'
import { ALL_39_PRODUCTS, MASTER_CATEGORIES } from '@/lib/catalogue-data'

export const dynamic = 'force-dynamic'

async function getHomepageData() {
  try {
    const supabase = await createClient()

    const [categoriesResult, productsResult] = await Promise.all([
      supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('sort_order'),
      supabase
        .from('products')
        .select(`
          *,
          images:product_images(id, url, alt_text, is_primary),
          price_tiers:product_price_tiers(id, min_qty, max_qty, price_paise),
          inventory(quantity_available),
          category:categories(name, slug)
        `)
        .order('source_id', { ascending: true }),
    ])

    const dbCategories = (categoriesResult.data as Category[]) ?? []
    const dbProducts = (productsResult.data as ProductWithDetails[]) ?? []

    // If database already contains the 39 items, use them; otherwise fall back to MASTER catalogue
    const products = dbProducts.length >= 35 ? dbProducts : ALL_39_PRODUCTS
    const categories = dbCategories.length >= 2 ? dbCategories : MASTER_CATEGORIES

    return {
      categories,
      popularProducts: products,
    }
  } catch (err) {
    console.warn('Could not fetch homepage data from Supabase, using defaults:', err)
    return {
      categories: MASTER_CATEGORIES,
      popularProducts: ALL_39_PRODUCTS,
    }
  }
}

export default async function HomePage() {
  const { categories, popularProducts } = await getHomepageData()

  return (
    <main className="flex-1">
      <HomeInteractive
        popularProducts={popularProducts}
        categories={categories}
      />
    </main>
  )
}
