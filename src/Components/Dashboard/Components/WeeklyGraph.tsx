"use client";

import React, { useEffect, useState } from "react";
import { GraphCard } from "./GraphCard";
import axios from "axios";

interface ChartItem {
  label: string;
  values: number[];
}

export const WeeklyGraphSection: React.FC = () => {
  const [chartData, setChartData] = useState<ChartItem[]>([]);

  useEffect(() => {
    const fetchChartData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No access token found.");
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

        const formattedCharts: ChartItem[] = [
          { label: "Step Counter", values: charts.step_counter },
          { label: "Sleep Counter", values: charts.sleep_counter },
          { label: "Calorie Counter", values: charts.calorie_counter },
          { label: "Weight Counter", values: charts.weight_counter },
        ];

        setChartData(formattedCharts);
      } catch (err) {
        console.error("Failed to fetch chart data", err);
      }
    };

    fetchChartData();
  }, []);

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
          <GraphCard key={idx} label={chart.label} values={chart.values} />
        ))}
      </div>

      {/* <div className="mt-6 text-right">
        <a
          href="#"
          className="text-teal-600 text-sm font-medium hover:underline transition-colors"
        >
          View more &gt;
        </a>
      </div> */}
    </div>
  );
};
