"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ItineraryCard } from "@/components/itinerary-card"
import { ExperienceModal } from "@/components/experience-modal"
import { ItineraryMap } from "@/components/itinerary-map"
import { useItinerary } from "@/lib/itinerary-context"
import { useI18n } from "@/lib/i18n-context"
import type { Experience } from "@/lib/mock-data"
import {
  RefreshCw,
  UtensilsCrossed,
  Settings2,
  MapPin,
  List,
  Download,
} from "lucide-react"

interface ItineraryViewProps {
  onEditPreferences: () => void
}

export function ItineraryView({ onEditPreferences }: ItineraryViewProps) {
  const { t } = useI18n()
  const { itinerary: itineraryData } = useItinerary()
  const [selectedExperience, setSelectedExperience] =
    useState<Experience | null>(null)
  const [activeDay, setActiveDay] = useState(1)
  const [viewMode, setViewMode] = useState<"list" | "map">("list")

  console.log("🔍 ItineraryView - itineraryData:", itineraryData)
  console.log("🔍 ItineraryView - itinerary array:", itineraryData?.itinerary)
  console.log("🔍 ItineraryView - itinerary length:", itineraryData?.itinerary?.length)

  if (!itineraryData || !itineraryData.itinerary || itineraryData.itinerary.length === 0) {
    console.log("❌ No itinerary data found, showing empty message")
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">{t("itinerary.noItinerary")}</p>
      </div>
    )
  }

  const days = itineraryData.itinerary
  const currentDay = days.find((d: any) => d.day === activeDay)
  
  // Convert time slots to attractions array
  const currentDayAttractions = currentDay ? [
    currentDay.morning,
    currentDay.afternoon,
    currentDay.evening
  ].filter(Boolean) : []

  const handleExportKML = async () => {
    try {
      const response = await fetch("/api/itinerary/export-kml", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itinerary: itineraryData }),
      })
      if (!response.ok) throw new Error("Failed to export KML")
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "saadiyat-itinerary.kml"
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Failed to export KML:", error)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-6 py-4">
          <div>
            <h1 className="font-serif text-xl text-foreground">
              Your Itinerary
            </h1>
            <p className="text-xs text-muted-foreground">
              {days.length} {t("itinerary.days")}
            </p>
          </div>
          <div className="flex items-center gap-1 rounded-lg border border-border bg-card p-1">
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                viewMode === "list"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <List className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">List</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("map")}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                viewMode === "map"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <MapPin className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Map</span>
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-2xl px-6 py-6">
        {/* Day tabs */}
        <div className="mb-6 flex gap-2">
          {days.map((dayItem: any) => (
            <button
              key={dayItem.day}
              type="button"
              onClick={() => setActiveDay(dayItem.day)}
              className={`flex flex-col items-center rounded-xl border-2 px-5 py-3 transition-all duration-200 ${
                activeDay === dayItem.day
                  ? "border-primary bg-primary/5"
                  : "border-border bg-card hover:border-primary/20"
              }`}
            >
              <span
                className={`text-xs font-medium ${
                  activeDay === dayItem.day
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              >
                {t("itinerary.day")} {dayItem.day}
              </span>
              <span
                className={`text-[10px] ${
                  activeDay === dayItem.day
                    ? "text-foreground"
                    : "text-muted-foreground"
                }`}
              >
                {new Date(dayItem.date).toLocaleDateString()}
              </span>
            </button>
          ))}
        </div>

        {viewMode === "list" ? (
          <>
            {/* Timeline */}
            {currentDayAttractions.length > 0 && (
              <div className="relative flex flex-col gap-6">
                {/* Timeline line */}
                <div className="absolute bottom-0 left-5 top-0 w-px bg-border sm:left-6" />

                {currentDayAttractions.map((slot: any, index: number) => (
                  <div key={`${slot.attractionId}-${index}`} className="relative flex gap-4 sm:gap-5">
                    {/* Timeline dot */}
                    <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-primary bg-background sm:h-12 sm:w-12">
                      <span className="text-xs font-semibold text-primary">
                        {index + 1}
                      </span>
                    </div>

                    {/* Card */}
                    <div className="flex-1 pb-2">
                      <ItineraryCard
                        experience={{
                          id: slot?.attractionId || `slot-${index}`,
                          name: slot?.attractionName || "Attraction",
                          timeRange: slot?.timeRange || "",
                          shortDescription: slot?.whyChosen || slot?.shortDescription || "",
                          duration: slot?.duration || "",
                          tips: slot?.tips || [],
                          tags: slot?.tags || [],
                          image: slot?.image || "/images/louvre.jpg",
                          indoor: slot?.indoor !== undefined ? slot.indoor : undefined,
                          ticketRequired: slot?.ticketRequired || false,
                          walkingDistance: slot?.walkingDistance || ""
                        }}
                        onClick={() => setSelectedExperience({
                          id: slot?.attractionId || `slot-${index}`,
                          time: slot?.timeRange || "",
                          title: slot?.attractionName || "Attraction",
                          description: slot?.whyChosen || slot?.shortDescription || "",
                          duration: slot?.duration || "",
                          tips: slot?.tips || []
                        })}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Action buttons */}
            <div className="mt-8 flex flex-col gap-3">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Refine your plan
              </p>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 gap-2 rounded-full text-xs bg-transparent"
                >
                  <RefreshCw className="h-3 w-3" />
                  Fewer activities
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 gap-2 rounded-full text-xs bg-transparent"
                >
                  <UtensilsCrossed className="h-3 w-3" />
                  More food & cafes
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 gap-2 rounded-full text-xs bg-transparent"
                  onClick={onEditPreferences}
                >
                  <Settings2 className="h-3 w-3" />
                  Edit preferences
                </Button>
              </div>
            </div>

            <div className="mt-8 rounded-xl border border-border bg-card p-4">
              <div className="flex items-start justify-between gap-4">
                <p className="text-xs leading-relaxed text-muted-foreground">
                  You can always regenerate — nothing is locked in. Tap any
                  experience to learn more or swap it out.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExportKML}
                  className="shrink-0 gap-2 text-xs"
                >
                  <Download className="h-3 w-3" />
                  Export KML
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="space-y-4">
            {currentDay && (
              <>
                <ItineraryMap itinerary={[currentDay]} />
                <div className="rounded-xl border border-border bg-card p-4 text-xs text-muted-foreground">
                  <p className="font-medium mb-2">Map Legend:</p>
                  <ul className="space-y-1 ml-4">
                    <li>• Blue markers = Attractions</li>
                    <li>• Click markers for details</li>
                    <li>• Routes shown between stops</li>
                  </ul>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Experience detail modal */}
      <ExperienceModal
        experience={selectedExperience}
        onClose={() => setSelectedExperience(null)}
      />
    </div>
  )
}
