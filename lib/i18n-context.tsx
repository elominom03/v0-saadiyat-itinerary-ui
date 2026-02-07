"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import enMessages from "@/src/locales/en.json"
import arMessages from "@/src/locales/ar.json"

type Locale = "en" | "ar"
type Messages = typeof enMessages

interface I18nContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: string) => string
  dir: "ltr" | "rtl"
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

const messages: Record<Locale, Messages> = {
  en: enMessages,
  ar: arMessages
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en")

  useEffect(() => {
    // Load saved locale from localStorage
    const savedLocale = localStorage.getItem("locale") as Locale
    if (savedLocale && (savedLocale === "en" || savedLocale === "ar")) {
      setLocaleState(savedLocale)
      updateDirection(savedLocale)
    }
  }, [])

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale)
    localStorage.setItem("locale", newLocale)
    updateDirection(newLocale)
  }

  const updateDirection = (locale: Locale) => {
    const dir = locale === "ar" ? "rtl" : "ltr"
    document.documentElement.dir = dir
    document.documentElement.lang = locale
  }

  const t = (key: string): string => {
    const keys = key.split(".")
    let value: any = messages[locale]
    
    for (const k of keys) {
      value = value?.[k]
    }
    
    return typeof value === "string" ? value : key
  }

  const dir = locale === "ar" ? "rtl" : "ltr"

  return (
    <I18nContext.Provider value={{ locale, setLocale, t, dir }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error("useI18n must be used within I18nProvider")
  }
  return context
}
