import { prisma } from "./prisma"

export interface AttractionScore {
  attractionId: string
  baseScore: number
  crowdPenalty: number
  finalScore: number
  crowdLevel: string
  recentAssignments: number
}

export interface CrowdAwareAttraction {
  id: string
  name: string
  category: string
  themes: string[]
  indoorOutdoor: string
  locationCluster: string
  avgDuration: number
  crowdLevel: string
  heatSensitivity: string
  score: number
  crowdScore: number
  recentAssignments: number
  crowdPenalty: number
  description: string
  shortDescription: string | null
  ticketRequired: boolean
  walkingDistance: string | null
  image: string | null
  tips: string[]
  lat: number | null
  lng: number | null
  googleRating?: number | null
  googleReviews?: number | null
  kidFriendly?: boolean
}

/**
 * Calculate how many times an attraction has been assigned in recent itineraries
 * (within the last 24 hours to simulate real-time crowd distribution)
 */
async function getRecentAssignmentCount(attractionId: string): Promise<number> {
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
  
  const count = await prisma.itinerary.count({
    where: {
      attractionId,
      createdAt: {
        gte: oneDayAgo
      }
    }
  })
  
  return count
}

/**
 * Calculate crowd penalty based on:
 * 1. Base crowd level (from attraction metadata)
 * 2. Recent assignment count (dynamic usage)
 */
function calculateCrowdPenalty(
  baseCrowdLevel: string,
  recentAssignments: number
): number {
  // Base penalties
  const basePenalties: Record<string, number> = {
    low: 0,
    medium: 0.15,
    high: 0.3
  }
  
  const basePenalty = basePenalties[baseCrowdLevel] || 0
  
  // Dynamic penalty: increase by 0.1 for every 5 recent assignments
  const dynamicPenalty = Math.min((recentAssignments / 5) * 0.1, 0.4)
  
  // Total penalty (capped at 0.7 to always allow some score)
  return Math.min(basePenalty + dynamicPenalty, 0.7)
}

/**
 * Calculate base score for an attraction based on user preferences
 */
function calculateBaseScore(
  attraction: any,
  userInterests: string[],
  userPace: string
): number {
  let score = 0.5 // Start with neutral score
  
  const themes = JSON.parse(attraction.themes) as string[]
  
  // Interest matching (up to +0.4)
  const matchingInterests = themes.filter(theme => 
    userInterests.some(interest => 
      theme.toLowerCase().includes(interest.toLowerCase()) ||
      interest.toLowerCase().includes(theme.toLowerCase())
    )
  )
  
  score += Math.min(matchingInterests.length * 0.1, 0.4)
  
  // Pace matching
  if (userPace === "relaxed") {
    // Prefer low crowd, shorter duration
    if (attraction.crowdLevel === "low") score += 0.15
    if (attraction.avgDuration <= 120) score += 0.1
  } else if (userPace === "maximize") {
    // Don't penalize high crowd as much, prefer efficient locations
    if (attraction.crowdLevel === "high") score -= 0.05
  }
  
  return Math.min(score, 1.0)
}

/**
 * Get crowd-aware scored attractions for itinerary planning
 */
export async function getCrowdAwareAttractions(
  userInterests: string[],
  userPace: string = "balanced"
): Promise<CrowdAwareAttraction[]> {
  // Fetch all attractions
  const attractions = await prisma.attraction.findMany()
  
  // Calculate scores with crowd penalties
  const scoredAttractions = await Promise.all(
    attractions.map(async (attraction) => {
      const recentAssignments = await getRecentAssignmentCount(attraction.id)
      const baseScore = calculateBaseScore(attraction, userInterests, userPace)
      const crowdPenalty = calculateCrowdPenalty(attraction.crowdLevel, recentAssignments)
      const finalScore = Math.max(baseScore - crowdPenalty, 0)
      
      return {
        ...attraction,
        themes: JSON.parse(attraction.themes) as string[],
        tips: attraction.tips ? JSON.parse(attraction.tips) as string[] : [],
        score: finalScore,
        crowdScore: finalScore,
        recentAssignments,
        crowdPenalty
      }
    })
  )
  
  // Sort by score (highest first)
  return scoredAttractions.sort((a, b) => b.score - a.score)
}

/**
 * Find alternative attractions with similar themes but lower crowd levels
 */
export async function findSimilarLowerCrowdAlternatives(
  attractionId: string,
  limit: number = 3
): Promise<CrowdAwareAttraction[]> {
  const attraction = await prisma.attraction.findUnique({
    where: { id: attractionId }
  })
  
  if (!attraction) return []
  
  const themes = JSON.parse(attraction.themes) as string[]
  const allAttractions = await prisma.attraction.findMany({
    where: {
      NOT: { id: attractionId }
    }
  })
  
  // Find attractions with overlapping themes and lower/equal crowd levels
  const crowdLevelRanking = { low: 0, medium: 1, high: 2 }
  const currentCrowdRank = crowdLevelRanking[attraction.crowdLevel as keyof typeof crowdLevelRanking]
  
  const alternatives = allAttractions
    .filter(alt => {
      const altThemes = JSON.parse(alt.themes) as string[]
      const altCrowdRank = crowdLevelRanking[alt.crowdLevel as keyof typeof crowdLevelRanking]
      
      // Must have at least one overlapping theme and lower/equal crowd
      const hasOverlap = altThemes.some(theme => themes.includes(theme))
      const lowerCrowd = altCrowdRank <= currentCrowdRank
      
      return hasOverlap && lowerCrowd
    })
    .map(alt => ({
      ...alt,
      themes: JSON.parse(alt.themes) as string[],
      tips: alt.tips ? JSON.parse(alt.tips) as string[] : [],
      score: 0,
      crowdScore: 0,
      recentAssignments: 0,
      crowdPenalty: 0
    }))
    .slice(0, limit)
  
  return alternatives
}

/**
 * Get crowd distribution summary for analytics/debugging
 */
export async function getCrowdDistributionSummary() {
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
  
  const recentItineraries = await prisma.itinerary.findMany({
    where: {
      createdAt: {
        gte: oneDayAgo
      }
    },
    include: {
      attraction: true
    }
  })
  
  // Count assignments per attraction
  const assignmentCounts = recentItineraries.reduce((acc, itinerary) => {
    const id = itinerary.attractionId
    acc[id] = (acc[id] || 0) + 1
    return acc
  }, {} as Record<string, number>)
  
  return {
    totalAssignments: recentItineraries.length,
    attractionCounts: assignmentCounts,
    mostUsed: Object.entries(assignmentCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([id, count]) => {
        const itinerary = recentItineraries.find(i => i.attractionId === id)
        return {
          id,
          name: itinerary?.attraction.name || "Unknown",
          count
        }
      })
  }
}
