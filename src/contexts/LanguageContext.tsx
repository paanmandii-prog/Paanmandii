'use client'

import React, { createContext, useContext, useEffect, useState, useTransition } from 'react'
import { translations, Language, TranslationKey } from '@/lib/translations'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  toggleLanguage: () => void
  t: (key: TranslationKey, fallback?: string) => string
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  toggleLanguage: () => {},
  t: (key) => translations.en[key] ?? key,
})

const STORAGE_KEY = 'paan_mandi_lang'

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en')
  const [, startTransition] = useTransition()

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as Language | null
      if (saved && (saved === 'en' || saved === 'hi')) {
        setLanguageState(saved)
        document.documentElement.lang = saved
      }
    } catch {
      // localStorage may fail in restricted browser contexts
    }
  }, [])

  const setLanguage = (newLang: Language) => {
    startTransition(() => {
      setLanguageState(newLang)
      try {
        localStorage.setItem(STORAGE_KEY, newLang)
        document.cookie = `${STORAGE_KEY}=${newLang}; path=/; max-age=31536000; SameSite=Lax`
        document.documentElement.lang = newLang
      } catch {
        // ignore storage errors
      }
    })
  }

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'hi' : 'en')
  }

  const t = (key: TranslationKey, fallback?: string): string => {
    const langDict = translations[language] || translations.en
    const val = langDict[key]
    if (val !== undefined) return val
    const enVal = translations.en[key]
    if (enVal !== undefined) return enVal
    return fallback ?? String(key)
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}
