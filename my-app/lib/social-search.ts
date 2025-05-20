export async function searchSocialMedia(brandName: string, platforms: string[]): Promise<Array<{
  platform: string
  mentions: Array<{
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
  }>
}>> {
  const results = []

  for (const platform of platforms) {
    try {
      const response = await fetch(`/api/social-search?platform=${platform.toLowerCase()}&query=${encodeURIComponent(brandName)}`, {
        headers: {
          'Accept': 'application/json'
        }
      })
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to parse error response' }))
        console.error(`Error from ${platform}:`, errorData)
        throw new Error(errorData.error || `Failed to fetch from ${platform}`)
      }

      const data = await response.json()
      
      if (!data || !Array.isArray(data.mentions)) {
        console.error(`Invalid data format from ${platform}:`, data)
        throw new Error(`Invalid data format from ${platform}`)
      }
      
      // Transform the data to match our metrics structure
      const mentions = data.mentions.map((mention: any) => ({
        id: mention.id || String(Math.random()),
        content: mention.content || mention.text || mention.title || '',
        author: mention.author || mention.channelTitle || mention.source || 'Unknown',
        timestamp: mention.timestamp || mention.publishedAt || new Date().toISOString(),
        sentiment: calculateSentiment(mention.content || mention.text || mention.title || ''),
        engagement: {
          likes: mention.likes || mention.viewCount || 0,
          shares: mention.shares || mention.retweetCount || 0,
          comments: mention.comments || mention.commentCount || 0
        }
      }))

      results.push({
        platform,
        mentions
      })
    } catch (error) {
      console.error(`Error searching ${platform}:`, error)
      // Add empty result for failed platform
      results.push({
        platform,
        mentions: []
      })
    }
  }

  return results
}

function calculateSentiment(text: string): 'positive' | 'negative' | 'neutral' {
  // Simple sentiment analysis based on keywords
  const positiveWords = ['good', 'great', 'excellent', 'amazing', 'love', 'best', 'awesome', 'perfect', 'happy', 'satisfied', 'recommend', 'impressed']
  const negativeWords = ['bad', 'terrible', 'awful', 'worst', 'hate', 'poor', 'disappointing', 'fail', 'unhappy', 'dissatisfied', 'avoid', 'waste']

  const words = text.toLowerCase().split(/\s+/)
  let positiveCount = 0
  let negativeCount = 0

  for (const word of words) {
    if (positiveWords.includes(word)) positiveCount++
    if (negativeWords.includes(word)) negativeCount++
  }

  if (positiveCount > negativeCount) return 'positive'
  if (negativeCount > positiveCount) return 'negative'
  return 'neutral'
} 