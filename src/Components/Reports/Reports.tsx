"use client";

import { useEffect } from "react";
import ReportSection from "./Components/ReportSection";
import FilterBar from "./Components/FilterBar";
import { useReportsStore } from "./store/reportsStore";
import { Header } from "@/shared/atoms/Header";
import { Sidebar } from "@/shared/atoms/Sidebar";
import { Footer } from "@/shared/atoms/Footer";
import UploadReportSection from "./Components/UploadReport";

export default function ReportsPage() {
  const { filteredReports, fetchReports, isLoading } = useReportsStore();

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header />

      <div className="flex flex-1">
        <div className="hidden md:block">
          <Sidebar />
        </div>

        <div className="flex-1 overflow-hidden">
          <main className="p-6 overflow-y-auto h-full">
            <div className="bg-white shadow rounded mb-6">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <h1 className="text-3xl font-bold text-gray-800">Health Reports</h1>
                <p className="mt-2 text-gray-600">
                  View and manage all your health-related reports in one place
                </p>
              </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <FilterBar />

              <UploadReportSection />

              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
                </div>
              ) : (
                <div className="space-y-8 mt-6">
                  <ReportSection
                    title="Lab Reports"
                    description="Blood work and laboratory test results"
                    reports={filteredReports.filter((report) => report.category === "lab")}
                  />

                  <ReportSection
                    title="Imaging Reports"
                    description="X-rays, MRIs, CT scans and other imaging results"
                    reports={filteredReports.filter((report) => report.category === "imaging")}
                  />

                  <ReportSection
                    title="Medical Examinations"
                    description="Physical examinations and specialist consultations"
                    reports={filteredReports.filter((report) => report.category === "examination")}
                  />

                  <ReportSection
                    title="Vaccination Records"
                    description="Immunization history and vaccination certificates"
                    reports={filteredReports.filter((report) => report.category === "vaccination")}
                  />
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
}
