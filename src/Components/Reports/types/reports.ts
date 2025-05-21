export interface ReportDetail {
    name: string
    value: string
    unit?: string
    status: "normal" | "high" | "low" | "abnormal"
  }
  
  export interface Report {
    id: string
    name: string
    category: string
    date: string
    status: "normal" | "abnormal" | "pending"
    details: ReportDetail[]
  }
  
  export interface FilterOptions {
    searchTerm?: string
    dateRange?: string
    categories?: string[]
  }
  