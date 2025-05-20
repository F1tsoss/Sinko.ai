import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { LRUCache } from 'lru-cache'
import { Redis } from '@upstash/redis'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Initialize Redis client for distributed rate limiting
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL || '',
  token: process.env.UPSTASH_REDIS_TOKEN || '',
})

// Initialize LRU cache for local caching
const cache = new LRUCache({
  max: 500, // Maximum number of items
  ttl: 1000 * 60 * 60, // 1 hour TTL
})

// Rate limiting configuration
const RATE_LIMITS = {
  twitter: { maxRequests: 50, windowMs: 1000 * 60 * 15 }, // 50 requests per 15 minutes
  youtube: { maxRequests: 100, windowMs: 1000 * 60 * 60 }, // 100 requests per hour
  google: { maxRequests: 100, windowMs: 1000 * 60 * 60 }, // 100 requests per hour
  forums: { maxRequests: 200, windowMs: 1000 * 60 * 60 }, // 200 requests per hour
}

// Rate limiting function
export async function rateLimit(platform: string, key: string): Promise<boolean> {
  const limit = RATE_LIMITS[platform as keyof typeof RATE_LIMITS]
  if (!limit) return true

  const now = Date.now()
  const windowKey = `${platform}:${key}:${Math.floor(now / limit.windowMs)}`
  
  const requests = await redis.incr(windowKey)
  if (requests === 1) {
    await redis.expire(windowKey, Math.ceil(limit.windowMs / 1000))
  }

  return requests <= limit.maxRequests
}

// Caching function
export async function getCachedData<T>(key: string, fetchFn: () => Promise<T>): Promise<T> {
  const cached = cache.get(key)
  if (cached) {
    return cached as T
  }

  const data = await fetchFn()
  cache.set(key, data)
  return data
}

// Sentiment analysis function using a simple keyword-based approach
export function analyzeSentiment(text: string): 'positive' | 'negative' | 'neutral' {
  const positiveWords = [
    'good', 'great', 'excellent', 'amazing', 'love', 'best', 'perfect',
    'awesome', 'fantastic', 'wonderful', 'happy', 'satisfied', 'impressed'
  ]
  const negativeWords = [
    'bad', 'terrible', 'awful', 'horrible', 'worst', 'hate', 'disappointed',
    'poor', 'useless', 'waste', 'problem', 'issue', 'complaint'
  ]

  const words = text.toLowerCase().split(/\W+/)
  let positiveCount = 0
  let negativeCount = 0

  words.forEach(word => {
    if (positiveWords.includes(word)) positiveCount++
    if (negativeWords.includes(word)) negativeCount++
  })

  if (positiveCount > negativeCount) return 'positive'
  if (negativeCount > positiveCount) return 'negative'
  return 'neutral'
}

// Error handling utility
export class ScrapingError extends Error {
  constructor(
    message: string,
    public platform: string,
    public originalError?: any
  ) {
    super(message)
    this.name = 'ScrapingError'
  }
}

// Retry utility for failed requests
export async function withRetry<T>(
  fn: () => Promise<T>,
  retries = 3,
  delay = 1000
): Promise<T> {
  try {
    return await fn()
  } catch (error) {
    if (retries === 0) throw error
    await new Promise(resolve => setTimeout(resolve, delay))
    return withRetry(fn, retries - 1, delay * 2)
  }
}

// Network error detection
export function isNetworkError(error: any): boolean {
  return (
    error.code === 'ECONNREFUSED' ||
    error.code === 'ETIMEDOUT' ||
    error.code === 'ENOTFOUND' ||
    error.message?.includes('network') ||
    error.message?.includes('timeout')
  )
}
