import { Leaf, ShieldCheck, Heart, Sparkles, MapPin } from 'lucide-react'

export const metadata = {
  title: 'Our Story & Philosophy',
  description: 'Learn about Paanmandii — crafting authentic, tobacco-free paan rooted in classical Indian tradition.',
}

export default function AboutPage() {
  return (
    <div className="bg-[#F8F3E8] min-h-screen py-16 md:py-24">
      <div className="container-site max-w-4xl">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <span className="text-[11px] sm:text-[12px] font-bold uppercase tracking-[0.16em] text-[#B58A45]">
            Our Heritage &amp; Philosophy
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#173D2C] leading-tight font-normal">
            Reviving the lost art of the classical Indian paan.
          </h1>
          <p className="font-sans text-[16px] sm:text-[17px] text-[#292A23]/80 max-w-2xl mx-auto leading-relaxed">
            Paanmandii was founded to restore paan to its noble origin: a clean, pure, and delectable digestif prepared exclusively with tobacco-free, natural botanical ingredients.
          </p>
        </div>

        {/* 3 Core Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="rounded-[10px] border border-[#E5DFD2] bg-[#FFFFFF] p-6 shadow-none">
            <span className="font-serif text-xl font-bold text-[#B58A45] mb-2 block">01</span>
            <h3 className="font-serif text-xl text-[#173D2C] mb-2 font-medium">
              100% Tobacco-Free
            </h3>
            <p className="text-[13px] text-[#292A23]/75 leading-relaxed">
              Every blend is completely free from nicotine, tobacco, and chemical flavor enhancers. Crafted for purity and natural wellness.
            </p>
          </div>

          <div className="rounded-[10px] border border-[#E5DFD2] bg-[#FFFFFF] p-6 shadow-none">
            <span className="font-serif text-xl font-bold text-[#B58A45] mb-2 block">02</span>
            <h3 className="font-serif text-xl text-[#173D2C] mb-2 font-medium">
              Farm-Direct Vines
            </h3>
            <p className="text-[13px] text-[#292A23]/75 leading-relaxed">
              We procure pristine betel leaves directly from generational growers in Varanasi, Bihar, and West Bengal, picked fresh at dawn.
            </p>
          </div>

          <div className="rounded-[10px] border border-[#E5DFD2] bg-[#FFFFFF] p-6 shadow-none">
            <span className="font-serif text-xl font-bold text-[#B58A45] mb-2 block">03</span>
            <h3 className="font-serif text-xl text-[#173D2C] mb-2 font-medium">
              40-Day Sun-Cured Gulkand
            </h3>
            <p className="text-[13px] text-[#292A23]/75 leading-relaxed">
              Authentic Damask rose petals cured naturally under sunlight in glass jars with organic rock sugar to preserve delicate aromatics.
            </p>
          </div>
        </div>

        {/* Narrative Box */}
        <div className="rounded-[12px] border border-[#E5DFD2] bg-[#FFFFFF] p-8 sm:p-12 space-y-6 text-[15px] text-[#292A23]/80 leading-relaxed shadow-none">
          <h2 className="font-serif text-2xl sm:text-3xl text-[#173D2C] font-normal">
            A timeless ritual, reimagined for today.
          </h2>
          <p>
            For more than two millennia, the sharing of paan (Tambula) in India was celebrated as the ultimate gesture of gracious hospitality, respect, and digestive comfort after meals. It graced royal banquet halls and humble family gatherings with equal dignity.
          </p>
          <p>
            In modern times, commercial tobacco and synthetic essences diminished this exquisite botanical art. At Paanmandii, we are on a mission to bring back the authentic sensory experience of real paan — crisp green leaves, gentle tannins from natural acacia wood kattha, cooling fennel, and floral rose notes.
          </p>
          <p>
            Whether served at festive wedding dinners, family reunions, or enjoyed as a personal evening digestif, Paanmandii brings you the pure essence of Indian botanical craftsmanship.
          </p>
          <div className="pt-6 border-t border-[#E5DFD2] flex items-center gap-3 text-xs text-[#292A23]/60">
            <MapPin className="h-4 w-4 text-[#52734A] shrink-0" />
            <span>Dedicated central facilities sourcing from Varanasi, Bihar, Bengal and shipping nationwide.</span>
          </div>
        </div>
      </div>
    </div>
  )
}
