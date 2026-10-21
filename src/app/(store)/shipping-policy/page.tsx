import { Truck, ShieldCheck, Clock, MapPin } from 'lucide-react'

export const metadata = {
  title: 'Shipping Policy | PAAN MANDI',
  description: 'Wholesale delivery windows, freight calculations, and cold-chain shipping details.',
}

export default function ShippingPolicyPage() {
  return (
    <div className="bg-gray-50/60 min-h-screen py-10 md:py-16">
      <div className="container-site max-w-3xl">
        <div className="rounded-3xl border border-gray-200 bg-white p-8 sm:p-10 shadow-xs space-y-6 text-sm text-gray-700 leading-relaxed">
          <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-700">
              <Truck className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-gray-900">
                Wholesale Shipping Policy
              </h1>
              <p className="text-xs text-gray-500">Effective Date: October 2026</p>
            </div>
          </div>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-gray-900">1. Dispatch Windows & Early Morning Shipping</h2>
            <p>
              To maintain the highest grade of fresh paan leaves, all perishable orders are prepared and dispatched between 5:00 AM and 11:00 AM. Orders placed after 6:00 PM are queued for the subsequent morning dispatch window.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-gray-900">2. Freight & Free Delivery Threshold</h2>
            <p>
              Standard wholesale freight is calculated based on consignment weight and destination PIN code. All wholesale orders exceeding <strong>₹5,000</strong> qualify for complimentary delivery within serviceable delivery zones.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-gray-900">3. Leaf Preservation Packaging</h2>
            <p>
              Paan leaves are packed in traditional breathable bamboo and banana leaf bundles to maintain optimal moisture levels. Non-perishable items like packaging boxes and supari are packed in moisture-proof cartons.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-gray-900">4. Delivery Inspection</h2>
            <p>
              Upon arrival, buyers are required to inspect the exterior condition of the crates and verify package seals before signing the delivery manifest.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
