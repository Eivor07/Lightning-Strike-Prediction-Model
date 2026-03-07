"use client"

import { useRef, useEffect, useState } from "react"

interface Alert {
  id: number
  level: "high" | "moderate" | "low"
  lat: number
  lng: number
  radius: number
}

interface AlertMapProps {
  alerts: Alert[]
}

export function AlertMap({ alerts }: AlertMapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [mapError, setMapError] = useState(false)

  // Draw the map and alert circles
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const updateCanvasSize = () => {
      const container = canvas.parentElement
      if (container) {
        canvas.width = container.clientWidth
        canvas.height = 400
      }
    }

    updateCanvasSize()
    window.addEventListener("resize", updateCanvasSize)

    // Attempt to load a map background image
    const mapImage = new Image()
    mapImage.crossOrigin = "anonymous"
    mapImage.src = "/placeholder.svg?height=400&width=800"

    mapImage.onload = () => {
      setMapLoaded(true)
      drawMap()
    }

    mapImage.onerror = () => {
      setMapError(true)
      drawFallbackMap()
    }

    function drawMap() {
      if (!ctx) return

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw map background
      ctx.drawImage(mapImage, 0, 0, canvas.width, canvas.height)

      // Draw alert circles
      drawAlertCircles()
    }

    function drawFallbackMap() {
      if (!ctx) return

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw a simple grid background
      ctx.fillStyle = "#f0f8ff"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.strokeStyle = "#ccc"
      ctx.lineWidth = 0.5

      // Draw grid lines
      const gridSize = 40
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, canvas.height)
        ctx.stroke()
      }

      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(canvas.width, y)
        ctx.stroke()
      }

      // Add text indicating it's a fallback map
      ctx.fillStyle = "#666"
      ctx.font = "14px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText("Map Background Unavailable", canvas.width / 2, 20)

      // Draw some city markers
      drawCityMarkers(ctx, canvas.width, canvas.height)

      // Draw alert circles
      drawAlertCircles()
    }

    function drawCityMarkers(ctx: CanvasRenderingContext2D, width: number, height: number) {
      const cities = [
        { name: "Los Angeles", x: width * 0.2, y: height * 0.3 },
        { name: "San Francisco", x: width * 0.15, y: height * 0.15 },
        { name: "Las Vegas", x: width * 0.4, y: height * 0.25 },
        { name: "Phoenix", x: width * 0.5, y: height * 0.4 },
        { name: "Denver", x: width * 0.6, y: height * 0.2 },
        { name: "Dallas", x: width * 0.7, y: height * 0.6 },
        { name: "Chicago", x: width * 0.8, y: height * 0.3 },
        { name: "New York", x: width * 0.9, y: height * 0.25 },
      ]

      cities.forEach((city) => {
        // Draw dot
        ctx.beginPath()
        ctx.arc(city.x, city.y, 3, 0, Math.PI * 2)
        ctx.fillStyle = "#333"
        ctx.fill()

        // Draw name
        ctx.fillStyle = "#333"
        ctx.font = "10px sans-serif"
        ctx.textAlign = "center"
        ctx.fillText(city.name, city.x, city.y + 15)
      })
    }

    function drawAlertCircles() {
      if (!ctx) return

      // Map the lat/lng to canvas coordinates (simplified)
      // In a real app, you would use proper geo projection
      const mapWidth = canvas.width
      const mapHeight = canvas.height

      alerts.forEach((alert) => {
        // Convert lat/lng to x/y (this is a simplified example)
        // In a real app, you would use proper geo projection
        const x = (((alert.lng + 118.4) / 0.4) * mapWidth) / 10
        const y = (((34.2 - alert.lat) / 0.2) * mapHeight) / 10

        // Set circle style based on alert level
        let color
        let alpha

        switch (alert.level) {
          case "high":
            color = "rgba(220, 38, 38, 0.5)" // red
            alpha = 0.5
            break
          case "moderate":
            color = "rgba(249, 115, 22, 0.4)" // orange
            alpha = 0.4
            break
          case "low":
            color = "rgba(234, 179, 8, 0.3)" // yellow
            alpha = 0.3
            break
          default:
            color = "rgba(107, 114, 128, 0.3)" // gray
            alpha = 0.3
        }

        // Draw circle with animation effect
        const pulseRadius = alert.radius * 3 + Math.sin(Date.now() / 1000) * 2

        // Draw circle
        ctx.beginPath()
        ctx.arc(x, y, pulseRadius, 0, Math.PI * 2)
        ctx.fillStyle = color
        ctx.fill()

        // Draw circle border
        ctx.strokeStyle = color.replace(`, ${alpha})`, ", 0.8)")
        ctx.lineWidth = 2
        ctx.stroke()

        // Draw center point
        ctx.beginPath()
        ctx.arc(x, y, 3, 0, Math.PI * 2)
        ctx.fillStyle = color.replace(`, ${alpha})`, ", 1)")
        ctx.fill()
      })

      // Request animation frame for pulsing effect
      requestAnimationFrame(() => {
        if (mapLoaded) {
          drawMap()
        } else if (mapError) {
          drawFallbackMap()
        }
      })
    }

    // Initial draw
    if (mapLoaded) {
      drawMap()
    } else if (mapError) {
      drawFallbackMap()
    }

    return () => {
      window.removeEventListener("resize", updateCanvasSize)
    }
  }, [alerts, mapLoaded, mapError])

  return (
    <div className="relative h-[400px] w-full overflow-hidden rounded-md border bg-background">
      <canvas ref={canvasRef} className="h-full w-full" />
      {!mapLoaded && !mapError && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50">
          <div className="text-center">
            <div className="mb-2 animate-spin text-primary">
              <svg className="h-8 w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </div>
            <p className="text-sm text-muted-foreground">Loading map...</p>
          </div>
        </div>
      )}
    </div>
  )
}
