import type { UserPreferences } from "@/lib/types"
import type { DayItinerary, Experience } from "@/lib/mock-data"
import { allExperiences } from "@/lib/mock-data"

/**
 * Maps a backend attraction ID to our local Experience data (for images, tags, etc.)
 * Falls back to a minimal Experience object if the ID isn't in our mock data.
 */
function resolveExperience(
  slot: {
    attractionId: string
    attractionName: string
    timeRange: string
    duration?: string
    whyChosen: string
    tips?: string[]
  },
): Experience {
  const local = allExperiences.find((e) => e.id === slot.attractionId)
  if (local) {
    return {
      ...local,
      timeRange: slot.timeRange,
      whyChosen: slot.whyChosen,
      tips: slot.tips?.length ? slot.tips : local.tips,
    }
  }
  // Fallback for attractions not in our mock data
  return {
    id: slot.attractionId,
    name: slot.attractionName,
    category: "museum",
    description: slot.whyChosen,
    shortDescription: slot.whyChosen,
    duration: slot.duration || "1 hr",
    timeRange: slot.timeRange,
    tags: [],
    indoor: true,
    ticketRequired: false,
    walkingDistance: "Varies",
    image: "/images/saadiyat-hero.jpg",
    whyChosen: slot.whyChosen,
    tips: slot.tips || [],
    lat: 24.54,
    lng: 54.41,
  }
}

/**
 * Convert backend itinerary response (morning/afternoon/evening slots)
 * into our frontend DayItinerary[] format (array of experiences).
 */
interface BackendTimeSlot {
  attractionId: string
  attractionName: string
  timeRange: string
  duration?: string
  whyChosen: string
  tips?: string[]
}

interface BackendDay {
  day: number
  date: string
  morning?: BackendTimeSlot | null
  afternoon?: BackendTimeSlot | null
  evening?: BackendTimeSlot | null
  // Also support array format in case backend sends stops[]
  stops?: BackendTimeSlot[]
}

interface BackendResponse {
  sessionId?: string
  itinerary: BackendDay[]
  crowdStrategy?: string
  optimizations?: string[]
  excludedPlaces?: string[]
}

function convertBackendResponse(data: BackendResponse): {
  itinerary: DayItinerary[]
  summary: string
} {
  const itinerary: DayItinerary[] = data.itinerary.map((day) => {
    const experiences: Experience[] = []

    if (day.stops && day.stops.length > 0) {
      // Array format
      for (const stop of day.stops) {
        experiences.push(resolveExperience(stop))
      }
    } else {
      // morning/afternoon/evening format
      if (day.morning) experiences.push(resolveExperience(day.morning))
      if (day.afternoon) experiences.push(resolveExperience(day.afternoon))
      if (day.evening) experiences.push(resolveExperience(day.evening))
    }

    return {
      day: day.day,
      date: day.date || `Day ${day.day}`,
      experiences,
    }
  })

  const summary =
    data.crowdStrategy ||
    (data.optimizations?.length
      ? data.optimizations.join(". ")
      : "Your personalized itinerary is ready.")

  return { itinerary, summary }
}

/**
 * Calls the backend /api/itinerary/generate endpoint.
 * Maps our UserPreferences to the backend's expected request format.
 */
export async function generateItineraryFromBackend(
  preferences: UserPreferences,
): Promise<{ itinerary: DayItinerary[]; summary: string }> {
  const interestMap: Record<string, string> = {
    Art: "art",
    Beach: "beach",
    Food: "food",
    Spiritual: "spirituality",
    Shopping: "shopping",
    Nature: "nature",
    Architecture: "architecture",
    Family: "family",
  }

  const response = await fetch("/api/itinerary/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      arrivalTime: new Date(preferences.arrivalDate).toISOString(),
      departureTime: new Date(preferences.departureDate).toISOString(),
      hotelLocation: preferences.hotelLocation || "Saadiyat Beach",
      pace: preferences.selectedPace.toLowerCase(),
      interests: preferences.selectedInterests.map(
        (i) => interestMap[i] || i.toLowerCase(),
      ),
      preferences: {
        dietary: [],
        lowWalking: preferences.selectedPace === "relaxed",
        mustSee: [],
        groupType: preferences.groupType,
        groupSize: Number(preferences.groupSize) || 1,
        childrenCount: Number(preferences.childrenCount) || 0,
        artPreferences: preferences.selectedArtPreferences,
      },
    }),
  })

  if (!response.ok) {
    throw new Error(`Backend error: ${response.status}`)
  }

  const data: BackendResponse = await response.json()
  return convertBackendResponse(data)
}
