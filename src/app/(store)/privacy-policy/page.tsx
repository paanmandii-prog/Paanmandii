import { ShieldCheck, Lock } from 'lucide-react'

export const metadata = {
  title: 'Privacy Policy | PAAN MANDI',
  description: 'How PAAN MANDI collects, uses, and safeguards your wholesale business details.',
}

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-gray-50/60 min-h-screen py-10 md:py-16">
      <div className="container-site max-w-3xl">
        <div className="rounded-3xl border border-gray-200 bg-white p-8 sm:p-10 shadow-xs space-y-6 text-sm text-gray-700 leading-relaxed">
          <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-700">
              <Lock className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-gray-900">
                Privacy Policy
              </h1>
              <p className="text-xs text-gray-500">Effective Date: October 2026</p>
            </div>
          </div>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-gray-900">1. Information We Collect</h2>
            <p>
              We collect business identification details necessary to fulfill wholesale commercial orders, including Proprietor Name, Business/Shop Name, Delivery Address, Mobile Number, Email Address, and optional GSTIN.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-gray-900">2. How We Use Business Data</h2>
            <p>
              Your data is exclusively used to process wholesale orders, generate legal GST invoices, coordinate local freight transport, and provide order dispatch tracking via SMS or WhatsApp.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-gray-900">3. Data Security & Storage</h2>
            <p>
              Authentication and database records are securely stored using enterprise-grade encryption. Payment credentials are never stored on our servers; they are processed securely through RBI-compliant payment gateway partners (Razorpay).
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
