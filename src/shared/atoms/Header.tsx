"use client"
import { useState } from "react"
import { useDevice } from "@/hooks/useDevice"
import { MobileSidebar } from "./MobileSidebar"

export const Header = () => {
  const { isDesktop } = useDevice()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <header className="w-full flex justify-between items-center px-4 py-3 md:px-6 md:py-4 border-b bg-white sticky top-0 z-10">
      <div className="flex items-center">
        {!isDesktop && (
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="mr-2 p-1 rounded-md hover:bg-gray-100 md:hidden"
            aria-label="Open menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
            >
              <line x1="4" x2="20" y1="12" y2="12" />
              <line x1="4" x2="20" y1="6" y2="6" />
              <line x1="4" x2="20" y1="18" y2="18" />
            </svg>
          </button>
        )}
        <h1 className="text-lg md:text-xl font-bold">Healthiclick</h1>
      </div>

      <div className="flex items-center gap-2 md:gap-6">
        <button className="p-2 rounded-md hover:bg-gray-100 font-medium">
          {isDesktop ? (
            "Alerts"
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
            >
              <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
              <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
            </svg>
          )}
        </button>
        <button className="p-2 rounded-md hover:bg-gray-100 font-medium">
          {isDesktop ? (
            "Profile"
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
            >
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 bg-opacity-50 z-50 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div
            className="absolute top-0 left-0 w-64 h-full bg-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="font-bold">Healthiclick</h2>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1 rounded-md hover:bg-gray-100"
                aria-label="Close menu"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </button>
            </div>
            <MobileSidebar />
          </div>
        </div>
      )}
    </header>
  )
}
