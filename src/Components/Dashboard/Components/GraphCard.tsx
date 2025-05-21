// app/feature/dashboard/components/GraphCard.tsx
"use client";

import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface GraphCardProps {
  label: string;
  values: number[];
}

const months = ["January", "February", "March", "April", "May", "June", "July"];

export const GraphCard: React.FC<GraphCardProps> = ({ label, values }) => {
  const data = values.map((v, i) => ({ name: months[i], value: v }));

  return (
    <div className="border rounded p-3 shadow-sm">
      <h4 className="text-sm font-medium mb-2">{label}</h4>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" tick={{ fontSize: 10 }} />
          <YAxis tick={{ fontSize: 10 }} />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
