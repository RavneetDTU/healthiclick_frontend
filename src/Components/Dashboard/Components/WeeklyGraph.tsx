// app/feature/dashboard/components/WeeklyGraphSection.tsx
"use client";

import React from "react";
import { useDashboardStore } from "../store/dashboardStore";
import { GraphCard } from "./GraphCard";

export const WeeklyGraphSection: React.FC = () => {
  const { chartData } = useDashboardStore();

  return (
    <div className="bg-white p-4 rounded shadow">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4">
        <h3 className="text-lg font-semibold mb-2 sm:mb-0">Weekly Graphs</h3>
        <input
          type="text"
          placeholder="Search for a metric"
          className="border rounded px-3 py-1 text-sm"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {chartData.map((chart, idx) => (
          <GraphCard key={idx} label={chart.label} values={chart.values} />
        ))}
      </div>

      <div className="mt-4 text-right">
        <a href="#" className="text-red-600 text-sm font-medium hover:underline">
          View more &gt;
        </a>
      </div>
    </div>
  );
};
