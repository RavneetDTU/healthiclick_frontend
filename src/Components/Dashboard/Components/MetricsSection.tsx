"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

interface MetricData {
  step: number;
  weight: number;
  calories: number;
  sleep: number;
}

export const MetricsSection: React.FC = () => {
  const [metricData, setMetricData] = useState<MetricData>({
    step: 0,
    weight: 0,
    calories: 0,
    sleep: 0,
  });

  useEffect(() => {
    const fetchMetrics = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No access token found. User may not be logged in.");
        return;
      }

      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/data`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const charts = response.data.charts;

        setMetricData({
          step: charts.step_counter.at(-1) || 0,
          weight: charts.weight_counter.at(-1) || 0,
          calories: charts.calorie_counter.at(-1) || 0,
          sleep: charts.sleep_counter.at(-1) || 0,
        });
      } catch (error) {
        console.error("Failed to fetch metric data", error);
      }
    };

    fetchMetrics();
  }, []);

  const metrics = [
    { label: "Step Count", value: metricData.step, unit: "steps" },
    { label: "Weight", value: metricData.weight, unit: "kg" },
    { label: "Calorie Burn", value: metricData.calories, unit: "kcal" },
    { label: "Sleep Log", value: metricData.sleep, unit: "hr/day" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {metrics.map((metric, index) => (
        <div key={index} className="bg-orange-100 p-4 rounded shadow text-center">
          <h4 className="text-sm text-gray-700 dark:text-gray-700 mb-1">{metric.label}</h4>
          <p className="text-2xl font-bold">
            {metric.value} {metric.unit}
          </p>
        </div>
      ))}
    </div>
  );
};
