import ActivityCharts from "@/Components/UserProfile/Components/ActivityChart";
import { Footer } from "@/shared/atoms/Footer";
import { Header } from "@/shared/atoms/Header";
import { Sidebar } from "@/shared/atoms/Sidebar";
import React from "react";
function page() {
  return (
    <div className="min-h-screen bg-[#fef7f2] ">
      <Header />
      <div className="flex flex-col lg:flex-row">
        <div className="hidden md:block">
          <Sidebar />
        </div>

       <ActivityCharts />
      </div>

      <Footer />
    </div>
  );
}
export default page;
