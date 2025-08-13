// Components/ReportSection.tsx
import type { Report } from "../types/reports";
import ReportCard from "./ReportCard";

interface ReportSectionProps {
  title: string;
  description: string;
  reports: Report[];
}

export default function ReportSection({ title, description, reports }: ReportSectionProps) {
  if (reports.length === 0) return null;

  return (
    <section className="bg-white rounded-xl shadow overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
        <p className="text-sm text-gray-600 mt-1">{description}</p>
      </div>

      <div className="divide-y divide-gray-100">
        {reports.length === 0 ? (
          <div className="p-6 text-center text-gray-500">No reports available in this category</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
            {reports.map((report) => (
              <ReportCard key={report.id} report={report} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
