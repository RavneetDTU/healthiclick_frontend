"use client";

import React, { useEffect } from "react";
import { useDashboardStore } from "@/Components/Dashboard/store/dashboardStore";
import { Sidebar } from "@/shared/atoms/Sidebar";
import { Header } from "@/shared/atoms/Header";
import { Footer } from "@/shared/atoms/Footer";
import { MetricsSection } from "@/Components/Dashboard/Components/MetricsSection";
import { WeeklyGraphSection } from "@/Components/Dashboard/Components/WeeklyGraph";

const DashboardPage = () => {
  const { loadDashboardData } = useDashboardStore();

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  return (
    <div className="min-h-screen flex flex-col bg-[#fef7f2]">
      {/* Header at top */}
      <Header />

      {/* Main content with Sidebar and sections */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <div className="hidden md:block">
          <Sidebar />
        </div>

        {/* Page content */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
          <h1 className="text-2xl sm:text-3xl font-bold mb-6">Dashboard</h1>
          <MetricsSection />
          <WeeklyGraphSection />
        </div>
      </div>

      {/* Footer always at bottom */}
      <Footer />
    </div>
  );
};

export default DashboardPage;
