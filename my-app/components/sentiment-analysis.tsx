import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

interface SentimentAnalysisProps {
  mentions: Array<{
    sentiment: 'positive' | 'negative' | 'neutral'
  }>
}

export function SentimentAnalysis({ mentions }: SentimentAnalysisProps) {
  // Calculate sentiment distribution
  const sentimentCounts = mentions.reduce((acc, mention) => {
    acc[mention.sentiment] = (acc[mention.sentiment] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const data = [
    { name: 'Positive', value: sentimentCounts.positive || 0, color: '#22c55e' },
    { name: 'Neutral', value: sentimentCounts.neutral || 0, color: '#eab308' },
    { name: 'Negative', value: sentimentCounts.negative || 0, color: '#ef4444' }
  ]

  const total = data.reduce((sum, item) => sum + item.value, 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sentiment Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => [
                  `${value} mentions (${((value / total) * 100).toFixed(1)}%)`,
                  'Count'
                ]}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-4 text-center">
          {data.map((item) => (
            <div key={item.name}>
              <div className="text-2xl font-bold" style={{ color: item.color }}>
                {item.value}
              </div>
              <div className="text-sm text-muted-foreground">{item.name}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
} 