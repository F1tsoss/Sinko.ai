import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowDown, ArrowUp, MessageSquare, Star, TrendingUp, Users } from "lucide-react"

interface MetricsCardsProps {
  brandName: string
  searchResults: Array<{
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
  }>
}

export function MetricsCards({ brandName, searchResults }: MetricsCardsProps) {
  // Calculate total mentions
  const totalMentions = searchResults.reduce((total, result) => total + result.mentions.length, 0)
  
  // Calculate sentiment score (0-10 scale)
  const sentimentScores = searchResults.flatMap(result => 
    result.mentions.map(mention => {
      switch (mention.sentiment) {
        case 'positive': return 8
        case 'neutral': return 5
        case 'negative': return 2
        default: return 5
      }
    })
  )
  const averageSentiment = sentimentScores.length > 0 
    ? (sentimentScores.reduce((a, b) => a + b, 0) / sentimentScores.length).toFixed(1)
    : '0.0'

  // Calculate review rating (0-5 scale)
  const reviewRatings = searchResults.flatMap(result => 
    result.mentions.map(mention => {
      switch (mention.sentiment) {
        case 'positive': return 4.5
        case 'neutral': return 3.0
        case 'negative': return 1.5
        default: return 3.0
      }
    })
  )
  const averageRating = reviewRatings.length > 0 
    ? (reviewRatings.reduce((a, b) => a + b, 0) / reviewRatings.length).toFixed(1)
    : '0.0'

  // Calculate competitor mentions
  const competitorMentions = searchResults.reduce((total, result) => {
    const mentions = result.mentions.filter(mention => 
      mention.content.toLowerCase().includes('competitor') || 
      mention.content.toLowerCase().includes('alternative') ||
      mention.content.toLowerCase().includes('vs')
    )
    return total + mentions.length
  }, 0)

  // Calculate week-over-week changes (placeholder values for now)
  const totalMentionsChange = '+12%'
  const sentimentChange = '+3%'
  const ratingChange = '-0.2'
  const competitorMentionsChange = '+18%'

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Mentions</CardTitle>
          <MessageSquare className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalMentions}</div>
          <p className="text-xs text-muted-foreground">
            <span className="text-emerald-500 flex items-center">
              <ArrowUp className="mr-1 h-4 w-4" />
              {totalMentionsChange}
            </span>{" "}
            from last week
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Sentiment Score</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{averageSentiment}</div>
          <p className="text-xs text-muted-foreground">
            <span className="text-emerald-500 flex items-center">
              <ArrowUp className="mr-1 h-4 w-4" />
              {sentimentChange}
            </span>{" "}
            from last week
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Review Rating</CardTitle>
          <Star className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{averageRating}</div>
          <p className="text-xs text-muted-foreground">
            <span className="text-rose-500 flex items-center">
              <ArrowDown className="mr-1 h-4 w-4" />
              {ratingChange}
            </span>{" "}
            from last month
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Competitor Mentions</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{competitorMentions}</div>
          <p className="text-xs text-muted-foreground">
            <span className="text-emerald-500 flex items-center">
              <ArrowUp className="mr-1 h-4 w-4" />
              {competitorMentionsChange}
            </span>{" "}
            from last week
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
