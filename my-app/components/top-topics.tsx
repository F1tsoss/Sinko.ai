import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface TopTopicsProps {
  mentions: Array<{
    content: string
  }>
}

export function TopTopics({ mentions }: TopTopicsProps) {
  // Extract and count topics from mention content
  const topics = mentions.reduce((acc, mention) => {
    const words = mention.content.toLowerCase().split(/\s+/)
    words.forEach(word => {
      // Skip common words and short words
      if (word.length < 4 || ['the', 'and', 'for', 'that', 'this', 'with', 'are', 'was', 'were'].includes(word)) {
        return
      }
      acc[word] = (acc[word] || 0) + 1
    })
    return acc
  }, {} as Record<string, number>)

  // Sort topics by frequency and get top 10
  const topTopics = Object.entries(topics)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([topic, count]) => ({
      topic,
      count
    }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Topics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topTopics.map((item) => (
            <div key={item.topic} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 rounded-full bg-blue-500" />
                <span className="font-medium capitalize">{item.topic}</span>
              </div>
              <span className="text-sm text-muted-foreground">{item.count} mentions</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
} 