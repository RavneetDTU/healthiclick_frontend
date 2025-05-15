"use client";

import React, { useEffect } from "react";
import { Header } from "@/shared/atoms/Header";
import { Sidebar } from "@/shared/atoms/Sidebar";
import { MetricCard } from "@/shared/atoms/MatricCard";
import { useDashboardStore } from "./store/dashboardStore";
import { Status } from "./type";
import { FollowupTable } from "@/shared/atoms/FollowupTable";
import avtarImage from "@/images/assets/profile_avtar.png";
import { Footer } from "@/shared/atoms/Footer";
import { PlansTable } from "@/shared/atoms/PlanTable";
import { SessionTable } from "@/shared/atoms/CreateSession";

const Dashboard = () => {
  const { sessions, orders, customers, followups, setDashboardData } =
    useDashboardStore();

  useEffect(() => {
    // mock fetching data
    setDashboardData({
      sessions: 28,
      orders: 80,
      customers: 542,
      followups: [
        {
          id: 1,
          name: "john smith",
          email: "john@gmail.com",
          phone: "5676786855",
          avatarImage: {
            url: avtarImage,
            alt: "john smith",
          },
          status: Status.Active,
        },
        {
          id: 2,
          name: "jane doe",
          email: "jane@example.com",
          phone: "9876543210",
          avatarImage: {
            url: avtarImage, // Reusing the same image — change if needed
            alt: "jane doe",
          },
          status: Status.Pending,
        },
      ],
    });
  }, [setDashboardData]);

  return (
    <div className="min-h-screen bg-[#fef7f2]">
      <Header />

      <div className="flex">
        <Sidebar />
        <main className="p-6 overflow-y-auto w-full ">
          <h2 className="text-3xl font-bold mb-6">Dashboard</h2>
          <div className="grid grid-cols-3 gap-6 mb-8">
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
            <FollowupTable title="Today's Followup" followups={followups} />
            <PlansTable/>
            <SessionTable/>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default Dashboard;
