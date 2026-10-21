import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const supabase = await createClient()
  const { searchParams } = new URL(req.url)

  const query = searchParams.get('q') || ''
  const categorySlug = searchParams.get('category') || ''
  const sortBy = searchParams.get('sort') || 'featured' // 'featured', 'price_asc', 'price_desc', 'name'
  const inStockOnly = searchParams.get('in_stock') === 'true'
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10))
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)))
  const offset = (page - 1) * limit

  try {
    let baseQuery = supabase
      .from('products')
      .select(`
        *,
        images:product_images(id, url, alt_text, is_primary, sort_order),
        price_tiers:product_price_tiers(id, min_qty, max_qty, price_paise),
        inventory(id, quantity_available, allow_backorder),
        category:categories(id, name, slug)
      `, { count: 'exact' })
      .eq('is_active', true)

    if (query) {
      baseQuery = baseQuery.or(`name.ilike.%${query}%,description.ilike.%${query}%,sku.ilike.%${query}%`)
    }

    if (categorySlug) {
      // Find category id
      const { data: cat } = await supabase
        .from('categories')
        .select('id')
        .eq('slug', categorySlug)
        .single()

      if (cat) {
        baseQuery = baseQuery.eq('category_id', cat.id)
      }
    }

    if (sortBy === 'price_asc') {
      baseQuery = baseQuery.order('base_price_paise', { ascending: true })
    } else if (sortBy === 'price_desc') {
      baseQuery = baseQuery.order('base_price_paise', { ascending: false })
    } else if (sortBy === 'name') {
      baseQuery = baseQuery.order('name', { ascending: true })
    } else {
      // Default: featured first, then popular, then created_at
      baseQuery = baseQuery
        .order('is_featured', { ascending: false })
        .order('is_popular', { ascending: false })
        .order('created_at', { ascending: false })
    }

    baseQuery = baseQuery.range(offset, offset + limit - 1)

    const { data: products, count, error } = await baseQuery

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    let filtered = products || []
    if (inStockOnly) {
      filtered = filtered.filter(
        (p) => (p.inventory?.quantity_available ?? 0) > 0 || p.inventory?.allow_backorder
      )
    }

    return NextResponse.json({
      products: filtered,
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal Server Error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
