"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface TopicsChartProps {
  brandName: string
}

const topics = [
  { name: "Product Quality", count: 245, sentiment: "positive" },
  { name: "Customer Service", count: 189, sentiment: "negative" },
  { name: "Pricing", count: 156, sentiment: "neutral" },
  { name: "New Features", count: 132, sentiment: "positive" },
  { name: "Delivery", count: 98, sentiment: "negative" },
]

export function TopicsChart({ brandName }: TopicsChartProps) {
  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Top Topics</CardTitle>
        <CardDescription>Most discussed themes in {brandName} mentions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topics.map((topic) => (
            <div key={topic.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className={`${
                    topic.sentiment === "positive"
                      ? "border-emerald-500 text-emerald-500"
                      : topic.sentiment === "negative"
                        ? "border-rose-500 text-rose-500"
                        : "border-gray-500 text-gray-500"
                  }`}
                >
                  {topic.sentiment}
                </Badge>
                <span className="font-medium">{topic.name}</span>
              </div>
              <span className="text-sm text-muted-foreground">{topic.count} mentions</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
