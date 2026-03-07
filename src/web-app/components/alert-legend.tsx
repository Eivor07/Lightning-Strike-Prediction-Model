export function AlertLegend() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="h-4 w-4 rounded-full bg-red-500"></div>
        <div>
          <p className="font-medium">High Risk</p>
          <p className="text-sm text-muted-foreground">Immediate danger. Seek shelter immediately.</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="h-4 w-4 rounded-full bg-orange-500"></div>
        <div>
          <p className="font-medium">Moderate Risk</p>
          <p className="text-sm text-muted-foreground">Lightning likely. Prepare to seek shelter.</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="h-4 w-4 rounded-full bg-yellow-500"></div>
        <div>
          <p className="font-medium">Low Risk</p>
          <p className="text-sm text-muted-foreground">Lightning possible. Stay alert to changing conditions.</p>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-sm text-muted-foreground">
          Map shows real lightning data from New Zealand. Each dot represents a lightning strike location.
        </p>
      </div>
    </div>
  )
}
