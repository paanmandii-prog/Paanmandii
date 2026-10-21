'use client'

import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useCart } from '@/contexts/CartContext'
import { useLanguage } from '@/contexts/LanguageContext'
import {
  ShoppingBag,
  Search,
  Menu,
  X,
  User,
  ChevronDown,
  Package,
  Heart,
  LogOut,
  Globe,
  ShieldCheck,
} from 'lucide-react'
import { cn } from '@/lib/utils'

export default function Header() {
  const router = useRouter()
  const supabase = createClient()
  const { summary } = useCart()
  const { language, toggleLanguage, t } = useLanguage()
  const [user, setUser] = useState<null | { id: string; email?: string }>(null)
  const [profile, setProfile] = useState<{ full_name: string } | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [scrolled, setScrolled] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
      if (user) {
        supabase
          .from('profiles')
          .select('full_name')
          .eq('id', user.id)
          .single()
          .then(({ data }) => setProfile(data))
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null)
      if (!session?.user) setProfile(null)
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/products?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
      setSearchOpen(false)
      setMobileOpen(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUserMenuOpen(false)
    router.push('/')
    router.refresh()
  }

  const navLinks = [
    { href: '/products', label: t('navShop') },
    { href: '/products', label: t('navCatalogue') },
    { href: '/categories', label: t('navCategories') },
    { href: '/admin', label: t('navAdmin') },
    { href: '/#contact', label: t('navContact') },
  ]

  return (
    <header
      className={cn(
        'sticky top-0 z-50 bg-[#FFFFFF] border-b border-[#E2E8F0] transition-shadow duration-200',
        scrolled && 'shadow-md shadow-emerald-950/5'
      )}
    >
      {/* Announcement Bar with Bilingual Content */}
      <div className="bg-[#123F2B] text-[#FFFFFF] py-2 px-4 text-center text-[12px] sm:text-[13px] font-medium tracking-wide flex items-center justify-center gap-2">
        <span className="inline-block h-2 w-2 rounded-full bg-[#2F855A] animate-pulse" />
        <span>{t('announcement')}</span>
      </div>

      <div className="container-site">
        <div className="flex items-center justify-between py-3 sm:py-3.5">
          {/* Brand Wordmark & Tagline */}
          <Link
            href="/"
            className="flex flex-col group"
          >
            <div className="flex items-baseline gap-1.5">
              <span className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#123F2B] group-hover:text-[#17643D] transition-colors">
                PAAN MANDI
              </span>
              <span className="inline-block h-2 w-2 rounded-full bg-[#C49746]" />
            </div>
            <span className="text-[10px] sm:text-[11px] font-medium tracking-wide text-[#2F855A]">
              {language === 'hi' ? 'आपकी पान की दुकान, अब ऑनलाइन!' : 'Aapki Paan Ki Dukaan, Ab Online!'}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-6 lg:flex" aria-label="Main Navigation">
            {navLinks.map((link, idx) => (
              <Link
                key={`${link.href}-${idx}`}
                href={link.href}
                className="text-[14px] font-medium text-[#18251D] hover:text-[#17643D] transition-colors relative py-1 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 hover:after:w-full after:bg-[#17643D] after:transition-all after:duration-200"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2.5 sm:gap-3.5">
            {/* Desktop Search Bar */}
            <form onSubmit={handleSearch} className="hidden md:flex items-center relative">
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('searchPlaceholder')}
                className="w-48 lg:w-60 xl:w-72 rounded-lg border border-[#E2E8F0] bg-[#F6F8F5] px-3 py-1.5 pl-8 text-[13px] text-[#18251D] placeholder-[#18251D]/50 focus:border-[#17643D] focus:bg-[#FFFFFF] focus:outline-none transition-all"
              />
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#18251D]/50 pointer-events-none" />
            </form>

            {/* Language Switch Toggle: EN / हिन्दी */}
            <button
              type="button"
              onClick={toggleLanguage}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#D8E2DC] bg-[#FFFFFF] hover:bg-[#F6F8F5] px-2.5 py-1.5 text-xs font-bold text-[#123F2B] transition-all shadow-2xs hover:border-[#2F855A] active:scale-95"
              title={language === 'en' ? 'हिन्दी में बदलें (Switch to Hindi)' : 'Switch to English'}
              aria-label={t('langToggleAria')}
            >
              <Globe className="h-3.5 w-3.5 text-[#2F855A]" />
              <span className={cn('px-1 py-0.5 rounded text-[11px]', language === 'en' ? 'bg-[#123F2B] text-[#FFFFFF]' : 'text-gray-500')}>
                EN
              </span>
              <span className="text-gray-300">/</span>
              <span className={cn('px-1 py-0.5 rounded text-[11px]', language === 'hi' ? 'bg-[#123F2B] text-[#FFFFFF]' : 'text-gray-500')}>
                हिन्दी
              </span>
            </button>

            {/* Mobile Search Toggle */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="md:hidden p-1.5 text-[#18251D] hover:text-[#17643D]"
              aria-label="Toggle search"
            >
              <Search className="h-4.5 w-4.5" />
            </button>

            {/* Account / User Menu */}
            {user ? (
              <div ref={userMenuRef} className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-1.5 p-1 text-[13px] text-[#18251D] hover:text-[#17643D]"
                  aria-expanded={userMenuOpen}
                  aria-label="Account menu"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#E2E8F0] text-[12px] font-bold text-[#123F2B]">
                    {profile?.full_name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <ChevronDown className="h-3 w-3 text-[#18251D]/60 hidden sm:block" />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 rounded-xl bg-[#FFFFFF] border border-[#E2E8F0] py-1.5 shadow-lg z-50">
                    <div className="border-b border-[#E2E8F0] px-3.5 py-2">
                      <div className="text-[13px] font-semibold text-[#18251D] truncate">
                        {profile?.full_name || t('navAccount')}
                      </div>
                      <div className="truncate text-[11px] text-[#18251D]/60">{user.email}</div>
                    </div>
                    <Link
                      href="/account"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-3.5 py-2 text-[13px] text-[#18251D] hover:bg-[#F6F8F5]"
                    >
                      <User className="h-3.5 w-3.5" />
                      {t('navAccount')}
                    </Link>
                    <Link
                      href="/account/orders"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-3.5 py-2 text-[13px] text-[#18251D] hover:bg-[#F6F8F5]"
                    >
                      <Package className="h-3.5 w-3.5" />
                      {t('navOrders')}
                    </Link>
                    <Link
                      href="/admin"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-3.5 py-2 text-[13px] text-[#17643D] font-medium hover:bg-[#ECFDF5]"
                    >
                      <ShieldCheck className="h-3.5 w-3.5" />
                      {t('navAdmin')}
                    </Link>
                    <div className="my-1 border-t border-[#E2E8F0]" />
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 px-3.5 py-2 text-[13px] text-red-700 hover:bg-red-50 text-left font-medium"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      {t('navLogout')}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="hidden sm:inline-flex text-[13px] font-semibold text-[#17643D] hover:text-[#123F2B] px-2.5 py-1"
              >
                {t('navLogin')}
              </Link>
            )}

            {/* Shopping Bag / Cart */}
            <Link
              href="/cart"
              className="relative p-1.5 text-[#18251D] hover:text-[#17643D] transition-colors"
              aria-label={`Cart (${summary.item_count} items)`}
            >
              <ShoppingBag className="h-5 w-5" />
              {summary.item_count > 0 && (
                <span className="absolute -right-1 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#123F2B] text-[10px] font-bold text-[#FFFFFF] shadow-xs">
                  {summary.item_count > 99 ? '99+' : summary.item_count}
                </span>
              )}
            </Link>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-1.5 text-[#18251D] hover:text-[#17643D] md:hidden"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Input Drawer */}
        {searchOpen && (
          <form onSubmit={handleSearch} className="md:hidden pb-3 pt-1">
            <div className="relative">
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('searchPlaceholder')}
                className="w-full rounded-lg border border-[#E2E8F0] bg-[#F6F8F5] px-3 py-2 pl-9 text-[14px] text-[#18251D] placeholder-[#18251D]/50 focus:border-[#17643D] focus:bg-[#FFFFFF] focus:outline-none"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#18251D]/50 pointer-events-none" />
            </div>
          </form>
        )}
      </div>

      {/* Mobile Drawer Menu */}
      {mobileOpen && (
        <div className="border-t border-[#E2E8F0] bg-[#FFFFFF] md:hidden shadow-lg animate-in slide-in-from-top-2 duration-200">
          <div className="container-site py-4 space-y-3">
            <nav className="flex flex-col space-y-1">
              {navLinks.map((link, idx) => (
                <Link
                  key={`m-${link.href}-${idx}`}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-[15px] font-medium text-[#18251D] hover:bg-[#F6F8F5] hover:text-[#17643D] transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              {!user && (
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-[15px] font-semibold text-[#17643D] hover:bg-[#ECFDF5]"
                >
                  {t('navLogin')}
                </Link>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}
