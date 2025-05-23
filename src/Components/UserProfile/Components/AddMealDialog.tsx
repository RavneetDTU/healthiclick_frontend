"use client"

import { useState, useEffect, useRef } from "react"
import { useProfileStore } from "../store/userProfileStore"
import { useDevice } from "@/hooks/useDevice"
import { Toast } from "@/Components/ui/Toast"

export default function AddMealDialog() {
  const { dialogOpen, setDialogOpen, addMeal } = useProfileStore()
  const { isMobile } = useDevice()

  const [currentMealStep, setCurrentMealStep] = useState(1)
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null)

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

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const label = `Meal ${currentMealStep}`

    addMeal({
      id: `${Date.now()}-${currentMealStep}`,
      ...mealData,
      date: new Date().toISOString(),
      label
    })

    showToast(`${label} saved`, "success")

    setMealData({ meal_name: "", quantity: "", recipe: "" })

    if (currentMealStep < 3) {
      setCurrentMealStep(currentMealStep + 1)
    } else {
      setDialogOpen("mealSeprate", false)
    }
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dialogRef.current && !dialogRef.current.contains(event.target as Node)) {
        setDialogOpen("mealSeprate", false)
      }
    }

    if (dialogOpen.mealSeprate) {
      document.addEventListener("mousedown", handleClickOutside)
      document.body.style.overflow = "hidden"
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.body.style.overflow = ""
    }
  }, [dialogOpen.mealSeprate, setDialogOpen])

  if (!dialogOpen.mealSeprate) return null

  return (
    <>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
        <div
          ref={dialogRef}
          className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full ${isMobile ? "max-w-[95%]" : "max-w-md"}`}
          role="dialog"
          aria-modal="true"
        >
          <form onSubmit={handleSubmit}>
            <div className="p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold mb-2">Add Meal {currentMealStep}</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium">Meal Name</label>
                  <input
                    name="meal_name"
                    value={mealData.meal_name}
                    onChange={handleChange}
                    placeholder="e.g., Grilled Chicken"
                    required
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md dark:bg-gray-700"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Quantity</label>
                  <input
                    name="quantity"
                    value={mealData.quantity}
                    onChange={handleChange}
                    placeholder="e.g., 1 bowl"
                    required
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md dark:bg-gray-700"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Recipe</label>
                  <textarea
                    name="recipe"
                    value={mealData.recipe}
                    onChange={handleChange}
                    placeholder="Recipe or instructions"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md dark:bg-gray-700 min-h-[100px]"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setCurrentMealStep(Math.max(currentMealStep - 1, 1))}
                  disabled={currentMealStep === 1}
                  className="px-3 py-1.5 text-sm border rounded-md bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
                >
                  Preview
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 text-sm bg-orange-300 text-white rounded-md hover:bg-orange-500"
                >
                  {currentMealStep < 3 ? "Next" : "Finish"}
                </button>
              </div>
              <button
                type="button"
                onClick={() => setDialogOpen("mealSeprate", false)}
                className="text-sm text-gray-500 hover:underline"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
