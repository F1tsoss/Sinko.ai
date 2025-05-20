"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Bell, Settings } from "lucide-react"
import { Label } from "@/components/ui/label"

interface AlertsPanelProps {
  brandName: string
}

export function AlertsPanel({ brandName }: AlertsPanelProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Alert Settings</CardTitle>
            <CardDescription>Configure {brandName} notification preferences</CardDescription>
          </div>
          <Button variant="outline" size="icon">
            <Settings className="h-4 w-4" />
            <span className="sr-only">Settings</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="negative-mentions">Negative Mentions</Label>
              <p className="text-xs text-muted-foreground">Alert when negative mentions are detected</p>
            </div>
            <Switch id="negative-mentions" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="high-engagement">High Engagement</Label>
              <p className="text-xs text-muted-foreground">Alert on posts with high engagement</p>
            </div>
            <Switch id="high-engagement" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="competitor-mentions">Competitor Mentions</Label>
              <p className="text-xs text-muted-foreground">Alert when competitors are mentioned with {brandName}</p>
            </div>
            <Switch id="competitor-mentions" />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="review-alerts">New Reviews</Label>
              <p className="text-xs text-muted-foreground">Alert on new {brandName} product/service reviews</p>
            </div>
            <Switch id="review-alerts" defaultChecked />
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="sentiment-threshold">Sentiment Threshold</Label>
            <span className="text-xs text-muted-foreground">4.0</span>
          </div>
          <Slider id="sentiment-threshold" defaultValue={[4]} max={10} step={0.5} />
          <p className="text-xs text-muted-foreground">Alert when sentiment score falls below this value</p>
        </div>
        <Button className="w-full">
          <Bell className="mr-2 h-4 w-4" />
          Test Alerts
        </Button>
      </CardContent>
    </Card>
  )
}
