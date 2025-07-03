import React, { useState } from "react";
import NextImage, { StaticImageData } from "next/image";
import { useRouter } from "next/navigation";
import defaultAvatar from "@/images/assets/profile_avtar.png";

interface AvatarImage {
  url: string | StaticImageData;
  alt?: string;
}

interface BaseUser {
  id: string | number;
  name: string;
  email: string;
  phone: string;
  avatarImage: AvatarImage;
  sessionStatus?: SessionStatus;
  followupStatus?: string;
  [key: string]: unknown;
}

type SessionStatus = "Expiring Soon" | "Active" | "Expired";

interface CustomerTableProps<T extends BaseUser> {
  title: string;
  rows: T[];
  renderActions: (row: T) => React.ReactNode;
  filters?: string[];
}

export function CustomerTable<T extends BaseUser>({
  title,
  rows,
  renderActions,
  filters = [],
}: CustomerTableProps<T>) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState(filters[0] || "All");

  const router = useRouter();

  const priority: Record<SessionStatus, number> = {
    "Expiring Soon": 1,
    Active: 2,
    Expired: 3,
  };

  const filteredRows = rows
    .filter((row) => {
      const matchesName = row.name
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesFilter =
        filter === "All" ||
        row.sessionStatus === filter ||
        row.followupStatus === filter;
      return matchesName && matchesFilter;
    })
    .sort((a, b) => {
      const aPriority = priority[a.sessionStatus as SessionStatus] || 99;
      const bPriority = priority[b.sessionStatus as SessionStatus] || 99;
      return aPriority - bPriority;
    });

  return (
    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
      <h3 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800">{title}</h3>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 w-full sm:w-64 focus:ring-2 focus:ring-teal-400 focus:outline-none"
        />
        {filters.length > 0 && (
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 w-full sm:w-auto focus:ring-2 focus:ring-teal-400 focus:outline-none"
          >
            {filters.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
        )}
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
            {filteredRows.map((row) => {
              const avatarSrc =
                typeof row.avatarImage.url === "string" &&
                row.avatarImage.url.startsWith("http")
                  ? row.avatarImage.url
                  : defaultAvatar;

              return (
                <tr
                  key={row.id}
                  className="border-b hover:bg-gray-50 cursor-pointer transition"
                >
                  <td
                    className="px-2 py-2 whitespace-nowrap"
                    onClick={() =>
                      router.push(`/feature/userProfile/${row.id}`)
                    }
                  >
                    <NextImage
                      src={avatarSrc}
                      alt={"avatar"}
                      height={32}
                      width={32}
                      className="w-8 h-8 rounded-full"
                    />
                  </td>
                  <td
                    className="px-2 py-2 whitespace-nowrap"
                    onClick={() =>
                      router.push(`/feature/userProfile/${row.id}`)
                    }
                  >
                    {row.id}
                  </td>
                  <td
                    className="px-2 py-2 whitespace-nowrap"
                    onClick={() =>
                      router.push(`/feature/userProfile/${row.id}`)
                    }
                  >
                    {row.name}
                  </td>
                  <td
                    className="px-2 py-2 whitespace-nowrap"
                    onClick={() =>
                      router.push(`/feature/userProfile/${row.id}`)
                    }
                  >
                    {row.email}
                  </td>
                  <td
                    className="px-2 py-2 whitespace-nowrap"
                    onClick={() =>
                      router.push(`/feature/userProfile/${row.id}`)
                    }
                  >
                    {row.phone}
                  </td>
                  <td className="px-2 py-2 whitespace-nowrap">
                    {renderActions(row)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
