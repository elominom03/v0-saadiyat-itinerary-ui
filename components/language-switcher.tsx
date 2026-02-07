"use client"

import { Button } from "@/components/ui/button"
import { useI18n } from "@/lib/i18n-context"
import { Globe } from "lucide-react"

export function LanguageSwitcher() {
  const { locale, setLocale } = useI18n()

  const toggleLanguage = () => {
    setLocale(locale === "en" ? "ar" : "en")
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleLanguage}
      className="fixed top-4 right-4 z-50 gap-2"
    >
      <Globe className="h-4 w-4" />
      {locale === "en" ? "العربية" : "English"}
    </Button>
  )
}
