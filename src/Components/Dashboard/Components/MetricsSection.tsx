"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

interface DailyCheckinData {
  date: string;
  steps: number;
  weight: number;
  calories: number;
  sleep_hours: number;
  id: number;
  user_id: number;
}

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No access token found. Please log in.");
        setLoading(false);
        return;
      }

      try {
        // Calculate date range (last 7 days)
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - 7);
        
        const formattedStartDate = startDate.toISOString().split('T')[0];
        const formattedEndDate = endDate.toISOString().split('T')[0];

        const response = await axios.get<DailyCheckinData[]>(
          `${process.env.NEXT_PUBLIC_BASE_URL}/daily-checkin?start_date=${formattedStartDate}&end_date=${formattedEndDate}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.length === 0) {
          // setError("No metrics data available for the selected period.");
          setLoading(false);
          return;
        }

        // Get the most recent entry
        const latestEntry = response.data.reduce((latest, current) => {
          return new Date(current.date) > new Date(latest.date) ? current : latest;
        });

        setMetricData({
          step: latestEntry.steps || 0,
          weight: latestEntry.weight || 0,
          calories: latestEntry.calories || 0,
          sleep: latestEntry.sleep_hours || 0,
        });
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch metric data", error);
        setError("Failed to load metrics data. Please try again later.");
        setLoading(false);
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

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {Array(4).fill(0).map((_, index) => (
          <div key={index} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 text-center">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 text-center mb-6">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {metrics.map((metric, index) => (
        <div
          key={index}
          className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 text-center"
        >
          <h4 className="text-sm text-gray-600 mb-1 font-medium">{metric.label}</h4>
          <p className="text-2xl font-bold text-teal-700">
            {metric.value} <span className="text-base text-gray-500">{metric.unit}</span>
          </p>
        </div>
      ))}
    </div>
  );
};