"use client"

import type React from "react"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { MentionsFeed } from "@/components/mentions-feed"
import { MetricsCards } from "@/components/metrics-cards"
import { SentimentAnalysis } from "@/components/sentiment-analysis"
import { MentionSources } from "@/components/mention-sources"
import { TopTopics } from "@/components/top-topics"
import { AlertsPanel } from "@/components/alerts-panel"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { XCircle } from "lucide-react"

const SOCIAL_PLATFORMS = ['YouTube', 'Google', 'Forums']

interface SearchResult {
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
}

async function searchSocialMedia(brandName: string): Promise<SearchResult[]> {
  const results: SearchResult[] = []
  
  // Search each platform one by one
  for (const platform of SOCIAL_PLATFORMS) {
    try {
      const response = await fetch(`/api/social-search?platform=${platform}&query=${encodeURIComponent(brandName)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
      })
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to parse error response' }))
        console.error(`Error from ${platform}:`, errorData)
        throw new Error(errorData.error || `Failed to fetch from ${platform}`)
      }
      
      const data = await response.json().catch(error => {
        console.error(`Error parsing response from ${platform}:`, error)
        throw new Error(`Invalid response from ${platform}`)
      })
      
      if (!data || !Array.isArray(data.mentions)) {
        console.error(`Invalid data format from ${platform}:`, data)
        throw new Error(`Invalid data format from ${platform}`)
      }
      
      // Add brand name to mentions content for better context
      const mentions = data.mentions.map((mention: any) => ({
        ...mention,
        content: mention.content.replace(/product|service|company/g, brandName)
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

export function BrandSetup() {
  const [brandName, setBrandName] = useState('')
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<Array<{
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
  }>>([])
  const [error, setError] = useState<string | null>(null)
  const [hasSearched, setHasSearched] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!brandName || selectedPlatforms.length === 0) return

    setIsSearching(true)
    setError(null)
    setSearchResults([])
    setHasSearched(false)

    try {
      const results = await searchSocialMedia(brandName)
      setSearchResults(results)
      setHasSearched(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while searching')
    } finally {
      setIsSearching(false)
    }
  }

  if (isSearching) {
    return (
      <div className="flex min-h-screen flex-col">
        <DashboardHeader brandName={brandName} />
        <div className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
            <h2 className="mt-4 text-xl font-semibold">Analyzing brand mentions for "{brandName}"</h2>
            <div className="mt-4 space-y-2">
              <p className="text-muted-foreground">Searching social media...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col">
        <DashboardHeader brandName={brandName} />
        <div className="flex flex-1 items-center justify-center">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-2xl text-destructive">Error</CardTitle>
              <CardDescription>{error}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full"
                onClick={() => {
                  setError(null)
                  setBrandName("")
                  setSelectedPlatforms([])
                  setHasSearched(false)
                }}
              >
                Try Again
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (!hasSearched) {
    return (
      <div className="flex min-h-screen flex-col">
        <DashboardHeader brandName="" />
        <main className="flex-1 p-6 md:p-8 flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-2xl">Welcome to Sinko AI</CardTitle>
              <CardDescription>Enter your brand details to start monitoring your online reputation</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="brand-name">Brand Name</Label>
                  <Input
                    id="brand-name"
                    placeholder="Enter your brand name"
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="platforms">Platforms</Label>
                  <div className="flex space-x-2">
                    {SOCIAL_PLATFORMS.map((platform) => (
                      <Button
                        key={platform}
                        type="button"
                        variant={selectedPlatforms.includes(platform) ? "default" : "outline"}
                        onClick={() => {
                          if (selectedPlatforms.includes(platform)) {
                            setSelectedPlatforms(selectedPlatforms.filter((p) => p !== platform))
                          } else {
                            setSelectedPlatforms([...selectedPlatforms, platform])
                          }
                        }}
                      >
                        {platform}
                      </Button>
                    ))}
                  </div>
                </div>
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={!brandName.trim() || selectedPlatforms.length === 0}
                >
                  Start Monitoring
                </Button>
              </form>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  // Calculate total mentions and sentiment distribution
  const totalMentions = searchResults.reduce((total, result) => total + result.mentions.length, 0)
  const sentimentCounts = searchResults.reduce((counts, result) => {
    result.mentions.forEach(mention => {
      counts[mention.sentiment] = (counts[mention.sentiment] || 0) + 1
    })
    return counts
  }, {} as Record<string, number>)

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader brandName={brandName} />
      <main className="flex-1 space-y-6 p-6 md:p-8">
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{brandName} Reputation Dashboard</h1>
              <p className="text-muted-foreground">
                Found {totalMentions} mentions across {searchResults.filter(r => r.mentions.length > 0).length} platforms
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => {
                setBrandName("")
                setSelectedPlatforms([])
                setSearchResults([])
                setHasSearched(false)
              }}
            >
              Change Brand
            </Button>
          </div>
        </div>
        <MetricsCards brandName={brandName} searchResults={searchResults} />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <SentimentAnalysis mentions={searchResults.flatMap(r => r.mentions)} />
          <MentionSources results={searchResults} />
          <TopTopics mentions={searchResults.flatMap(r => r.mentions)} />
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2">
            <MentionsFeed brandName={brandName} searchResults={searchResults} />
          </div>
          <AlertsPanel brandName={brandName} />
        </div>
      </main>
    </div>
  )
}
