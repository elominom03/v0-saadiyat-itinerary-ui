import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { isRateLimited, getRateLimitIdentifier, rateLimitConfigs } from "@/lib/rate-limit"

export async function GET(request: NextRequest) {
  try {
    // Rate limiting
    const identifier = getRateLimitIdentifier(request)
    const rateLimit = isRateLimited(identifier, rateLimitConfigs.attractions)
    
    if (rateLimit.limited) {
      return NextResponse.json(
        { 
          error: "Too many requests", 
          message: "Please wait before making more requests",
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

    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const crowdLevel = searchParams.get("crowdLevel")
    const indoorOutdoor = searchParams.get("indoorOutdoor")

    // Build filter query
    const where: any = {}
    if (category) where.category = category
    if (crowdLevel) where.crowdLevel = crowdLevel
    if (indoorOutdoor) where.indoorOutdoor = indoorOutdoor

    // Fetch attractions
    const attractions = await prisma.attraction.findMany({
      where,
      orderBy: {
        name: "asc"
      }
    })

    // Parse JSON fields
    const formattedAttractions = attractions.map(attraction => ({
      ...attraction,
      themes: JSON.parse(attraction.themes),
      tips: attraction.tips ? JSON.parse(attraction.tips) : []
    }))

    return NextResponse.json({
      attractions: formattedAttractions,
      total: formattedAttractions.length
    })
  } catch (error) {
    console.error("Error fetching attractions:", error)
    
    return NextResponse.json(
      { error: "Failed to fetch attractions", message: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}
