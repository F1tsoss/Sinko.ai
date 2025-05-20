"use client"

import { Bell, Menu, Search, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useState } from "react"
import { Sidebar } from "@/components/sidebar"

interface DashboardHeaderProps {
  brandName?: string
}

export function DashboardHeader({ brandName }: DashboardHeaderProps) {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72 p-0">
          <Sidebar brandName={brandName} />
        </SheetContent>
      </Sheet>
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
            SA
          </div>
          <span className="font-semibold">Sinko AI</span>
        </div>
      </div>
      <div className="relative flex-1 md:grow-0 md:basis-1/3">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder={brandName ? `Search ${brandName} mentions...` : "Search mentions..."}
          className="w-full rounded-lg bg-background pl-8 md:w-full"
        />
      </div>
      <div className="ml-auto flex items-center gap-4">
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
            3
          </span>
          <span className="sr-only">Notifications</span>
        </Button>
        <Button variant="outline" size="icon">
          <Settings className="h-5 w-5" />
          <span className="sr-only">Settings</span>
        </Button>
        <Button>Refresh Data</Button>
      </div>
    </header>
  )
}
