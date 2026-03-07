"use client"

import { X } from "lucide-react"
import { useEffect } from "react"

interface AlertNotificationProps {
  title: string
  message: string
  onClose: () => void
}

export function AlertNotification({ title, message, onClose }: AlertNotificationProps) {
  // Auto-close after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, 5000)

    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-md animate-in fade-in slide-in-from-bottom-5">
      <div className="rounded-lg border bg-background p-4 shadow-lg">
        <div className="flex items-start gap-4">
          <div className="flex-1">
            <h3 className="font-medium">{title}</h3>
            <p className="text-sm text-muted-foreground">{message}</p>
          </div>
          <button onClick={onClose} className="rounded-full p-1 hover:bg-muted">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
        </div>
      </div>
    </div>
  )
}
