// app/feature/dashboard/components/MetricsSection.tsx
"use client";

import React from "react";
import { useDashboardStore } from "../store/dashboardStore";

export const MetricsSection: React.FC = () => {
  const { metricData } = useDashboardStore();

  const metrics = [
    {
      label: "Steps Count",
      value: metricData.steps,
      unit: "",
    },
    {
      label: "Sleep Log",
      value: metricData.sleep,
      unit: "hr/day",
    },
    {
      label: "Calorie Burn",
      value: metricData.calories,
      unit: "",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
      {metrics.map((metric, index) => (
        <div key={index} className="bg-orange-100 p-4 rounded shadow text-center">
          <h4 className="text-sm text-gray-600 mb-1">{metric.label}</h4>
          <p className="text-2xl font-bold">
            {metric.value} {metric.unit}
          </p>
          <span className="text-xs text-gray-500">{metricData.trend}</span>
        </div>
      ))}
    </div>
  );
};
