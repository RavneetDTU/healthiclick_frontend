"use client"

import { useState, useEffect, useRef } from "react"
import { useDevice } from "@/hooks/useDevice"
import { MobileSidebar } from "./MobileSidebar"
import { FiMenu, FiBell, FiUser, FiX } from "react-icons/fi"
import { useRouter } from "next/navigation"

export const Header = () => {
  const { isDesktop } = useDevice()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [userName, setUserName] = useState<string | null>(null)
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const router = useRouter()
  const profileRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser)
        setUserName(parsed.full_name || parsed.name || "User")
      } catch {
        setUserName(null)
      }
    }

    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setShowProfileMenu(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleLogout = () => {
    localStorage.clear()
    setUserName(null)
    router.push("/feature/login")
  }

  return (
    <header className="w-full flex justify-between items-center px-4 py-3 md:px-6 md:py-4 border-b bg-white sticky top-0 z-10">
      <div className="flex items-center">
        {!isDesktop && (
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="mr-2 p-1 rounded-md hover:bg-gray-100 md:hidden"
            aria-label="Open menu"
          >
            <FiMenu className="h-5 w-5" />
          </button>
        )}
        <h1 className="text-lg md:text-xl font-bold">Healthiclick</h1>
      </div>

      <div className="flex items-center gap-4 md:gap-6 relative">
        <button className="p-2 rounded-md hover:bg-gray-100 font-medium">
          {isDesktop ? "Alerts" : <FiBell className="h-5 w-5" />}
        </button>

        {userName ? (
          <div ref={profileRef} className="relative">
            <button
              className="p-2 rounded-md hover:bg-gray-100"
              onClick={() => setShowProfileMenu((prev) => !prev)}
            >
              <FiUser className="h-5 w-5" />
            </button>
            {showProfileMenu && (
              <div className="absolute right-0 top-10 w-40 bg-white shadow-md rounded-md p-3 z-50">
                <p className="text-sm text-gray-700 dark:text-gray-700 mb-2 font-medium truncate">{userName}</p>
                <button
                  onClick={handleLogout}
                  className="w-full bg-red-100 hover:bg-red-200 text-red-700 text-sm py-1 px-2 rounded"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            className="bg-orange-400 hover:bg-orange-300 text-white px-3 py-1 text-sm rounded"
            onClick={() => router.push("/feature/login")}
          >
            Sign In
          </button>
        )}
      </div>

      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50 md:hidden"
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
                <FiX className="h-5 w-5" />
              </button>
            </div>
            <MobileSidebar />
          </div>
        </div>
      )}
    </header>
  )
}
