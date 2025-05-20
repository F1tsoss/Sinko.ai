import { NextResponse } from 'next/server'
import { exec } from 'child_process'
import { promisify } from 'util'
import youtubeSearch from 'youtube-search'
import { getJson } from 'serpapi'
import * as cheerio from 'cheerio'
import Parser from 'rss-parser'
import { 
  rateLimit, 
  getCachedData, 
  analyzeSentiment, 
  ScrapingError, 
  withRetry, 
  isNetworkError 
} from '@/lib/utils'

const execAsync = promisify(exec)
const parser = new Parser()

// Additional forum RSS feeds
const FORUM_FEEDS = [
  'https://www.reddit.com/r/all/search.rss?q=',
  'https://forum.example.com/feed?q=',
  'https://www.quora.com/feed/topic/',
  'https://stackoverflow.com/feeds/tag/',
  'https://www.producthunt.com/feed?q='
]

interface Mention {
  id: string
  content: string
  author: string
  timestamp: string
  sentiment: 'positive' | 'negative' | 'neutral'
  engagement: {
    likes: number
    shares: number
    comments: number
  }
}

interface RSSItem {
  guid?: string
  link?: string
  title: string
  content?: string
  contentSnippet?: string
  creator?: string
  author?: string
  isoDate?: string
}

interface GoogleSearchResult {
  link: string
  title: string
  snippet: string
  displayed_link: string
}

interface GoogleSearchResponse {
  organic_results: GoogleSearchResult[]
}

interface YouTubeSearchResult {
  id: string
  title: string
  description: string
  channelTitle: string
  publishedAt: string
  statistics?: {
    viewCount: string
  }
}

// Function to search YouTube
async function searchYouTube(query: string): Promise<Mention[]> {
  const cacheKey = `youtube:${query}`
  
  return getCachedData(cacheKey, async () => {
    if (!await rateLimit('youtube', query)) {
      throw new ScrapingError('Rate limit exceeded', 'youtube')
    }

    if (!process.env.YOUTUBE_API_KEY) {
      throw new ScrapingError('YOUTUBE_API_KEY is not configured', 'youtube')
    }

    try {
      const results = await withRetry(() => 
        new Promise<YouTubeSearchResult[]>((resolve, reject) => {
          youtubeSearch(query, {
            maxResults: 10,
            key: process.env.YOUTUBE_API_KEY,
            type: 'video'
          }, (err, results) => {
            if (err) {
              console.error('YouTube search error:', err)
              reject(new ScrapingError(`YouTube search failed: ${err.message}`, 'youtube', err))
            } else if (!results || results.length === 0) {
              console.log('No YouTube results found for query:', query)
              resolve([])
            } else {
              resolve(results as unknown as YouTubeSearchResult[])
            }
          })
        })
      )
      
      if (!results || results.length === 0) {
        return [] // Return empty array if no results found
      }
      
      return results.map(video => ({
        id: video.id,
        content: `${video.title}\n${video.description}`,
        author: video.channelTitle,
        timestamp: video.publishedAt,
        sentiment: analyzeSentiment(`${video.title} ${video.description}`),
        engagement: {
          likes: parseInt(video.statistics?.viewCount || '0'),
          shares: 0,
          comments: 0
        }
      }))
    } catch (error) {
      console.error('YouTube search error:', error)
      if (error instanceof ScrapingError) {
        throw error
      }
      if (isNetworkError(error)) {
        throw new ScrapingError('Network error while searching YouTube', 'youtube', error)
      }
      throw new ScrapingError(
        `Failed to search YouTube: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'youtube',
        error
      )
    }
  })
}

// Function to search Google
async function searchGoogle(query: string): Promise<Mention[]> {
  const cacheKey = `google:${query}`
  
  return getCachedData(cacheKey, async () => {
    if (!await rateLimit('google', query)) {
      throw new ScrapingError('Rate limit exceeded', 'google')
    }

    if (!process.env.SERPAPI_KEY) {
      throw new ScrapingError('SERPAPI_KEY is not configured', 'google')
    }

    try {
      const results = await withRetry(() => 
        getJson({
          engine: 'google',
          q: query,
          api_key: process.env.SERPAPI_KEY,
          num: 10
        })
      ) as GoogleSearchResponse
      
      if (!results.organic_results || results.organic_results.length === 0) {
        return [] // Return empty array if no results found
      }
      
      return results.organic_results.map(result => ({
        id: result.link,
        content: `${result.title}\n${result.snippet}`,
        author: result.displayed_link,
        timestamp: new Date().toISOString(),
        sentiment: analyzeSentiment(`${result.title} ${result.snippet}`),
        engagement: {
          likes: 0,
          shares: 0,
          comments: 0
        }
      }))
    } catch (error) {
      console.error('Google search error:', error)
      if (isNetworkError(error)) {
        throw new ScrapingError('Network error while searching Google', 'google', error)
      }
      throw new ScrapingError('Failed to search Google', 'google', error)
    }
  })
}

// Function to scrape public forums
async function scrapeForums(query: string): Promise<Mention[]> {
  const cacheKey = `forums:${query}`
  
  return getCachedData(cacheKey, async () => {
    if (!await rateLimit('forums', query)) {
      throw new ScrapingError('Rate limit exceeded', 'forums')
    }

    try {
      const results: Mention[] = []
      
      for (const feedUrl of FORUM_FEEDS) {
        try {
          const feed = await withRetry(() => 
            parser.parseURL(feedUrl + encodeURIComponent(query))
          ) as { items: RSSItem[] }
          
          results.push(...feed.items.map(item => ({
            id: item.guid || item.link || item.title,
            content: item.title + '\n' + (item.content || item.contentSnippet || ''),
            author: item.creator || item.author || 'Unknown',
            timestamp: item.isoDate || new Date().toISOString(),
            sentiment: analyzeSentiment(item.title + ' ' + (item.content || item.contentSnippet || '')),
            engagement: {
              likes: 0,
              shares: 0,
              comments: 0
            }
          })))
        } catch (error) {
          console.error(`Error parsing feed ${feedUrl}:`, error)
          // Continue with other feeds even if one fails
        }
      }
      
      return results
    } catch (error) {
      console.error('Forum scraping error:', error)
      if (isNetworkError(error)) {
        throw new ScrapingError('Network error while scraping forums', 'forums', error)
      }
      throw new ScrapingError('Failed to scrape forums', 'forums', error)
    }
  })
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const platform = searchParams.get('platform')
  const query = searchParams.get('query')

  if (!platform || !query) {
    return NextResponse.json(
      { error: 'Platform and query parameters are required' },
      { status: 400 }
    )
  }

  try {
    let mentions: Mention[] = []
    
    switch (platform.toLowerCase()) {
      case 'youtube':
        mentions = await searchYouTube(query)
        break
      case 'google':
        mentions = await searchGoogle(query)
        break
      case 'forums':
        mentions = await scrapeForums(query)
        break
      default:
        return NextResponse.json(
          { error: 'Invalid platform' },
          { status: 400 }
        )
    }
    
    // Ensure we're returning valid JSON
    return NextResponse.json({ 
      mentions,
      platform,
      query,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error(`Error searching ${platform}:`, error)
    
    // Handle specific error types
    if (error instanceof ScrapingError) {
      return NextResponse.json(
        { 
          error: error.message,
          platform: error.platform,
          details: error.originalError?.message,
          timestamp: new Date().toISOString()
        },
        { status: 500 }
      )
    }
    
    // Handle network errors
    if (isNetworkError(error)) {
      return NextResponse.json(
        { 
          error: 'Network error occurred',
          platform,
          details: error instanceof Error ? error.message : 'Unknown network error',
          timestamp: new Date().toISOString()
        },
        { status: 503 }
      )
    }
    
    // Handle other errors
    return NextResponse.json(
      { 
        error: `Failed to search ${platform}`,
        platform,
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
} 