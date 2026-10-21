import { HelpCircle, ChevronDown } from 'lucide-react'

export const metadata = {
  title: 'Frequently Asked Questions (FAQ) | PAAN MANDI',
  description: 'Answers to common questions about wholesale paan ordering, minimum quantities, freshness, and delivery.',
}

const FAQS = [
  {
    q: 'What is the Minimum Order Quantity (MOQ)?',
    a: 'Because PAAN MANDI is a true wholesale marketplace, every item has an established MOQ (e.g., 50 or 100 Dholi for paan leaves, 5 kg for Kattha/Supari, or 100 pcs for packaging). This enables us to offer direct mandi-floor prices.',
  },
  {
    q: 'How do volume tiered discounts work?',
    a: 'Our wholesale pricing automatically recalculates as your order quantity scales. For example, purchasing 50–99 Dholi qualifies for standard wholesale, while orders of 100+ or 500+ Dholi automatically receive tier 2 and tier 3 discounted rates at checkout.',
  },
  {
    q: 'How are fresh paan leaves preserved during transit?',
    a: 'Leaves are washed, dried, graded, and wrapped in traditional moisture-locking banana leaves and breathable jute packaging. Orders are transported via fast morning express routes to prevent wilting.',
  },
  {
    q: 'Do you provide GST tax invoices for business buyers?',
    a: 'Yes. All orders are accompanied by official GST invoices detailing HSN codes and statutory tax breakdowns, allowing registered buyers to claim Input Tax Credit (ITC).',
  },
  {
    q: 'What payment methods are supported?',
    a: 'We accept Cash on Delivery (COD) for regular buyers, direct UPI (Google Pay, PhonePe, Paytm), Net Banking, and Debit/Credit cards via secure Razorpay integration.',
  },
  {
    q: 'What is the return policy for damaged leaves?',
    a: 'Perishable paan leaves must be inspected on arrival. If leaves suffer moisture damage during transit, send photographs within 3 hours of delivery for an immediate replacement credit or refund.',
  },
]

export default function FAQPage() {
  return (
    <div className="bg-gray-50/60 min-h-screen py-10 md:py-16">
      <div className="container-site max-w-3xl">
        <div className="text-center mb-10">
          <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-green-100 px-3.5 py-1 text-xs font-bold text-green-800">
            <HelpCircle className="h-3.5 w-3.5" />
            Wholesale Helpdesk
          </div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight sm:text-4xl">
            Frequently Asked Questions
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Everything you need to know about purchasing wholesale paan shop supplies online.
          </p>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-gray-200 bg-white p-6 shadow-2xs"
            >
              <h3 className="text-base font-bold text-gray-900 mb-2">
                {faq.q}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
