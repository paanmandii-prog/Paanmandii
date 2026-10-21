import { FileText, ShieldAlert } from 'lucide-react'

export const metadata = {
  title: 'Terms & Conditions | PAAN MANDI',
  description: 'Terms of service and wholesale business regulations governing PAAN MANDI transactions.',
}

export default function TermsPage() {
  return (
    <div className="bg-gray-50/60 min-h-screen py-10 md:py-16">
      <div className="container-site max-w-3xl">
        <div className="rounded-3xl border border-gray-200 bg-white p-8 sm:p-10 shadow-xs space-y-6 text-sm text-gray-700 leading-relaxed">
          <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-700">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-gray-900">
                Terms & Conditions
              </h1>
              <p className="text-xs text-gray-500">Effective Date: October 2026</p>
            </div>
          </div>

          <div className="rounded-2xl border border-red-200 bg-red-50/70 p-4 text-xs text-red-950">
            <strong>Statutory Compliance Disclaimer:</strong> PAAN MANDI strictly sells legally permitted agricultural produce (paan leaves), culinary food preparation items (edible kattha, chuna), permitted supari varieties, and commercial packaging supplies. We do not sell banned substances or contraband products.
          </div>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-gray-900">1. Commercial Buyer Eligibility</h2>
            <p>
              By accessing and creating an account on PAAN MANDI, you affirm that you are at least 18 years of age and operating an authentic business or shop purchasing products for commercial preparation, retail sale, or packaging purposes.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-gray-900">2. Wholesale Minimum Order Quantities</h2>
            <p>
              Prices listed on PAAN MANDI are wholesale rates calculated based on specified Minimum Order Quantities (MOQ). Orders failing to satisfy the mandatory MOQ or stepped packaging increments cannot be processed.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-gray-900">3. Market Pricing Variations</h2>
            <p>
              Due to agricultural fluctuations in fresh paan mandi yields and climate changes, base prices and volume tiers are subject to change. Confirmed and paid orders will be fulfilled at the locked purchase price.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-gray-900">4. Governing Law & Jurisdiction</h2>
            <p>
              These Terms and any disputes arising out of wholesale purchase agreements shall be governed by and construed in accordance with the laws of India, under the jurisdiction of competent courts in Uttar Pradesh.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
