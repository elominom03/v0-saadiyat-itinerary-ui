"use client"

import { useEffect, useState, useRef } from "react"
import { Loader2 } from "lucide-react"
import type { UserPreferences } from "@/lib/types"
import type { DayItinerary } from "@/lib/mock-data"

interface LoadingScreenProps {
  preferences: UserPreferences
  onComplete: (itinerary: DayItinerary[], summary: string) => void
  onError: () => void
}

const messages = [
  "Analyzing your preferences...",
  "Finding the best stops for your group...",
  "Matching art and culture to your tastes...",
  "Building your personalized timeline...",
  "Optimizing for a smooth layover...",
  "Almost ready...",
]

export function LoadingScreen({ preferences, onComplete, onError }: LoadingScreenProps) {
  const [messageIndex, setMessageIndex] = useState(0)
  const hasStarted = useRef(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => {
        if (prev < messages.length - 1) return prev + 1
        return prev
      })
    }, 1500)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (hasStarted.current) return
    hasStarted.current = true

    async function generate() {
      try {
        const res = await fetch("/api/generate-itinerary", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ preferences }),
        })

        if (!res.ok) throw new Error("Failed to generate")

        const data = await res.json()
        onComplete(data.itinerary, data.summary)
      } catch {
        onError()
      }
    }

    generate()
  }, [preferences, onComplete, onError])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-6">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <div className="flex flex-col items-center gap-2 text-center">
        <p className="text-sm font-medium text-foreground transition-all duration-300">
          {messages[messageIndex]}
        </p>
        <p className="text-xs text-muted-foreground">
          AI is personalizing your Saadiyat experience
        </p>
      </div>
    </div>
  )
}
