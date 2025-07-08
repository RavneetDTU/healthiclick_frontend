"use client"

import type React from "react"
import { useState, useEffect, useRef, useCallback } from "react"
import { useProfileStore } from "../store/userProfileStore"
import { useDevice } from "@/hooks/useDevice"
import { Toast } from "@/Components/ui/Toast"
import { FaCamera } from "react-icons/fa"

export default function DocUploadMeal() {
  const { dialogOpen, setDialogOpen, user } = useProfileStore()
  const { isMobile } = useDevice()
  const [file, setFile] = useState<File | null>(null)
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const dialogRef = useRef<HTMLDivElement>(null)
  const dropAreaRef = useRef<HTMLDivElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploaded = e.target.files?.[0] || null
    if (uploaded) validateAndSetFile(uploaded)
  }

  const validateAndSetFile = (file: File) => {
    const validTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ]
    
    if (validTypes.includes(file.type)) {
      setFile(file)
    } else {
      showToast("Invalid file type. Please upload an image, PDF, or Word document.", "error")
    }
  }

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type })
  }

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndSetFile(e.dataTransfer.files[0])
    }
  }, [])

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
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/diet-plan/${userId}`, {
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
              <div
                ref={dropAreaRef}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className={`border-2 rounded-lg p-4 text-center relative transition-colors duration-200 ${
                  isDragging 
                    ? 'border-teal-500 bg-teal-50' 
                    : 'border-dashed border-gray-300 bg-gray-50'
                }`}
              >
                <input
                  type="file"
                  accept="image/*,.pdf,.doc,.docx"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer flex flex-col items-center justify-center gap-2 min-h-[100px]"
                >
                  {isDragging ? (
                    <p className="text-teal-600 font-medium">Drop your file here</p>
                  ) : (
                    <>
                      <div className="w-10 h-10 border-2 border-dashed border-teal-400 rounded-full flex items-center justify-center">
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          className="h-5 w-5 text-teal-500" 
                          viewBox="0 0 20 20" 
                          fill="currentColor"
                        >
                          <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-teal-600 hover:text-teal-700 font-medium">
                          Drag & drop a file or click to browse
                        </p>
                        <p className="text-sm text-gray-500 mt-1">Supported: Images, PDF, DOC, DOCX</p>
                      </div>
                    </>
                  )}
                </label>

                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleFileChange}
                  className="hidden"
                  id="camera-input"
                />
                <button
                  type="button"
                  onClick={() => document.getElementById("camera-input")?.click()}
                  className="absolute top-2 right-2 p-1 text-teal-500 hover:text-teal-600"
                  aria-label="Capture from camera"
                >
                  <FaCamera size={20} />
                </button>
              </div>

              {file && (
                <div className="mt-2 p-3 bg-white border rounded-md shadow-sm">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Selected File:</p>
                      <p className="text-sm text-gray-600 truncate">{file.name}</p>
                    </div>
                    <button 
                      onClick={() => setFile(null)}
                      className="text-sm text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
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
              disabled={!file}
              className={`px-4 py-2 rounded-md transition ${
                file 
                  ? 'bg-teal-600 text-white hover:bg-teal-700' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </>
  )
}