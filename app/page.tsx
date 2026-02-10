"use client"

import { useState, useCallback, useEffect } from "react"
import { SetupFlow } from "@/components/setup-flow"
import { LoadingScreen } from "@/components/loading-screen"
import { ItineraryView } from "@/components/itinerary-view"
import { useItinerary } from "@/lib/itinerary-context"

type AppScreen = "setup" | "loading" | "itinerary"

export default function Page() {
  const [screen, setScreen] = useState<AppScreen>("setup")
  const { itinerary } = useItinerary()

  // Automatically transition to itinerary view when data is available
  useEffect(() => {
    if (itinerary && screen === "loading") {
      console.log("✅ Itinerary data detected, transitioning to itinerary view")
      setScreen("itinerary")
    }
  }, [itinerary, screen])

  const handleSetupComplete = useCallback(() => {
    console.log("✅ Setup complete, showing loading screen")
    setScreen("loading")
  }, [])

  if (screen === "setup") {
    return <SetupFlow onComplete={handleSetupComplete} />
  }

  if (screen === "loading") {
    return <LoadingScreen onComplete={() => {}} />
  }

  return <ItineraryView onEditPreferences={() => setScreen("setup")} />
}
