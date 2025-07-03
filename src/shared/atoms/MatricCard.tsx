interface MetricCardProps {
  title: string;
  value: number;
  change: string;
}

export const MetricCard = ({ title, value, change }: MetricCardProps) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-sm">
    <p className="text-gray-700">{title}</p>
    <p className="text-xs text-gray-500 mb-2">{change}</p>
    <p className="text-2xl font-semibold text-teal-600">{value}</p>
  </div>
);
