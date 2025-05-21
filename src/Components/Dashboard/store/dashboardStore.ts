// app/feature/dashboard/store/dashboardStore.ts
import { create } from "zustand";

export interface MetricData {
  steps: number;
  sleep: number; // in hours per day
  calories: number;
  trend: string;
}

export interface ChartData {
  label: string;
  values: number[];
}

interface DashboardState {
  metricData: MetricData;
  chartData: ChartData[];
  loadDashboardData: () => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  metricData: {
    steps: 0,
    sleep: 0,
    calories: 0,
    trend: "+0% from last month",
  },
  chartData: [],
  loadDashboardData: () => {
    set({
      metricData: {
        steps: 10254,
        sleep: 7.5,
        calories: 312,
        trend: "+3% from last month",
      },
      chartData: [
        { label: "Step Chart", values: [60, 72, 85, 65, 50, 50, 40] },
        { label: "Sleep Chart", values: [60, 72, 85, 65, 50, 50, 40] },
        { label: "Calorie Chart", values: [60, 72, 85, 65, 50, 50, 40] },
        { label: "Weight Chart", values: [60, 72, 85, 65, 50, 50, 40] },
      ],
    });
  },
}));
