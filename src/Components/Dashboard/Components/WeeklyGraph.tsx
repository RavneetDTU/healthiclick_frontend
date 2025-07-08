"use client";

import React, { useEffect, useState } from "react";
import { GraphCard } from "./GraphCard";
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

interface ChartItem {
  label: string;
  values: number[];
  dates?: string[];
}

export const WeeklyGraphSection: React.FC = () => {
  const [chartData, setChartData] = useState<ChartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChartData = async () => {
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
          // setError("No chart data available for the selected period.");
          setLoading(false);
          return;
        }

        // Sort data by date
        const sortedData = [...response.data].sort((a, b) => 
          new Date(a.date).getTime() - new Date(b.date).getTime()
        );

        // Extract dates for labels
        const dates = sortedData.map(item => 
          new Date(item.date).toLocaleDateString('en-US', { weekday: 'short' })
        );

        const formattedCharts: ChartItem[] = [
          { 
            label: "Step Counter", 
            values: sortedData.map(item => item.steps),
            dates
          },
          { 
            label: "Sleep Counter", 
            values: sortedData.map(item => item.sleep_hours),
            dates
          },
          { 
            label: "Calorie Counter", 
            values: sortedData.map(item => item.calories),
            dates
          },
          { 
            label: "Weight Counter", 
            values: sortedData.map(item => item.weight),
            dates
          },
        ];

        setChartData(formattedCharts);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch chart data", err);
        setError("Failed to load chart data. Please try again later.");
        setLoading(false);
      }
    };

    fetchChartData();
  }, []);

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {Array(4).fill(0).map((_, index) => (
              <div key={index} className="h-64 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4">
        <h3 className="text-xl font-semibold text-teal-700 mb-2 sm:mb-0">Weekly Graphs</h3>
        <input
          type="text"
          placeholder="Search for a metric"
          className="border border-gray-300 rounded-md px-3 py-1.5 text-sm w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-teal-300"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {chartData.map((chart, idx) => (
          <GraphCard 
            key={idx} 
            label={chart.label} 
            values={chart.values} 
            dates={chart.dates}
          />
        ))}
      </div>
    </div>
  );
};