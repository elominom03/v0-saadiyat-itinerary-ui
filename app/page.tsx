"use client"

import { useState, useCallback } from "react"
import { SetupFlow } from "@/components/setup-flow"
import { LoadingScreen } from "@/components/loading-screen"
import { ItineraryView } from "@/components/itinerary-view"

type AppScreen = "setup" | "loading" | "itinerary"

export default function Page() {
  const [screen, setScreen] = useState<AppScreen>("setup")

  const handleLoadingComplete = useCallback(() => {
    setScreen("itinerary")
  }, [])

  if (screen === "setup") {
    return <SetupFlow onComplete={() => setScreen("loading")} />
  }

  if (screen === "loading") {
    return <LoadingScreen onComplete={handleLoadingComplete} />
  }

  return <ItineraryView onEditPreferences={() => setScreen("setup")} />
}
