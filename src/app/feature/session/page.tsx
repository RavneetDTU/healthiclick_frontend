
import type { Metadata } from "next";
import BookingCalendar from "@/Components/CreateSession/Components/BookingCalender";
import { Header } from "@/shared/atoms/Header";
import { Sidebar } from "@/shared/atoms/Sidebar";
import { Footer } from "@/shared/atoms/Footer";

export const metadata: Metadata = {
  title: "Book a Session",
  description: "Schedule an appointment with our team",
};

export default function BookSessionPage() {
  return (
    <div className="min-h-screen bg-[#fef7f2]">
      <Header />

      <div className="flex">
        <div className="hidden md:block">
          <Sidebar />
        </div>

        <div className="flex-1 overflow-hidden">
          <main className="p-6 overflow-y-auto h-full">
            <div className="bg-white shadow-sm rounded mb-6">
              <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center">
                <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Book a Session</h1>
                <p className="mt-4 text-muted-foreground">
                  Select a date and time slot to schedule your appointment
                </p>
              </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
              <BookingCalendar />
            </div>
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
}
