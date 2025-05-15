"use client"

import { useEffect, useState } from "react"
import { breakpoints } from "@/lib/theme"

type DeviceType = "mobile" | "tablet" | "desktop" | "largeDesktop"

export function useDevice() {
  const [deviceType, setDeviceType] = useState<DeviceType>("mobile")
  const [width, setWidth] = useState(0)

  useEffect(() => {
    // Function to update width and device type
    const updateDimensions = () => {
      const width = window.innerWidth
      setWidth(width)

      if (width < breakpoints.sm) {
        setDeviceType("mobile")
      } else if (width < breakpoints.lg) {
        setDeviceType("tablet")
      } else if (width < breakpoints.xl) {
        setDeviceType("desktop")
      } else {
        setDeviceType("largeDesktop")
      }
    }

    // Set initial dimensions
    updateDimensions()

    // Add event listener
    window.addEventListener("resize", updateDimensions)

    // Clean up
    return () => {
      window.removeEventListener("resize", updateDimensions)
    }
  }, [])

  const isMobile = deviceType === "mobile"
  const isTablet = deviceType === "tablet"
  const isDesktop = deviceType === "desktop" || deviceType === "largeDesktop"

  return {
    deviceType,
    width,
    isMobile,
    isTablet,
    isDesktop,
  }
}
