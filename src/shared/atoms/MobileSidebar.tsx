"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"

const navItems = [
  { label: "Customers", href: "/feature/allCustomer", group: "YOU" },
  { label: "All Leads", href: "#", group: "YOU" },
  { label: "Tasks", href: "#", group: "YOU" },
  { label: "Dashboard", href: "/feature/dashboard", group: "COMPANY" },
  { label: "Sessions", href: "/feature/session", group: "COMPANY" },
  { label: "Diet Plan", href: "/feature/dietPlan", group: "COMPANY" },
  { label: "Exercise", href: "/feature/exercise", group: "COMPANY" },
  { label: "Reports", href: "/feature/reports", group: "COMPANY" },
  { label: "Reports", href: "/feature/activityChart", group: "Activity Chart" },
]

export const MobileSidebar = () => {
  const pathname = usePathname()

  const groupedNavItems = navItems.reduce(
    (acc, item) => {
      if (!acc[item.group]) {
        acc[item.group] = []
      }
      acc[item.group].push(item)
      return acc
    },
    {} as Record<string, typeof navItems>,
  )

  return (
    <div className="flex flex-col h-full bg-white p-4 overflow-y-auto">
      {Object.entries(groupedNavItems).map(([group, items]) => (
        <div key={group} className="mb-6">
          <h2 className="text-xs text-gray-500 mb-2 px-2">{group}</h2>
          <div className="space-y-1">
            {items.map((item) => {
              const isActive = pathname === item.href
              const baseClasses = "block py-2 px-2 rounded-md font-semibold transition-colors"
              const activeClasses = "bg-orange-100 text-orange-600"
              const hoverClasses = "hover:bg-gray-100 hover:text-orange-600"
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`${baseClasses} ${isActive ? activeClasses : hoverClasses}`}
                >
                  {item.label}
                </Link>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
