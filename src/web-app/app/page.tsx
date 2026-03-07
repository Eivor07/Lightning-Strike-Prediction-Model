import { Nav } from "@/components/nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CloudRain, CloudSun, Wind, Zap } from "lucide-react"
import Link from "next/link"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100">
      <Nav />

      <main className="container mx-auto py-6 px-4 sm:px-6 sm:py-12">
        <section className="mb-8 sm:mb-12 text-center">
          <h2 className="mb-4 text-3xl sm:text-4xl font-bold text-blue-900">Real-time Weather Monitoring</h2>
          <p className="mx-auto max-w-2xl text-base sm:text-lg text-blue-700">
            Stay safe with our advanced lightning prediction system. Get alerts for high-risk areas and plan
            accordingly.
          </p>
        </section>

        <section className="mb-8 sm:mb-12">
          <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="transition-all duration-300 hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg sm:text-xl font-medium">Current Weather</CardTitle>
                <CloudSun className="h-5 w-5 sm:h-6 sm:w-6 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl sm:text-4xl font-bold">72°F</div>
                <p className="text-sm text-muted-foreground">Partly Cloudy</p>
              </CardContent>
            </Card>

            <Card className="transition-all duration-300 hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg sm:text-xl font-medium">Precipitation</CardTitle>
                <CloudRain className="h-5 w-5 sm:h-6 sm:w-6 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl sm:text-4xl font-bold">20%</div>
                <p className="text-sm text-muted-foreground">Chance of rain</p>
              </CardContent>
            </Card>

            <Card className="transition-all duration-300 hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg sm:text-xl font-medium">Wind Speed</CardTitle>
                <Wind className="h-5 w-5 sm:h-6 sm:w-6 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl sm:text-4xl font-bold">8 mph</div>
                <p className="text-sm text-muted-foreground">North-East</p>
              </CardContent>
            </Card>

            <Card className="transition-all duration-300 hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg sm:text-xl font-medium">Lightning Risk</CardTitle>
                <Zap className="h-5 w-5 sm:h-6 sm:w-6 text-amber-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl sm:text-4xl font-bold">Moderate</div>
                <p className="text-sm text-muted-foreground">Check alert zones</p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="mb-8 sm:mb-12">
          <Card className="transition-all duration-300 hover:shadow-md">
            <CardHeader>
              <CardTitle>Today's Forecast</CardTitle>
              <CardDescription>Hourly prediction for the next 12 hours</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex overflow-x-auto pb-2 gap-4">
                {[...Array(12)].map((_, i) => {
                  const hour = new Date()
                  hour.setHours(hour.getHours() + i)
                  const temp = Math.round(70 + Math.sin(i * 0.5) * 8)
                  const isRainy = i > 6 && i < 10

                  return (
                    <div key={i} className="flex flex-col items-center min-w-[60px] p-2 rounded-md bg-blue-50">
                      <span className="text-sm font-medium">
                        {hour.getHours() % 12 || 12}
                        {hour.getHours() >= 12 ? "PM" : "AM"}
                      </span>
                      {isRainy ? (
                        <CloudRain className="my-2 h-6 w-6 text-blue-500" />
                      ) : (
                        <CloudSun className="my-2 h-6 w-6 text-amber-500" />
                      )}
                      <span className="text-sm font-bold">{temp}°F</span>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="text-center">
          <Link href="/lightning-alerts">
            <Button className="bg-blue-600 hover:bg-blue-700 transition-colors duration-300" size="lg">
              <Zap className="mr-2 h-5 w-5" />
              View Lightning Alert Zones
            </Button>
          </Link>
        </section>
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
