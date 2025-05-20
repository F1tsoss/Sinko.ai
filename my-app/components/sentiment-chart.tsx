"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts"

interface SentimentChartProps {
  brandName: string
}

const data = [
  { name: "Positive", value: 540, color: "#10b981" },
  { name: "Neutral", value: 620, color: "#6b7280" },
  { name: "Negative", value: 88, color: "#ef4444" },
]

export function SentimentChart({ brandName }: SentimentChartProps) {
  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Sentiment Analysis</CardTitle>
        <CardDescription>Distribution of {brandName} mention sentiment</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => [`${value} mentions`, "Count"]}
                contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
