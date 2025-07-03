"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { useProfileStore } from "../store/userProfileStore"
import { useDevice } from "@/hooks/useDevice"
import { Toast } from "@/Components/ui/Toast"
import { FaCamera } from "react-icons/fa"

export default function DocUploadMeal() {
  const { dialogOpen, setDialogOpen, user } = useProfileStore()
  const { isMobile } = useDevice()
  const [file, setFile] = useState<File | null>(null)
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null)

  const dialogRef = useRef<HTMLDivElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploaded = e.target.files?.[0] || null
    setFile(uploaded)
  }

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type })
  }

  const handleSave = async () => {
    if (!file) {
      showToast("Please upload a document or image before saving.", "error")
      return
    }

    const token = localStorage.getItem("token")
    const userId = user?.userid

    if (!token || !userId) {
      showToast("User not authenticated", "error")
      return
    }

    const formData = new FormData()
    formData.append("file", file)

    try {
      const response = await fetch(`https://xyz.healthiclick.com/diet-plan/${userId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      const responseText = await response.text()
      console.log("Upload response:", response.status, responseText)

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.status}`)
      }

      showToast("Diet Plan uploaded successfully", "success")
      setFile(null)
      setDialogOpen("mealDoc", false)
    } catch (error) {
      console.error("Upload error:", error)
      showToast("Failed to upload diet plan. Please try again.", "error")
    }
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dialogRef.current && !dialogRef.current.contains(event.target as Node)) {
        setDialogOpen("mealDoc", false)
      }
    }

    if (dialogOpen.mealDoc) {
      document.addEventListener("mousedown", handleClickOutside)
      document.body.style.overflow = "hidden"
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.body.style.overflow = ""
    }
  }, [dialogOpen.mealDoc, setDialogOpen])

  if (!dialogOpen.mealDoc) return null

  return (
    <>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
        <div
          ref={dialogRef}
          className={`bg-white rounded-xl shadow-lg w-full ${isMobile ? "max-w-[95%]" : "max-w-md"} overflow-hidden`}
          role="dialog"
          aria-modal="true"
        >
          <div className="p-5">
            <h2 className="text-xl font-semibold text-teal-700 text-center mb-4">Upload Meal Document</h2>

            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center relative bg-gray-50">
                <input
                  type="file"
                  accept="image/*,.pdf,.doc,.docx"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer text-teal-600 hover:text-teal-700 font-medium"
                >
                  Click to select a file
                </label>

                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleFileChange}
                  className="hidden"
                  id="camera-input"
                />
                <FaCamera
                  size={22}
                  className="absolute top-2 right-2 text-teal-500 hover:text-teal-600 cursor-pointer"
                  onClick={() => document.getElementById("camera-input")?.click()}
                  title="Capture Image from Camera"
                />

                <p className="text-sm text-gray-500 mt-1">Supported: Images, PDF, DOC, DOCX</p>
              </div>

              {file && (
                <div className="mt-2 p-3 bg-white border rounded-md shadow-sm">
                  <p className="text-sm font-medium text-gray-700">Selected File:</p>
                  <p className="text-sm text-gray-600 truncate">{file.name}</p>
                  {file.type === "application/pdf" ? (
                    <iframe
                      src={URL.createObjectURL(file)}
                      className="w-full h-64 border mt-2 rounded"
                      title="PDF Preview"
                    />
                  ) : file.type.startsWith("image/") ? (
                    <img
                      src={URL.createObjectURL(file)}
                      alt="Preview"
                      className="w-full h-64 object-contain border mt-2 rounded"
                    />
                  ) : null}
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-between items-center px-5 py-3 border-t border-gray-200">
            <button
              type="button"
              onClick={() => setDialogOpen("mealDoc", false)}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
