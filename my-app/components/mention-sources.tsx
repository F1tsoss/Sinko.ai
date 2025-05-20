import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface MentionSourcesProps {
  results: Array<{
    platform: string
    mentions: Array<any>
  }>
}

export function MentionSources({ results }: MentionSourcesProps) {
  // Calculate mentions per platform
  const data = results.map(result => ({
    platform: result.platform,
    mentions: result.mentions.length
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mention Sources</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="platform" />
              <YAxis />
              <Tooltip
                formatter={(value: number) => [`${value} mentions`, 'Count']}
              />
              <Bar dataKey="mentions" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-4 text-center">
          {data.map((item) => (
            <div key={item.platform}>
              <div className="text-2xl font-bold text-blue-500">
                {item.mentions}
              </div>
              <div className="text-sm text-muted-foreground">{item.platform}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
} 