"use client"

import React, { createContext, useContext, useState, ReactNode } from "react"
import type { GenerateItineraryResponse } from "./api-client"

interface ItineraryContextType {
  itinerary: GenerateItineraryResponse | null
  setItinerary: (data: GenerateItineraryResponse | null) => void
  error: string | null
  setError: (error: string | null) => void
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
}

const ItineraryContext = createContext<ItineraryContextType | undefined>(undefined)

export function ItineraryProvider({ children }: { children: ReactNode }) {
  const [itinerary, setItinerary] = useState<GenerateItineraryResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  return (
    <ItineraryContext.Provider
      value={{
        itinerary,
        setItinerary,
        error,
        setError,
        isLoading,
        setIsLoading
      }}
    >
      {children}
    </ItineraryContext.Provider>
  )
}

export function useItinerary() {
  const context = useContext(ItineraryContext)
  if (context === undefined) {
    throw new Error("useItinerary must be used within an ItineraryProvider")
  }
  return context
}
