"use client"

import { useParams } from "next/navigation"
import { Nav } from "@/components/nav"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CloudRain, CloudSun, Thermometer, Wind } from "lucide-react"
import { useEffect, useState } from "react"

// Mock data for city weather
const mockCityWeather = {
  "New York": { temp: 72, condition: "Partly Cloudy", humidity: 65, windSpeed: 8 },
  "Los Angeles": { temp: 75, condition: "Sunny", humidity: 50, windSpeed: 5 },
  Chicago: { temp: 68, condition: "Cloudy", humidity: 70, windSpeed: 12 },
  Houston: { temp: 82, condition: "Clear", humidity: 60, windSpeed: 7 },
  Phoenix: { temp: 95, condition: "Sunny", humidity: 20, windSpeed: 6 },
  Philadelphia: { temp: 70, condition: "Rainy", humidity: 80, windSpeed: 9 },
  "San Antonio": { temp: 85, condition: "Partly Cloudy", humidity: 55, windSpeed: 8 },
  "San Diego": { temp: 73, condition: "Sunny", humidity: 65, windSpeed: 7 },
  Dallas: { temp: 80, condition: "Clear", humidity: 45, windSpeed: 10 },
  "San Jose": { temp: 72, condition: "Foggy", humidity: 75, windSpeed: 6 },
}

export default function CityWeather() {
  const params = useParams()
  const cityName = decodeURIComponent(params.name as string)
  const [weather, setWeather] = useState<any>(null)

  useEffect(() => {
    // Simulate API call with setTimeout
    setTimeout(() => {
      const cityWeather = mockCityWeather[cityName as keyof typeof mockCityWeather] || {
        temp: Math.floor(Math.random() * 30) + 60,
        condition: ["Sunny", "Cloudy", "Rainy", "Partly Cloudy"][Math.floor(Math.random() * 4)],
        humidity: Math.floor(Math.random() * 50) + 30,
        windSpeed: Math.floor(Math.random() * 15) + 1,
      }
      setWeather(cityWeather)
    }, 500)
  }, [cityName])

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100">
      <Nav />

      <main className="container mx-auto py-6 px-4 sm:px-6 sm:py-12">
        <h1 className="text-3xl font-bold text-blue-900 mb-6">Weather in {cityName}</h1>

        {weather ? (
          <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="transition-all duration-300 hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg sm:text-xl font-medium">Temperature</CardTitle>
                <Thermometer className="h-5 w-5 sm:h-6 sm:w-6 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl sm:text-4xl font-bold">{weather.temp}°F</div>
                <p className="text-sm text-muted-foreground">{weather.condition}</p>
              </CardContent>
            </Card>

            <Card className="transition-all duration-300 hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg sm:text-xl font-medium">Humidity</CardTitle>
                <CloudRain className="h-5 w-5 sm:h-6 sm:w-6 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl sm:text-4xl font-bold">{weather.humidity}%</div>
                <p className="text-sm text-muted-foreground">Relative humidity</p>
              </CardContent>
            </Card>

            <Card className="transition-all duration-300 hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg sm:text-xl font-medium">Wind Speed</CardTitle>
                <Wind className="h-5 w-5 sm:h-6 sm:w-6 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl sm:text-4xl font-bold">{weather.windSpeed} mph</div>
                <p className="text-sm text-muted-foreground">Steady wind</p>
              </CardContent>
            </Card>

            <Card className="transition-all duration-300 hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg sm:text-xl font-medium">Condition</CardTitle>
                <CloudSun className="h-5 w-5 sm:h-6 sm:w-6 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl sm:text-4xl font-bold">{weather.condition}</div>
                <p className="text-sm text-muted-foreground">Current sky condition</p>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}
      </main>

      <footer className="container mx-auto py-6 px-4 sm:px-6 mt-12 border-t border-blue-100">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-blue-700">© 2025 WeatherSafe. All rights reserved.</p>
          <p className="text-sm text-blue-700">Data updated: {new Date().toLocaleTimeString()}</p>
        </div>
      </footer>
    </div>
  )
}
