"use client"

import { useBookingStore } from "../store/sessionStore"
import { format } from "date-fns"
import { CalendarIcon, Clock } from "lucide-react"
import { Card } from "@/Components/ui/Card";
import { CardContent } from "@/Components/ui/Card";

export default function BookingSummary() {
  const { selectedDate, selectedSlot } = useBookingStore()

  if (!selectedDate || !selectedSlot) return null

  return (
    <Card className="border shadow-sm">
      <CardContent className="p-6">
        <h3 className="font-semibold text-lg mb-4">Booking Summary</h3>

        <div className="space-y-3">
          <div className="flex items-start">
            <CalendarIcon className="h-5 w-5 mr-3 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Date</p>
              <p className="text-sm text-muted-foreground">{format(selectedDate, "EEEE, MMMM d, yyyy")}</p>
            </div>
          </div>

          <div className="flex items-start">
            <Clock className="h-5 w-5 mr-3 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Time</p>
              <p className="text-sm text-muted-foreground">{format(new Date(selectedSlot.time), "h:mm a")}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
