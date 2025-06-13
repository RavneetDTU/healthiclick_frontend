"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

const navItems = [
  { label: "Customers", href: "/feature/allCustomer" },
  { label: "All Leads", href: "#" },
  { label: "Tasks", href: "#" },
  { label: "Dashboard", href: "/feature/dashboard" },
  { label: "Daily Checkin", href: "/feature/dailyCheckin" },
  { label: "Sessions", href: "/feature/session" },
  { label: "Diet Plan", href: "/feature/dietPlan" },
  { label: "Exercise", href: "/feature/exercise" },
  { label: "Reports", href: "/feature/reports" },
  { label: "Activity Chart", href: "/feature/activityChart" },

];

export const Sidebar = () => {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const adminFlag = localStorage.getItem("is_admin");
      setIsAdmin(adminFlag === "true");
    }
  }, []);

  return (
    <aside className="w-56 h-full flex flex-col items-center bg-white shadow-md shadow-gray-500 dark:shadow-gray-500 p-4">
      {isAdmin && (
        <div className="mb-8">
          <h2 className="text-xs text-gray-700 dark:text-gray-700 mb-2">YOU</h2>
          {navItems.slice(0, 3).map((item) => (
            <Link href={item.href} key={item.label}>
              <div className="mb-4 font-semibold cursor-pointer hover:text-orange-600 transition-colors">
                {item.label}
              </div>
            </Link>
          ))}
        </div>
      )}

      <div>
        <h2 className="text-xs text-gray-700 dark:text-gray-700 mb-2">COMPANY</h2>
        {navItems.slice(3).map((item) => (
          <Link href={item.href} key={item.label}>
            <div className="mb-4 font-semibold cursor-pointer hover:text-orange-600 transition-colors">
              {item.label}
            </div>
          </Link>
        ))}
      </div>
    </aside>
  );
};
