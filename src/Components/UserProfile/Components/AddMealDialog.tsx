"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { useProfileStore } from "../store/userProfileStore"
import { useDevice } from "@/hooks/useDevice"

export default function AddMealDialog() {
  const { dialogOpen, setDialogOpen, addMeal } = useProfileStore()
  const { isMobile } = useDevice()
  const [mealData, setMealData] = useState({
    meal_name: "",
    quantity: "",
    recipe: "",
  })
  const dialogRef = useRef<HTMLDivElement>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setMealData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    addMeal({
      id: Date.now().toString(),
      ...mealData,
      date: new Date().toISOString(),
    })
    setMealData({ meal_name: "", quantity: "", recipe: "" })
    setDialogOpen("meal", false)
  }

  // Close dialog when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dialogRef.current && !dialogRef.current.contains(event.target as Node)) {
        setDialogOpen("meal", false)
      }
    }

    if (dialogOpen.meal) {
      document.addEventListener("mousedown", handleClickOutside)
      // Prevent body scrolling when dialog is open
      document.body.style.overflow = "hidden"
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      // Restore body scrolling when dialog is closed
      document.body.style.overflow = ""
    }
  }, [dialogOpen.meal, setDialogOpen])

  if (!dialogOpen.meal) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 bg-opacity-50 p-4">
      <div
        ref={dialogRef}
        className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full ${isMobile ? "max-w-[95%]" : "max-w-md"}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="meal-dialog-title"
      >
        <form onSubmit={handleSubmit}>
          <div className="p-4 sm:p-6">
            <div className="mb-4">
              <h2 id="meal-dialog-title" className="text-lg sm:text-xl font-semibold">
                Add New Meal
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm">
                Enter the details of your meal below.
              </p>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="meal_name" className="block text-sm font-medium">
                  Meal Name
                </label>
                <input
                  id="meal_name"
                  name="meal_name"
                  value={mealData.meal_name}
                  onChange={handleChange}
                  placeholder="e.g., Grilled Chicken Salad"
                  required
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 dark:bg-gray-700"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="quantity" className="block text-sm font-medium">
                  Quantity
                </label>
                <input
                  id="quantity"
                  name="quantity"
                  value={mealData.quantity}
                  onChange={handleChange}
                  placeholder="e.g., 1 serving (250g)"
                  required
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 dark:bg-gray-700"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="recipe" className="block text-sm font-medium">
                  Recipe
                </label>
                <textarea
                  id="recipe"
                  name="recipe"
                  value={mealData.recipe}
                  onChange={handleChange}
                  placeholder="Enter recipe or preparation instructions..."
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 min-h-[80px] sm:min-h-[100px] dark:bg-gray-700"
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2 p-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={() => setDialogOpen("meal", false)}
              className="px-3 py-1.5 text-xs sm:text-sm border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-1.5 text-xs sm:text-sm bg-violet-600 text-white rounded-md hover:bg-violet-700 transition-colors"
            >
              Add Meal
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
