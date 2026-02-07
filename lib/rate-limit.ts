/**
 * Simple in-memory rate limiter for demo purposes
 * For production, use Redis or a proper rate limiting service
 */

interface RateLimitStore {
  [key: string]: {
    count: number
    resetTime: number
  }
}

const store: RateLimitStore = {}

export interface RateLimitConfig {
  windowMs: number // Time window in milliseconds
  maxRequests: number // Max requests per window
}

const defaultConfig: RateLimitConfig = {
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 10 // 10 requests per minute
}

/**
 * Check if a request should be rate limited
 * @param identifier Unique identifier (IP address, user ID, etc.)
 * @param config Rate limit configuration
 * @returns true if rate limited, false if allowed
 */
export function isRateLimited(
  identifier: string,
  config: RateLimitConfig = defaultConfig
): {
  limited: boolean
  remaining: number
  resetTime: number
} {
  const now = Date.now()
  const key = `ratelimit:${identifier}`

  // Clean up expired entries (simple cleanup)
  if (Math.random() < 0.01) {
    // 1% chance to cleanup on each call
    Object.keys(store).forEach(k => {
      if (store[k].resetTime < now) {
        delete store[k]
      }
    })
  }

  // Get or create rate limit entry
  let entry = store[key]
  
  if (!entry || entry.resetTime < now) {
    // Create new window
    entry = {
      count: 0,
      resetTime: now + config.windowMs
    }
    store[key] = entry
  }

  // Increment count
  entry.count++

  const limited = entry.count > config.maxRequests
  const remaining = Math.max(0, config.maxRequests - entry.count)

  return {
    limited,
    remaining,
    resetTime: entry.resetTime
  }
}

/**
 * Get rate limit identifier from request
 * Uses IP address as identifier
 */
export function getRateLimitIdentifier(request: Request): string {
  // Try to get real IP from headers (for proxies/CDNs)
  const forwardedFor = request.headers.get("x-forwarded-for")
  const realIp = request.headers.get("x-real-ip")
  
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim()
  }
  
  if (realIp) {
    return realIp
  }

  // Fallback to a generic identifier
  return "unknown"
}

/**
 * Rate limit configurations for different endpoints
 */
export const rateLimitConfigs = {
  // Itinerary generation is expensive, limit to 5 per minute
  generateItinerary: {
    windowMs: 60 * 1000,
    maxRequests: 5
  },
  // Regeneration is also expensive
  regenerateItinerary: {
    windowMs: 60 * 1000,
    maxRequests: 5
  },
  // Attractions listing is cheaper, allow more
  attractions: {
    windowMs: 60 * 1000,
    maxRequests: 30
  }
}
