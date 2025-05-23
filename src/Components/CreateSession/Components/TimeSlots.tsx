"use client"

import { useEffect } from "react"
import { useBookingStore } from "../store/sessionStore"
import { format } from "date-fns"

interface TimeSlotsProps {
  date: Date
}

export default function TimeSlots({ date }: TimeSlotsProps) {
  const { slots, fetchSlots, isLoading, selectedSlot, setSelectedSlot } = useBookingStore()

  useEffect(() => {
    fetchSlots(date)
  }, [date, fetchSlots])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (slots.length === 0) {
    return (
      <div className="py-4 text-center">
        <p className="text-gray-500">No available slots for this date</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {slots.map((slot) => (
        <button
          key={slot.id}
          className={`
            h-14 flex flex-col justify-center items-center border rounded-md transition-all duration-200
            ${
              slot.available
                ? selectedSlot?.id === slot.id
                  ? "border-green-500 bg-green-50 text-green-700"
                  : "border-gray-200 hover:border-green-500 hover:bg-green-50 text-gray-900"
                : "bg-red-50 border-red-200 text-gray-500 cursor-not-allowed"
            }
          `}
          disabled={!slot.available}
          onClick={() => setSelectedSlot(slot)}
        >
          <span className="text-sm font-medium">{format(new Date(slot.time), "h:mm a")}</span>
          {slot.available ? (
            <span className="text-xs text-green-600">Available</span>
          ) : (
            <span className="text-xs text-red-600">Booked</span>
          )}
        </button>
      ))}
    </div>
  )
}
