'use client'

import React, { useState, useMemo, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { Category, ProductWithDetails } from '@/types'
import ProductCard from '@/components/products/ProductCard'
import HeroBanarasiPaan from '@/components/home/HeroBanarasiPaan'
import { useLanguage } from '@/contexts/LanguageContext'
import { ALL_39_PRODUCTS, MASTER_CATEGORIES } from '@/lib/catalogue-data'
import {
  ArrowRight,
  Search,
  Filter,
  ShieldCheck,
  Truck,
  Leaf,
  Scale,
  Award,
  CheckCircle2,
  ChevronRight,
  Mail,
  Phone,
  MapPin,
  Sparkles,
} from 'lucide-react'

interface HomeInteractiveProps {
  popularProducts?: ProductWithDetails[]
  categories?: Category[]
}

export default function HomeInteractive({
  popularProducts = [],
  categories = [],
}: HomeInteractiveProps) {
  const { language, t } = useLanguage()
  const [activeTab, setActiveTab] = useState<'all' | 'mukhya' | 'anya'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [inStockOnly, setInStockOnly] = useState(false)
  const [emailInput, setEmailInput] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  // Use ALL_39_PRODUCTS as master catalogue if popularProducts is empty or less than 10
  const catalogueList: ProductWithDetails[] = useMemo(() => {
    if (popularProducts && popularProducts.length >= 35) {
      return popularProducts
    }
    return ALL_39_PRODUCTS
  }, [popularProducts])

  // Filter products by category, search query, stock
  const filteredProducts = useMemo(() => {
    return catalogueList.filter((product) => {
      // Category Tab filter
      if (activeTab === 'mukhya') {
        const isMukhya =
          product.category?.slug === 'mukhya-saman' ||
          (product.source_id && parseInt(product.source_id, 10) <= 26)
        if (!isMukhya) return false
      } else if (activeTab === 'anya') {
        const isAnya =
          product.category?.slug === 'anya-saman' ||
          (product.source_id && parseInt(product.source_id, 10) >= 27)
        if (!isAnya) return false
      }

      // In stock filter
      if (inStockOnly) {
        const stock = product.inventory?.quantity_available ?? 0
        if (stock <= 0 && !product.inventory?.allow_backorder) return false
      }

      // Search query filter (Hindi name, English name, SKU, Source ID)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim()
        const matchesName = product.name?.toLowerCase().includes(q)
        const matchesNameHi = product.name_hi?.toLowerCase().includes(q)
        const matchesNameEn = product.name_en?.toLowerCase().includes(q)
        const matchesSku = product.sku?.toLowerCase().includes(q)
        const matchesId = product.source_id?.includes(q)
        if (!matchesName && !matchesNameHi && !matchesNameEn && !matchesSku && !matchesId) {
          return false
        }
      }

      return true
    })
  }, [catalogueList, activeTab, inStockOnly, searchQuery])

  // Scroll reveal setup using IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed')
          }
        })
      },
      { threshold: 0.15 }
    )

    document.querySelectorAll('.reveal-fade-up').forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (!emailInput.trim()) return
    setSubscribed(true)
    setTimeout(() => {
      setSubscribed(false)
      setEmailInput('')
    }, 4000)
  }

  const wholesalePillars = [
    {
      icon: <Scale className="h-6 w-6 text-[#17643D]" />,
      title: t('feature1Title'),
      desc: t('feature1Desc'),
    },
    {
      icon: <Leaf className="h-6 w-6 text-[#2F855A]" />,
      title: t('feature2Title'),
      desc: t('feature2Desc'),
    },
    {
      icon: <ShieldCheck className="h-6 w-6 text-[#C49746]" />,
      title: t('feature3Title'),
      desc: t('feature3Desc'),
    },
    {
      icon: <Truck className="h-6 w-6 text-[#123F2B]" />,
      title: t('feature4Title'),
      desc: t('feature4Desc'),
    },
  ]

  return (
    <div className="w-full bg-[#F6F8F5] text-[#18251D]">
      {/* ========================================================================= */}
      {/* 1. HERO SECTION WITH BANARASI PAAN & ORBITING PAAN LEAVES */}
      {/* ========================================================================= */}
      <HeroBanarasiPaan />

      {/* ========================================================================= */}
      {/* 2. WHOLESALE PILLARS BANNER (Lightweight Scroll Animation) */}
      {/* ========================================================================= */}
      <section className="border-b border-[#E2E8F0] bg-[#FFFFFF] py-8 sm:py-10">
        <div className="container-site">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {wholesalePillars.map((p, idx) => (
              <div
                key={idx}
                className="reveal-fade-up flex items-start gap-4 p-4 rounded-xl bg-[#F6F8F5]/60 border border-[#E2E8F0]/60 hover:border-[#2F855A]/40 transition-colors"
                style={{ transitionDelay: `${idx * 80}ms` }}
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#FFFFFF] shadow-2xs border border-[#E2E8F0]">
                  {p.icon}
                </div>
                <div>
                  <h3 className="font-sans font-bold text-sm sm:text-base text-[#123F2B] mb-1">
                    {p.title}
                  </h3>
                  <p className="text-xs text-[#18251D]/75 leading-relaxed">
                    {p.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. COMPLETE 39 PRODUCTS WHOLESALE CATALOGUE SECTION */}
      {/* ========================================================================= */}
      <section id="catalogue-section" className="py-12 sm:py-16 lg:py-20">
        <div className="container-site">
          {/* Section Header */}
          <div className="reveal-fade-up mb-8 sm:mb-10 text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-[#ECFDF5] border border-[#A7F3D0] px-3.5 py-1 text-xs font-bold text-[#123F2B]">
              <Sparkles className="h-3.5 w-3.5 text-[#17643D]" />
              <span>{language === 'hi' ? '39 आवश्यक मंडी सामग्री' : 'All 39 Rate List Supplies'}</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#123F2B]">
              {t('featuredHeading')}
            </h2>
            <p className="text-sm sm:text-base text-[#18251D]/75 leading-relaxed">
              {t('featuredSubheading')}
            </p>
          </div>

          {/* Search, Tabs & Filter Bar */}
          <div className="reveal-fade-up mb-8 bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-4 sm:p-5 shadow-2xs space-y-4">
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
              {/* Category Filter Tabs */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('all')}
                  className={`rounded-xl px-4 py-2 text-xs sm:text-sm font-bold transition-all ${
                    activeTab === 'all'
                      ? 'bg-[#123F2B] text-[#FFFFFF] shadow-sm'
                      : 'bg-[#F6F8F5] text-[#18251D] hover:bg-[#E2E8F0]'
                  }`}
                >
                  {t('catAll')}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('mukhya')}
                  className={`rounded-xl px-4 py-2 text-xs sm:text-sm font-bold transition-all ${
                    activeTab === 'mukhya'
                      ? 'bg-[#123F2B] text-[#FFFFFF] shadow-sm'
                      : 'bg-[#F6F8F5] text-[#18251D] hover:bg-[#E2E8F0]'
                  }`}
                >
                  {t('catMukhya')} (26)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('anya')}
                  className={`rounded-xl px-4 py-2 text-xs sm:text-sm font-bold transition-all ${
                    activeTab === 'anya'
                      ? 'bg-[#123F2B] text-[#FFFFFF] shadow-sm'
                      : 'bg-[#F6F8F5] text-[#18251D] hover:bg-[#E2E8F0]'
                  }`}
                >
                  {t('catAnya')} (13)
                </button>
              </div>

              {/* In Stock Toggle */}
              <div className="flex items-center gap-3">
                <label className="inline-flex items-center gap-2 text-xs font-semibold text-[#18251D] cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="h-4 w-4 rounded border-[#E2E8F0] text-[#17643D] focus:ring-[#17643D]"
                  />
                  <span>{t('filterInStockOnly')}</span>
                </label>
              </div>
            </div>

            {/* Instant Search Box */}
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('searchPlaceholder')}
                className="w-full rounded-xl border border-[#E2E8F0] bg-[#F6F8F5] py-2.5 px-4 pl-10 text-sm text-[#18251D] placeholder-[#18251D]/50 focus:border-[#17643D] focus:bg-[#FFFFFF] focus:outline-none transition-all"
              />
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#18251D]/50 pointer-events-none" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400 hover:text-gray-600"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Results Count & Rate List Notice */}
          <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-[#18251D]/70 px-1">
            <span className="font-semibold">
              {filteredProducts.length} {t('resultsFound')}
            </span>
            <span className="inline-flex items-center gap-1 text-amber-800 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
              * {language === 'hi'
                ? 'मालिक द्वारा दी गई दरें सटीक हैं; इकाई पुष्टि होने तक पुष्टि प्रतीक्षित चिह्नित है।'
                : 'Rates are preserved exactly as supplied. Packaging units marked for confirmation.'}
            </span>
          </div>

          {/* Product Grid: All 39 Items with Distinct Photography */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {filteredProducts.map((product, idx) => (
                <div
                  key={product.id || `p-${idx}`}
                  className="reveal-fade-up"
                  style={{ transitionDelay: `${(idx % 8) * 60}ms` }}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-12 text-center space-y-3">
              <div className="text-4xl">🔍</div>
              <h3 className="font-bold text-lg text-[#123F2B]">{t('noProductsFound')}</h3>
              <p className="text-xs text-[#18251D]/60 max-w-sm mx-auto">
                Try searching for another item like &ldquo;Saunf&rdquo;, &ldquo;कत्था&rdquo;, &ldquo;इलायची&rdquo; or clearing the search query.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('')
                  setActiveTab('all')
                  setInStockOnly(false)
                }}
                className="mt-2 btn-secondary text-xs"
              >
                {t('resetFilters')}
              </button>
            </div>
          )}

          {/* Explore More Footer Link */}
          <div className="mt-12 text-center">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 rounded-xl bg-[#123F2B] text-[#FFFFFF] px-8 py-3.5 text-sm font-bold shadow-md hover:bg-[#17643D] transition-all group"
            >
              <span>{t('viewAllProducts')}</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. WHOLESALE RATE LIST ASSURANCE & TRANSPARENCY SECTION */}
      {/* ========================================================================= */}
      <section className="py-12 sm:py-16 bg-[#FFFFFF] border-t border-b border-[#E2E8F0]">
        <div className="container-site">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-6 space-y-5">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-[#ECFDF5] border border-[#A7F3D0] px-3.5 py-1 text-xs font-bold text-[#123F2B]">
                <ShieldCheck className="h-3.5 w-3.5 text-[#17643D]" />
                <span>{language === 'hi' ? 'दुकानदार संरक्षण गारंटी' : 'Mandi Buyer Protection'}</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#123F2B]">
                {language === 'hi'
                  ? 'पारदर्शी थोक मंडी भाव, शून्य बिचौलिया'
                  : 'Transparent Mandi Pricing, Zero Middlemen'}
              </h2>
              <p className="text-sm sm:text-base text-[#18251D]/80 leading-relaxed">
                {language === 'hi'
                  ? 'पान मंडी में हम दुकानदारों और व्यापारियों को सीधे थोक दरों पर प्रामाणिक सामग्री प्रदान करते हैं। हमारी 39-उत्पाद रेट लिस्ट में प्रत्येक वस्तु का भाव तय है ताकि आपको बाज़ार के उतार-चढ़ाव में भी स्थिरता मिले।'
                  : 'PAAN MANDI provides retailers, kiosks, and catering partners with authentic wholesale supplies at direct rate-list prices. No inflated commissions or surprise billing.'}
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-[#17643D] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-sm font-bold text-[#123F2B]">
                      {language === 'hi' ? 'सटीक दर संरक्षण' : 'Exact Supplied Rate Guarantee'}
                    </strong>
                    <p className="text-xs text-[#18251D]/75">
                      {language === 'hi'
                        ? 'स्रोत रेट लिस्ट के सभी 39 भाव बिना किसी बदलाव के सुरक्षित हैं।'
                        : 'Every price from the source rate list is locked and honored at checkout.'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-[#17643D] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-sm font-bold text-[#123F2B]">
                      {language === 'hi' ? 'कानूनी सत्यापन और सुरक्षा' : 'Regulated Compliance & Safety'}
                    </strong>
                    <p className="text-xs text-[#18251D]/75">
                      {language === 'hi'
                        ? 'विनियमित मदें (जैसे भांग व किमाम) केवल कानूनी अनुपालन सत्यापन के बाद ही सक्रिय की जाती हैं।'
                        : 'Restricted items require authorized license checks and admin sign-off before sale.'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-[#17643D] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-sm font-bold text-[#123F2B]">
                      {language === 'hi' ? 'अखिल भारतीय ट्रांसपोर्ट' : 'Cold-Safe Logistics Dispatch'}
                    </strong>
                    <p className="text-xs text-[#18251D]/75">
                      {language === 'hi'
                        ? 'पान के पत्तों की ताजगी बनाए रखने के लिए विशेष तापमान नियंत्रित पैकिंग।'
                        : 'Temperature-guarded wrapping ensures betel leaves arrive crisp and fragrant.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 relative">
              <div className="relative aspect-4/3 w-full rounded-2xl overflow-hidden border border-[#E2E8F0] shadow-lg">
                <Image
                  src="/images/paan-ingredients-overhead.jpg"
                  alt="Traditional Indian Paan Mandi ingredients and preparation spices"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#123F2B]/85 via-transparent to-transparent flex items-end p-6">
                  <div className="text-[#FFFFFF] space-y-1">
                    <p className="text-xs font-bold uppercase tracking-wider text-[#C49746]">
                      {language === 'hi' ? 'मंडी थोक आपूर्ति' : 'Mandi Procurement'}
                    </p>
                    <p className="text-base sm:text-lg font-bold">
                      {language === 'hi'
                        ? 'बनारसी पत्ते, कत्था, चूना, गुलकंद और 39 सामान'
                        : '39 Essential Wholesaler Supplies Ready for Pan-India Dispatch'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. NEWSLETTER / WHOLESALE RATE UPDATE SUBSCRIPTION */}
      {/* ========================================================================= */}
      <section id="contact" className="py-12 sm:py-16 bg-[#123F2B] text-[#FFFFFF]">
        <div className="container-site max-w-3xl text-center space-y-6">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-[#17643D] px-3.5 py-1 text-xs font-bold text-[#FFFFFF]">
            <Sparkles className="h-3.5 w-3.5 text-[#C49746]" />
            <span>{language === 'hi' ? 'थोक भाव अलर्ट' : 'Wholesale Mandi Rate Alerts'}</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight">
            {language === 'hi'
              ? 'ताज़ा मंडी भाव सीधे अपने इनबॉक्स में पाएं'
              : 'Receive Weekly Wholesale Mandi Price Updates'}
          </h2>

          <p className="text-sm sm:text-base text-gray-300 max-w-xl mx-auto leading-relaxed">
            {language === 'hi'
              ? 'बनारसी पत्ते, कत्था, इलायची और अन्य 39 वस्तुओं के ताज़ा भाव जानने के लिए अपना ईमेल दर्ज करें।'
              : 'Subscribe to receive seasonal price notifications, bulk volume tier alerts, and supply harvest updates.'}
          </p>

          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row items-center gap-3 max-w-md mx-auto pt-2">
            <input
              type="email"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              placeholder={language === 'hi' ? 'अपना ईमेल दर्ज करें...' : 'Enter your shop or business email...'}
              required
              className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm text-white placeholder-gray-400 focus:border-[#C49746] focus:bg-white/20 focus:outline-none"
            />
            <button
              type="submit"
              className="w-full sm:w-auto shrink-0 rounded-xl bg-[#C49746] text-[#FFFFFF] px-6 py-3 text-sm font-bold hover:bg-[#9A722C] transition-colors shadow-md"
            >
              {subscribed
                ? (language === 'hi' ? 'सफलतापूर्वक जुड़ा!' : 'Subscribed!')
                : (language === 'hi' ? 'सूचनाएं पाएं' : 'Get Updates')}
            </button>
          </form>
        </div>
      </section>
    </div>
  )
}
