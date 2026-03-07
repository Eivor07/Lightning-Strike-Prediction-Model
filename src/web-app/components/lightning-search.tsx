"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Search, Loader2, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useLightningLocations } from "./lightning-data-processor"

// Define the coordinates for our lightning risk zones
const highRiskCoordinates = [
  [-36.2, 169.7],
  [-34.3, 167.9],
  [-37.1, 166.9],
  [-34.3, 167.1],
  [-35.3, 166.7],
  [-33.2, 167.8],
  [-33.8, 167.2],
  [-33.7, 166.9],
  [-36.1, 168.4],
  [-33.7, 168.4],
  [-33.4, 168.2],
  [-34.6, 169.7],
  [-40.2, 166.1],
  [-35.0, 166.5],
  [-33.8, 166.9],
  [-36.0, 167.4],
  [-33.4, 168.3],
  [-35.8, 168.9],
  [-34.2, 166.7],
  [-36.5, 167.0],
]

const moderateRiskCoordinates = [
  [-40.2, 166.7],
  [-42.8, 169.1],
  [-42.1, 170.1],
  [-41.4, 170.2],
  [-42.0, 167.7],
  [-40.7, 171.2],
  [-40.3, 166.4],
  [-41.5, 166.5],
  [-41.1, 169.9],
  [-40.2, 166.8],
  [-40.9, 168.4],
  [-41.0, 168.5],
  [-40.2, 167.4],
  [-40.0, 167.9],
  [-41.3, 168.9],
]

const lowRiskCoordinates = [
  [-35.6, 177.3],
  [-33.9, 177.3],
  [-35.9, 177.2],
  [-36.6, 177.4],
  [-37.3, 173.2],
  [-37.9, 173.1],
  [-36.4, 172.5],
  [-36.0, 172.6],
  [-36.0, 172.5],
  [-36.3, 172.9],
  [-36.2, 172.8],
  [-36.3, 173.0],
  [-36.6, 173.2],
  [-36.7, 173.2],
  [-36.7, 173.2],
]

// Mock geocoding data for New Zealand locations
const locationCoordinates: Record<string, [number, number]> = {
  auckland: [-36.8509, 174.7645],
  wellington: [-41.2865, 174.7762],
  christchurch: [-43.5321, 172.6362],
  hamilton: [-37.787, 175.2793],
  tauranga: [-37.6878, 176.1651],
  napier: [-39.4928, 176.912],
  dunedin: [-45.8788, 170.5028],
  "palmerston north": [-40.3523, 175.6082],
  nelson: [-41.2706, 173.284],
  rotorua: [-38.1368, 176.2497],
  "new plymouth": [-39.0556, 174.0752],
  whangarei: [-35.7275, 174.3166],
  invercargill: [-46.4132, 168.3538],
  whanganui: [-39.93, 175.05],
  gisborne: [-38.6533, 178.0042],
  queenstown: [-45.0312, 168.6626],
  waikato: [-37.787, 175.2793],
  "bay of plenty": [-37.6878, 176.1651],
  northland: [-35.7275, 174.3166],
  taranaki: [-39.0556, 174.0752],
}

// Calculate distance between two coordinates using Haversine formula
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371 // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1)
  const dLon = deg2rad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const d = R * c // Distance in km
  return d
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180)
}

// Find the risk level for a given coordinate
function findRiskLevel(lat: number, lon: number): { level: "high" | "moderate" | "low" | "none"; distance: number } {
  let closestDistance = Number.POSITIVE_INFINITY
  let riskLevel: "high" | "moderate" | "low" | "none" = "none"

  // Check high risk zones
  for (const coord of highRiskCoordinates) {
    const distance = calculateDistance(lat, lon, coord[0], coord[1])
    if (distance < closestDistance) {
      closestDistance = distance
      riskLevel = "high"
    }
  }

  // Check moderate risk zones
  for (const coord of moderateRiskCoordinates) {
    const distance = calculateDistance(lat, lon, coord[0], coord[1])
    if (distance < closestDistance) {
      closestDistance = distance
      riskLevel = "moderate"
    }
  }

  // Check low risk zones
  for (const coord of lowRiskCoordinates) {
    const distance = calculateDistance(lat, lon, coord[0], coord[1])
    if (distance < closestDistance) {
      closestDistance = distance
      riskLevel = "low"
    }
  }

  // If the closest point is more than 100km away, consider it no risk
  if (closestDistance > 100) {
    riskLevel = "none"
  }

  return { level: riskLevel, distance: closestDistance }
}

export function LightningSearch() {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResult, setSearchResult] = useState<{
    location: string
    coordinates: [number, number]
    risk: { level: "high" | "moderate" | "low" | "none"; distance: number }
    region?: string
  } | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedRegion, setSelectedRegion] = useState<string>("all")

  // Get locations from the CSV data
  const { locations, loading: locationsLoading } = useLightningLocations()
  const [allLocations, setAllLocations] = useState<Record<string, [number, number]>>(locationCoordinates)
  const [regions, setRegions] = useState<string[]>([])

  // Update locations when CSV data is loaded
  useEffect(() => {
    if (locations.length > 0) {
      const newLocations: Record<string, [number, number]> = { ...locationCoordinates }
      const regionSet = new Set<string>()

      locations.forEach((loc) => {
        newLocations[loc.name.toLowerCase()] = loc.coordinates
        regionSet.add(loc.region)
      })

      setAllLocations(newLocations)
      setRegions(Array.from(regionSet).sort())
    }
  }, [locations])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // Simulate API call delay
    setTimeout(() => {
      const query = searchQuery.trim().toLowerCase()

      // Check if the location exists in our data
      if (allLocations[query]) {
        const coordinates = allLocations[query]
        const risk = findRiskLevel(coordinates[0], coordinates[1])

        // Find region if it's from our dataset
        const locationData = locations.find(
          (loc) =>
            loc.name.toLowerCase() === query ||
            (loc.coordinates[0] === coordinates[0] && loc.coordinates[1] === coordinates[1]),
        )

        setSearchResult({
          location: query.charAt(0).toUpperCase() + query.slice(1),
          coordinates,
          risk,
          region: locationData?.region,
        })
        setLoading(false)
      } else {
        // Try to find a partial match
        const filteredLocations = Object.keys(allLocations).filter((location) => {
          // If a region is selected, only show locations in that region
          if (selectedRegion !== "all") {
            const locationData = locations.find(
              (loc) =>
                loc.name.toLowerCase() === location ||
                (loc.coordinates[0] === allLocations[location][0] && loc.coordinates[1] === allLocations[location][1]),
            )
            if (locationData && locationData.region !== selectedRegion) {
              return false
            }
          }
          return location.includes(query)
        })

        if (filteredLocations.length > 0) {
          const matchedLocation = filteredLocations[0]
          const coordinates = allLocations[matchedLocation]
          const risk = findRiskLevel(coordinates[0], coordinates[1])

          // Find region if it's from our dataset
          const locationData = locations.find(
            (loc) =>
              loc.name.toLowerCase() === matchedLocation ||
              (loc.coordinates[0] === coordinates[0] && loc.coordinates[1] === coordinates[1]),
          )

          setSearchResult({
            location: matchedLocation.charAt(0).toUpperCase() + matchedLocation.slice(1),
            coordinates,
            risk,
            region: locationData?.region,
          })
          setLoading(false)
        } else {
          setError("Location not found. Please try a different location in New Zealand.")
          setSearchResult(null)
          setLoading(false)
        }
      }
    }, 1000)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <Select value={selectedRegion} onValueChange={setSelectedRegion}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Select Region" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Regions</SelectItem>
            {regions.map((region) => (
              <SelectItem key={region} value={region}>
                {region}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <form onSubmit={handleSearch} className="flex w-full items-center space-x-2">
          <Input
            type="text"
            placeholder="Search location (e.g., Auckland)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" disabled={loading || !searchQuery.trim()}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            <span className="ml-2 hidden sm:inline">Search</span>
          </Button>
        </form>
      </div>

      {locationsLoading && (
        <div className="flex items-center justify-center py-4">
          <Loader2 className="h-6 w-6 animate-spin text-blue-500 mr-2" />
          <span>Loading location data...</span>
        </div>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {searchResult && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-lg">{searchResult.location}</h3>
                  {searchResult.region && (
                    <p className="text-sm text-muted-foreground flex items-center">
                      <MapPin className="h-3 w-3 mr-1" />
                      {searchResult.region}
                    </p>
                  )}
                  <p className="text-sm text-muted-foreground">
                    {searchResult.coordinates[0].toFixed(4)}, {searchResult.coordinates[1].toFixed(4)}
                  </p>
                </div>
                <RiskBadge level={searchResult.risk.level} />
              </div>

              <p className="text-sm mt-2">
                {searchResult.risk.level === "none"
                  ? "This location is not currently in a lightning risk zone."
                  : `This location is in a ${searchResult.risk.level} risk zone. The nearest lightning activity is approximately ${Math.round(searchResult.risk.distance)} km away.`}
              </p>

              {searchResult.risk.level !== "none" && (
                <div className="mt-2 text-sm">
                  <strong>Recommendation: </strong>
                  {searchResult.risk.level === "high" && "Seek shelter immediately. Avoid open areas and tall objects."}
                  {searchResult.risk.level === "moderate" &&
                    "Be prepared to seek shelter. Monitor weather conditions closely."}
                  {searchResult.risk.level === "low" && "Stay alert to changing weather conditions."}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="mt-4">
        <h3 className="text-sm font-medium mb-2">Recent Lightning Activity Locations:</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 max-h-32 overflow-y-auto">
          {locations
            .filter((loc) => selectedRegion === "all" || loc.region === selectedRegion)
            .slice(0, 9)
            .map((location, index) => {
              const risk = findRiskLevel(location.coordinates[0], location.coordinates[1])
              return (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="justify-start overflow-hidden text-ellipsis whitespace-nowrap"
                  onClick={() => {
                    setSearchQuery(location.name.toLowerCase())
                    const coordinates = location.coordinates
                    setSearchResult({
                      location: location.name,
                      coordinates,
                      risk,
                      region: location.region,
                    })
                  }}
                >
                  <div
                    className={`w-2 h-2 rounded-full mr-2 ${
                      risk.level === "high"
                        ? "bg-red-500"
                        : risk.level === "moderate"
                          ? "bg-orange-500"
                          : risk.level === "low"
                            ? "bg-yellow-500"
                            : "bg-green-500"
                    }`}
                  />
                  <span className="truncate">{location.name}</span>
                </Button>
              )
            })}
        </div>
      </div>
    </div>
  )
}

function RiskBadge({ level }: { level: "high" | "moderate" | "low" | "none" }) {
  const colors = {
    high: "bg-red-100 text-red-800 border-red-200",
    moderate: "bg-orange-100 text-orange-800 border-orange-200",
    low: "bg-yellow-100 text-yellow-800 border-yellow-200",
    none: "bg-green-100 text-green-800 border-green-200",
  }

  const labels = {
    high: "High Risk",
    moderate: "Moderate Risk",
    low: "Low Risk",
    none: "No Risk",
  }

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${colors[level]}`}>{labels[level]}</span>
  )
}
