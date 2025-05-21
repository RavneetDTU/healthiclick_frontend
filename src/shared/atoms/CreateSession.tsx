import React, { useState } from "react";
import NextImage, { StaticImageData } from "next/image";
import { useRouter } from "next/navigation";
import avtarImage from "@/images/assets/profile_avtar.png";

interface Plan {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatarImage: {
    url: string | StaticImageData;
    alt?: string;
  };
  sessionStatus: "Expiring Soon" | "Active" | "Expired";
}

const mockPlans: Plan[] = [
  {
    id: "001",
    name: "Alice Johnson",
    email: "alice@example.com",
    phone: "123-456-7890",
    avatarImage: { url: avtarImage },
    sessionStatus: "Expiring Soon",
  },
  {
    id: "002",
    name: "Bob Smith",
    email: "bob@example.com",
    phone: "321-654-0987",
    avatarImage: { url: avtarImage },
    sessionStatus: "Active",
  },
  {
    id: "003",
    name: "Carol Williams",
    email: "carol@example.com",
    phone: "987-654-3210",
    avatarImage: { url: avtarImage },
    sessionStatus: "Expired",
  },
  {
    id: "004",
    name: "David Brown",
    email: "david@example.com",
    phone: "456-789-1234",
    avatarImage: { url: avtarImage },
    sessionStatus: "Expiring Soon",
  },
];

export const CreateSession: React.FC = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<
    "All" | "Active" | "Expiring Soon" | "Expired"
  >("All");

  const router = useRouter();

  const filteredPlans = mockPlans
    .filter(
      (plan) =>
        plan.name.toLowerCase().includes(search.toLowerCase()) &&
        (filter === "All" || plan.sessionStatus === filter)
    )
    .sort((a, b) => {
      const priority = {
        "Expiring Soon": 1,
        Active: 2,
        Expired: 3,
      };
      return priority[a.sessionStatus] - priority[b.sessionStatus];
    });

  return (
    <div className="bg-white p-4 sm:p-6 rounded shadow shadow-gray-500">
      <h3 className="text-lg sm:text-xl font-semibold mb-4">Plans</h3>

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
            setFilter(
              e.target.value as "All" | "Active" | "Expiring Soon" | "Expired"
            )
          }
          className="border border-gray-300 rounded px-3 py-2 w-full sm:w-auto"
        >
          <option value="All">All</option>
          <option value="Expiring Soon">Expiring Soon</option>
          <option value="Active">Active</option>
          <option value="Expired">Expired</option>
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
              <th className="px-2 py-2 whitespace-nowrap">Session</th>
            </tr>
          </thead>
          <tbody>
            {filteredPlans.map((plan) => (
              <tr
                key={plan.id}
                onClick={() => router.push("/feature/userProfile")}
                className="border-b hover:bg-gray-50 cursor-pointer"
              >
                <td className="px-2 py-2 whitespace-nowrap">
                  <NextImage
                    src={plan.avatarImage.url}
                    alt={plan.avatarImage.alt || "avatar"}
                    height={32}
                    width={32}
                    className="w-8 h-8 rounded-full"
                  />
                </td>
                <td className="px-2 py-2 whitespace-nowrap">{plan.id}</td>
                <td className="px-2 py-2 whitespace-nowrap">{plan.name}</td>
                <td className="px-2 py-2 whitespace-nowrap">{plan.email}</td>
                <td className="px-2 py-2 whitespace-nowrap">{plan.phone}</td>
                <td className="px-2 py-2 whitespace-nowrap font-medium">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      plan.sessionStatus === "Expiring Soon"
                        ? "bg-orange-200 text-orange-800"
                        : plan.sessionStatus === "Active"
                        ? "bg-green-200 text-green-800"
                        : "bg-red-200 text-red-800"
                    }`}
                  >
                    {plan.sessionStatus}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
