"use client"

import { useEffect, useRef, useState } from "react"
import Script from "next/script"
import { getRiskZones } from "@/lib/api"

export function LeafletLightningMap() {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const initMap = async () => {
      if (!mapContainerRef.current || !window.L) return

      // Clear any existing map
      if (mapRef.current) {
        mapRef.current.remove()
      }

      // Initialize map
      const map = window.L.map(mapContainerRef.current, {
        center: [-38.46838332281929, 171.52154040259217],
        zoom: 5,
        zoomControl: true,
        preferCanvas: true,
        crs: window.L.CRS.EPSG3857,
      })
      mapRef.current = map

      // Add tile layer
      window.L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
        attribution: '&copy; CARTO',
        subdomains: "abcd",
      }).addTo(map)

      try {
        const zones = await getRiskZones()

        zones.forEach((zone: any) => {
          const color = zone.label === 'Red' ? 'red' : (zone.label === 'Orange' ? 'orange' : 'yellow')
          window.L.circleMarker([zone.latitude, zone.longitude], {
            color: color,
            fill: true,
            fillColor: color,
            fillOpacity: 0.6,
            radius: 8,
            weight: 3,
          }).bindPopup(`<strong>${zone.label} Risk Zone</strong><br/>Predicted Center`).addTo(map)
        })
      } catch (err) {
        console.warn("Could not fetch remote zones, falling back to static points", err)
        // Fallback or just empty
      }

      // Add legend
      const legend = window.L.control({ position: "bottomright" })
      legend.onAdd = () => {
        const div = window.L.DomUtil.create("div", "info legend")
        div.style.backgroundColor = "white"
        div.style.padding = "10px"
        div.style.borderRadius = "5px"
        div.style.boxShadow = "0 0 15px rgba(0,0,0,0.2)"
        div.innerHTML = `
          <strong>Lightning Risk</strong>
          <div style="display:flex;align-items:center;margin-top:5px;"><div style="width:12px;height:12px;border-radius:50%;background-color:red;margin-right:8px;"></div>High Risk</div>
          <div style="display:flex;align-items:center;margin-top:5px;"><div style="width:12px;height:12px;border-radius:50%;background-color:orange;margin-right:8px;"></div>Moderate Risk</div>
          <div style="display:flex;align-items:center;margin-top:5px;"><div style="width:12px;height:12px;border-radius:50%;background-color:yellow;margin-right:8px;"></div>Low Risk</div>
        `
        return div
      }
      legend.addTo(map)
      setLoading(false)
    }

    if (window.L) {
      initMap()
    } else {
      window.initLeafletMap = initMap
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
      delete window.initLeafletMap
    }
  }, [])

  return (
    <>
      <Script
        src="https://cdn.jsdelivr.net/npm/leaflet@1.9.3/dist/leaflet.js"
        onLoad={() => {
          if (window.initLeafletMap) {
            window.initLeafletMap()
          }
        }}
      />
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/leaflet@1.9.3/dist/leaflet.css" />
      <div className="relative w-full h-[400px]">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-10">
            <span className="text-blue-900 font-medium">Initializing Map...</span>
          </div>
        )}
        <div ref={mapContainerRef} className="w-full h-full rounded-md overflow-hidden" />
      </div>
    </>
  )
}

declare global {
  interface Window {
    L: any
    initLeafletMap?: () => void
  }
}
