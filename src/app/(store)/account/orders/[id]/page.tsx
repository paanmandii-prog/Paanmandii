import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { formatPrice } from '@/lib/utils'
import {
  ArrowLeft,
  FileText,
  MapPin,
  Calendar,
  CreditCard,
  Truck,
  CheckCircle2,
} from 'lucide-react'

interface OrderDetailPageProps {
  params: Promise<{
    id: string
  }>
}

export const metadata = {
  title: 'Order Invoice Details | PAAN MANDI',
  description: 'Itemized wholesale order invoice and delivery summary.',
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect(`/login?redirect=/account/orders/${id}`)
  }

  const { data: order } = await supabase
    .from('orders')
    .select(`
      *,
      order_items(*),
      order_status_history(*)
    `)
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (!order) {
    notFound()
  }

  const deliveryAddress = order.delivery_address as any

  return (
    <div className="bg-gray-50/60 min-h-screen py-8 md:py-12">
      <div className="container-site max-w-4xl">
        {/* Back Link */}
        <div className="mb-6">
          <Link
            href="/account/orders"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-green-700 transition"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Orders
          </Link>
        </div>

        {/* Invoice Header Card */}
        <div className="rounded-3xl border border-gray-200 bg-white p-6 sm:p-8 shadow-xs mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="rounded-full bg-green-100 px-3 py-0.5 text-xs font-bold text-green-800">
                  Wholesale Tax Invoice
                </span>
                <span className="text-xs text-gray-500">
                  Status: <strong className="uppercase text-gray-800">{order.status.replace(/_/g, ' ')}</strong>
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-gray-900">
                Order #{order.order_number}
              </h1>
            </div>

            <div className="text-left sm:text-right text-xs text-gray-500">
              <div>Placed on: <strong>{new Date(order.created_at).toLocaleDateString('en-IN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}</strong></div>
              <div className="mt-1">
                Payment: <strong className="uppercase">{order.payment_method}</strong> ({order.payment_status})
              </div>
            </div>
          </div>

          {/* Delivery & Shipping Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-6 border-b border-gray-100 text-xs">
            <div>
              <h3 className="font-bold text-gray-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-green-700" />
                Shipping / Delivery Address
              </h3>
              {deliveryAddress ? (
                <div className="space-y-1 text-gray-600">
                  <div className="font-bold text-gray-900">{deliveryAddress.recipient_name}</div>
                  {deliveryAddress.shop_name && <div>{deliveryAddress.shop_name}</div>}
                  {deliveryAddress.gstin && (
                    <div className="font-mono text-green-800">GSTIN: {deliveryAddress.gstin}</div>
                  )}
                  <div>{deliveryAddress.line1}</div>
                  {deliveryAddress.line2 && <div>{deliveryAddress.line2}</div>}
                  <div>{deliveryAddress.city}, {deliveryAddress.state} - {deliveryAddress.pincode}</div>
                  <div>Phone: {deliveryAddress.mobile}</div>
                </div>
              ) : (
                <p className="text-gray-500">Self Pickup from Mandi counter selected</p>
              )}
            </div>

            <div>
              <h3 className="font-bold text-gray-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Truck className="h-4 w-4 text-green-700" />
                Fulfillment & Notes
              </h3>
              <div className="space-y-1 text-gray-600">
                <div>Method: <strong className="capitalize">{order.fulfillment_method}</strong></div>
                {order.customer_note && (
                  <div className="mt-2 rounded-xl bg-gray-50 p-2.5 border border-gray-100 text-gray-700">
                    <span className="font-semibold block mb-0.5 text-gray-900">Your Instructions:</span>
                    "{order.customer_note}"
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="py-6 border-b border-gray-100">
            <h3 className="font-bold text-gray-900 uppercase tracking-wider mb-4">
              Itemized Wholesale Supplies
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-gray-200 text-gray-500 font-semibold uppercase">
                    <th className="pb-3">Item Description</th>
                    <th className="pb-3 text-center">Unit Price</th>
                    <th className="pb-3 text-center">Qty</th>
                    <th className="pb-3 text-center">GST Rate</th>
                    <th className="pb-3 text-right">Tax (₹)</th>
                    <th className="pb-3 text-right">Amount (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {order.order_items?.map((item: any) => (
                    <tr key={item.id}>
                      <td className="py-3">
                        <div className="font-bold text-gray-900">{item.product_name}</div>
                        <div className="text-gray-400">SKU: {item.product_sku}</div>
                      </td>
                      <td className="py-3 text-center font-medium">
                        {formatPrice(item.unit_price_paise)} / {item.product_unit}
                      </td>
                      <td className="py-3 text-center font-bold text-gray-900">
                        {item.quantity} {item.product_unit}
                      </td>
                      <td className="py-3 text-center text-gray-600">
                        {item.tax_rate_percent}%
                      </td>
                      <td className="py-3 text-right text-gray-600">
                        {formatPrice(item.tax_paise)}
                      </td>
                      <td className="py-3 text-right font-black text-gray-900">
                        {formatPrice(item.line_total_paise)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Totals Summary */}
          <div className="pt-6 flex justify-end">
            <div className="w-full max-w-xs space-y-2 text-xs">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal (Excl. Tax):</span>
                <span className="font-semibold text-gray-900">{formatPrice(order.subtotal_paise)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Total GST:</span>
                <span className="font-semibold text-gray-900">{formatPrice(order.tax_paise)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery Freight:</span>
                <span className="font-semibold text-gray-900">
                  {order.delivery_fee_paise === 0 ? 'Free' : formatPrice(order.delivery_fee_paise)}
                </span>
              </div>
              <div className="pt-3 border-t border-gray-200 flex justify-between items-baseline text-sm">
                <span className="font-bold text-gray-900">Total Invoice Amount:</span>
                <span className="text-xl font-black text-green-800">{formatPrice(order.total_paise)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
