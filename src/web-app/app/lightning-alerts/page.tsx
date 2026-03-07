"use client"

import { useState, Suspense } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, ArrowLeft, Bell, RefreshCw, Loader2 } from "lucide-react"
import { AlertLegend } from "@/components/alert-legend"
import { AlertNotification } from "@/components/alert-notification"
import { WeatherAlert } from "@/components/weather-alert"
import { Nav } from "@/components/nav"
import { LeafletLightningMap } from "@/components/leaflet-lightning-map"
import { LightningSearch } from "@/components/lightning-search"

// Mock data for lightning alerts statistics
const mockAlertData = {
  timestamp: new Date().toISOString(),
  counts: {
    high: 50,
    moderate: 45,
    low: 35,
  },
}

function LoadingCard() {
  return (
    <div className="flex items-center justify-center p-8">
      <Loader2 className="h-8 w-8 animate-spin text-blue-500 mr-2" />
      <span>Loading data...</span>
    </div>
  )
}

export default function LightningAlerts() {
  const [alertData, setAlertData] = useState(mockAlertData)
  const [loading, setLoading] = useState(false)
  const [showNotification, setShowNotification] = useState(false)
  const [activeTab, setActiveTab] = useState("map")

  // Simulate refreshing the alert data
  const refreshAlerts = () => {
    setLoading(true)
    setTimeout(() => {
      // Simulate changing data slightly
      setAlertData({
        counts: {
          high: Math.floor(Math.random() * 10) + 45,
          moderate: Math.floor(Math.random() * 15) + 40,
          low: Math.floor(Math.random() * 20) + 30,
        },
        timestamp: new Date().toISOString(),
      })
      setLoading(false)
      setShowNotification(true)

      // Hide notification after 3 seconds
      setTimeout(() => {
        setShowNotification(false)
      }, 3000)
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100">
      <Nav />

      <main className="container mx-auto py-4 px-4 sm:px-6 sm:py-6">
        <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Link href="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            </Link>
            <h2 className="text-xl sm:text-2xl font-bold text-blue-900">Lightning Alert Zones</h2>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={refreshAlerts}
              disabled={loading}
              variant="outline"
              size="sm"
              className="transition-all duration-300"
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              Refresh Alerts
            </Button>
            <Button variant="outline" size="sm" className="transition-all duration-300">
              <Bell className="mr-2 h-4 w-4" />
              Subscribe
            </Button>
          </div>
        </div>

        <Card className="mb-4">
          <CardHeader className="pb-2">
            <CardTitle>Search Location</CardTitle>
            <CardDescription>Check if a location is in a lightning risk zone</CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<LoadingCard />}>
              <LightningSearch />
            </Suspense>
          </CardContent>
        </Card>

        <Tabs defaultValue="map" value={activeTab} onValueChange={setActiveTab} className="mb-4 sm:hidden">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="map">Map View</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="grid gap-4 sm:gap-6 md:grid-cols-3">
          <div className={`md:col-span-2 ${activeTab === "details" ? "hidden sm:block" : ""}`}>
            <Card className="h-full transition-all duration-300 hover:shadow-md">
              <CardHeader>
                <CardTitle>Lightning Alert Map</CardTitle>
                <CardDescription>Real-time lightning risk zones in New Zealand</CardDescription>
              </CardHeader>
              <CardContent>
                <LeafletLightningMap />
              </CardContent>
            </Card>
          </div>

          <div className={`${activeTab === "map" ? "hidden sm:block" : ""}`}>
            <Card className="mb-4 sm:mb-6 transition-all duration-300 hover:shadow-md">
              <CardHeader>
                <CardTitle>Alert Legend</CardTitle>
                <CardDescription>Understanding the alert levels</CardDescription>
              </CardHeader>
              <CardContent>
                <AlertLegend />
              </CardContent>
            </Card>

            <Card className="mb-4 sm:mb-6 transition-all duration-300 hover:shadow-md">
              <CardHeader>
                <CardTitle>Alert Statistics</CardTitle>
                <CardDescription>Current lightning risk assessment</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium">High Risk Zones</p>
                    <div className="flex items-center">
                      <AlertCircle className="mr-2 h-4 w-4 text-red-500" />
                      <span className="text-2xl font-bold">{alertData.counts.high}</span>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium">Moderate Risk Zones</p>
                    <div className="flex items-center">
                      <AlertCircle className="mr-2 h-4 w-4 text-orange-500" />
                      <span className="text-2xl font-bold">{alertData.counts.moderate}</span>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium">Low Risk Zones</p>
                    <div className="flex items-center">
                      <AlertCircle className="mr-2 h-4 w-4 text-yellow-500" />
                      <span className="text-2xl font-bold">{alertData.counts.low}</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <p className="text-sm text-muted-foreground">
                      Last updated: {new Date(alertData.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <WeatherAlert />
          </div>
        </div>
      </main>

      <footer className="container mx-auto py-6 px-4 sm:px-6 mt-8 sm:mt-12 border-t border-blue-100">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-blue-700">© 2025 WeatherSafe. All rights reserved.</p>
          <p className="text-sm text-blue-700">Data updated: {new Date().toLocaleTimeString()}</p>
        </div>
      </footer>

      {showNotification && (
        <AlertNotification
          title="Alerts Updated"
          message="Lightning alert zones have been refreshed with the latest data."
          onClose={() => setShowNotification(false)}
        />
      )}
    </div>
  )
}
