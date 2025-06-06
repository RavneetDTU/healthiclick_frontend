// components/DailyCheckIn.tsx
"use client";
import { useState, useEffect } from "react";
import { useCheckInStore } from "./store/DailyCheckinStore";
import { Header } from "@/shared/atoms/Header";
import { Sidebar } from "@/shared/atoms/Sidebar";
import { Footer } from "@/shared/atoms/Footer";

const DailyCheckIn = () => {
  const [date, setDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [steps, setSteps] = useState<number>(0);
  const [weight, setWeight] = useState<number>(0);
  const [calories, setCalories] = useState<number>(0);
  const [sleepHours, setSleepHours] = useState<number>(0);
  const [weekday, setWeekday] = useState<string>("");
  const [isEditingPastDate, setIsEditingPastDate] = useState<boolean>(false);

  const { addCheckIn, getCheckIn } = useCheckInStore();

  useEffect(() => {
    updateWeekday(date);
    loadExistingData(date);
  }, [date]);

  const updateWeekday = (selectedDate: string) => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const dateObj = new Date(selectedDate);
    setWeekday(days[dateObj.getDay()]);

    const today = new Date().toISOString().split("T")[0];
    setIsEditingPastDate(selectedDate !== today);
  };

  const loadExistingData = (selectedDate: string) => {
    const existingData = getCheckIn(selectedDate);
    if (existingData) {
      setSteps(existingData.steps);
      setWeight(existingData.weight);
      setCalories(existingData.calories);
      setSleepHours(existingData.sleepHours);
    } else {
      setSteps(0);
      setWeight(0);
      setCalories(0);
      setSleepHours(0);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addCheckIn({
      date,
      steps,
      weight,
      calories,
      sleepHours,
    });
    alert("Data saved successfully!");
  };

  return (
    <div className="min-h-screen bg-[#fef7f2]">
      <Header />
      <div className="flex">
        <div className="hidden md:block">
          <Sidebar />
        </div>

        <div className="w-full bg-gradient-to-br from-orange-50 to-orange-100/35 py-6 px-4">
          <div className="max-w-md mx-auto bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="p-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800 mb-2 sm:mb-0">
                  Daily Check-In
                </h2>
                <div className="text-sm text-gray-500">
                  <span className="font-medium">{weekday}</span>,{" "}
                  {new Date(date).toLocaleDateString()}
                </div>
              </div>

              {isEditingPastDate && (
                <div className="mb-4 p-3 bg-yellow-50 text-yellow-800 rounded-lg text-xs sm:text-sm">
                  You`re editing data for a past date.
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="date"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Select Date
                  </label>
                  <input
                    type="date"
                    id="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    max={new Date().toISOString().split("T")[0]}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200"
                  />
                </div>

                <div className="space-y-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <label
                      htmlFor="steps"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Step Count
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        id="steps"
                        value={steps || ""}
                        onChange={(e) =>
                          setSteps(parseInt(e.target.value) || 0)
                        }
                        min="0"
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200"
                        placeholder="Enter steps"
                      />
                      <span className="absolute right-3 top-2 text-gray-500 text-sm">
                        steps
                      </span>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-3 rounded-lg">
                    <label
                      htmlFor="weight"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Weight
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        id="weight"
                        value={weight || ""}
                        onChange={(e) =>
                          setWeight(parseFloat(e.target.value) || 0)
                        }
                        min="0"
                        step="0.1"
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200"
                        placeholder="Enter weight"
                      />
                      <span className="absolute right-3 top-2 text-gray-500 text-sm">
                        kg
                      </span>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-3 rounded-lg">
                    <label
                      htmlFor="calories"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Calories
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        id="calories"
                        value={calories || ""}
                        onChange={(e) =>
                          setCalories(parseInt(e.target.value) || 0)
                        }
                        min="0"
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200"
                        placeholder="Enter calories"
                      />
                      <span className="absolute right-3 top-2 text-gray-500 text-sm">
                        kcal
                      </span>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-3 rounded-lg">
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
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200"
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
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-orange-300 hover:bg-orange-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-200 transition-colors duration-200"
                  >
                    Save Daily Log
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default DailyCheckIn;
