"use client"

import { useState } from "react"
import type { Report } from "../types/reports"
import Button from "@/Components/ui/Button"
import { FileText, Calendar, AlertCircle, CheckCircle, Clock, Download } from "lucide-react"

interface ReportCardProps {
  report: Report
}

export default function ReportCard({ report }: ReportCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const getStatusIcon = () => {
    switch (report.status) {
      case "normal":
        return <CheckCircle className="h-5 w-5 text-success-500" />
      case "abnormal":
        return <AlertCircle className="h-5 w-5 text-error-500" />
      case "pending":
        return <Clock className="h-5 w-5 text-warning-500" />
      default:
        return <FileText className="h-5 w-5 text-gray-400" />
    }
  }

  const getStatusText = () => {
    switch (report.status) {
      case "normal":
        return "Normal"
      case "abnormal":
        return "Requires Attention"
      case "pending":
        return "Results Pending"
      default:
        return "Unknown"
    }
  }

  const handleDownload = (report: Report) => {

    // const reportData = {
    //   name: report.name,
    //   date: report.date,
    //   status: report.status,
    //   details: report.details,
    // }

    // Convert report data to a formatted string
    let content = `Report: ${report.name}\n`
    content += `Date: ${report.date}\n`
    content += `Status: ${getStatusText()}\n\n`

    if (report.details && report.details.length > 0) {
      content += "Details:\n"
      report.details.forEach((detail) => {
        content += `- ${detail.name}: ${detail.value} ${detail.unit || ""} (${detail.status})\n`
      })
    }

    // Create a blob with the content
    const blob = new Blob([content], { type: "text/plain" })

    // Create a URL for the blob
    const url = URL.createObjectURL(blob)

    // Create a temporary link element
    const link = document.createElement("a")
    link.href = url
    link.download = `${report.name.replace(/\s+/g, "_")}_${report.date}.txt`

    // Append the link to the body
    document.body.appendChild(link)

    // Trigger the download
    link.click()

    // Clean up
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200">
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center">
            <div className="bg-primary-50 p-2 rounded-lg">
              <FileText className="h-5 w-5 text-primary-600" />
            </div>
            <h3 className="ml-3 text-lg font-medium text-gray-900">{report.name}</h3>
          </div>
          <div className="flex items-center">{getStatusIcon()}</div>
        </div>

        <div className="mt-3 space-y-2">
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="h-4 w-4 mr-1.5" />
            <span>{report.date}</span>
          </div>

          <div className="flex items-center text-sm">
            <span
              className={`
              px-2 py-1 rounded-full text-xs font-medium
              ${report.status === "normal" ? "bg-green-100 text-green-800" : ""}
              ${report.status === "abnormal" ? "bg-red-100 text-red-800" : ""}
              ${report.status === "pending" ? "bg-yellow-100 text-yellow-800" : ""}
            `}
            >
              {getStatusText()}
            </span>
          </div>
        </div>

        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="space-y-3">
              {report.details &&
                report.details.map((detail, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span className="text-gray-600">{detail.name}</span>
                    <span
                      className={`font-medium ${
                        detail.status === "normal"
                          ? "text-success-500"
                          : detail.status === "high"
                            ? "text-error-500"
                            : detail.status === "low"
                              ? "text-warning-500"
                              : "text-gray-900"
                      }`}
                    >
                      {detail.value} {detail.unit && <span className="text-gray-500 text-xs">{detail.unit}</span>}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        )}

        <div className="mt-4 flex flex-col sm:flex-row gap-2">
          <Button onClick={() => setIsExpanded(!isExpanded)} variant="secondary" className="flex-1">
            {isExpanded ? "Hide Details" : "Show Details"}
          </Button>
          <div className="flex flex-col sm:flex-row gap-2 flex-1">
            <Button onClick={() => window.open(`/api/reports/${report.id}/view`, "_blank")} className="flex-1">
              View Report
            </Button>
            <Button
              onClick={() => handleDownload(report)}
              variant="outline"
              className="flex-1 flex items-center justify-center"
            >
              <Download className="h-4 w-4 mr-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
