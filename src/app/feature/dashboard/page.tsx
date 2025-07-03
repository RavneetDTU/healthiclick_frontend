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
    <div className="min-h-screen flex flex-col bg-gray-100 text-gray-800">
      {/* Header */}
      <Header />

      {/* Main content */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <div className="hidden md:block">
          <Sidebar />
        </div>

        {/* Page content */}
        <main className="flex-1 px-4 sm:px-6 md:px-8 py-6 overflow-y-auto">
          <h1 className="text-3xl font-semibold text-teal-700 mb-6">Dashboard</h1>
          <MetricsSection />
          <WeeklyGraphSection />
        </main>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default DashboardPage;
