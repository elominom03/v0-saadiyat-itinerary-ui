"use client"

import { useState, useCallback } from "react"
import { SetupFlow } from "@/components/setup-flow"
import { LoadingScreen } from "@/components/loading-screen"
import { ItineraryView } from "@/components/itinerary-view"
import type { UserPreferences } from "@/lib/types"
import type { DayItinerary } from "@/lib/mock-data"

type AppScreen = "setup" | "loading" | "itinerary"

export default function Page() {
  console.log("[v0] Page mounted, app is loading correctly")
  const [screen, setScreen] = useState<AppScreen>("setup")
  const [preferences, setPreferences] = useState<UserPreferences | null>(null)
  const [itinerary, setItinerary] = useState<DayItinerary[]>([])
  const [summary, setSummary] = useState("")

  const handleSetupComplete = useCallback((prefs: UserPreferences) => {
    setPreferences(prefs)
    setScreen("loading")
  }, [])

  const handleLoadingComplete = useCallback(
    (generatedItinerary: DayItinerary[], generatedSummary: string) => {
      setItinerary(generatedItinerary)
      setSummary(generatedSummary)
      setScreen("itinerary")
    },
    []
  )

  const handleError = useCallback(() => {
    // Fall back to setup on error
    setScreen("setup")
  }, [])

  const handleEditPreferences = useCallback(() => {
    setScreen("setup")
  }, [])

  if (screen === "setup") {
    return <SetupFlow onComplete={handleSetupComplete} />
  }

  if (screen === "loading" && preferences) {
    return (
      <LoadingScreen
        preferences={preferences}
        onComplete={handleLoadingComplete}
        onError={handleError}
      />
    )
  }

  return (
    <ItineraryView
      itinerary={itinerary}
      summary={summary}
      onEditPreferences={handleEditPreferences}
    />
  )
}
