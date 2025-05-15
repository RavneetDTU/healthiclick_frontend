"use client";

import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  ChartOptions,
  ChartData,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const BarChart = ({
  data,
  options,
}: {
  data: ChartData<"bar">;
  options: ChartOptions<"bar">;
}) => {
  return <Bar data={data} options={options} />;
};

export const LineChart = ({
  data,
  options,
}: {
  data: ChartData<"line">;
  options: ChartOptions<"line">;
}) => {
  return <Line data={data} options={options} />;
};
