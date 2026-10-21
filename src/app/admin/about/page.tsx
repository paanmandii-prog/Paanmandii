'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Leaf,
  ShieldCheck,
  Truck,
  MapPin,
  Edit3,
  Save,
  X,
  ExternalLink,
  Star,
  Users,
  Package,
  TrendingUp,
} from 'lucide-react'

const INITIAL_CONTENT = {
  tagline: 'Aapki Paan Ki Dukaan, Ab Online!',
  mission:
    'PAAN MANDI was founded with a singular motto: we bridge the gap between fresh leaf farmers and neighborhood paan artisans across India.',
  locations: 'Operating central hubs across Uttar Pradesh, Bihar, West Bengal, and nationwide logistics routes.',
  trustLine:
    'For decades, independent paan shop owners spent hours traveling before dawn to physical wholesale markets, haggling over unstable prices and facing unpredictable leaf spoilage. PAAN MANDI digitizes this entire process.',
}

const VALUES = [
  {
    icon: Leaf,
    title: 'Farm & Mandi Direct',
    desc: 'We source directly from reputed Mandi hubs like Banaras, Mahoba, and Bengal — ensuring top leaf grades with unmatched moisture retention.',
    color: 'bg-green-50 text-green-700',
  },
  {
    icon: ShieldCheck,
    title: 'Strict Legal Compliance',
    desc: 'We operate strictly within statutory frameworks, distributing solely legally permitted supplies, natural extracts, and hygienic packaging.',
    color: 'bg-blue-50 text-blue-700',
  },
  {
    icon: Truck,
    title: 'Cold-Chain Logistics',
    desc: "Paan leaves are delicate. Our specialized packaging protects freshness and prevents rot during express ground freight.",
    color: 'bg-amber-50 text-amber-700',
  },
]

const STATS = [
  { icon: Users, label: 'Paan Shops Served', value: '500+', color: 'text-green-700' },
  { icon: Package, label: 'Product SKUs', value: '80+', color: 'text-blue-700' },
  { icon: Star, label: 'Avg. Customer Rating', value: '4.8★', color: 'text-amber-600' },
  { icon: TrendingUp, label: 'Orders Monthly', value: '2,000+', color: 'text-rose-600' },
]

export default function AdminAboutPage() {
  const [content, setContent] = useState(INITIAL_CONTENT)
  const [editing, setEditing] = useState<keyof typeof INITIAL_CONTENT | null>(null)
  const [draft, setDraft] = useState('')
  const [saved, setSaved] = useState(false)

  function startEdit(field: keyof typeof INITIAL_CONTENT) {
    setEditing(field)
    setDraft(content[field])
    setSaved(false)
  }

  function saveEdit() {
    if (editing) {
      setContent((prev) => ({ ...prev, [editing]: draft }))
      setEditing(null)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    }
  }

  function cancelEdit() {
    setEditing(null)
    setDraft('')
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            About Us — Brand Content
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Preview and edit your storefront About Us content from this panel.
          </p>
        </div>
        <div className="flex gap-2.5">
          {saved && (
            <span className="flex items-center gap-1.5 rounded-xl bg-green-100 px-4 py-2.5 text-xs font-bold text-green-700">
              <Save className="h-3.5 w-3.5" /> Saved!
            </span>
          )}
          <Link
            href="/about"
            target="_blank"
            className="flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-xs font-bold text-gray-700 shadow-2xs hover:bg-gray-50 transition"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            View Live Page
          </Link>
        </div>
      </div>

      {/* Headline Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((s) => {
          const Icon = s.icon
          return (
            <div
              key={s.label}
              className="rounded-2xl border border-gray-200 bg-white p-5 shadow-2xs flex flex-col gap-2"
            >
              <Icon className={`h-5 w-5 ${s.color}`} />
              <div className={`text-2xl font-black ${s.color}`}>{s.value}</div>
              <div className="text-[11px] text-gray-400 font-medium">{s.label}</div>
            </div>
          )
        })}
      </div>

      {/* Tagline & Mission */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-2xs space-y-5">
        <h2 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3">
          Brand Identity &amp; Mission
        </h2>

        {(['tagline', 'mission', 'locations', 'trustLine'] as const).map((field) => {
          const labels: Record<string, string> = {
            tagline: 'Tagline',
            mission: 'Mission Statement',
            locations: 'Hub Locations',
            trustLine: 'Why Shops Trust Us — Narrative',
          }
          const isMultiline = field === 'mission' || field === 'trustLine'
          return (
            <div key={field} className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  {labels[field]}
                </span>
                {editing !== field ? (
                  <button
                    onClick={() => startEdit(field)}
                    className="flex items-center gap-1 text-xs font-bold text-green-700 hover:underline"
                  >
                    <Edit3 className="h-3 w-3" /> Edit
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={saveEdit}
                      className="text-xs font-bold text-green-700 flex items-center gap-1"
                    >
                      <Save className="h-3 w-3" /> Save
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="text-xs font-bold text-gray-400 flex items-center gap-1"
                    >
                      <X className="h-3 w-3" /> Cancel
                    </button>
                  </div>
                )}
              </div>
              {editing === field ? (
                isMultiline ? (
                  <textarea
                    autoFocus
                    rows={3}
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    className="w-full rounded-xl border border-green-300 bg-green-50/40 px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-400 resize-none"
                  />
                ) : (
                  <input
                    autoFocus
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    className="w-full rounded-xl border border-green-300 bg-green-50/40 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-400"
                  />
                )
              ) : field === 'locations' ? (
                <div className="flex items-start gap-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4 text-green-700 shrink-0 mt-0.5" />
                  {content[field]}
                </div>
              ) : (
                <p className="text-sm text-gray-600 leading-relaxed">{content[field]}</p>
              )}
            </div>
          )
        })}
      </div>

      {/* Core Value Cards Preview */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-2xs">
        <h2 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3 mb-5">
          Core Values (Storefront Preview)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {VALUES.map((v) => {
            const Icon = v.icon
            return (
              <div
                key={v.title}
                className="rounded-xl border border-gray-100 bg-gray-50/60 p-5 space-y-3 hover:shadow-sm transition"
              >
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${v.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="text-sm font-bold text-gray-900">{v.title}</div>
                <p className="text-xs text-gray-500 leading-relaxed">{v.desc}</p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
