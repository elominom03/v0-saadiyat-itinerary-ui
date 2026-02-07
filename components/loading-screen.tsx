"use client"

import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"

interface LoadingScreenProps {
  onComplete: () => void
}

const messages = [
  "Designing your Saadiyat experience...",
  "Curating the best stops for you...",
  "Optimizing for a smooth layover...",
  "Almost ready...",
]

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [messageIndex, setMessageIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => {
        if (prev < messages.length - 1) return prev + 1
        return prev
      })
    }, 1200)

    const timeout = setTimeout(() => {
      onComplete()
    }, 4000)

    return () => {
      clearInterval(interval)
      clearTimeout(timeout)
    }
  }, [onComplete])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-6">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <div className="flex flex-col items-center gap-2 text-center">
        <p className="text-sm font-medium text-foreground transition-all duration-300">
          {messages[messageIndex]}
        </p>
        <p className="text-xs text-muted-foreground">
          Tailored to your preferences
        </p>
      </div>
    </div>
  )
}
