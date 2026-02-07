"use client"

import { useEffect, useState, useRef } from "react"
import { Loader2 } from "lucide-react"
import type { UserPreferences } from "@/lib/types"
import type { DayItinerary, Experience } from "@/lib/mock-data"
import { allExperiences } from "@/lib/mock-data"

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

function findExperience(id: string): Experience | undefined {
  return allExperiences.find((e) => e.id === id)
}

function buildHardcodedItinerary(preferences: UserPreferences): { itinerary: DayItinerary[]; summary: string } {
  const isFamily = preferences.groupType === "family"
  const isCouples = preferences.groupType === "couple"
  const isFriends = preferences.groupType === "friends"
  const likesArt = preferences.selectedInterests.includes("Art")
  const likesBeach = preferences.selectedInterests.includes("Beach")
  const likesFood = preferences.selectedInterests.includes("Food")

  // Build Day 1
  const day1Stops: { id: string; timeRange: string; whyChosen: string }[] = [
    {
      id: "museum-cafe-louvre",
      timeRange: "09:00 - 09:45",
      whyChosen: "Start your day with specialty coffee right inside the Louvre campus to ease into the island.",
    },
    {
      id: "louvre-abu-dhabi",
      timeRange: "10:00 - 12:30",
      whyChosen: likesArt
        ? "A must-see for your art interests -- the iconic rain of light dome houses civilizations of creativity."
        : "The crown jewel of Saadiyat Island and an unmissable architectural masterpiece.",
    },
    {
      id: "fouquets-abu-dhabi",
      timeRange: "12:45 - 14:00",
      whyChosen: isCouples
        ? "A romantic French dining experience with views of the museum promenade."
        : "Elegant French cuisine steps from the Louvre -- perfect for a refined lunch.",
    },
    ...(isFamily
      ? [
          {
            id: "natural-history-museum",
            timeRange: "14:30 - 16:30",
            whyChosen: "The kids will love the dinosaur exhibits and interactive displays.",
          },
        ]
      : [
          {
            id: "manarat-al-saadiyat",
            timeRange: "14:30 - 16:00",
            whyChosen: "A rotating gallery space showcasing contemporary exhibitions from the UAE and beyond.",
          },
        ]),
    ...(likesBeach
      ? [
          {
            id: "saadiyat-beach-club",
            timeRange: "16:30 - 18:30",
            whyChosen: "Unwind on pristine white sand with premium service after a culture-rich morning.",
          },
        ]
      : [
          {
            id: "mamsha-al-saadiyat",
            timeRange: "16:30 - 18:00",
            whyChosen: "A scenic beachfront promenade with boutiques and ocean views for a relaxing late afternoon.",
          },
        ]),
    {
      id: isFriends ? "buddha-bar-beach" : isCouples ? "tean" : "hawksbill",
      timeRange: "19:00 - 20:30",
      whyChosen: isFriends
        ? "Lively beachfront dining with Asian-fusion flavors -- great energy for a group."
        : isCouples
          ? "Modern Emirati cuisine in a stylish setting -- a romantic evening choice."
          : "Coastal Mediterranean dining with a relaxed, family-friendly atmosphere.",
    },
  ]

  // Build Day 2
  const day2Stops: { id: string; timeRange: string; whyChosen: string }[] = [
    {
      id: "nayzak-cafe",
      timeRange: "09:00 - 09:45",
      whyChosen: "A local favorite for artisanal coffee and fresh pastries to fuel day two.",
    },
    {
      id: isFamily ? "teamlab-phenomena" : "abrahamic-family-house",
      timeRange: "10:00 - 12:00",
      whyChosen: isFamily
        ? "An immersive, interactive digital art experience the whole family will love."
        : "A powerful symbol of coexistence -- three houses of worship designed by David Adjaye.",
    },
    {
      id: likesFood ? "beirut-sur-mer" : "toto-saadiyat",
      timeRange: "12:30 - 13:45",
      whyChosen: likesFood
        ? "Authentic Lebanese seafood right by the water -- a foodie highlight."
        : "Relaxed Italian dining with ocean views, perfect for a leisurely lunch.",
    },
    {
      id: "bassam-freiha-art-foundation",
      timeRange: "14:15 - 15:45",
      whyChosen: "A hidden gem showcasing bold contemporary art from the Arab world and beyond.",
    },
    {
      id: likesBeach ? "kai-beach" : "saadiyat-grove",
      timeRange: "16:00 - 17:30",
      whyChosen: likesBeach
        ? "A serene, less-crowded beach to soak in the last rays before your flight."
        : "Browse boutique shops and pick up souvenirs at Saadiyat's lifestyle district.",
    },
    {
      id: "sal-saadiyat",
      timeRange: "18:00 - 19:30",
      whyChosen: "End your Saadiyat experience with Spanish-Mediterranean flavors and ocean sunset views.",
    },
  ]

  const mapStops = (stops: { id: string; timeRange: string; whyChosen: string }[]) =>
    stops
      .map((stop) => {
        const exp = findExperience(stop.id)
        if (!exp) return null
        return { ...exp, timeRange: stop.timeRange, whyChosen: stop.whyChosen }
      })
      .filter(Boolean) as Experience[]

  const arrival = new Date(preferences.arrivalDate)
  const departure = new Date(preferences.departureDate)
  const hours = Math.round((departure.getTime() - arrival.getTime()) / (1000 * 60 * 60))
  const days = Math.max(1, Math.ceil(hours / 12))

  const itinerary: DayItinerary[] = [
    { day: 1, date: "Day 1 - Culture & Discovery", experiences: mapStops(day1Stops) },
  ]

  if (days >= 2) {
    itinerary.push({ day: 2, date: "Day 2 - Art, Beach & Flavors", experiences: mapStops(day2Stops) })
  }

  const groupLabel = isFamily ? "your family" : isCouples ? "you two" : isFriends ? "your group" : "you"
  const summary = `We've crafted a ${days}-day itinerary for ${groupLabel}, blending ${preferences.selectedInterests.slice(0, 3).join(", ").toLowerCase()} across Saadiyat Island's best venues. Each stop was chosen to match your ${preferences.selectedPace} pace and make the most of your ${hours}-hour layover.`

  return { itinerary, summary }
}

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
    // Simulate a short delay to show loading messages, then return hardcoded itinerary
    const timer = setTimeout(() => {
      if (hasStarted.current) return
      hasStarted.current = true
      try {
        const { itinerary, summary } = buildHardcodedItinerary(preferences)
        onComplete(itinerary, summary)
      } catch {
        onError()
      }
    }, 3000)

    return () => clearTimeout(timer)
  }, [preferences, onComplete, onError])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-6">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <div className="flex flex-col items-center gap-2 text-center">
        <p className="text-sm font-medium text-foreground transition-all duration-300">
          {messages[messageIndex]}
        </p>
        <p className="text-xs text-muted-foreground">
          Personalizing your Saadiyat experience
        </p>
      </div>
    </div>
  )
}
