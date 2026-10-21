import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import {
  User,
  ShoppingBag,
  Building2,
  FileText,
  Phone,
  Mail,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react'

export const metadata = {
  title: 'My Wholesale Account | PAAN MANDI',
  description: 'Manage your PAAN MANDI wholesale profile, business details, and GST information.',
}

export default async function AccountPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?redirect=/account')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // Get count of recent orders
  const { count: orderCount } = await supabase
    .from('orders')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', user.id)

  return (
    <div className="bg-gray-50/60 min-h-screen py-8 md:py-12">
      <div className="container-site max-w-4xl">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900">
              Wholesale Account Overview
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              Registered business details and account statistics
            </p>
          </div>

          <Link
            href="/account/orders"
            className="inline-flex items-center gap-2 rounded-xl bg-green-700 px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-green-800 transition self-start"
          >
            <ShoppingBag className="h-4 w-4" />
            View Orders ({orderCount || 0})
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Quick Metrics */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-2xs">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
              Total Wholesale Orders
            </div>
            <div className="text-3xl font-black text-gray-900">
              {orderCount || 0}
            </div>
            <p className="mt-2 text-[11px] text-gray-400">
              Orders placed under this account
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-2xs">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
              Buyer Classification
            </div>
            <div className="text-xl font-bold text-green-700 flex items-center gap-1.5 mt-1">
              <ShieldCheck className="h-5 w-5" />
              Verified Wholesale
            </div>
            <p className="mt-2 text-[11px] text-gray-400">
              Eligible for volume Mandi price tiers
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-2xs">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
              Primary Contact
            </div>
            <div className="text-sm font-bold text-gray-900 truncate mt-1">
              {profile?.full_name || user.email?.split('@')[0]}
            </div>
            <div className="text-xs text-gray-500 truncate">
              {user.email}
            </div>
          </div>
        </div>

        {/* Business & GST Details */}
        <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-2xs">
          <h2 className="text-base font-bold text-gray-900 uppercase tracking-wider mb-4 pb-3 border-b border-gray-100 flex items-center gap-2">
            <Building2 className="h-4 w-4 text-green-700" />
            Business & Tax Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
            <div>
              <div className="text-xs font-medium text-gray-500 mb-1">Paan Shop / Business Name</div>
              <div className="font-bold text-gray-900">
                {profile?.shop_name || 'Not provided'}
              </div>
            </div>

            <div>
              <div className="text-xs font-medium text-gray-500 mb-1">Registered GSTIN</div>
              <div className="font-mono font-bold text-gray-900">
                {profile?.gstin || 'Unregistered / Composition Buyer'}
              </div>
            </div>

            <div>
              <div className="text-xs font-medium text-gray-500 mb-1">Mobile Contact</div>
              <div className="font-bold text-gray-900">
                {profile?.mobile ? `+91 ${profile.mobile}` : 'Not provided'}
              </div>
            </div>

            <div>
              <div className="text-xs font-medium text-gray-500 mb-1">Login Email</div>
              <div className="font-bold text-gray-900">
                {user.email}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
