import { RotateCcw, AlertTriangle, CheckCircle2 } from 'lucide-react'

export const metadata = {
  title: 'Return & Refund Policy | PAAN MANDI',
  description: 'Procedures for claims on transit-damaged paan leaves and defective supplies.',
}

export default function ReturnRefundPolicyPage() {
  return (
    <div className="bg-gray-50/60 min-h-screen py-10 md:py-16">
      <div className="container-site max-w-3xl">
        <div className="rounded-3xl border border-gray-200 bg-white p-8 sm:p-10 shadow-xs space-y-6 text-sm text-gray-700 leading-relaxed">
          <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-700">
              <RotateCcw className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-gray-900">
                Return & Refund Policy
              </h1>
              <p className="text-xs text-gray-500">Effective Date: October 2026</p>
            </div>
          </div>

          <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-4 text-xs text-amber-900">
            <strong>Perishable Goods Notice:</strong> Due to the perishable botanical nature of paan leaves, returns must follow strict inspection protocols upon receipt.
          </div>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-gray-900">1. Fresh Paan Leaves Claims</h2>
            <p>
              If your paan leaves arrive crushed or damaged due to transit mishandling, you must report the issue within <strong>3 hours</strong> of receipt by sending photographic evidence and your Order Reference Number to our WhatsApp support line (+91 98765 43210).
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-gray-900">2. Non-Perishable Supplies & Packaging</h2>
            <p>
              Unopened packaging supplies, boxes, and dry ingredients can be returned within <strong>3 days</strong> of delivery if unopened, sealed in their original cartons, and verified by our logistics team.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-gray-900">3. Refund Processing</h2>
            <p>
              Approved refunds are credited to the original payment source within 3–5 business days, or added as Mandi wallet credit for your next order. For Cash on Delivery orders, refunds are disbursed via direct NEFT/UPI bank transfer.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
