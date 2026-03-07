"use client"

import { useEffect, useState } from "react"

export type LightningDataPoint = {
  lon: number
  lat: number
  only_date: string
  only_time: string
  intensity: number
  altitude: string
  air_pressure: string
  current_kA: string
  energy_released_MJ: string
  humidity_percent: number
  wind_speed_kmh: string
}

export type LocationData = {
  name: string
  coordinates: [number, number]
  region: string
}

// Function to fetch and parse the CSV data
export async function fetchLightningData(): Promise<LightningDataPoint[]> {
  try {
    const response = await fetch(
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/cleaned1-9cLRjnWFdlDGCedmtLuayfM1OVYNfz.csv",
    )
    const text = await response.text()

    // Parse CSV
    const rows = text.split("\n")
    const headers = rows[0].split(",")

    const data: LightningDataPoint[] = []

    for (let i = 1; i < rows.length; i++) {
      if (!rows[i].trim()) continue

      const values = rows[i].split(",")
      const dataPoint: any = {}

      headers.forEach((header, index) => {
        const value = values[index]
        if (header === "lon" || header === "lat" || header === "intensity" || header === "humidity_percent") {
          dataPoint[header] = Number.parseFloat(value)
        } else {
          dataPoint[header] = value
        }
      })

      data.push(dataPoint as LightningDataPoint)
    }

    return data
  } catch (error) {
    console.error("Error fetching lightning data:", error)
    return []
  }
}

// Function to cluster coordinates into locations
export function clusterCoordinates(data: LightningDataPoint[], radius = 0.1): LocationData[] {
  if (data.length === 0) return []

  const clusters: { center: [number, number]; points: LightningDataPoint[] }[] = []

  // New Zealand regions
  const regions: { name: string; bounds: { north: number; south: number; east: number; west: number } }[] = [
    { name: "Northland", bounds: { north: -34.4, south: -36.4, east: 174.5, west: 172.5 } },
    { name: "Auckland", bounds: { north: -36.4, south: -37.3, east: 175.3, west: 174.3 } },
    { name: "Waikato", bounds: { north: -37.3, south: -38.5, east: 176.0, west: 174.5 } },
    { name: "Bay of Plenty", bounds: { north: -37.3, south: -38.5, east: 177.5, west: 176.0 } },
    { name: "Gisborne", bounds: { north: -37.5, south: -39.0, east: 178.5, west: 177.5 } },
    { name: "Hawke's Bay", bounds: { north: -39.0, south: -40.5, east: 177.5, west: 176.0 } },
    { name: "Taranaki", bounds: { north: -38.5, south: -40.0, east: 175.5, west: 173.5 } },
    { name: "Manawatu-Whanganui", bounds: { north: -39.0, south: -41.0, east: 176.5, west: 174.5 } },
    { name: "Wellington", bounds: { north: -40.5, south: -41.5, east: 176.0, west: 174.5 } },
    { name: "Tasman", bounds: { north: -40.5, south: -42.0, east: 173.5, west: 172.0 } },
    { name: "Nelson", bounds: { north: -41.0, south: -41.5, east: 174.0, west: 173.0 } },
    { name: "Marlborough", bounds: { north: -41.0, south: -42.5, east: 174.5, west: 173.0 } },
    { name: "West Coast", bounds: { north: -41.5, south: -44.5, east: 172.0, west: 168.0 } },
    { name: "Canterbury", bounds: { north: -42.0, south: -45.0, east: 174.0, west: 170.0 } },
    { name: "Otago", bounds: { north: -44.0, south: -46.5, east: 171.0, west: 167.5 } },
    { name: "Southland", bounds: { north: -45.0, south: -47.5, east: 169.5, west: 166.0 } },
  ]

  // Function to determine which region a point belongs to
  function getRegion(lat: number, lon: number): string {
    for (const region of regions) {
      if (
        lat <= region.bounds.north &&
        lat >= region.bounds.south &&
        lon <= region.bounds.east &&
        lon >= region.bounds.west
      ) {
        return region.name
      }
    }
    return "Unknown Region"
  }

  // Calculate distance between two points
  function distance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    return Math.sqrt(Math.pow(lat1 - lat2, 2) + Math.pow(lon1 - lon2, 2))
  }

  // Cluster the data points
  for (const point of data) {
    let foundCluster = false

    for (const cluster of clusters) {
      if (distance(point.lat, point.lon, cluster.center[0], cluster.center[1]) <= radius) {
        cluster.points.push(point)
        // Recalculate center
        const avgLat = cluster.points.reduce((sum, p) => sum + p.lat, 0) / cluster.points.length
        const avgLon = cluster.points.reduce((sum, p) => sum + p.lon, 0) / cluster.points.length
        cluster.center = [avgLat, avgLon]
        foundCluster = true
        break
      }
    }

    if (!foundCluster) {
      clusters.push({
        center: [point.lat, point.lon],
        points: [point],
      })
    }
  }

  // Convert clusters to location data
  return clusters.map((cluster, index) => {
    const region = getRegion(cluster.center[0], cluster.center[1])
    return {
      name: `Location ${index + 1} (${region})`,
      coordinates: cluster.center,
      region,
    }
  })
}

export function useLightningLocations(): { locations: LocationData[]; loading: boolean; error: string | null } {
  const [locations, setLocations] = useState<LocationData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)
        const data = await fetchLightningData()

        // Take a sample of the data to avoid processing too many points
        const sampleData = data.filter((_, index) => index % 10 === 0).slice(0, 100)

        const clusteredLocations = clusterCoordinates(sampleData)
        setLocations(clusteredLocations)
        setLoading(false)
      } catch (err) {
        console.error("Error processing lightning data:", err)
        setError("Failed to process lightning data")
        setLoading(false)
      }
    }

    loadData()
  }, [])

  return { locations, loading, error }
}
