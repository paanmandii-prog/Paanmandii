import Link from 'next/link'
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Layers,
  Store,
  Leaf,
  LogOut,
  Users,
  BookOpen,
  Info,
} from 'lucide-react'

export const metadata = {
  title: 'Admin Control Center | PAAN MANDI',
  description: 'Wholesale order fulfillment, inventory management, and store management.',
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-100/80 flex flex-col md:flex-row">
      {/* Admin Sidebar */}
      <aside className="w-full md:w-64 bg-gray-900 text-gray-300 flex flex-col shrink-0">
        <div className="p-6 border-b border-gray-800">
          <Link href="/admin" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-green-600 shadow-sm">
              <Leaf className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="text-base font-black text-white tracking-tight">
                PAAN MANDI
              </div>
              <div className="text-[10px] font-semibold text-green-400 uppercase tracking-wider">
                Admin Control
              </div>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1 text-sm font-medium">
          <Link
            href="/admin"
            className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-gray-300 hover:bg-gray-800 hover:text-white transition"
          >
            <LayoutDashboard className="h-4 w-4 text-green-400" />
            Dashboard
          </Link>

          <Link
            href="/admin/orders"
            className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-gray-300 hover:bg-gray-800 hover:text-white transition"
          >
            <ShoppingBag className="h-4 w-4 text-green-400" />
            Orders Management
          </Link>

          <Link
            href="/admin/products"
            className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-gray-300 hover:bg-gray-800 hover:text-white transition"
          >
            <Package className="h-4 w-4 text-green-400" />
            Products & Pricing
          </Link>

          <Link
            href="/admin/inventory"
            className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-gray-300 hover:bg-gray-800 hover:text-white transition"
          >
            <Layers className="h-4 w-4 text-green-400" />
            Stock & Inventory
          </Link>

          <div className="pt-3 pb-1 px-3.5">
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-600">Content</span>
          </div>

          <Link
            href="/admin/paan-history"
            className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-gray-300 hover:bg-gray-800 hover:text-white transition"
          >
            <BookOpen className="h-4 w-4 text-amber-400" />
            Paan History
          </Link>

          <Link
            href="/admin/about"
            className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-gray-300 hover:bg-gray-800 hover:text-white transition"
          >
            <Info className="h-4 w-4 text-blue-400" />
            About Us
          </Link>
        </nav>

        {/* Bottom Storefront & User Links */}
        <div className="p-4 border-t border-gray-800 space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-center gap-2 rounded-xl bg-gray-800 py-2.5 text-xs font-bold text-gray-200 hover:bg-gray-700 hover:text-white transition"
          >
            <Store className="h-4 w-4" />
            View Live Storefront
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
