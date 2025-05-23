"use client"
import TimeSlots from "./TimeSlots"
import BookingForm from "./BookingForm"
import { useBookingStore } from "../store/sessionStore"
import { format } from "date-fns"
import Calendar from "./Calender"

export default function BookingCalendar() {
  const { selectedDate, setSelectedDate, selectedSlot } = useBookingStore()

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <div className="border border-gray-200 rounded-lg shadow-sm bg-white">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Select a Date</h2>
          <Calendar
            selected={selectedDate}
            onSelect={(date) => setSelectedDate(date)}
            disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
          />
        </div>
      </div>

      <div className="space-y-8">
        <div className="border border-gray-200 rounded-lg shadow-sm bg-white">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">
              Available Slots for {format(selectedDate!, "EEEE, MMMM d, yyyy")}
            </h2>
            <TimeSlots date={selectedDate!} />
          </div>
        </div>

        {selectedSlot && (
          <div className="border border-gray-200 rounded-lg shadow-sm bg-white">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-900">Complete Your Booking</h2>
              <BookingForm />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
