"use client";

import React, { useEffect, useState } from "react";
import { Header } from "@/shared/atoms/Header";
import { Sidebar } from "@/shared/atoms/Sidebar";
import { MetricCard } from "@/shared/atoms/MatricCard";
import { useCustomerStore } from "./store/AllCustomerStore";
import { Followup , Status  } from "./type";
import avtarImage from "@/images/assets/profile_avtar.png";
import { Footer } from "@/shared/atoms/Footer";
import axios from "axios";
import { CustomerTable } from "@/shared/atoms/CustomerTable";
import { PopupComponent } from "@/shared/atoms/PopupComponent";

interface UserApiResponse {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  avatar?: string;
}

const AllCustomer = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [feedback, setFeedback] = useState("");

  const { sessions, orders, customers, followups, setDashboardData } =
    useCustomerStore();

  // const sessionUsers: SessionUser[] = [
  //   {
  //     id: 101,
  //     name: "Alice Johnson",
  //     email: "alice@example.com",
  //     phone: "123-456-7890",
  //     avatarImage: { url: avtarImage },
  //     sessionStatus: "Expiring Soon",
  //   },
  //   {
  //     id: 102,
  //     name: "Bob Smith",
  //     email: "bob@example.com",
  //     phone: "321-654-0987",
  //     avatarImage: { url: avtarImage },
  //     sessionStatus: "Active",
  //   },
  //   {
  //     id: 103,
  //     name: "Carol Williams",
  //     email: "carol@example.com",
  //     phone: "987-654-3210",
  //     avatarImage: { url: avtarImage },
  //     sessionStatus: "Expired",
  //   },
  // ];

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No access token found.");
        return;
      }

      try {
        const metricsRes = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/data`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const metrics = metricsRes.data.metrics;

        const usersRes = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/admin/users`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const followupUsers: Followup[] = usersRes.data.map(
          (user: UserApiResponse) => ({
            id: user.id,
            name: user.full_name,
            email: user.email,
            phone: user.phone,
            avatarImage: {
              url: user.avatar || avtarImage,
              alt: user.full_name,
            },
            status: Status.Active,
          })
        );

        setDashboardData({
          sessions: metrics.total_sessions,
          orders: metrics.active_clients,
          customers: metrics.end_of_month_clients,
          followups: followupUsers,
        });
      } catch (error) {
        console.error("Failed to fetch data", error);
        setDashboardData({
          sessions: 0,
          orders: 0,
          customers: 0,
          followups: [],
        });
      }
    };

    fetchData();
  }, [setDashboardData]);

  return (
    <div className="min-h-screen flex flex-col bg-[#f9fafb]">
      <Header />

      <div className="flex flex-1">
        <div className="hidden md:block">
          <Sidebar />
        </div>

        <main className="p-6 overflow-y-auto w-full">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">Dashboard</h2>

          <div className="grid md:grid-cols-3 gap-6 mb-8 sm:grid-cols-1 text-center md:text-start">
            <MetricCard
              title="Today's Session"
              value={sessions}
              change="+3% from last month"
            />
            <MetricCard
              title="Number of Clients"
              value={orders}
              change="+5% from last month"
            />
            <MetricCard
              title="End Month Clients"
              value={customers}
              change="+8% from last month"
            />
          </div>

          <div className="flex flex-col gap-10">
            <CustomerTable<Followup>
              title="Followups"
              rows={followups}
              filters={["All", Status.Active, Status.Pending, Status.Inactive]}
              renderActions={() => (
                <select
                  className="border border-gray-300 rounded px-2 py-1 bg-white text-sm"
                  onChange={(e) => {
                    if (e.target.value === "No") {
                      setShowPopup(true);
                    }
                  }}
                >
                  <option value="">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              )}
            />

            {showPopup && (
              <PopupComponent
                date={selectedDate}
                feedback={feedback}
                onDateChange={setSelectedDate}
                onFeedbackChange={setFeedback}
                onClose={() => setShowPopup(false)}
              />
            )}

            {/* <CustomerTable<SessionUser>
              title="Create Session"
              rows={sessionUsers}
              filters={["All", "Active", "Expiring Soon", "Expired"]}
              renderActions={(row) => (
                <span
                  className={`px-2 py-1 rounded text-xs ${
                    row.sessionStatus === "Expiring Soon"
                      ? "bg-orange-200 text-orange-800"
                      : row.sessionStatus === "Active"
                      ? "bg-green-200 text-green-800"
                      : "bg-red-200 text-red-800"
                  }`}
                >
                  {row.sessionStatus}
                </span>
              )}
            />
            <CustomerTable<SessionUser>
              title="Plans"
              rows={sessionUsers}
              filters={["All", "Active", "Expiring Soon", "Expired"]}
              renderActions={(row) => (
                <span
                  className={`px-2 py-1 rounded text-xs ${
                    row.sessionStatus === "Expiring Soon"
                      ? "bg-orange-200 text-orange-800"
                      : row.sessionStatus === "Active"
                      ? "bg-green-200 text-green-800"
                      : "bg-red-200 text-red-800"
                  }`}
                >
                  {row.sessionStatus}
                </span>
              )}
            /> */}
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default AllCustomer;
