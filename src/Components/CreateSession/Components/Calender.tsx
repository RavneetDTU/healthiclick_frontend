"use client"

import { useState } from "react"
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
} from "date-fns"

interface CalendarProps {
  selected?: Date
  onSelect?: (date: Date | undefined) => void
  disabled?: (date: Date) => boolean
}

export default function Calendar({ selected, onSelect, disabled }: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(monthStart)
  const startDate = startOfWeek(monthStart)
  const endDate = endOfWeek(monthEnd)

  const dateFormat = "d"
  const rows = []
  let days = []
  let day = startDate
  let formattedDate = ""

  while (day <= endDate) {
    for (let i = 0; i < 7; i++) {
      formattedDate = format(day, dateFormat)
      const cloneDay = day
      const isDisabled = disabled ? disabled(cloneDay) : false
      const isSelected = selected ? isSameDay(day, selected) : false
      const isCurrentMonth = isSameMonth(day, monthStart)

      days.push(
        <div
          className={`
            p-2 h-10 w-10 flex items-center justify-center text-sm cursor-pointer rounded-md transition-colors
            ${isCurrentMonth ? "text-gray-900" : "text-gray-400"}
            ${isSelected ? "bg-blue-600 text-white" : ""}
            ${!isSelected && isCurrentMonth && !isDisabled ? "hover:bg-gray-100" : ""}
            ${isDisabled ? "cursor-not-allowed opacity-50" : ""}
          `}
          key={day.toString()}
          onClick={() => !isDisabled && onSelect && onSelect(cloneDay)}
        >
          <span>{formattedDate}</span>
        </div>,
      )
      day = addDays(day, 1)
    }
    rows.push(
      <div className="grid grid-cols-7 gap-1" key={day.toString()}>
        {days}
      </div>,
    )
    days = []
  }

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1))
  }

  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1))
  }

  return (
    <div className="border border-gray-200 rounded-md p-4 bg-white">
      <div className="flex items-center justify-between mb-4">
        <button onClick={prevMonth} className="p-2 hover:bg-gray-100 rounded-md transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h2 className="text-lg font-semibold text-gray-900">{format(currentMonth, "MMMM yyyy")}</h2>
        <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded-md transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
          <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
            {day}
          </div>
        ))}
      </div>

      <div className="space-y-1">{rows}</div>
    </div>
  )
}
