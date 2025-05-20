import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { BarChart3, Bell, Home, MessageSquare, Settings, Star, TrendingUp, Users } from "lucide-react"
import Link from "next/link"

interface SidebarProps {
  brandName?: string
}

export function Sidebar({ brandName }: SidebarProps) {
  return (
    <div className="flex h-full flex-col border-r bg-background">
      <div className="flex h-14 items-center border-b px-4">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
            SA
          </div>
          <span className="font-semibold">Sinko AI</span>
          {brandName && <span className="text-xs text-muted-foreground">({brandName})</span>}
        </div>
      </div>
      <ScrollArea className="flex-1">
        <nav className="grid gap-1 p-2">
          <Link href="#" passHref legacyBehavior>
            <Button variant="ghost" className="justify-start gap-2 font-normal">
              <Home className="h-4 w-4" />
              Dashboard
            </Button>
          </Link>
          <Link href="#" passHref legacyBehavior>
            <Button variant="ghost" className="justify-start gap-2 font-normal">
              <MessageSquare className="h-4 w-4" />
              Mentions
            </Button>
          </Link>
          <Link href="#" passHref legacyBehavior>
            <Button variant="ghost" className="justify-start gap-2 font-normal">
              <TrendingUp className="h-4 w-4" />
              Analytics
            </Button>
          </Link>
          <Link href="#" passHref legacyBehavior>
            <Button variant="ghost" className="justify-start gap-2 font-normal">
              <Star className="h-4 w-4" />
              Reviews
            </Button>
          </Link>
          <Link href="#" passHref legacyBehavior>
            <Button variant="ghost" className="justify-start gap-2 font-normal">
              <Bell className="h-4 w-4" />
              Alerts
            </Button>
          </Link>
          <Link href="#" passHref legacyBehavior>
            <Button variant="ghost" className="justify-start gap-2 font-normal">
              <Users className="h-4 w-4" />
              Competitors
            </Button>
          </Link>
          <Link href="#" passHref legacyBehavior>
            <Button variant="ghost" className="justify-start gap-2 font-normal">
              <BarChart3 className="h-4 w-4" />
              Reports
            </Button>
          </Link>
          <Link href="#" passHref legacyBehavior>
            <Button variant="ghost" className="justify-start gap-2 font-normal">
              <Settings className="h-4 w-4" />
              Settings
            </Button>
          </Link>
        </nav>
      </ScrollArea>
      <div className="border-t p-4">
        <div className="flex items-center gap-4">
          <div className="h-9 w-9 rounded-full bg-muted">
            <img
              src="/placeholder.svg?height=36&width=36"
              alt="Avatar"
              className="rounded-full"
              height={36}
              width={36}
            />
          </div>
          <div className="grid gap-0.5 text-sm">
            <div className="font-medium">Sarah Johnson</div>
            <div className="text-xs text-muted-foreground">sarah@company.com</div>
          </div>
        </div>
      </div>
    </div>
  )
}
