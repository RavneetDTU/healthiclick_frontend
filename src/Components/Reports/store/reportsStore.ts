import { create } from "zustand"
import type { Report } from "../types/reports"

interface ReportsState {
  reports: Report[]
  filteredReports: Report[]
  isLoading: boolean
  error: string | null
  fetchReports: () => Promise<void>
  filterReports: (filters: {
    searchTerm?: string
    dateRange?: string
    categories?: string[]
  }) => void
}

// Mock data for demonstration
const mockReports: Report[] = [
  {
    id: "1",
    name: "Complete Blood Count (CBC)",
    category: "lab",
    date: "2023-04-15",
    status: "normal",
    details: [
      { name: "Hemoglobin", value: "14.2", unit: "g/dL", status: "normal" },
      { name: "White Blood Cells", value: "7.5", unit: "K/uL", status: "normal" },
      { name: "Platelets", value: "250", unit: "K/uL", status: "normal" },
      { name: "Red Blood Cells", value: "5.1", unit: "M/uL", status: "normal" },
    ],
  },
  {
    id: "2",
    name: "Lipid Panel",
    category: "lab",
    date: "2023-04-15",
    status: "abnormal",
    details: [
      { name: "Total Cholesterol", value: "240", unit: "mg/dL", status: "high" },
      { name: "HDL Cholesterol", value: "45", unit: "mg/dL", status: "normal" },
      { name: "LDL Cholesterol", value: "165", unit: "mg/dL", status: "high" },
      { name: "Triglycerides", value: "150", unit: "mg/dL", status: "normal" },
    ],
  },
  {
    id: "3",
    name: "Thyroid Function",
    category: "lab",
    date: "2023-03-22",
    status: "normal",
    details: [
      { name: "TSH", value: "2.5", unit: "mIU/L", status: "normal" },
      { name: "Free T4", value: "1.2", unit: "ng/dL", status: "normal" },
      { name: "Free T3", value: "3.1", unit: "pg/mL", status: "normal" },
    ],
  },
  {
    id: "4",
    name: "Vitamin B12",
    category: "lab",
    date: "2023-03-22",
    status: "abnormal",
    details: [{ name: "Vitamin B12", value: "190", unit: "pg/mL", status: "low" }],
  },
  {
    id: "5",
    name: "Vitamin D",
    category: "lab",
    date: "2023-03-22",
    status: "abnormal",
    details: [{ name: "25-Hydroxy Vitamin D", value: "18", unit: "ng/mL", status: "low" }],
  },
  {
    id: "6",
    name: "Chest X-Ray",
    category: "imaging",
    date: "2023-02-10",
    status: "normal",
    details: [],
  },
  {
    id: "7",
    name: "Abdominal Ultrasound",
    category: "imaging",
    date: "2023-01-05",
    status: "normal",
    details: [],
  },
  {
    id: "8",
    name: "Annual Physical",
    category: "examination",
    date: "2023-04-01",
    status: "normal",
    details: [],
  },
  {
    id: "9",
    name: "COVID-19 Vaccination",
    category: "vaccination",
    date: "2023-01-15",
    status: "normal",
    details: [],
  },
  {
    id: "10",
    name: "Flu Vaccination",
    category: "vaccination",
    date: "2022-10-20",
    status: "normal",
    details: [],
  },
]

export const useReportsStore = create<ReportsState>((set, get) => ({
  reports: [],
  filteredReports: [],
  isLoading: false,
  error: null,

  fetchReports: async () => {
    set({ isLoading: true, error: null })

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // In a real app, you would fetch from an API
      set({
        reports: mockReports,
        filteredReports: mockReports,
        isLoading: false,
      })
    } catch (error) {
      set({
        error: "Failed to fetch reports" + error,
        isLoading: false,
      })
    }
  },

  filterReports: ({ searchTerm = "", dateRange = "all", categories = [] }) => {
    const { reports } = get()

    let filtered = [...reports]

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (report) =>
          report.name.toLowerCase().includes(term) ||
          report.details.some(
            (detail) => detail.name.toLowerCase().includes(term) || detail.value.toLowerCase().includes(term),
          ),
      )
    }

    // Filter by date range
    if (dateRange !== "all") {
      const now = new Date()
      const cutoffDate = new Date()

      switch (dateRange) {
        case "last30":
          cutoffDate.setDate(now.getDate() - 30)
          break
        case "last90":
          cutoffDate.setDate(now.getDate() - 90)
          break
        case "last365":
          cutoffDate.setDate(now.getDate() - 365)
          break
      }

      filtered = filtered.filter((report) => {
        const reportDate = new Date(report.date)
        return reportDate >= cutoffDate
      })
    }

    // Filter by categories
    if (categories.length > 0) {
      filtered = filtered.filter((report) => categories.includes(report.category))
    }

    set({ filteredReports: filtered })
  },
}))
