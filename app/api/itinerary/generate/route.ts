import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { getCrowdAwareAttractions } from "@/lib/crowd-management"
import { generateItineraryWithGemini, generateHeuristicItinerary } from "@/lib/gemini-ai"
import { isRateLimited, getRateLimitIdentifier, rateLimitConfigs } from "@/lib/rate-limit"
import type { UserPreferences } from "@/lib/gemini-ai"

// Request validation schema
const generateItinerarySchema = z.object({
  arrivalTime: z.string().datetime(),
  departureTime: z.string().datetime(),
  hotelLocation: z.string().optional(),
  pace: z.enum(["relaxed", "balanced", "maximize"]),
  interests: z.array(z.string()).min(1),
  preferences: z.object({
    dietary: z.array(z.string()).optional(),
    lowWalking: z.boolean().optional(),
    mustSee: z.array(z.string()).optional()
  }).optional(),
  tripType: z.enum(["solo", "family"]).optional(),
  familyMembers: z.array(z.object({
    age: z.number(),
    type: z.enum(["adult", "child"])
  })).optional(),
  recommendations: z.object({
    text: z.string().optional(),
    places: z.array(z.string()).optional()
  }).optional()
})

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const identifier = getRateLimitIdentifier(request)
    const rateLimit = isRateLimited(identifier, rateLimitConfigs.generateItinerary)
    
    if (rateLimit.limited) {
      return NextResponse.json(
        { 
          error: "Too many requests", 
          message: "Please wait before generating another itinerary",
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
    const validatedData = generateItinerarySchema.parse(body)

    // Convert to UserPreferences format
    const userPreferences: UserPreferences = {
      arrivalTime: new Date(validatedData.arrivalTime),
      departureTime: new Date(validatedData.departureTime),
      hotelLocation: validatedData.hotelLocation,
      pace: validatedData.pace,
      interests: validatedData.interests,
      preferences: validatedData.preferences
    }

    // Create user session
    const session = await prisma.userSession.create({
      data: {
        arrivalTime: userPreferences.arrivalTime,
        departureTime: userPreferences.departureTime,
        hotelLocation: userPreferences.hotelLocation || null,
        pace: userPreferences.pace,
        interests: JSON.stringify(userPreferences.interests),
        preferences: JSON.stringify(userPreferences.preferences || {}),
        tripType: validatedData.tripType || "solo",
        familyMembers: validatedData.familyMembers ? JSON.stringify(validatedData.familyMembers) : null,
        recommendations: validatedData.recommendations ? JSON.stringify(validatedData.recommendations) : null
      }
    })

    // Get crowd-aware attractions
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

    // Generate itinerary with Gemini AI (with fallback)
    let itineraryResult
    let usedAI = false
    try {
      console.log("\n🤖 Attempting AI generation with Gemini...")
      itineraryResult = await generateItineraryWithGemini(userPreferences, attractions)
      usedAI = true
      console.log("✅ AI generation successful!")
    } catch (aiError) {
      console.error("\n⚠️  Gemini AI failed, using smart heuristic fallback")
      console.error("   Error:", aiError instanceof Error ? aiError.message.substring(0, 150) : "Unknown")
      itineraryResult = generateHeuristicItinerary(userPreferences, attractions)
      console.log("✅ Heuristic fallback successful!")
    }
    console.log(`\n📊 Generation Method: ${usedAI ? '🤖 AI (Gemini)' : '🧠 Smart Heuristic'}`)

    // Save itinerary to database
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

    // Return response with full itinerary details
    return NextResponse.json({
      sessionId: session.id,
      itinerary: itineraryResult.days,
      excludedPlaces: itineraryResult.excludedPlaces,
      optimizations: itineraryResult.optimizations,
      crowdStrategy: itineraryResult.crowdStrategy,
      attractionsUsed: attractions.length
    })
  } catch (error) {
    console.error("Error generating itinerary:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "Failed to generate itinerary", message: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}
