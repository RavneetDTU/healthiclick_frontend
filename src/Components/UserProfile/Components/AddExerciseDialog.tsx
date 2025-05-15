"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { useProfileStore } from "../store/userProfileStore"
import { useDevice } from "@/hooks/useDevice"

export default function AddExerciseDialog() {
  const { dialogOpen, setDialogOpen, addExercise } = useProfileStore()
  const { isMobile } = useDevice()
  const [exerciseData, setExerciseData] = useState({
    exercise_name: "",
    duration: "",
    video_link: "",
  })
  const dialogRef = useRef<HTMLDivElement>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setExerciseData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    addExercise({
      id: Date.now().toString(),
      ...exerciseData,
      date: new Date().toISOString(),
    })
    setExerciseData({ exercise_name: "", duration: "", video_link: "" })
    setDialogOpen("exercise", false)
  }

  // Close dialog when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dialogRef.current && !dialogRef.current.contains(event.target as Node)) {
        setDialogOpen("exercise", false)
      }
    }

    if (dialogOpen.exercise) {
      document.addEventListener("mousedown", handleClickOutside)
      // Prevent body scrolling when dialog is open
      document.body.style.overflow = "hidden"
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      // Restore body scrolling when dialog is closed
      document.body.style.overflow = ""
    }
  }, [dialogOpen.exercise, setDialogOpen])

  if (!dialogOpen.exercise) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 bg-opacity-50 p-4">
      <div
        ref={dialogRef}
        className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full ${isMobile ? "max-w-[95%]" : "max-w-md"}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="exercise-dialog-title"
      >
        <form onSubmit={handleSubmit}>
          <div className="p-4 sm:p-6">
            <div className="mb-4">
              <h2 id="exercise-dialog-title" className="text-lg sm:text-xl font-semibold">
                Add New Exercise
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm">
                Enter the details of your exercise below.
              </p>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="exercise_name" className="block text-sm font-medium">
                  Exercise Name
                </label>
                <input
                  id="exercise_name"
                  name="exercise_name"
                  value={exerciseData.exercise_name}
                  onChange={handleChange}
                  placeholder="e.g., Push-ups"
                  required
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 dark:bg-gray-700"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="duration" className="block text-sm font-medium">
                  Duration
                </label>
                <input
                  id="duration"
                  name="duration"
                  value={exerciseData.duration}
                  onChange={handleChange}
                  placeholder="e.g., 30 minutes"
                  required
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 dark:bg-gray-700"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="video_link" className="block text-sm font-medium">
                  Video Link
                </label>
                <input
                  id="video_link"
                  name="video_link"
                  value={exerciseData.video_link}
                  onChange={handleChange}
                  placeholder="e.g., https://youtube.com/watch?v=..."
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 dark:bg-gray-700"
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2 p-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={() => setDialogOpen("exercise", false)}
              className="px-3 py-1.5 text-xs sm:text-sm border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-1.5 text-xs sm:text-sm bg-violet-600 text-white rounded-md hover:bg-violet-700 transition-colors"
            >
              Add Exercise
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
