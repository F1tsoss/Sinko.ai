"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowUpDown, Check, Facebook, Instagram, MessageSquare, Star, ThumbsUp, Twitter, Youtube, Search, Users } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface MentionsFeedProps {
  brandName: string
  searchResults?: Array<{
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

export function MentionsFeed({ brandName, searchResults = [] }: MentionsFeedProps) {
  // Flatten all mentions from different platforms
  const allMentions = searchResults.flatMap(result => 
    result.mentions.map(mention => ({
      ...mention,
      platform: result.platform.toLowerCase()
    }))
  )

  // Sort mentions by timestamp (most recent first)
  const sortedMentions = [...allMentions].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  )

  const renderMention = (mention: typeof sortedMentions[0]) => (
    <div key={mention.id} className="rounded-lg border p-4">
      <div className="flex items-start gap-4">
        <Avatar>
          <AvatarImage
            src={`/placeholder.svg?height=40&width=40&text=${mention.author[0]}`}
            alt={mention.author}
          />
          <AvatarFallback>{mention.author[0]}</AvatarFallback>
        </Avatar>
        <div className="grid gap-1 flex-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold">@{mention.author}</span>
            {mention.platform === "twitter" && <Twitter className="h-4 w-4 text-sky-500" />}
            {mention.platform === "youtube" && <Youtube className="h-4 w-4 text-red-500" />}
            {mention.platform === "google" && <Search className="h-4 w-4 text-blue-500" />}
            {mention.platform === "forums" && <Users className="h-4 w-4 text-green-500" />}
            <Badge
              variant="outline"
              className={`ml-auto ${
                mention.sentiment === "positive"
                  ? "border-emerald-500 text-emerald-500"
                  : mention.sentiment === "negative"
                    ? "border-rose-500 text-rose-500"
                    : "border-gray-500 text-gray-500"
              }`}
            >
              {mention.sentiment}
            </Badge>
          </div>
          <p className="text-sm">{mention.content}</p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
            <span>{new Date(mention.timestamp).toLocaleString()}</span>
            <div className="flex items-center gap-1">
              <ThumbsUp className="h-3 w-3" />
              <span>{mention.engagement.likes}</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageSquare className="h-3 w-3" />
              <span>{mention.engagement.comments}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-end gap-2">
        <Button variant="outline" size="sm">
          <MessageSquare className="mr-2 h-4 w-4" />
          Reply
        </Button>
        <Button variant="outline" size="sm">
          <Check className="mr-2 h-4 w-4" />
          Mark as Handled
        </Button>
      </div>
    </div>
  )

  return (
    <Card className="col-span-2">
      <CardHeader className="flex flex-row items-center">
        <div className="grid gap-1">
          <CardTitle>Recent Mentions</CardTitle>
          <CardDescription>Monitor what people are saying about {brandName}</CardDescription>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Select defaultValue="recent">
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Most Recent</SelectItem>
              <SelectItem value="engagement">Highest Engagement</SelectItem>
              <SelectItem value="sentiment">Sentiment</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <ArrowUpDown className="h-4 w-4" />
            <span className="sr-only">Sort</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all">
          <TabsList className="mb-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="positive">Positive</TabsTrigger>
            <TabsTrigger value="neutral">Neutral</TabsTrigger>
            <TabsTrigger value="negative">Negative</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="space-y-4">
            {sortedMentions.map(renderMention)}
          </TabsContent>
          <TabsContent value="positive" className="space-y-4">
            {sortedMentions
              .filter(mention => mention.sentiment === "positive")
              .map(renderMention)}
          </TabsContent>
          <TabsContent value="neutral" className="space-y-4">
            {sortedMentions
              .filter(mention => mention.sentiment === "neutral")
              .map(renderMention)}
          </TabsContent>
          <TabsContent value="negative" className="space-y-4">
            {sortedMentions
              .filter(mention => mention.sentiment === "negative")
              .map(renderMention)}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
