/**
 * API client for backend services
 */

export interface FamilyMember {
  age: number
  type: "adult" | "child"
}

export interface GenerateItineraryRequest {
  arrivalTime: string // ISO datetime
  departureTime: string // ISO datetime
  hotelLocation?: string
  pace: "relaxed" | "balanced" | "maximize"
  interests: string[]
  preferences?: {
    dietary?: string[]
    lowWalking?: boolean
    mustSee?: string[]
  }
  tripType?: "solo" | "family"
  familyMembers?: FamilyMember[]
  recommendations?: {
    text?: string
    places?: string[]
  }
}

export interface TimeSlot {
  attractionId: string
  attractionName: string
  timeRange: string
  duration: string
  whyChosen: string
  tips?: string[]
}

export interface DayPlan {
  day: number
  date: string
  morning?: TimeSlot
  afternoon?: TimeSlot
  evening?: TimeSlot
}

export interface GenerateItineraryResponse {
  sessionId: string
  itinerary: DayPlan[]
  excludedPlaces: string[]
  optimizations: string[]
  crowdStrategy: string
  attractionsUsed: number
}

export interface Attraction {
  id: string
  name: string
  category: string
  themes: string[]
  indoorOutdoor: string
  locationCluster: string
  avgDuration: number
  crowdLevel: string
  heatSensitivity: string
  description: string
  shortDescription?: string
  ticketRequired: boolean
  walkingDistance?: string
  image?: string
  tips?: string[]
  lat?: number
  lng?: number
  googleRating?: number
  googleReviews?: number
  kidFriendly?: boolean
  openingHours?: string
  ticketPrice?: string
}

export interface AttractionsResponse {
  attractions: Attraction[]
  total: number
}

export interface RegenerateItineraryRequest {
  sessionId: string
  pace?: "relaxed" | "balanced" | "maximize"
  interests?: string[]
  preferences?: {
    dietary?: string[]
    lowWalking?: boolean
    mustSee?: string[]
  }
}

/**
 * Generate a new itinerary
 */
export async function generateItinerary(
  request: GenerateItineraryRequest
): Promise<GenerateItineraryResponse> {
  const response = await fetch("/api/itinerary/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(request)
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || "Failed to generate itinerary")
  }

  return response.json()
}

/**
 * Get all attractions
 */
export async function getAttractions(filters?: {
  category?: string
  crowdLevel?: string
  indoorOutdoor?: string
}): Promise<AttractionsResponse> {
  const params = new URLSearchParams()
  if (filters?.category) params.append("category", filters.category)
  if (filters?.crowdLevel) params.append("crowdLevel", filters.crowdLevel)
  if (filters?.indoorOutdoor) params.append("indoorOutdoor", filters.indoorOutdoor)

  const url = `/api/attractions${params.toString() ? `?${params.toString()}` : ""}`
  const response = await fetch(url)

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || "Failed to fetch attractions")
  }

  return response.json()
}

/**
 * Regenerate an itinerary with updated preferences
 */
export async function regenerateItinerary(
  request: RegenerateItineraryRequest
): Promise<GenerateItineraryResponse> {
  const response = await fetch("/api/itinerary/regenerate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(request)
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || "Failed to regenerate itinerary")
  }

  return response.json()
}
