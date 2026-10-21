import Link from 'next/link'
import {
  CheckCircle2,
  Package,
  Truck,
  ArrowRight,
  ShoppingBag,
  MessageCircle,
  FileCheck,
} from 'lucide-react'

interface OrderSuccessPageProps {
  searchParams: Promise<{
    order_number?: string
  }>
}

export const metadata = {
  title: 'Order Placed Successfully | PAAN MANDI',
  description: 'Your wholesale order has been confirmed and submitted for Mandi packing.',
}

export default async function OrderSuccessPage({ searchParams }: OrderSuccessPageProps) {
  const params = await searchParams
  const orderNumber = params.order_number || 'PM-CONFIRMED'

  return (
    <div className="bg-gray-50/60 min-h-[80vh] py-12 md:py-20 flex items-center justify-center">
      <div className="container-site max-w-xl">
        <div className="rounded-3xl border border-gray-200 bg-white p-8 sm:p-10 text-center shadow-lg">
          {/* Success Checkmark Icon */}
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 shadow-inner">
            <CheckCircle2 className="h-12 w-12" />
          </div>

          <div className="inline-block rounded-full bg-green-50 px-3.5 py-1 text-xs font-bold text-green-800 mb-3">
            Wholesale Order Confirmed
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mb-2">
            Shukriya! Order Received
          </h1>

          <p className="text-sm text-gray-600 mb-6">
            Your wholesale supply order has been received and sent to our Mandi packing team.
          </p>

          {/* Order Number Box */}
          <div className="rounded-2xl border border-dashed border-green-300 bg-green-50/50 p-4 mb-8">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
              Order Reference Number
            </div>
            <div className="text-2xl font-black text-green-900 tracking-wider">
              {orderNumber}
            </div>
          </div>

          {/* Fulfillment Milestones */}
          <div className="space-y-3 text-left mb-8 rounded-2xl bg-gray-50 p-5 text-xs text-gray-600">
            <div className="flex items-start gap-3">
              <FileCheck className="h-4 w-4 text-green-700 shrink-0 mt-0.5" />
              <div>
                <strong className="text-gray-900">Tax Invoice Generated:</strong> A GST-compliant wholesale invoice is being prepared for your account.
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Package className="h-4 w-4 text-green-700 shrink-0 mt-0.5" />
              <div>
                <strong className="text-gray-900">Fresh Packing:</strong> Leaves and supplies are packed in temperature-controlled bundles.
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Truck className="h-4 w-4 text-green-700 shrink-0 mt-0.5" />
              <div>
                <strong className="text-gray-900">Mandi Dispatch:</strong> Scheduled for immediate departure.
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/account/orders"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-700 px-6 py-3.5 text-sm font-bold text-white shadow-md transition hover:bg-green-800"
            >
              View Order History
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/products"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-6 py-3.5 text-sm font-bold text-gray-700 shadow-2xs transition hover:bg-gray-50"
            >
              <ShoppingBag className="h-4 w-4" />
              Continue Shopping
            </Link>
          </div>

          {/* WhatsApp Support Assistance */}
          <div className="mt-8 pt-6 border-t border-gray-100">
            <a
              href={`https://wa.me/919999999999?text=${encodeURIComponent(
                `Hello PAAN MANDI, I have an inquiry regarding wholesale Order #${orderNumber}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-700 hover:underline"
            >
              <MessageCircle className="h-4 w-4" />
              Need help? Chat with Mandi Manager on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
