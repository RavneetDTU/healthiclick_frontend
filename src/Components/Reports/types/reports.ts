export interface ReportDetail {
  name: string;
  value: string;
  unit?: string;
  status: "normal" | "high" | "low";
}
  
  export interface Report {
    id: string;
    userId: string;
    name: string;
    type: string; // matches recordType in API
    category: string;
    date: string;
    status: "normal" | "abnormal" | "pending";
    details: ReportDetail[];
  }
  
  export interface FilterOptions {
    searchTerm?: string
    dateRange?: string
    categories?: string[]
  }
  