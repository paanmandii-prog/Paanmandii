'use client'

import { useState } from 'react'
import { BookOpen, Leaf, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react'
import Link from 'next/link'

interface Era {
  id: number
  period: string
  title: string
  icon: string
  color: string
  badgeColor: string
  summary: string
  details: string
  funFact: string
}

const PAAN_HISTORY: Era[] = [
  {
    id: 1,
    period: '2500+ BCE',
    title: 'Ancient Origins — Harappan & Vedic Era',
    icon: '🌿',
    color: 'border-emerald-400',
    badgeColor: 'bg-emerald-100 text-emerald-800',
    summary: 'Paan (betel leaf) has roots tracing back to ancient South Asian civilizations.',
    details:
      'Archaeological evidence suggests betel leaf chewing was practiced as far back as 2500 BCE in the Indus Valley Civilization. Ancient Vedic texts mention "Tambula" (betel leaf preparation) as an offering and post-meal digestive. It was considered sacred, purifying the mouth and aiding digestion after feasts at royal courts.',
    funFact: '🏺 Betel nut remnants have been found in Bronze Age burial sites across Southeast Asia.',
  },
  {
    id: 2,
    period: '300–1200 CE',
    title: 'The Classical Period — Royalty & Ayurveda',
    icon: '👑',
    color: 'border-violet-400',
    badgeColor: 'bg-violet-100 text-violet-800',
    summary: 'Paan became intertwined with royal hospitality and classical Ayurvedic medicine.',
    details:
      'During the Gupta and later Chola empires, paan became a symbol of nobility and hospitality. Ayurvedic texts like Charaka Samhita documented its medicinal properties — aiding digestion, freshening breath, and treating mouth ailments. Elaborate "Paan Daans" (betel boxes) became prized gifts between kingdoms. Royal households maintained dedicated "Tambulikars" (paan preparers).',
    funFact: '👑 Cleopatra reportedly received betel leaf as a luxury trade gift from South Asian merchants.',
  },
  {
    id: 3,
    period: '1200–1700 CE',
    title: 'Mughal Golden Age — The Art of Paan',
    icon: '🕌',
    color: 'border-amber-400',
    badgeColor: 'bg-amber-100 text-amber-800',
    summary: 'Mughal emperors elevated paan to an imperial cultural institution.',
    details:
      'The Mughal era transformed paan into a fine art. Emperors like Humayun, Akbar, and Shah Jahan had elaborate paan ceremonies. The preparation involved silver-leaf wrapped paan with dried rose petals, cardamom, saffron strands, and rare Indian spices. "Maan Barabar Paan Khilao" became a proverb — welcoming guests with paan was a mark of utmost respect. Kathak dancers held paan in choreography symbolizing feminine grace.',
    funFact: '🌸 Shah Jahan had a special silver "Paan Daan" inlaid with rubies gifted to his beloved Mumtaz.',
  },
  {
    id: 4,
    period: '1700–1947 CE',
    title: 'Colonial Era & the Birth of the Paan Shop',
    icon: '🏪',
    color: 'border-rose-400',
    badgeColor: 'bg-rose-100 text-rose-800',
    summary: 'Paan shops became social hubs in every Indian town and city.',
    details:
      "During British rule, paan culture democratized. From narrow-lane paan stalls to railway station kiosks, the 'Paan Wala' became an iconic figure in Indian social fabric. Cities like Banaras (Varanasi), Lucknow, Patna, and Kolkata developed their own signature paan styles. Benarasi Paan with its sweet, mouth-filling flavor and silver vark became India's most celebrated variety. The trade thrived on specialized leaf varieties from Bengal, Maharashtra, and Andhra.",
    funFact:
      '🚂 Every major Indian railway station had a "Paan Bidi" stall — they were officially licensed vendors since the 1880s.',
  },
  {
    id: 5,
    period: '1947–2000 CE',
    title: 'Post-Independence Era — Cultural Icon',
    icon: '🇮🇳',
    color: 'border-orange-400',
    badgeColor: 'bg-orange-100 text-orange-800',
    summary: 'Paan cemented its place in Bollywood, folk culture, and daily Indian life.',
    details:
      "Post-independence India saw paan immortalized in culture. Bollywood songs like 'Khaike Paan Banaras Wala' (Don, 1978) became anthems. Politicians offered paan at rallies. Across small towns, the paan shop at the neighborhood corner became the de facto local news center — where gossip, politics, cricket scores, and community bonds were forged daily. Paan exports also grew as Indian diaspora carried the tradition globally.",
    funFact:
      "🎬 Amitabh Bachchan's 'Khaike Paan Banaras Wala' made Benarasi Paan internationally famous overnight.",
  },
  {
    id: 6,
    period: '2000–Present',
    title: 'The Digital Age — PAAN MANDI Online',
    icon: '💻',
    color: 'border-green-400',
    badgeColor: 'bg-green-100 text-green-800',
    summary: 'Wholesale paan trade enters the digital era with PAAN MANDI.',
    details:
      "The 21st century brings paan's ancient supply chain online. PAAN MANDI bridges traditional wholesale mandis in Banaras, Mahoba, and Bengal with modern paan shop owners across India. Through real-time inventory, volume-tier wholesale pricing, GST-compliant invoicing, and cold-chain logistics, we're preserving a 4,500-year-old tradition while making it efficient for the digital age. Aapki Paan Ki Dukaan, Ab Online!",
    funFact:
      '🌐 India has an estimated 5 million+ paan shops — making it one of the largest street retail categories in the country.',
  },
]

export default function AdminPaanHistoryPage() {
  const [expanded, setExpanded] = useState<number | null>(1)
  const [activeFilter, setActiveFilter] = useState<'all' | 'ancient' | 'medieval' | 'modern'>('all')

  const filterMap = {
    all: PAAN_HISTORY,
    ancient: PAAN_HISTORY.slice(0, 2),
    medieval: PAAN_HISTORY.slice(2, 4),
    modern: PAAN_HISTORY.slice(4),
  }

  const displayed = filterMap[activeFilter]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
            <BookOpen className="h-7 w-7 text-amber-600" />
            Paan History — Interactive Timeline
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            4,500 years of paan tradition, from Vedic texts to PAAN MANDI&apos;s digital age.
          </p>
        </div>
        <Link
          href="/what-is-paan"
          target="_blank"
          className="flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-xs font-bold text-gray-700 shadow-2xs hover:bg-gray-50 transition"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          View Live Page
        </Link>
      </div>

      {/* Era Overview Strip */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
        {PAAN_HISTORY.map((era) => (
          <button
            key={era.id}
            onClick={() => setExpanded(era.id)}
            className={`rounded-xl border p-3 text-center transition hover:shadow-sm ${
              expanded === era.id
                ? 'border-green-400 bg-green-50 shadow-sm'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <div className="text-xl mb-1">{era.icon}</div>
            <div className="text-[10px] font-bold text-gray-600 leading-tight">{era.period}</div>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {(['all', 'ancient', 'medieval', 'modern'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition capitalize ${
              activeFilter === f
                ? 'bg-gray-900 text-white'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {f === 'all' ? 'All Eras' : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gradient-to-b from-emerald-300 via-amber-300 to-green-400 hidden sm:block" />

        <div className="space-y-4">
          {displayed.map((era) => (
            <div key={era.id} className="sm:pl-12 relative">
              {/* Era dot */}
              <div className="absolute left-3.5 top-5 h-3 w-3 rounded-full bg-white border-2 border-gray-400 hidden sm:block" />

              <div
                className={`rounded-2xl border-l-4 ${era.color} border border-gray-200 bg-white shadow-2xs overflow-hidden`}
              >
                <button
                  className="w-full text-left px-5 py-4 flex items-center justify-between hover:bg-gray-50/60 transition"
                  onClick={() => setExpanded(expanded === era.id ? null : era.id)}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{era.icon}</span>
                    <div>
                      <span
                        className={`inline-block rounded-full text-[10px] font-bold px-2.5 py-0.5 mb-1 ${era.badgeColor}`}
                      >
                        {era.period}
                      </span>
                      <div className="text-sm font-bold text-gray-900">{era.title}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{era.summary}</div>
                    </div>
                  </div>
                  <div className="shrink-0 ml-3 text-gray-400">
                    {expanded === era.id ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </div>
                </button>

                {expanded === era.id && (
                  <div className="px-5 pb-5 border-t border-gray-100 space-y-4">
                    <p className="text-sm text-gray-600 leading-relaxed pt-4">{era.details}</p>
                    <div className="flex items-start gap-3 rounded-xl bg-amber-50 border border-amber-100 px-4 py-3">
                      <Leaf className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                      <p className="text-xs text-amber-800 font-medium leading-relaxed">{era.funFact}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
