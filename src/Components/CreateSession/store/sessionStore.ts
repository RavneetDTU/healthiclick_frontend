import { create } from "zustand"
import { format } from "date-fns"

export interface TimeSlot {
  id: string
  time: string
  available: boolean
}

interface BookingFormData {
  name: string
  email: string
  phone: string
  notes: string
  sessionType: string
  date: Date
  slotId: string
}

interface BookingState {
  selectedDate: Date | undefined
  selectedSlot: TimeSlot | undefined
  slots: TimeSlot[]
  isLoading: boolean
  setSelectedDate: (date: Date | undefined) => void
  setSelectedSlot: (slot: TimeSlot | undefined) => void
  fetchSlots: (date: Date) => Promise<void>
  bookAppointment: (data: BookingFormData) => Promise<void>
}

// Helper function to generate mock time slots
const generateMockSlots = (date: Date): TimeSlot[] => {
  const slots: TimeSlot[] = []
  const dateString = format(date, "yyyy-MM-dd")

  // Generate slots from 9 AM to 5 PM
  for (let hour = 9; hour < 17; hour++) {
    // Add slots for each hour (on the hour and half past)
    for (const minute of [0, 30]) {
      const time = new Date(
        `${dateString}T${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}:00`,
      )

      // Randomly determine if slot is available (70% chance of being available)
      // Make weekends less available
      const isWeekend = time.getDay() === 0 || time.getDay() === 6
      const availabilityChance = isWeekend ? 0.4 : 0.7

      slots.push({
        id: `${dateString}-${hour}-${minute}`,
        time: time.toISOString(),
        available: Math.random() < availabilityChance,
      })
    }
  }

  return slots
}

export const useBookingStore = create<BookingState>((set, get) => ({
  selectedDate: new Date(),
  selectedSlot: undefined,
  slots: [],
  isLoading: false,

  setSelectedDate: (date) => {
    set({ selectedDate: date, selectedSlot: undefined })
  },

  setSelectedSlot: (slot) => {
    set({ selectedSlot: slot })
  },

  fetchSlots: async (date) => {
    set({ isLoading: true, slots: [] })

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Generate mock data
      const slots = generateMockSlots(date)

      set({ slots, isLoading: false })
    } catch (error) {
      console.error("Error fetching slots:", error)
      set({ isLoading: false })
    }
  },

  bookAppointment: async (data) => {
    // In a real app, you would send this data to your API
    console.log("Booking appointment with data:", data)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Update the slot to be unavailable
    const updatedSlots = get().slots.map((slot) => (slot.id === data.slotId ? { ...slot, available: false } : slot))

    set({ slots: updatedSlots })

    return Promise.resolve()
  },
}))
