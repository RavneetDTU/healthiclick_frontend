"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Button from "@/Components/ui/Button"
import { Search, Filter, ChevronDown } from "lucide-react"
import { useReportsStore } from "../store/reportsStore"

export default function FilterBar() {
  const { filterReports } = useReportsStore()
  const [searchTerm, setSearchTerm] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [dateRange, setDateRange] = useState("all")
  const [categories, setCategories] = useState<string[]>([])

  // Apply filters whenever filter criteria change
  useEffect(() => {
    filterReports({ searchTerm, dateRange, categories })
  }, [filterReports, searchTerm, dateRange, categories])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    filterReports({ searchTerm, dateRange, categories })
  }

  const toggleCategory = (category: string) => {
    if (categories.includes(category)) {
      setCategories(categories.filter((c) => c !== category))
    } else {
      setCategories([...categories, category])
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-4">
      <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search reports..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button type="button" variant="secondary" onClick={() => setShowFilters(!showFilters)} className="sm:w-auto">
          <Filter className="h-4 w-4 mr-2" />
          Filters
          <ChevronDown className={`h-4 w-4 ml-2 transition-transform ${showFilters ? "rotate-180" : ""}`} />
        </Button>
        <Button type="submit" className="sm:w-auto">
          Search
        </Button>
      </form>

      {showFilters && (
        <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
            <div className="flex flex-wrap gap-2">
              {[
                { value: "all", label: "All Time" },
                { value: "last30", label: "Last 30 Days" },
                { value: "last90", label: "Last 90 Days" },
                { value: "last365", label: "Last Year" },
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={`px-3 py-1.5 text-sm rounded-full ${
                    dateRange === option.value
                      ? "bg-primary-100 text-primary-800 border-primary-300"
                      : "bg-gray-100 text-gray-800 border-gray-200"
                  } border`}
                  onClick={() => setDateRange(option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Categories</label>
            <div className="flex flex-wrap gap-2">
              {[
                { value: "lab", label: "Lab Reports" },
                { value: "imaging", label: "Imaging" },
                { value: "examination", label: "Examinations" },
                { value: "vaccination", label: "Vaccinations" },
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={`px-3 py-1.5 text-sm rounded-full ${
                    categories.includes(option.value)
                      ? "bg-primary-100 text-primary-800 border-primary-300"
                      : "bg-gray-100 text-gray-800 border-gray-200"
                  } border`}
                  onClick={() => toggleCategory(option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
