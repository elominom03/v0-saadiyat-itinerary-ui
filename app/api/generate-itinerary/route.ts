import { generateText, Output } from "ai"
import { z } from "zod"
import { allExperiences } from "@/lib/mock-data"

const itineraryStopSchema = z.object({
  experienceId: z.string().describe("The id of the experience from the venue list"),
  timeRange: z.string().describe("Suggested time range, e.g. '10:00 - 12:30'"),
  whyChosen: z.string().describe("A 1-2 sentence personalized explanation of why this stop was chosen based on the user's preferences"),
})

const daySchema = z.object({
  day: z.number().describe("Day number, starting at 1"),
  date: z.string().describe("Friendly date label, e.g. 'Day 1 - Morning to Evening'"),
  stops: z.array(itineraryStopSchema).describe("Ordered list of stops for this day"),
})

const itineraryOutputSchema = z.object({
  days: z.array(daySchema).describe("Array of day itineraries"),
  summary: z.string().describe("A 2-3 sentence overall summary of the personalized itinerary"),
})

export async function POST(req: Request) {
  const { preferences } = await req.json()

  // Build a condensed venue list for the prompt
  const venueList = allExperiences.map((e) => ({
    id: e.id,
    name: e.name,
    category: e.category,
    cuisine: e.cuisine || null,
    duration: e.duration,
    tags: e.tags,
    indoor: e.indoor,
    ticketRequired: e.ticketRequired,
    shortDescription: e.shortDescription,
  }))

  // Calculate layover duration
  const arrival = new Date(preferences.arrivalDate)
  const departure = new Date(preferences.departureDate)
  const hours = Math.round((departure.getTime() - arrival.getTime()) / (1000 * 60 * 60))
  const days = Math.max(1, Math.ceil(hours / 12))

  const { output } = await generateText({
    model: "openai/gpt-4o-mini",
    output: Output.object({
      schema: itineraryOutputSchema,
    }),
    messages: [
      {
        role: "system",
        content: `You are a luxury travel concierge specializing in Saadiyat Island, Abu Dhabi. You create personalized itineraries for transit passengers and visitors.

Rules:
- Only use experience IDs from the provided venue list. Never invent new IDs.
- Create ${days} day(s) of itinerary.
- Each day should have 4-7 stops depending on pace preference.
- "relaxed" pace = 4 stops max per day with longer breaks.
- "balanced" pace = 5-6 stops per day.
- "packed" pace = 6-7 stops per day.
- Always start the day with a coffee/cafe, then alternate between museums/activities and food.
- Time ranges should be realistic (museums: 1.5-2.5hrs, dining: 1-1.5hrs, coffee: 30min, beach: 1.5-2hrs).
- For families with children, prefer kid-friendly venues (Natural History Museum, teamLab, beaches, casual dining).
- For couples, prefer romantic/premium dining and cultural experiences.
- For solo travelers, include cafes and contemplative spaces.
- For friends groups, include lively restaurants and beach clubs.
- Respect art preferences when selecting museums/galleries.
- Each "whyChosen" should reference the user's specific preferences (group type, interests, art preferences, etc.).
- Do not repeat the same experience across days.`,
      },
      {
        role: "user",
        content: `Create a personalized itinerary for a visitor to Saadiyat Island, Abu Dhabi.

USER PREFERENCES:
- Arrival: ${preferences.arrivalDate}
- Departure: ${preferences.departureDate}
- Layover: ~${hours} hours (${days} day${days > 1 ? "s" : ""})
- Hotel location: ${preferences.hotelLocation}
- Group type: ${preferences.groupType}
- Group size: ${preferences.groupSize} people
${preferences.childrenCount ? `- Children: ${preferences.childrenCount}` : ""}
- Pace: ${preferences.selectedPace}
- Interests: ${preferences.selectedInterests.join(", ")}
${preferences.selectedArtPreferences.length > 0 ? `- Art preferences: ${preferences.selectedArtPreferences.join(", ")}` : ""}
${preferences.selectedExtras.length > 0 ? `- Extras: ${preferences.selectedExtras.join(", ")}` : ""}

AVAILABLE VENUES:
${JSON.stringify(venueList, null, 2)}`,
      },
    ],
  })

  if (!output) {
    return Response.json({ error: "Failed to generate itinerary" }, { status: 500 })
  }

  // Map the AI output back to full experience objects
  const experienceMap = new Map(allExperiences.map((e) => [e.id, e]))

  const itinerary = output.days.map((day) => ({
    day: day.day,
    date: day.date,
    experiences: day.stops
      .map((stop) => {
        const experience = experienceMap.get(stop.experienceId)
        if (!experience) return null
        return {
          ...experience,
          timeRange: stop.timeRange,
          whyChosen: stop.whyChosen,
        }
      })
      .filter(Boolean),
  }))

  return Response.json({ itinerary, summary: output.summary })
}
