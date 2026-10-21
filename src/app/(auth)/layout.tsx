import Link from 'next/link'
import { Leaf, ShieldCheck, Truck, Store } from 'lucide-react'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-2 mb-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-700 shadow-sm">
            <Leaf className="h-6 w-6 text-white" />
          </div>
          <span className="text-2xl font-black tracking-tight text-gray-900">
            PAAN MANDI
          </span>
        </Link>
        <p className="text-xs font-semibold text-green-700">
          "Aapki Paan Ki Dukaan, Ab Online!"
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 shadow-md rounded-3xl sm:px-10 border border-gray-100">
          {children}
        </div>

        {/* Wholesale Trust Badges */}
        <div className="mt-6 flex items-center justify-center gap-6 text-[11px] text-gray-500">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-green-700" />
            <span>100% Legal Supplies</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Store className="h-4 w-4 text-green-700" />
            <span>Wholesale Rates</span>
          </div>
        </div>
      </div>
    </div>
  )
}
