import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { getCrowdAwareAttractions } from "@/lib/crowd-management"
import { generateItineraryWithGemini, generateHeuristicItinerary } from "@/lib/gemini-ai"
import { isRateLimited, getRateLimitIdentifier, rateLimitConfigs } from "@/lib/rate-limit"
import type { UserPreferences } from "@/lib/gemini-ai"

// Request validation schema
const regenerateItinerarySchema = z.object({
  sessionId: z.string(),
  pace: z.enum(["relaxed", "balanced", "maximize"]).optional(),
  interests: z.array(z.string()).optional(),
  preferences: z.object({
    dietary: z.array(z.string()).optional(),
    lowWalking: z.boolean().optional(),
    mustSee: z.array(z.string()).optional()
  }).optional()
})

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const identifier = getRateLimitIdentifier(request)
    const rateLimit = isRateLimited(identifier, rateLimitConfigs.regenerateItinerary)
    
    if (rateLimit.limited) {
      return NextResponse.json(
        { 
          error: "Too many requests", 
          message: "Please wait before regenerating another itinerary",
          retryAfter: Math.ceil((rateLimit.resetTime - Date.now()) / 1000)
        },
        { 
          status: 429,
          headers: {
            "X-RateLimit-Remaining": rateLimit.remaining.toString(),
            "X-RateLimit-Reset": new Date(rateLimit.resetTime).toISOString()
          }
        }
      )
    }

    // Parse and validate request body
    const body = await request.json()
    const validatedData = regenerateItinerarySchema.parse(body)

    // Fetch existing session
    const session = await prisma.userSession.findUnique({
      where: { id: validatedData.sessionId }
    })

    if (!session) {
      return NextResponse.json(
        { error: "Session not found" },
        { status: 404 }
      )
    }

    // Update session if new preferences provided
    const updatedSession = await prisma.userSession.update({
      where: { id: session.id },
      data: {
        pace: validatedData.pace || session.pace,
        interests: validatedData.interests 
          ? JSON.stringify(validatedData.interests) 
          : session.interests,
        preferences: validatedData.preferences 
          ? JSON.stringify(validatedData.preferences) 
          : session.preferences
      }
    })

    // Parse preferences
    const userPreferences: UserPreferences = {
      arrivalTime: new Date(updatedSession.arrivalTime),
      departureTime: new Date(updatedSession.departureTime),
      hotelLocation: updatedSession.hotelLocation || undefined,
      pace: updatedSession.pace as "relaxed" | "balanced" | "maximize",
      interests: JSON.parse(updatedSession.interests),
      preferences: updatedSession.preferences ? JSON.parse(updatedSession.preferences) : undefined
    }

    // Delete old itinerary
    await prisma.itinerary.deleteMany({
      where: { sessionId: session.id }
    })

    // Get crowd-aware attractions with updated preferences
    const attractions = await getCrowdAwareAttractions(
      userPreferences.interests,
      userPreferences.pace
    )

    if (attractions.length === 0) {
      return NextResponse.json(
        { error: "No attractions available" },
        { status: 404 }
      )
    }

    // Generate new itinerary with Gemini AI (with fallback)
    let itineraryResult
    try {
      itineraryResult = await generateItineraryWithGemini(userPreferences, attractions)
    } catch (aiError) {
      console.error("Gemini AI failed, using heuristic fallback:", aiError)
      itineraryResult = generateHeuristicItinerary(userPreferences, attractions)
    }

    // Save new itinerary to database
    const itineraryEntries = []
    for (const day of itineraryResult.days) {
      const timeBlocks = [
        { block: "morning", slot: day.morning },
        { block: "afternoon", slot: day.afternoon },
        { block: "evening", slot: day.evening }
      ]

      for (const { block, slot } of timeBlocks) {
        if (!slot) continue

        itineraryEntries.push({
          sessionId: session.id,
          dayNumber: day.day,
          timeBlock: block,
          attractionId: slot.attractionId,
          reasoningText: slot.whyChosen,
          timeRange: slot.timeRange,
          whyChosen: slot.whyChosen
        })
      }
    }

    await prisma.itinerary.createMany({
      data: itineraryEntries
    })

    // Return response
    return NextResponse.json({
      sessionId: session.id,
      itinerary: itineraryResult.days,
      excludedPlaces: itineraryResult.excludedPlaces,
      optimizations: itineraryResult.optimizations,
      crowdStrategy: itineraryResult.crowdStrategy,
      attractionsUsed: attractions.length,
      regenerated: true
    })
  } catch (error) {
    console.error("Error regenerating itinerary:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "Failed to regenerate itinerary", message: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}
