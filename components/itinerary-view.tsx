"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ItineraryCard } from "@/components/itinerary-card"
import { ExperienceModal } from "@/components/experience-modal"
import { MapView } from "@/components/map-view"
import type { DayItinerary, Experience } from "@/lib/mock-data"
import {
  RefreshCw,
  UtensilsCrossed,
  Settings2,
  MapPin,
  List,
  Sparkles,
} from "lucide-react"

interface ItineraryViewProps {
  itinerary: DayItinerary[]
  summary: string
  onEditPreferences: () => void
}

export function ItineraryView({ itinerary, summary, onEditPreferences }: ItineraryViewProps) {
  const [selectedExperience, setSelectedExperience] =
    useState<Experience | null>(null)
  const [activeDay, setActiveDay] = useState(1)
  const [viewMode, setViewMode] = useState<"list" | "map">("list")

  const currentDay = itinerary.find((d) => d.day === activeDay)

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
              {itinerary.length} day{itinerary.length > 1 ? "s" : ""} on Saadiyat Island
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
        {/* AI Summary */}
        {summary && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-primary/20 bg-primary/5 p-4">
            <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <p className="text-sm leading-relaxed text-foreground">{summary}</p>
          </div>
        )}

        {/* Day tabs */}
        <div className="mb-6 flex gap-2">
          {itinerary.map((day) => (
            <button
              key={day.day}
              type="button"
              onClick={() => setActiveDay(day.day)}
              className={`flex flex-col items-center rounded-xl border-2 px-5 py-3 transition-all duration-200 ${
                activeDay === day.day
                  ? "border-primary bg-primary/5"
                  : "border-border bg-card hover:border-primary/20"
              }`}
            >
              <span
                className={`text-xs font-medium ${
                  activeDay === day.day
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              >
                Day {day.day}
              </span>
              <span
                className={`text-[10px] ${
                  activeDay === day.day
                    ? "text-foreground"
                    : "text-muted-foreground"
                }`}
              >
                {day.date}
              </span>
            </button>
          ))}
        </div>

        {viewMode === "list" ? (
          <>
            {/* Timeline */}
            {currentDay && (
              <div className="relative flex flex-col gap-6">
                {/* Timeline line */}
                <div className="absolute bottom-0 left-5 top-0 w-px bg-border sm:left-6" />

                {currentDay.experiences.map((experience, index) => (
                  <div key={experience.id} className="relative flex gap-4 sm:gap-5">
                    {/* Timeline dot */}
                    <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-primary bg-background sm:h-12 sm:w-12">
                      <span className="text-xs font-semibold text-primary">
                        {index + 1}
                      </span>
                    </div>

                    {/* Card */}
                    <div className="flex-1 pb-2">
                      <ItineraryCard
                        experience={experience}
                        onClick={() => setSelectedExperience(experience)}
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

            <div className="mt-8 rounded-xl border border-border bg-card p-4 text-center">
              <p className="text-xs leading-relaxed text-muted-foreground">
                This itinerary was personalized by AI based on your preferences.
                Tap any experience to learn more, or edit preferences to regenerate.
              </p>
            </div>
          </>
        ) : (
          currentDay && <MapView experiences={currentDay.experiences} />
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
