'use client'

import React, { useRef, useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Sparkles, ChevronDown, CheckCircle2 } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

interface LeafConfig {
  id: number
  startAngle: number
  duration: number
  sizeDesktop: number
  sizeMobile: number
  tilt: number
  src: string
  alt: string
}

const ORBIT_LEAVES: LeafConfig[] = [
  { id: 1, startAngle: 0, duration: 28, sizeDesktop: 72, sizeMobile: 48, tilt: -12, src: '/images/paan-leaf-1.webp', alt: 'Fresh Banarasi betel leaf' },
  { id: 2, startAngle: 60, duration: 28, sizeDesktop: 64, sizeMobile: 44, tilt: 15, src: '/images/paan-leaf-2.webp', alt: 'Tender Magahi betel leaf' },
  { id: 3, startAngle: 120, duration: 28, sizeDesktop: 78, sizeMobile: 52, tilt: -8, src: '/images/paan-leaf-3.webp', alt: 'Aromatic Calcutta betel leaf' },
  { id: 4, startAngle: 180, duration: 28, sizeDesktop: 68, sizeMobile: 46, tilt: 22, src: '/images/paan-leaf-4.webp', alt: 'Crisp green betel leaf' },
  { id: 5, startAngle: 240, duration: 28, sizeDesktop: 74, sizeMobile: 50, tilt: -18, src: '/images/paan-leaf-5.webp', alt: 'Hand-sorted farm betel leaf' },
  { id: 6, startAngle: 300, duration: 28, sizeDesktop: 66, sizeMobile: 44, tilt: 10, src: '/images/paan-leaf-6.webp', alt: 'Fresh wholesale paan leaf' },
]

export default function HeroBanarasiPaan() {
  const { language, t } = useLanguage()
  const heroRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(true)

  // Pause animation when hero is off-screen
  useEffect(() => {
    const el = heroRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)
      },
      { threshold: 0.1 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={heroRef}
      className="relative overflow-hidden bg-gradient-to-b from-[#FFFFFF] via-[#F6F8F5] to-[#F0F4F1] py-12 md:py-20 lg:py-24 border-b border-[#E2E8F0]"
      aria-label="Banarasi Paan Wholesale Hero"
    >
      {/* Background Decorative Ambient Circles */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none overflow-hidden opacity-40">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#2F855A]/10 blur-3xl" />
        <div className="absolute top-1/3 -right-32 w-[30rem] h-[30rem] rounded-full bg-[#C49746]/10 blur-3xl" />
      </div>

      <div className="container-site relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Left Column: Editorial Brand Copy & Actions */}
          <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left space-y-6">
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-2 rounded-full bg-[#ECFDF5] border border-[#A7F3D0] px-3.5 py-1.5 shadow-2xs">
              <Sparkles className="h-4 w-4 text-[#17643D]" />
              <span className="text-xs sm:text-sm font-bold text-[#123F2B] tracking-wide">
                {language === 'hi' ? 'आपकी पान की दुकान, अब ऑनलाइन!' : 'Aapki Paan Ki Dukaan, Ab Online!'}
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#123F2B] leading-[1.12]">
              <span>{t('heroTitlePrefix')} </span>
              <span className="text-[#17643D] underline decoration-[#C49746] decoration-wavy decoration-2 underline-offset-8">
                {t('heroTitleHighlight')}
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-[#18251D]/80 max-w-xl leading-relaxed">
              {t('heroSubtitle')}
            </p>

            {/* Prominent Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto pt-2">
              <Link
                href="/products"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-xl bg-[#17643D] text-[#FFFFFF] px-7 py-3.5 text-base font-bold transition-all shadow-md hover:bg-[#123F2B] hover:shadow-lg active:scale-98 group"
              >
                <span>{t('heroCtaShop')}</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>

              <a
                href="#catalogue-section"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-[#FFFFFF] text-[#123F2B] border-2 border-[#D8E2DC] px-7 py-3.5 text-base font-bold transition-all hover:bg-[#F6F8F5] hover:border-[#17643D] active:scale-98"
              >
                {t('heroCtaExplore')}
              </a>
            </div>

            {/* Wholesale Transparency Pillars */}
            <div className="grid grid-cols-3 gap-3 sm:gap-6 pt-4 border-t border-[#E2E8F0]/80 w-full max-w-lg">
              <div className="flex flex-col items-center lg:items-start">
                <span className="font-serif text-2xl sm:text-3xl font-extrabold text-[#123F2B]">{t('heroStat1Val')}</span>
                <span className="text-[11px] sm:text-xs font-medium text-[#18251D]/70">{t('heroStat1Lbl')}</span>
              </div>
              <div className="flex flex-col items-center lg:items-start border-x border-[#E2E8F0] px-2 sm:px-4">
                <span className="font-serif text-2xl sm:text-3xl font-extrabold text-[#17643D]">{t('heroStat2Val')}</span>
                <span className="text-[11px] sm:text-xs font-medium text-[#18251D]/70">{t('heroStat2Lbl')}</span>
              </div>
              <div className="flex flex-col items-center lg:items-start">
                <span className="font-serif text-2xl sm:text-3xl font-extrabold text-[#C49746]">{t('heroStat3Val')}</span>
                <span className="text-[11px] sm:text-xs font-medium text-[#18251D]/70">{t('heroStat3Lbl')}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Central Banarasi Paan & Orbiting Paan Leaves */}
          <div className="lg:col-span-5 flex justify-center items-center relative py-6">
            {/* The Visual Stage */}
            <div
              className="relative flex items-center justify-center w-[300px] h-[300px] sm:w-[420px] sm:h-[420px] lg:w-[460px] lg:h-[460px]"
              style={{
                // CSS Custom Property for Orbit radius
                ['--orbit-radius' as string]: 'clamp(120px, 32vw, 190px)',
              }}
            >
              {/* Outer Decorative Orbit Ring Guide */}
              <div className="absolute inset-4 rounded-full border border-dashed border-[#2F855A]/30 pointer-events-none" />
              <div className="absolute inset-16 rounded-full border border-[#C49746]/20 pointer-events-none" />

              {/* Glowing Radial Backdrop behind centerpiece */}
              <div className="absolute w-56 h-56 sm:w-80 sm:h-80 rounded-full bg-radial from-[#4CAF50]/20 via-[#2F855A]/10 to-transparent blur-xl pointer-events-none animate-halo-pulse" />

              {/* Central Master Banarasi Paan */}
              <div className="relative z-20 w-[220px] h-[220px] sm:w-[290px] sm:h-[290px] lg:w-[320px] lg:h-[320px] transition-transform duration-500 animate-hero-entrance">
                <div className="relative w-full h-full animate-hero-float">
                  <Image
                    src="/images/hero-banarasi-paan.webp"
                    alt="Authentic Banarasi Meetha Paan prepared with Chaandi Vark, Gulkand and fragrant cloves"
                    fill
                    priority
                    sizes="(max-width: 640px) 220px, (max-width: 1024px) 290px, 320px"
                    className="object-contain drop-shadow-[0_16px_28px_rgba(18,63,43,0.32)]"
                  />
                </div>
              </div>

              {/* Orbiting Paan Leaves Ring */}
              {ORBIT_LEAVES.map((leaf) => {
                const style: React.CSSProperties = {
                  ['--orbit-start-angle' as string]: `${leaf.startAngle}deg`,
                  ['--orbit-duration' as string]: `${leaf.duration}s`,
                  animationPlayState: isVisible ? 'running' : 'paused',
                }

                return (
                  <div
                    key={leaf.id}
                    className="orbit-leaf"
                    style={style}
                    aria-hidden="true"
                  >
                    <div
                      className="relative w-full h-full transition-transform hover:scale-110"
                      style={{
                        transform: `rotate(${leaf.tilt}deg)`,
                      }}
                    >
                      <Image
                        src={leaf.src}
                        alt={leaf.alt}
                        fill
                        sizes="60px"
                        className="object-contain drop-shadow-[0_6px_10px_rgba(18,63,43,0.25)]"
                      />
                    </div>
                  </div>
                )
              })}

              {/* Subtle Floating Verified Quality Stamp */}
              <div className="absolute -bottom-2 sm:bottom-4 right-0 sm:right-4 z-30 bg-[#FFFFFF]/95 backdrop-blur-xs border border-[#A7F3D0] rounded-2xl px-3.5 py-2 shadow-lg flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#123F2B] text-[#FFFFFF]">
                  <CheckCircle2 className="h-4 w-4 text-[#C49746]" />
                </div>
                <div className="text-left">
                  <p className="text-[10px] uppercase font-bold text-[#17643D] tracking-wider">
                    {language === 'hi' ? 'असली बनारसी पान' : 'Banarasi Paan'}
                  </p>
                  <p className="text-[11px] font-bold text-[#123F2B]">
                    {language === 'hi' ? '100% शुद्ध एवं तंबाकू-मुक्त' : '100% Pure & Tobacco-Free'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="mt-8 lg:mt-12 flex justify-center">
          <a
            href="#catalogue-section"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#18251D]/60 hover:text-[#17643D] transition-colors"
            aria-label={t('scrollDown')}
          >
            <span>{t('scrollDown')}</span>
            <ChevronDown className="h-4 w-4 animate-scroll-bounce text-[#17643D]" />
          </a>
        </div>
      </div>
    </section>
  )
}
