// app/feature/dashboard/page.tsx
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
    <div className="min-h-screen bg-[#fef7f2]">
      <Header />
      <div className="flex">
        <div className="hidden md:block">
          <Sidebar />
        </div>

        <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
          <h1 className="text-2xl sm:text-3xl font-bold mb-6">Dashboard</h1>
          <MetricsSection />
          <WeeklyGraphSection />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default DashboardPage;
