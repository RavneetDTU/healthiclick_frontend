interface MetricCardProps {
    title: string;
    value: number;
    change: string;
  }
  
  export const MetricCard = ({ title, value, change }: MetricCardProps) => (
    <div className="bg-orange-100 p-6 rounded shadow text-sm">
      <p className="text-gray-700 dark:text-gray-700">{title}</p>
      <p className="text-xs text-gray-500 dark:text-gray-500 mb-2">{change}</p>
      <p className="text-2xl font-semibold">{value}</p>
    </div>
  );