"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useProfileStore } from "../store/userProfileStore"
import { useDevice } from "@/hooks/useDevice"

export default function ActivityCharts() {
  const [timeframe, setTimeframe] = useState<"weekly" | "monthly">("weekly")
  const { meals, exercises } = useProfileStore()
  const { deviceType } = useDevice()
  const mealChartRef = useRef<HTMLCanvasElement>(null)
  const exerciseChartRef = useRef<HTMLCanvasElement>(null)

  const processChartData = () => {
    const now = new Date()
    const days = timeframe === "weekly" ? 7 : 30

    const labelFormat =
      deviceType === "mobile"
        ? {
            weekday: timeframe === "weekly" ? "short" : undefined,
            day: timeframe === "monthly" ? "numeric" : undefined,
          }
        : {
            weekday: "short",
            month: timeframe === "monthly" ? "short" : undefined,
            day: timeframe === "monthly" ? "numeric" : undefined,
          }

    const labels = Array.from({ length: days }, (_, i) => {
      const date = new Date(now)
      date.setDate(date.getDate() - (days - 1 - i))
      return date.toLocaleDateString("en-US", labelFormat as Intl.DateTimeFormatOptions)
    })

    const mealData = Array(days).fill(0)
    const exerciseData = Array(days).fill(0)

    meals.forEach((meal) => {
      const mealDate = new Date(meal.date)
      const dayDiff = Math.floor((now.getTime() - mealDate.getTime()) / (1000 * 60 * 60 * 24))
      if (dayDiff < days) {
        mealData[days - 1 - dayDiff]++
      }
    })

    exercises.forEach((exercise) => {
      const exerciseDate = new Date(exercise.date)
      const dayDiff = Math.floor((now.getTime() - exerciseDate.getTime()) / (1000 * 60 * 60 * 24))
      if (dayDiff < days) {
        exerciseData[days - 1 - dayDiff]++
      }
    })

    return { labels, mealData, exerciseData }
  }

  useEffect(() => {
    const { labels, mealData, exerciseData } = processChartData()
    const renderChart = (ref: React.RefObject<HTMLCanvasElement>, data: number[], color: string) => {
      if (!ref.current) return

      const ctx = ref.current.getContext("2d")
      if (!ctx) return

      const rect = ref.current.getBoundingClientRect()
      const dpr = window.devicePixelRatio || 1
      ref.current.width = rect.width * dpr
      ref.current.height = rect.height * dpr
      ctx.scale(dpr, dpr)

      const width = rect.width
      const height = rect.height
      const padding = deviceType === "mobile" ? 15 : 25
      const chartWidth = width - padding * 2
      const chartHeight = height - 60
      const barSpacing = deviceType === "mobile" ? 4 : 8
      const barWidth = chartWidth / labels.length - barSpacing
      const maxValue = Math.max(...data, 1)

      ctx.clearRect(0, 0, width, height)

      ctx.strokeStyle = "rgba(229, 231, 235, 0.5)"
      ctx.lineWidth = 1
      for (let i = 0; i <= 5; i++) {
        const y = height - 30 - (i * chartHeight) / 5
        ctx.beginPath()
        ctx.moveTo(padding, y)
        ctx.lineTo(width - padding, y)
        ctx.stroke()
      }

      data.forEach((value, index) => {
        const x = padding + index * (barWidth + barSpacing)
        const barHeight = (value / maxValue) * chartHeight

        const gradient = ctx.createLinearGradient(0, height - 30 - barHeight, 0, height - 30)
        gradient.addColorStop(0, color)
        gradient.addColorStop(1, "rgba(253, 186, 116, 0.5)")

        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.moveTo(x, height - 30)
        ctx.lineTo(x, height - 30 - barHeight)
        ctx.lineTo(x + barWidth, height - 30 - barHeight)
        ctx.lineTo(x + barWidth, height - 30)
        ctx.closePath()
        ctx.fill()

        ctx.fillStyle = "#6B7280"
        ctx.font = `${deviceType === "mobile" ? "10px" : "11px"} 'Inter', sans-serif`
        ctx.textAlign = "center"
        ctx.fillText(labels[index], x + barWidth / 2, height - 10)

        if (value > 0) {
          ctx.fillStyle = "#ea580c"
          ctx.font = `${deviceType === "mobile" ? "11px" : "12px"} 'Inter', sans-serif`
          ctx.fillText(value.toString(), x + barWidth / 2, height - 30 - barHeight - 10)
        }
      })
    }

    renderChart(mealChartRef as React.RefObject<HTMLCanvasElement>, mealData, "#fb923c")
    renderChart(exerciseChartRef as React.RefObject<HTMLCanvasElement>, exerciseData, "#fdba74")
  }, [timeframe, meals, exercises, deviceType, processChartData])

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <div className="p-3 sm:p-4 pb-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h2 className="text-base sm:text-lg font-semibold">Activity Overview</h2>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              Track your meals and exercises over time
            </p>
          </div>
          <div className="flex rounded-md overflow-hidden border border-gray-200 dark:border-gray-700 self-start">
            <button
              onClick={() => setTimeframe("weekly")}
              className={`px-2 sm:px-3 py-1 text-xs sm:text-sm transition-colors ${
                timeframe === "weekly"
                  ? "bg-orange-300 text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              Weekly
            </button>
            <button
              onClick={() => setTimeframe("monthly")}
              className={`px-2 sm:px-3 py-1 text-xs sm:text-sm transition-colors ${
                timeframe === "monthly"
                  ? "bg-orange-300 text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              Monthly
            </button>
          </div>
        </div>
      </div>
      <div className="p-3 sm:p-4">
        <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
          <div className="relative">
            <canvas
              ref={mealChartRef}
              style={{ width: "100%", height: "220px" }}
              className="cursor-default"
            ></canvas>
          </div>
          <div className="relative">
            <canvas
              ref={exerciseChartRef}
              style={{ width: "100%", height: "220px" }}
              className="cursor-default"
            ></canvas>
          </div>
        </div>
      </div>
    </div>
  )
}
