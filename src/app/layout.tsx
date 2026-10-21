import type { Metadata } from 'next'
import { Cormorant_Garamond, DM_Sans, Noto_Sans_Devanagari } from 'next/font/google'
import './globals.css'
import { CartProvider } from '@/contexts/CartContext'
import { LanguageProvider } from '@/contexts/LanguageContext'
import { Toaster } from 'sonner'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-heading',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-body',
  display: 'swap',
})

const notoDevanagari = Noto_Sans_Devanagari({
  subsets: ['devanagari', 'latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-devanagari',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'PAAN MANDI — Aapki Paan Ki Dukaan, Ab Online! | आपकी पान की दुकान, अब ऑनलाइन!',
    template: '%s | PAAN MANDI',
  },
  description:
    'PAAN MANDI: India’s trusted wholesale paan and shop supplies marketplace. Banarasi leaves, Kattha, Chuna, Gulkand, Cardamom, and all 39 essential mandi items at transparent wholesale rates.',
  keywords: [
    'PAAN MANDI',
    'wholesale paan',
    'banarasi paan',
    'paan leaves wholesale',
    'kattha chuna',
    'gulkand wholesale',
    'paan mandi rate list',
    'पान मंडी',
    'थोक पान',
  ],
  openGraph: {
    type: 'website',
    siteName: 'PAAN MANDI',
    title: 'PAAN MANDI — Aapki Paan Ki Dukaan, Ab Online!',
    description: 'Wholesale paan, leaves, and spices at genuine mandi rates with pan-India delivery.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${cormorant.variable} ${dmSans.variable} ${notoDevanagari.variable}`}>
      <body className="font-sans antialiased bg-[#F6F8F5] text-[#18251D] min-h-screen flex flex-col selection:bg-[#2F855A]/20 selection:text-[#123F2B]">
        <LanguageProvider>
          <CartProvider>
            {children}
            <Toaster position="top-center" richColors />
          </CartProvider>
        </LanguageProvider>
      </body>
    </html>
  )
}
