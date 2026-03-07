import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle } from "lucide-react"

export function WeatherAlert() {
  return (
    <Card className="border-amber-200 bg-amber-50 transition-all duration-300 hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-amber-500" />
          <CardTitle className="text-amber-800">Weather Advisory</CardTitle>
        </div>
        <CardDescription className="text-amber-700">Active for your region</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-amber-800 mb-2">
          <strong>Thunderstorm Watch:</strong> Conditions are favorable for the development of severe thunderstorms in
          and close to the watch area.
        </p>
        <p className="text-xs text-amber-700">
          Valid until: {new Date(Date.now() + 3600000 * 6).toLocaleTimeString()} today
        </p>
      </CardContent>
    </Card>
  )
}
