import { NextRequest, NextResponse } from "next/server"
import { GoogleGenAI } from "@google/genai"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { text } = body

    if (!text || typeof text !== "string") {
      return NextResponse.json(
        { error: "Text is required" },
        { status: 400 }
      )
    }

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      // Fallback: basic keyword matching
      return await extractPlacesWithKeywords(text)
    }

    // Use Gemini AI to extract and match place names (using new v1 SDK)
    const ai = new GoogleGenAI({
      apiKey: apiKey
    })

    // Fetch all attractions for matching
    const attractions = await prisma.attraction.findMany({
      select: { id: true, name: true, category: true }
    })

    const prompt = `You are helping a travel planner extract place names from user recommendations.

USER RECOMMENDATIONS TEXT:
"${text}"

AVAILABLE SAADIYAT ISLAND ATTRACTIONS:
${attractions.map(a => `- ${a.name} (${a.category})`).join('\n')}

TASK:
1. Extract all place/attraction names mentioned in the user's text
2. Match them to the available Saadiyat Island attractions
3. Return ONLY matched attraction names

Return ONLY a JSON array of matched attraction names, nothing else:
["Attraction Name 1", "Attraction Name 2"]

If no matches found, return empty array: []`

    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",  // Use Gemini 2.5 (new SDK requires 2.0+)
      contents: prompt
    })
    const responseText = result.text.trim()
    
    // Parse JSON response
    let jsonText = responseText
    if (jsonText.startsWith("```json")) jsonText = jsonText.slice(7)
    if (jsonText.startsWith("```")) jsonText = jsonText.slice(3)
    if (jsonText.endsWith("```")) jsonText = jsonText.slice(0, -3)
    
    const places = JSON.parse(jsonText.trim())

    return NextResponse.json({
      places: Array.isArray(places) ? places : [],
      originalText: text
    })
  } catch (error) {
    console.error("Error extracting places:", error)
    
    // Fallback to keyword matching
    return await extractPlacesWithKeywords(body.text)
  }
}

/**
 * Fallback: Simple keyword matching without AI
 */
async function extractPlacesWithKeywords(text: string) {
  const attractions = await prisma.attraction.findMany({
    select: { name: true }
  })

  const lowerText = text.toLowerCase()
  const matchedPlaces = attractions
    .filter(attr => lowerText.includes(attr.name.toLowerCase()))
    .map(attr => attr.name)

  return NextResponse.json({
    places: matchedPlaces,
    originalText: text,
    method: "keyword-fallback"
  })
}
