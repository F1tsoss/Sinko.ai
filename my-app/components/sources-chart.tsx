"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts"

interface SourcesChartProps {
  brandName: string
}

const data = [
  { name: "Twitter", value: 420 },
  { name: "Instagram", value: 380 },
  { name: "Facebook", value: 210 },
  { name: "Reddit", value: 150 },
  { name: "Reviews", value: 88 },
]

export function SourcesChart({ brandName }: SourcesChartProps) {
  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Mention Sources</CardTitle>
        <CardDescription>Where {brandName} is being mentioned</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical">
              <XAxis type="number" hide />
              <YAxis dataKey="name" type="category" width={80} axisLine={false} tickLine={false} />
              <Tooltip
                formatter={(value) => [`${value} mentions`, "Count"]}
                contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0" }}
              />
              <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
