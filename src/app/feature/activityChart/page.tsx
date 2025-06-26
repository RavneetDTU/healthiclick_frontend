"use client";

import React from "react";
import ActivityCharts from "@/Components/UserProfile/Components/ActivityChart";
import { Footer } from "@/shared/atoms/Footer";
import { Header } from "@/shared/atoms/Header";
import { Sidebar } from "@/shared/atoms/Sidebar";

function Page() {
  return (
    <div className="min-h-screen flex flex-col bg-[#fef7f2]">
      {/* Top Header */}
      <Header />

      {/* Main content area */}
      <div className="flex flex-1">
        {/* Sidebar on large screens */}
        <div className="hidden md:block">
          <Sidebar />
        </div>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
          <h1 className="text-2xl sm:text-3xl font-bold mb-6">Activity Overview</h1>
          <ActivityCharts />
        </main>
      </div>

      {/* Footer pinned at bottom */}
      <Footer />
    </div>
  );
}

export default Page;
