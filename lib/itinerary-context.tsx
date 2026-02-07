"use client"

import React, { createContext, useContext, useState, ReactNode } from "react"
import type { GenerateItineraryResponse } from "./api-client"

interface ItineraryContextType {
  itineraryData: GenerateItineraryResponse | null
  setItineraryData: (data: GenerateItineraryResponse | null) => void
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
}

const ItineraryContext = createContext<ItineraryContextType | undefined>(undefined)

export function ItineraryProvider({ children }: { children: ReactNode }) {
  const [itineraryData, setItineraryData] = useState<GenerateItineraryResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  return (
    <ItineraryContext.Provider
      value={{
        itineraryData,
        setItineraryData,
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
