// Components/ReportCard.tsx
"use client";

import { useState } from "react";
import type { Report } from "../types/reports";
import Button from "@/Components/ui/Button";
import {
  FileText,
  Calendar,
  AlertCircle,
  CheckCircle,
  Clock,
  Download,
} from "lucide-react";
import { getMedicalRecordPdf, deleteMedicalRecord } from "@/lib/api";
import { useProfileStore } from "@/Components/UserProfile/store/userProfileStore";
import { useReportsStore } from "../store/reportsStore";

// Map UI category -> API recordType for endpoints
const CATEGORY_TO_RECORDTYPE: Record<
  Report["category"],
  "lab_reports" | "diagnostic_reports" | "medical_certificates" | "vaccination_records"
> = {
  lab: "lab_reports",
  imaging: "diagnostic_reports",
  examination: "medical_certificates",
  vaccination: "vaccination_records",
};

interface ReportCardProps {
  report: Report;
}

export default function ReportCard({ report }: ReportCardProps) {
  const [downloading, setDownloading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const { user } = useProfileStore();

  const fetchReports = useReportsStore((s) => s.fetchReports);
  const fetchAllReports = useReportsStore((s) => s.fetchAllReports);
  const selectedRecordType = useReportsStore((s) => s.selectedRecordType);

  const getStatusIcon = () => {
    switch (report.status) {
      case "normal":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "abnormal":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case "pending":
        return <Clock className="h-5 w-5 text-teal-500" />;
      default:
        return <FileText className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusText = () => {
    switch (report.status) {
      case "normal":
        return "Normal";
      case "abnormal":
        return "Requires Attention";
      case "pending":
        return "Results Pending";
      default:
        return "Unknown";
    }
  };

  const openPdfInNewTab = async () => {
    if (!user?.userid) return;
    try {
      const recordType = CATEGORY_TO_RECORDTYPE[report.category];
      const res = await getMedicalRecordPdf(user.userid, recordType);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
      setTimeout(() => URL.revokeObjectURL(url), 60_000);
    } catch (e) {
      console.error("Failed to open PDF:", e);
    }
  };

  const handleDownload = async (r: Report) => {
    if (!user?.userid) return;
    try {
      setDownloading(true);
      const recordType = CATEGORY_TO_RECORDTYPE[r.category];
      const res = await getMedicalRecordPdf(user.userid, recordType);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = `${r.name.replace(/\s+/g, "_")}_${r.date}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error("Download failed:", e);
    } finally {
      setDownloading(false);
    }
  };

  const handleDelete = async () => {
    if (!user?.userid) return;
    try {
      setDeleting(true);
      const recordType = CATEGORY_TO_RECORDTYPE[report.category];
      await deleteMedicalRecord(user.userid, recordType);

      // Refresh list after deletion
      if (selectedRecordType) {
        await fetchReports(selectedRecordType);
      } else {
        await fetchAllReports();
      }
    } catch (e) {
      console.error("Delete failed:", e);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center">
            <div className="bg-teal-50 p-2 rounded-lg">
              <FileText className="h-5 w-5 text-teal-600" />
            </div>
            <h3 className="ml-3 text-lg font-medium text-gray-800">
              {report.name}
            </h3>
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
                ${report.status === "normal" ? "bg-green-100 text-green-700" : ""}
                ${report.status === "abnormal" ? "bg-red-100 text-red-700" : ""}
                ${report.status === "pending" ? "bg-teal-200 text-white" : ""}
              `}
            >
              {getStatusText()}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-4 flex flex-col sm:flex-row gap-2">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 w-full">
            <Button onClick={openPdfInNewTab} className="w-full min-w-0">
              View Report
            </Button>
            <Button
              onClick={() => handleDownload(report)}
              variant="outline"
              className="w-full flex items-center justify-center min-w-0"
              disabled={downloading}
            >
              <Download className="h-4 w-4 mr-2" />
              {downloading ? "Downloading..." : "Download"}
            </Button>
            <Button
              onClick={handleDelete}
              variant="outline"
              className="w-full min-w-0"
              disabled={deleting}
            >
              {deleting ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
