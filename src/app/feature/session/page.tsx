"use client";
import { Header } from "@/shared/atoms/Header";
import { Sidebar } from "@/shared/atoms/Sidebar";
import { Footer } from "@/shared/atoms/Footer";
import { InlineWidget } from "react-calendly";

export default function BookSessionPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#fef7f2]">
      <Header />

      <div className="flex flex-1">
        <div className="hidden md:block">
          <Sidebar />
        </div>

        <div className=" w-fit md:w-full max-h-screen p-4 md:p-0">
        <InlineWidget url="https://calendly.com/mdsahil31818/book-your-session"/>
        </div>
      </div>

      <Footer />
    </div>
  );
}
