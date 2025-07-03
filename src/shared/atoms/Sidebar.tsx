"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

const navItems = [
  { label: "Customers", href: "/feature/allCustomer" },
  // { label: "All Leads", href: "#" },
  // { label: "Tasks", href: "#" },
  { label: "Dashboard", href: "/feature/dashboard" },
  { label: "Daily Checkin", href: "/feature/dailyCheckin" },
  { label: "Sessions", href: "/feature/session" },
  { label: "Diet Plan", href: "/feature/dietPlan" },
  { label: "Exercise", href: "/feature/exercise" },
  { label: "Reports", href: "/feature/reports" },
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
    <aside className="w-60 h-full flex flex-col items-start bg-white shadow-md p-5 rounded-tr-2xl rounded-br-2xl">
      {isAdmin && (
        <div className="mb-10 w-full">
          <h2 className="text-[11px] tracking-wide text-teal-600 font-semibold mb-3">Admin</h2>
          {navItems.slice(0, 1).map((item) => (
            <Link href={item.href} key={item.label}>
              <div className="mb-2 px-3 py-2 rounded-lg text-gray-700 font-medium cursor-pointer hover:bg-teal-100 hover:text-teal-700 transition-colors">
                {item.label}
              </div>
            </Link>
          ))}
        </div>
      )}

      <div className="w-full">
        <h2 className="text-[11px] tracking-wide text-teal-600 font-semibold mb-3">Welcome</h2>
        {navItems.slice(1).map((item) => (
          <Link href={item.href} key={item.label}>
            <div className="mb-2 px-3 py-2 rounded-lg text-gray-700 font-medium cursor-pointer hover:bg-teal-100 hover:text-teal-700 transition-colors">
              {item.label}
            </div>
          </Link>
        ))}
      </div>
    </aside>
  );
};
