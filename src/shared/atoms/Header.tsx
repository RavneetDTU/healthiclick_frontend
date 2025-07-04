"use client";

import { useState, useEffect, useRef } from "react";
import { useDevice } from "@/hooks/useDevice";
import { MobileSidebar } from "./MobileSidebar";
import { FiMenu, FiBell, FiUser, FiX } from "react-icons/fi";
import { useRouter } from "next/navigation";

export const Header = () => {
  const { isDesktop } = useDevice();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const router = useRouter();
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUserName(parsed.full_name || parsed.name || "User");
      } catch {
        setUserName(null);
      }
    }

    const handleClickOutside = (e: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target as Node)
      ) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setUserName(null);
    router.push("/feature/login");
  };

  return (
    <header className="w-full flex justify-between items-center px-4 py-3 md:px-6 md:py-4 border-b sticky top-0 z-10 bg-gradient-to-r from-teal-50 to-blue-50 backdrop-blur-md shadow-sm">
      <div className="flex items-center">
        {!isDesktop && (
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="mr-2 p-2 rounded-xl bg-teal-100 hover:bg-teal-200 transition md:hidden"
            aria-label="Open menu"
          >
            <FiMenu className="h-5 w-5 text-teal-700" />
          </button>
        )}
        <h1 className="text-xl md:text-2xl font-semibold text-teal-700">
          Healthiclick
        </h1>
      </div>

      <div className="flex items-center gap-4 md:gap-6 relative">
        <button className="p-2 rounded-xl bg-blue-100 hover:bg-blue-200 transition">
          {isDesktop ? (
            <span className="text-blue-700 font-medium">Alerts</span>
          ) : (
            <FiBell className="h-5 w-5 text-blue-700" />
          )}
        </button>

        {userName ? (
          <div ref={profileRef} className="relative">
            <button
              className="p-2 rounded-xl bg-teal-100 hover:bg-teal-200 transition"
              onClick={() => setShowProfileMenu((prev) => !prev)}
            >
              <FiUser className="h-5 w-5 text-teal-700" />
            </button>
            {showProfileMenu && (
              <div className="absolute right-0 top-10 w-44 bg-white shadow-lg rounded-xl p-4 z-50 border border-gray-100">
                <p className="text-sm text-gray-800 font-medium truncate mb-2">
                  {userName}
                </p>
                <button
                  onClick={handleLogout}
                  className="w-full text-sm py-1.5 px-3 rounded-md bg-red-100 hover:bg-red-200 text-red-700 font-medium"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            className="bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-400 hover:to-blue-400 text-white px-4 py-1.5 text-sm rounded-xl font-medium transition"
            onClick={() => router.push("/feature/login")}
          >
            Sign In
          </button>
        )}
      </div>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Semi-transparent backdrop */}
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Sidebar container */}
          <div className="fixed inset-y-0 left-0 w-72 bg-white shadow-xl">
            {/* Header with close button */}
            <div className="flex justify-between items-center p-4 border-b border-gray-100 h-16">
              <h2 className="text-xl font-bold text-teal-600">Healthiclick</h2>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1.5 rounded-lg hover:bg-gray-100"
                aria-label="Close menu"
              >
                <FiX className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            {/* Scrollable content area */}
            <div className="h-[calc(100vh-64px)] overflow-y-auto bg-white">
              <MobileSidebar />
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
