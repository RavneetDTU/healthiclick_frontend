"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"

const navItems = [
  { label: "Customers", href: "/feature/allCustomer", group: "ADMIN" },
  { label: "Dashboard", href: "/feature/dashboard", group: "WELCOME" },
  { label: "Sessions", href: "/feature/session", group: "WELCOME" },
  { label: "Diet Plan", href: "/feature/dietPlan", group: "WELCOME" },
  { label: "Exercise", href: "/feature/exercise", group: "WELCOME" },
  { label: "Reports", href: "/feature/reports", group: "WELCOME" },
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
    <div className="h-full w-full overflow-y-auto">

      {Object.entries(groupedNavItems).map(([group, items]) => (
        <div key={group} className="mb-6">
          <h2 className="text-xs uppercase tracking-wider text-gray-500 mb-3 px-4 font-medium">
            {group}
          </h2>
          <div className="space-y-1 px-2">
            {items.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`block px-4 py-2.5 rounded-lg transition-all ${
                    isActive
                      ? 'bg-orange-50 text-orange-600 font-semibold'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-orange-500'
                  }`}
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