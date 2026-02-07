import { GoogleGenAI } from "@google/genai"
import type { CrowdAwareAttraction } from "./crowd-management"

export interface FamilyMember {
  age: number
  type: "adult" | "child"
}

export interface UserPreferences {
  arrivalTime: Date
  departureTime: Date
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

export interface GeminiItineraryResponse {
  itinerary: {
    [key: string]: {
      morning?: string
      afternoon?: string
      evening?: string
    }
  }
  excluded_places: string[]
  optimizations: string[]
  crowd_strategy: string
}

export interface ItineraryResult {
  days: DayPlan[]
  excludedPlaces: string[]
  optimizations: string[]
  crowdStrategy: string
}

/**
 * Analyze family composition and generate tailored instructions
 */
function analyzeFamilyComposition(familyMembers: FamilyMember[]) {
  const adults = familyMembers.filter(m => m.type === "adult").length
  const children = familyMembers.filter(m => m.type === "child")
  const youngKids = children.filter(c => c.age <= 5).length
  const olderKids = children.filter(c => c.age > 5 && c.age <= 12).length
  const teens = children.filter(c => c.age > 12).length

  let summary = `${adults} adult(s)`
  if (children.length > 0) {
    summary += `, ${children.length} child(ren)`
    if (youngKids > 0) summary += ` (${youngKids} under 6)`
  }

  const details = `- Adults: ${adults}
${children.length > 0 ? `- Children: ${children.length}
  - Ages: ${children.map(c => c.age).join(", ")} years old
  - Young kids (0-5): ${youngKids}
  - Older kids (6-12): ${olderKids}
  - Teens (13+): ${teens}` : ""}`

  // Generate adjustments based on composition
  const adjustments = []
  
  if (youngKids > 0) {
    adjustments.push("1. **REDUCE daily activities by 30-40%** - young children need more rest")
    adjustments.push("2. **ADD 20-30 minute buffer** between each activity for diaper changes, snacks, meltdowns")
    adjustments.push("3. **PRIORITIZE indoor, air-conditioned venues** - young kids sensitive to heat")
    adjustments.push("4. **AVOID long walking distances** - stroller-friendly routes only")
    adjustments.push("5. **INCLUDE rest periods** - naptime considerations essential")
    adjustments.push("6. **PREFER morning activities** - kids are freshest before noon")
  } else if (olderKids > 0) {
    adjustments.push("1. **REDUCE daily activities by 20%** - kids need breaks")
    adjustments.push("2. **ADD 15-minute buffer** between activities")
    adjustments.push("3. **PRIORITIZE interactive/engaging venues** - museums with hands-on exhibits")
    adjustments.push("4. **INCLUDE kid-friendly restaurants** with children's menus")
    adjustments.push("5. **MIX educational and fun** - balance learning with beach/play time")
  } else if (teens > 0) {
    adjustments.push("1. **KEEP normal pace** - teens can handle adult itineraries")
    adjustments.push("2. **INCLUDE trendy/social venues** - Instagram-worthy spots")
    adjustments.push("3. **PREFER interactive experiences** - teamLab, modern museums")
  }

  if (children.length > 0) {
    adjustments.push(`${adjustments.length + 1}. **VERIFY kid-friendly attractions** - only use attractions with kidFriendly: true`)
    adjustments.push(`${adjustments.length + 1}. **AVOID late evening activities** - children need earlier bedtimes`)
  }

  return {
    summary,
    details,
    adjustments: adjustments.join("\n")
  }
}

/**
 * Build the Gemini prompt with all context
 */
function buildGeminiPrompt(
  preferences: UserPreferences,
  attractions: CrowdAwareAttraction[],
  cityState: {
    currentTemp?: number
    crowdLevel?: string
    timeOfDay?: string
  }
): string {
  const arrivalDate = preferences.arrivalTime.toLocaleDateString()
  const departureDate = preferences.departureTime.toLocaleDateString()
  const numDays = Math.ceil(
    (preferences.departureTime.getTime() - preferences.arrivalTime.getTime()) / (1000 * 60 * 60 * 24)
  )

  // Format attractions for the prompt
  const attractionsText = attractions
    .map(
      (a, i) =>
        `${i + 1}. ${a.name}
   - Category: ${a.category}
   - Themes: ${a.themes.join(", ")}
   - Indoor/Outdoor: ${a.indoorOutdoor}
   - Location: ${a.locationCluster}
   - Duration: ${a.avgDuration} minutes
   - Crowd Level: ${a.crowdLevel}
   - Heat Sensitivity: ${a.heatSensitivity}
   - Current Score: ${a.score.toFixed(2)} (higher is better due to crowd management)
   - Description: ${a.shortDescription || a.description}`
    )
    .join("\n\n")

  // Family composition analysis
  const familyInfo = preferences.familyMembers && preferences.familyMembers.length > 0
    ? analyzeFamilyComposition(preferences.familyMembers)
    : null

  return `You are an expert travel planner for Saadiyat Island, Abu Dhabi. Create a personalized ${numDays}-day layover itinerary.

USER PROFILE:
- Arrival: ${arrivalDate} at ${preferences.arrivalTime.toLocaleTimeString()}
- Departure: ${departureDate} at ${preferences.departureTime.toLocaleTimeString()}
- Hotel: ${preferences.hotelLocation || "Saadiyat Island resort area"}
- Trip Type: ${preferences.tripType || "solo"} ${familyInfo ? `(${familyInfo.summary})` : ""}
- Pace: ${preferences.pace} (${
    preferences.pace === "relaxed"
      ? "fewer activities, more breaks"
      : preferences.pace === "balanced"
      ? "curated highlights"
      : "fit in as much as possible"
  })
- Interests: ${preferences.interests.join(", ")}
${preferences.preferences?.dietary ? `- Dietary: ${preferences.preferences.dietary.join(", ")}` : ""}
${preferences.preferences?.lowWalking ? "- Preference: Low walking" : ""}
${preferences.preferences?.mustSee ? `- Must see: ${preferences.preferences.mustSee.join(", ")}` : ""}
${familyInfo ? `
FAMILY COMPOSITION:
${familyInfo.details}

CRITICAL FAMILY ADJUSTMENTS REQUIRED:
${familyInfo.adjustments}
` : ""}
${preferences.recommendations?.places && preferences.recommendations.places.length > 0 ? `
USER RECOMMENDATIONS (from friends/guides):
The user has received recommendations for: ${preferences.recommendations.places.join(", ")}
⚠️ PRIORITIZE these attractions if they match user interests and are available.
` : ""}

CURRENT CITY STATE:
- Temperature: ${cityState.currentTemp || 28}°C
- Overall Crowd Level: ${cityState.crowdLevel || "medium"}
- Time of Day: ${cityState.timeOfDay || "afternoon"}

AVAILABLE ATTRACTIONS (sorted by crowd-aware score):
${attractionsText}

CRITICAL CONSTRAINTS:
1. **Crowd Distribution**: Attractions with HIGHER scores have BETTER crowd management scores. Prefer higher-scored attractions to distribute crowds effectively.
2. **Location Efficiency**: Group attractions by locationCluster to minimize travel time.
3. **Heat Management**: For outdoor attractions, prefer morning/evening slots. Indoor attractions are safe anytime.
4. **Energy Flow**: Start days easier, build up, then wind down.
5. **Interest Matching**: Prioritize attractions matching user interests.
6. **Pace Respect**: 
   - Relaxed: 2-3 attractions/day, include breaks
   - Balanced: 3-4 attractions/day
   - Maximize: 4-5 attractions/day
7. **Time Blocks**: 
   - Morning: 8:00-12:00
   - Afternoon: 12:00-17:00
   - Evening: 17:00-21:00

CROWD MANAGEMENT STRATEGY:
- DO NOT overuse attractions with crowdLevel: "high"
- If an attraction has a LOW score despite matching interests, it's because of crowd concerns - find alternatives
- Spread visitors across similar-theme alternatives
- Suggest excluded places and explain why

OUTPUT FORMAT (must be valid JSON):
{
  "itinerary": {
    "day_1": {
      "morning": "ATTRACTION_ID",
      "afternoon": "ATTRACTION_ID",
      "evening": "ATTRACTION_ID"
    },
    "day_2": {
      "morning": "ATTRACTION_ID",
      "afternoon": "ATTRACTION_ID",
      "evening": "ATTRACTION_ID"
    }
  },
  "excluded_places": ["Attraction Name: Reason for exclusion"],
  "optimizations": ["Optimization 1", "Optimization 2"],
  "crowd_strategy": "Explain how you balanced crowd distribution"
}

RULES:
- Use ONLY attraction IDs from the list above (e.g., "louvre-abu-dhabi", not "Louvre Abu Dhabi")
- Include 2-4 time slots per day based on pace
- You may leave morning, afternoon, or evening as null/undefined if the pace is relaxed
- All IDs must exactly match the attraction IDs provided
- Provide ONLY the JSON response, no additional text

Generate the itinerary now:`
}

/**
 * Call Gemini AI to generate itinerary
 */
export async function generateItineraryWithGemini(
  preferences: UserPreferences,
  attractions: CrowdAwareAttraction[]
): Promise<ItineraryResult> {
  const apiKey = process.env.GEMINI_API_KEY
  
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is not set")
  }

  const ai = new GoogleGenAI({
    apiKey: apiKey
  })
  
  // Use Gemini 2.0+ models (new SDK designed for Gemini 2.0+)
  // All examples in docs use gemini-2.5-flash
  const modelNames = [
    "gemini-2.5-flash",           // Latest (from SDK docs)
    "gemini-2.0-flash-exp",       // Experimental
    "gemini-1.5-flash",           // Fallback
  ]

  // Build prompt
  const cityState = {
    currentTemp: 28,
    crowdLevel: "medium",
    timeOfDay: new Date().getHours() < 12 ? "morning" : new Date().getHours() < 17 ? "afternoon" : "evening"
  }
  
  const prompt = buildGeminiPrompt(preferences, attractions, cityState)

  // Try each model until one works
  let lastError: Error | null = null
  
  for (const modelName of modelNames) {
    try {
      console.log(`Attempting Gemini with model: ${modelName}`)
      
      // New SDK uses ai.models.generateContent() directly
      const result = await ai.models.generateContent({
        model: modelName,
        contents: prompt
      })
      
      const text = result.text
      
      // If we get here, it worked!
      console.log(`\n🎉 ✓ GEMINI AI WORKING!`)
      console.log(`   Model: ${modelName}`)
      console.log(`   Response length: ${text.length} characters`)
      console.log(`   First 100 chars: ${text.substring(0, 100)}...`)

      // Parse JSON response
      // Remove markdown code blocks if present
      let jsonText = text.trim()
    if (jsonText.startsWith("```json")) {
      jsonText = jsonText.slice(7)
    }
    if (jsonText.startsWith("```")) {
      jsonText = jsonText.slice(3)
    }
    if (jsonText.endsWith("```")) {
      jsonText = jsonText.slice(0, -3)
    }
    
    const geminiResponse: GeminiItineraryResponse = JSON.parse(jsonText.trim())

    // Validate and transform response
    const days: DayPlan[] = []
    let dayNum = 1
    
    for (const [dayKey, dayPlan] of Object.entries(geminiResponse.itinerary)) {
      const dayDate = new Date(preferences.arrivalTime)
      dayDate.setDate(dayDate.getDate() + dayNum - 1)
      
      const day: DayPlan = {
        day: dayNum,
        date: dayDate.toLocaleDateString("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric"
        })
      }

      // Map attraction IDs to full details
      const timeSlots: Array<{ period: "morning" | "afternoon" | "evening"; id: string | undefined }> = [
        { period: "morning", id: dayPlan.morning },
        { period: "afternoon", id: dayPlan.afternoon },
        { period: "evening", id: dayPlan.evening }
      ]

      for (const slot of timeSlots) {
        if (!slot.id) continue

        const attraction = attractions.find(a => a.id === slot.id)
        if (!attraction) continue

        const timeRange = 
          slot.period === "morning" ? "9:00 - 12:00" :
          slot.period === "afternoon" ? "13:00 - 16:00" :
          "17:00 - 20:00"

        day[slot.period] = {
          attractionId: attraction.id,
          attractionName: attraction.name,
          timeRange,
          duration: `${Math.floor(attraction.avgDuration / 60)}h ${attraction.avgDuration % 60}m`,
          whyChosen: `Selected for ${preferences.interests.join(", ")} interests. ${attraction.shortDescription || ""}`,
          tips: attraction.tips
        }
      }

      days.push(day)
      dayNum++
    }

      return {
        days,
        excludedPlaces: geminiResponse.excluded_places || [],
        optimizations: geminiResponse.optimizations || [],
        crowdStrategy: geminiResponse.crowd_strategy || "Balanced crowd distribution"
      }
      
    } catch (error) {
      lastError = error as Error
      const errorMsg = lastError.message.split('\n')[0]
      console.log(`✗ Model ${modelName} failed: ${errorMsg}`)
      continue
    }
  }
  
  // If all models failed
  console.error("\n❌ ALL GEMINI MODELS FAILED - Using Heuristic Fallback")
  console.error("   This means AI isn't generating the itinerary")
  console.error("   But don't worry - the heuristic is smart and uses your preferences!")
  console.error(`   Last error: ${lastError?.message?.substring(0, 200) || "Unknown"}`)
  throw new Error(`Failed to generate itinerary with all models: ${lastError?.message || "Unknown"}`)
}

/**
 * Fallback heuristic itinerary (if Gemini fails)
 */
export function generateHeuristicItinerary(
  preferences: UserPreferences,
  attractions: CrowdAwareAttraction[]
): ItineraryResult {
  const numDays = Math.ceil(
    (preferences.departureTime.getTime() - preferences.arrivalTime.getTime()) / (1000 * 60 * 60 * 24)
  )

  // Adjust for family composition
  const familyInfo = preferences.familyMembers && preferences.familyMembers.length > 0
    ? analyzeFamilyComposition(preferences.familyMembers)
    : null
  
  const youngKids = familyInfo ? preferences.familyMembers!.filter(m => m.type === "child" && m.age <= 5).length : 0
  const olderKids = familyInfo ? preferences.familyMembers!.filter(m => m.type === "child" && m.age > 5 && m.age <= 12).length : 0
  
  let attractionsPerDay = 
    preferences.pace === "relaxed" ? 2 :
    preferences.pace === "balanced" ? 3 : 4
  
  // Reduce for families with kids
  if (youngKids > 0) {
    attractionsPerDay = Math.max(2, Math.floor(attractionsPerDay * 0.6))
  } else if (olderKids > 0) {
    attractionsPerDay = Math.max(2, Math.floor(attractionsPerDay * 0.8))
  }

  // Filter attractions based on user preferences
  let filteredAttractions = [...attractions]
  
  // Filter for kid-friendly if family trip
  if (preferences.tripType === "family" && preferences.familyMembers && preferences.familyMembers.length > 0) {
    filteredAttractions = filteredAttractions.filter(a => a.kidFriendly !== false)
  }
  
  // Prioritize recommended places
  if (preferences.recommendations?.places && preferences.recommendations.places.length > 0) {
    const recommended = filteredAttractions.filter(a => 
      preferences.recommendations!.places!.some(rec => 
        a.name.toLowerCase().includes(rec.toLowerCase()) || rec.toLowerCase().includes(a.name.toLowerCase())
      )
    )
    const others = filteredAttractions.filter(a => !recommended.includes(a))
    filteredAttractions = [...recommended, ...others]
  }
  
  // Score attractions based on interests
  const scoredAttractions = filteredAttractions.map(attr => {
    let interestScore = 0
    const attrThemes = Array.isArray(attr.themes) ? attr.themes : 
                        typeof attr.themes === 'string' ? JSON.parse(attr.themes) : []
    
    preferences.interests.forEach(interest => {
      const interestLower = interest.toLowerCase()
      if (attr.name.toLowerCase().includes(interestLower) ||
          attr.category.toLowerCase().includes(interestLower) ||
          attrThemes.some((t: string) => t.toLowerCase().includes(interestLower))) {
        interestScore += 2
      }
    })
    
    return { ...attr, interestScore }
  })
  
  // Sort by interest score, then crowd score
  scoredAttractions.sort((a, b) => {
    if (b.interestScore !== a.interestScore) return b.interestScore - a.interestScore
    return b.crowdScore - a.crowdScore
  })

  const days: DayPlan[] = []
  const used = new Set<string>()

  for (let dayNum = 1; dayNum <= numDays; dayNum++) {
    const dayDate = new Date(preferences.arrivalTime)
    dayDate.setDate(dayDate.getDate() + dayNum - 1)

    const day: DayPlan = {
      day: dayNum,
      date: dayDate.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric"
      })
    }

    // Morning (indoor preferred for museums, or kid-friendly venues)
    if (attractionsPerDay >= 2) {
      const morningAttr = scoredAttractions.find(a => 
        !used.has(a.id) && 
        (a.indoorOutdoor === "indoor" || a.category === "museum")
      ) || scoredAttractions.find(a => !used.has(a.id))
      
      if (morningAttr) {
        used.add(morningAttr.id)
        day.morning = {
          attractionId: morningAttr.id,
          attractionName: morningAttr.name,
          timeRange: youngKids > 0 ? "9:00 - 11:00" : "9:00 - 12:00",
          duration: `${Math.floor(morningAttr.avgDuration / 60)}h ${morningAttr.avgDuration % 60}m`,
          whyChosen: morningAttr.interestScore > 0 
            ? `Matches your interests in ${preferences.interests.slice(0, 2).join(", ")}.`
            : `Popular morning attraction with ${morningAttr.crowdLevel} crowds.`,
          tips: morningAttr.tips
        }
      }
    }

    // Afternoon
    if (attractionsPerDay >= 3) {
      const afternoonAttr = scoredAttractions.find(a => 
        !used.has(a.id) && 
        (a.category === "dining" || a.category === "cafe" || a.indoorOutdoor === "indoor")
      ) || scoredAttractions.find(a => !used.has(a.id))
      
      if (afternoonAttr) {
        used.add(afternoonAttr.id)
        day.afternoon = {
          attractionId: afternoonAttr.id,
          attractionName: afternoonAttr.name,
          timeRange: youngKids > 0 ? "12:00 - 13:30" : "13:00 - 16:00",
          duration: `${Math.floor(afternoonAttr.avgDuration / 60)}h ${afternoonAttr.avgDuration % 60}m`,
          whyChosen: afternoonAttr.category === "dining" || afternoonAttr.category === "cafe"
            ? "Perfect spot for lunch and relaxation."
            : "Recommended for afternoon visit.",
          tips: afternoonAttr.tips
        }
      }
    }

    // Evening (outdoor/beach/dining preferred)
    const eveningAttr = scoredAttractions.find(a => 
      !used.has(a.id) && 
      (a.category === "beach" || a.category === "dining" || a.indoorOutdoor === "outdoor")
    ) || scoredAttractions.find(a => !used.has(a.id))
    
    if (eveningAttr) {
      used.add(eveningAttr.id)
      day.evening = {
        attractionId: eveningAttr.id,
        attractionName: eveningAttr.name,
        timeRange: youngKids > 0 ? "15:00 - 17:00" : "17:00 - 20:00",
        duration: `${Math.floor(eveningAttr.avgDuration / 60)}h ${eveningAttr.avgDuration % 60}m`,
        whyChosen: eveningAttr.category === "beach" 
          ? "Perfect for evening relaxation and sunset views."
          : "Great way to end your day.",
        tips: eveningAttr.tips
      }
    }

    days.push(day)
  }

  return {
    days,
    excludedPlaces: [],
    optimizations: [
      "Heuristic fallback used (AI temporarily unavailable)",
      `Tailored for ${preferences.pace} pace`,
      familyInfo ? `Adjusted for family with ${preferences.familyMembers!.length} members` : "Solo traveler itinerary",
      preferences.recommendations?.places?.length ? `Prioritized ${preferences.recommendations.places.length} recommended places` : "Based on your interests"
    ],
    crowdStrategy: "Balanced crowd distribution with interest-based selection"
  }
}
