import React, { useState } from "react";
import { Followup } from "@/Components/AllCustomes/type";
import NextImage from "next/image";
import { useRouter } from "next/navigation";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface FollowupTableProps {
  title: string;
  followups: Followup[];
}

export const FollowupTable: React.FC<FollowupTableProps> = ({
  title,
  followups,
}) => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"Daily" | "Weekly" | "Monthly">("Daily");
  const [showPopup, setShowPopup] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [feedback, setFeedback] = useState("");

  const router = useRouter();

  const filteredFollowups = followups.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelectChange = (value: string) => {
    if (value === "No") {
      setShowPopup(true);
    }
  };

  return (
    <div className="bg-white p-4 sm:p-6 rounded shadow shadow-gray-500">
      <h3 className="text-lg sm:text-xl font-semibold mb-4">{title}</h3>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 w-full sm:w-64"
        />

        <select
          value={filter}
          onChange={(e) =>
            setFilter(e.target.value as "Daily" | "Weekly" | "Monthly")
          }
          className="border border-gray-300 rounded px-3 py-2 w-full sm:w-auto"
        >
          <option value="Daily">Daily</option>
          <option value="Weekly">Weekly</option>
          <option value="Monthly">Monthly</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="table-auto w-full text-sm">
          <thead className="text-left border-b bg-gray-100">
            <tr>
              <th className="px-2 py-2 whitespace-nowrap">Avatar</th>
              <th className="px-2 py-2 whitespace-nowrap">Customer ID</th>
              <th className="px-2 py-2 whitespace-nowrap">Full Name</th>
              <th className="px-2 py-2 whitespace-nowrap">Email</th>
              <th className="px-2 py-2 whitespace-nowrap">Phone No</th>
              <th className="px-2 py-2 whitespace-nowrap">Followup</th>
            </tr>
          </thead>
          <tbody>
            {filteredFollowups.map((f) => (
              <tr
                key={f.id}
                className="border-b hover:bg-gray-50"
              >
                <td
                  className="px-2 py-2 cursor-pointer whitespace-nowrap"
                  onClick={() => router.push("/feature/userProfile")}
                >
                  <NextImage
                    src={f.avatarImage.url}
                    alt={f.avatarImage.alt || "avatar"}
                    height={32}
                    width={32}
                    className="w-8 h-8 rounded-full"
                  />
                </td>
                <td
                  className="px-2 py-2 whitespace-nowrap cursor-pointer"
                  onClick={() => router.push("/feature/userProfile")}
                >
                  {f.id}
                </td>
                <td
                  className="px-2 py-2 whitespace-nowrap cursor-pointer"
                  onClick={() => router.push("/feature/userProfile")}
                >
                  {f.name}
                </td>
                <td
                  className="px-2 py-2 whitespace-nowrap cursor-pointer"
                  onClick={() => router.push("/feature/userProfile")}
                >
                  {f.email}
                </td>
                <td
                  className="px-2 py-2 whitespace-nowrap cursor-pointer"
                  onClick={() => router.push("/feature/userProfile")}
                >
                  {f.phone}
                </td>
                <td className="px-2 py-2 whitespace-nowrap">
                  <select
                    className="border rounded px-2 py-1 w-full sm:w-auto"
                    onChange={(e) => handleSelectChange(e.target.value)}
                  >
                    <option value="">Select</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showPopup && (
        <div className="fixed inset-0 bg-gray-700/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">
              Schedule Next Follow-up
            </h3>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Select Date
              </label>
              <DatePicker
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                className="border px-3 py-1 rounded w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Feedback</label>
              <input
                type="text"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="border px-3 py-1 rounded w-full"
                placeholder="Enter feedback..."
              />
            </div>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowPopup(false)}
                className="px-4 py-1 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowPopup(false)}
                className="px-4 py-1 bg-blue-500 text-white rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
