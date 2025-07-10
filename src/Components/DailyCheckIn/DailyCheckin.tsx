"use client";
import { useState, useEffect } from "react";
import { Header } from "@/shared/atoms/Header";
import { Sidebar } from "@/shared/atoms/Sidebar";
import { Footer } from "@/shared/atoms/Footer";
import { useProfileStore } from "../UserProfile/store/userProfileStore";
import { Toast } from "../ui/Toast";

const DailyCheckIn = () => {
  const [date, setDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [waterIntake, setWaterIntake] = useState<number>(0);
  const [physicalActivities, setPhysicalActivities] = useState<string>("");
  const [extraFood, setExtraFood] = useState<string>("");
  const [sleepHours, setSleepHours] = useState<number>(0);
  const [weekday, setWeekday] = useState<string>("");
  const [isEditingPastDate, setIsEditingPastDate] = useState<boolean>(false);

  const { user } = useProfileStore();
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  useEffect(() => {
    updateWeekday(date);
  }, [date]);

  const updateWeekday = (selectedDate: string) => {
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const dateObj = new Date(selectedDate);
    setWeekday(days[dateObj.getDay()]);

    const today = new Date().toISOString().split("T")[0];
    setIsEditingPastDate(selectedDate !== today);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!user?.userid) {
      console.warn("⏳ missing userId");
      return;
    }

    if (!token) {
      setToast({ message: "User not authenticated", type: "error" });
      return;
    }

    const payload = {
      date: new Date(date).toISOString(),
      water_intake: waterIntake,
      physical_activities: physicalActivities,
      extra_food: extraFood,
      sleep_hours: sleepHours,
    };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/daily-checkin`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Something went wrong");
      }

      setToast({
        message: "Daily check-in saved successfully",
        type: "success",
      });

      // Reset form
      setWaterIntake(0);
      setPhysicalActivities("");
      setExtraFood("");
      setSleepHours(0);
    } catch (error: unknown) {
      console.error("Error saving data:", error);
      setToast({ message: "Failed to save daily check-in", type: "error" });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header />
      <div className="flex flex-1">
        <div className="hidden md:block">
          <Sidebar />
        </div>

        <div className="w-full py-6 px-4">
          <div className="max-w-md mx-auto bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="p-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
                <h2 className="text-xl font-semibold text-teal-700 mb-2 sm:mb-0">
                  Daily Wellness Log
                </h2>
                <div className="text-sm text-gray-600">
                  <span className="font-medium">{weekday}</span>,{" "}
                  {new Date(date).toLocaleDateString()}
                </div>
              </div>

              {isEditingPastDate && (
                <div className="mb-4 p-3 bg-teal-200 text-white rounded-lg text-xs sm:text-sm">
                  You`re editing data for a past date.
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="date"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Log Date
                  </label>
                  <input
                    type="date"
                    id="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    max={new Date().toISOString().split("T")[0]}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-200"
                  />
                </div>

                <div className="space-y-4">
                  <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                    <label
                      htmlFor="water"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Water Intake
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        id="water"
                        value={waterIntake || ""}
                        onChange={(e) =>
                          setWaterIntake(parseInt(e.target.value) || 0)
                        }
                        min="0"
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-200"
                        placeholder="Enter litres of water"
                      />
                      <span className="absolute right-3 top-2 text-gray-500 text-sm">
                        litre
                      </span>
                    </div>
                  </div>

                  <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                    <label
                      htmlFor="activities"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Physical Activities
                    </label>
                    <input
                      type="text"
                      id="activities"
                      value={physicalActivities}
                      onChange={(e) => setPhysicalActivities(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-200"
                      placeholder="E.g., Running, Yoga, Swimming"
                    />
                  </div>

                  <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                    <label
                      htmlFor="extraFood"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Additional Food Intake
                    </label>
                    <input
                      type="text"
                      id="extraFood"
                      value={extraFood}
                      onChange={(e) => setExtraFood(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-200"
                      placeholder="E.g., Dessert, Snacks"
                    />
                  </div>

                  <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                    <label
                      htmlFor="sleep"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Sleep Duration
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        id="sleep"
                        value={sleepHours || ""}
                        onChange={(e) =>
                          setSleepHours(parseFloat(e.target.value) || 0)
                        }
                        min="0"
                        max="24"
                        step="0.5"
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-200"
                        placeholder="Enter sleep hours"
                      />
                      <span className="absolute right-3 top-2 text-gray-500 text-sm">
                        hours
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-teal-500 hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-300 transition-colors duration-200"
                  >
                    Save Wellness Log
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <Footer />

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default DailyCheckIn;
