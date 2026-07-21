import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { generateKML, generateKMLFilename, type ItineraryForKML, type AttractionWithDetails } from "@/lib/kml-generator"
import type { DayPlan, TimeSlot } from "@/lib/api-client"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get("sessionId")

    if (!sessionId) {
      return NextResponse.json(
        { error: "sessionId is required" },
        { status: 400 }
      )
    }

    // Fetch session
    const session = await prisma.userSession.findUnique({
      where: { id: sessionId }
    })

    if (!session) {
      return NextResponse.json(
        { error: "Session not found" },
        { status: 404 }
      )
    }

    // Fetch itinerary entries
    const itineraryEntries = await prisma.itinerary.findMany({
      where: { sessionId },
      include: {
        attraction: true
      },
      orderBy: [
        { dayNumber: "asc" },
        { timeBlock: "asc" }
      ]
    })

    if (itineraryEntries.length === 0) {
      return NextResponse.json(
        { error: "No itinerary found for this session" },
        { status: 404 }
      )
    }

    // Group by days and organize by time blocks
    const daysMap = new Map<number, DayPlan>()
    const attractionsMap = new Map<string, AttractionWithDetails>()

    itineraryEntries.forEach((entry) => {
      const dayNumber = entry.dayNumber
      
      // Get or create day
      if (!daysMap.has(dayNumber)) {
        const dayDate = new Date(session.arrivalTime)
        dayDate.setDate(dayDate.getDate() + dayNumber - 1)
        
        daysMap.set(dayNumber, {
          day: dayNumber,
          date: dayDate.toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric"
          })
        })
      }

      const day = daysMap.get(dayNumber)!
      
      // Add attraction details to map
      if (!attractionsMap.has(entry.attractionId)) {
        const attr = entry.attraction
        attractionsMap.set(entry.attractionId, {
          id: attr.id,
          name: attr.name,
          lat: attr.lat,
          lng: attr.lng,
          description: attr.description,
          openingHours: attr.openingHours,
          openingDays: attr.openingDays,
          ticketPrice: attr.ticketPrice,
          website: attr.website,
          phone: attr.phone,
          category: attr.category
        })
      }

      // Create time slot
      const timeSlot: TimeSlot = {
        attractionId: entry.attractionId,
        attractionName: entry.attraction.name,
        timeRange: entry.timeRange || "",
        duration: `${Math.floor(entry.attraction.avgDuration / 60)}h ${entry.attraction.avgDuration % 60}m`,
        whyChosen: entry.whyChosen || entry.reasoningText || "",
        tips: entry.attraction.tips ? JSON.parse(entry.attraction.tips) : []
      }

      // Assign to correct time block
      switch (entry.timeBlock) {
        case "morning":
          day.morning = timeSlot
          break
        case "afternoon":
          day.afternoon = timeSlot
          break
        case "evening":
          day.evening = timeSlot
          break
      }
    })

    // Convert map to array
    const days = Array.from(daysMap.values())

    // Generate KML
    const itineraryForKML: ItineraryForKML = {
      sessionId,
      days,
      attractions: attractionsMap
    }

    const kmlContent = generateKML(itineraryForKML)
    const filename = generateKMLFilename(sessionId)

    // Return as downloadable file
    return new NextResponse(kmlContent, {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.google-earth.kml+xml",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-cache"
      }
    })
  } catch (error) {
    console.error("Error generating KML:", error)
    
    return NextResponse.json(
      { error: "Failed to generate KML file", message: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}
