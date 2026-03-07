"use client"

import type React from "react"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { Search } from "lucide-react"
import { useRouter } from "next/navigation"

export function Nav() {
  const [search, setSearch] = useState("")
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (search.trim()) {
      router.push(`/city/${encodeURIComponent(search.trim())}`)
    }
  }

  return (
    <header className="container mx-auto py-4 px-4 sm:px-6 sm:py-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <Link href="/" className="text-2xl font-bold text-blue-900">
          WeatherSafe
        </Link>
        <nav className="flex flex-wrap items-center gap-2 sm:gap-4">
          <Link href="/">
            <Button variant="ghost">Home</Button>
          </Link>
          <Link href="/lightning-alerts">
            <Button variant="ghost">Lightning Alerts</Button>
          </Link>
          <form onSubmit={handleSearch} className="flex items-center">
            <Input
              type="search"
              placeholder="Search city..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-32 sm:w-auto"
            />
            <Button type="submit" variant="ghost" size="icon">
              <Search className="h-4 w-4" />
              <span className="sr-only">Search</span>
            </Button>
          </form>
        </nav>
      </div>
    </header>
  )
}
