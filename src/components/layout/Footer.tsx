'use client'

import Link from 'next/link'
import { Mail, Phone, MapPin, ShieldCheck } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

export default function Footer() {
  const year = new Date().getFullYear()
  const { language, t } = useLanguage()

  const footerCollections = [
    { href: '/products', label: t('navCatalogue') },
    { href: '/categories/mukhya-saman', label: t('catMukhya') },
    { href: '/categories/anya-saman', label: t('catAnya') },
    { href: '/products?sort=price_asc', label: language === 'hi' ? 'कम मूल्य से शुरू' : 'Budget Wholesale' },
    { href: '/products?sort=featured', label: language === 'hi' ? 'विशेष मंडी सामान' : 'Featured Supplies' },
  ]

  const footerLinks = [
    { href: '/products', label: t('navShop') },
    { href: '/about', label: t('navAbout') },
    { href: '/faq', label: language === 'hi' ? 'अक्सर पूछे जाने वाले सवाल' : 'Wholesale FAQs' },
    { href: '/contact', label: t('navContact') },
    { href: '/admin', label: t('navAdmin') },
  ]

  const footerPolicies = [
    { href: '/shipping-policy', label: language === 'hi' ? 'डिलीवरी व फ्रेट नीति' : 'Shipping & Dispatch' },
    { href: '/return-refund-policy', label: language === 'hi' ? 'वापसी एवं रिफंड नीति' : 'Returns & Replacements' },
    { href: '/privacy-policy', label: language === 'hi' ? 'गोपनीयता नीति' : 'Privacy Policy' },
    { href: '/terms', label: language === 'hi' ? 'नियम और शर्तें' : 'Terms & Conditions' },
  ]

  return (
    <footer className="border-t border-[#E2E8F0] bg-[#FFFFFF] text-[#18251D] pt-14 pb-10">
      <div className="container-site">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-12 border-b border-[#E2E8F0]">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-flex flex-col">
              <div className="flex items-baseline gap-1.5">
                <span className="font-serif text-3xl font-bold tracking-tight text-[#123F2B]">
                  PAAN MANDI
                </span>
                <span className="inline-block h-2 w-2 rounded-full bg-[#C49746]" />
              </div>
              <span className="text-xs font-semibold text-[#2F855A]">
                {language === 'hi' ? 'आपकी पान की दुकान, अब ऑनलाइन!' : 'Aapki Paan Ki Dukaan, Ab Online!'}
              </span>
            </Link>

            <p className="text-[14px] leading-relaxed text-[#18251D]/75 max-w-sm">
              {language === 'hi'
                ? 'भारत का प्रमुख थोक पान और किराना बाजार। बनारसी पत्ते, कत्था, चूना, गुलकंद और 39 सत्यापित सामान सीधे मंडी भाव पर उपलब्ध।'
                : 'India’s premier wholesale paan marketplace. Direct mandi rates, certified suppliers, and cold-safe pan-India delivery for betel retailers and event organizers.'}
            </p>

            <div className="pt-2 space-y-2 text-[13px] text-[#18251D]/80">
              <div className="flex items-center gap-2.5">
                <Mail className="h-3.5 w-3.5 text-[#2F855A] shrink-0" />
                <a
                  href="mailto:paanmandii@gmail.com"
                  className="hover:text-[#17643D] underline decoration-[#E2E8F0] underline-offset-4"
                >
                  paanmandii@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="h-3.5 w-3.5 text-[#2F855A] shrink-0" />
                <a
                  href="tel:+919999999999"
                  className="hover:text-[#17643D]"
                >
                  +91 9999999999 ({language === 'hi' ? 'व्यापार सहायता' : 'Wholesale Support'})
                </a>
              </div>
              <div className="flex items-start gap-2.5">
                <MapPin className="h-3.5 w-3.5 text-[#2F855A] shrink-0 mt-0.5" />
                <span>{language === 'hi' ? 'वाराणसी, बिहार व बंगाल से सीधा मंडी प्रेषण' : 'Varanasi, Bihar & Bengal Direct Farm Procurement'}</span>
              </div>
            </div>
          </div>

          {/* Catalogue Collections */}
          <div>
            <h3 className="text-[12px] font-bold uppercase tracking-wider text-[#123F2B] mb-4">
              {language === 'hi' ? 'सामान श्रेणियां' : 'Categories'}
            </h3>
            <ul className="space-y-2.5 text-[14px]">
              {footerCollections.map((item, idx) => (
                <li key={`fc-${idx}`}>
                  <Link
                    href={item.href}
                    className="text-[#18251D]/70 hover:text-[#17643D] transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-[12px] font-bold uppercase tracking-wider text-[#123F2B] mb-4">
              {language === 'hi' ? 'त्वरित लिंक' : 'Quick Links'}
            </h3>
            <ul className="space-y-2.5 text-[14px]">
              {footerLinks.map((item, idx) => (
                <li key={`fl-${idx}`}>
                  <Link
                    href={item.href}
                    className="text-[#18251D]/70 hover:text-[#17643D] transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Policies & Compliance */}
          <div>
            <h3 className="text-[12px] font-bold uppercase tracking-wider text-[#123F2B] mb-4">
              {language === 'hi' ? 'नियम व शर्तें' : 'Wholesale Terms'}
            </h3>
            <ul className="space-y-2.5 text-[14px]">
              {footerPolicies.map((item, idx) => (
                <li key={`fp-${idx}`}>
                  <Link
                    href={item.href}
                    className="text-[#18251D]/70 hover:text-[#17643D] transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom copyright & statutory assurance */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[12px] text-[#18251D]/60">
          <p>
            &copy; {year} PAAN MANDI. {language === 'hi' ? 'सर्वाधिकार सुरक्षित।' : 'All rights reserved.'}
          </p>
          <div className="flex items-center gap-2 text-center sm:text-right">
            <ShieldCheck className="h-4 w-4 text-[#2F855A]" />
            <span>
              {language === 'hi'
                ? 'पारदर्शी थोक भाव • कानूनी अनुपालन सत्यापन प्रणाली'
                : '100% Rate Transparency • Verified Mandi Wholesale Rates'}
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
