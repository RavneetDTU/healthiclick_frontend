"use client";

import React, { useEffect, useState } from "react";
import { useDietPlanStore } from "./store/DietStore";
import { Sidebar } from "@/shared/atoms/Sidebar";
import { Header } from "@/shared/atoms/Header";
import { ImCross } from "react-icons/im";
import { FaCheck } from "react-icons/fa";
import { Footer } from "@/shared/atoms/Footer";

const weekDays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export const DietPlan = () => {
  const { weekDay, meals, setWeekDay, loadMockMeals } = useDietPlanStore();
  const [skippedItems, setSkippedItems] = useState<string[]>([]);
  const [preferredItems, setPreferredItems] = useState<string[]>([]);

  useEffect(() => {
    loadMockMeals();
  }, [loadMockMeals]);

  const handleSkip = (mealName: string) => {
    if (!skippedItems.includes(mealName)) {
      setSkippedItems([...skippedItems, mealName]);
      setPreferredItems(preferredItems.filter((item) => item !== mealName));
    }
  };

  const handlePreference = (mealName: string) => {
    if (!preferredItems.includes(mealName)) {
      setPreferredItems([...preferredItems, mealName]);
      setSkippedItems(skippedItems.filter((item) => item !== mealName));
    }
  };

  return (
    <div className="min-h-screen bg-[#fef7f2]">
      <Header />

      <div className="flex flex-col lg:flex-row">
        <Sidebar />
        <main className="p-4 sm:p-6 overflow-y-auto w-full">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">Diet Plan</h2>

          <div className="mb-6 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
            <div>
              <label className="text-base sm:text-lg font-medium mr-2 sm:mr-4">Weekdays</label>
              <select
                className="border rounded px-3 py-1 text-sm bg-white"
                value={weekDay}
                onChange={(e) => setWeekDay(e.target.value)}
              >
                <option value="">Choose a Day...</option>
                {weekDays.map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-3 sm:gap-4">
              <button
                className="px-4 py-1 rounded bg-red-200 text-red-800 text-sm"
                onClick={() => alert("Click on any meal item to skip it")}
              >
                Mark as Skip
              </button>
              <button
                className="px-4 py-1 rounded bg-green-200 text-green-800 text-sm"
                onClick={() => alert("Click on any meal item to mark as preference")}
              >
                Mark as Preference
              </button>
            </div>
          </div>

          {Object.entries(meals).map(([mealTitle, items]) => (
            <div
              key={mealTitle}
              className="mb-6 bg-white rounded shadow-md shadow-gray-300"
            >
              <div className="border-b px-4 py-2 font-semibold text-base sm:text-lg">
                {mealTitle}
              </div>
              <div className="px-2 sm:px-4 py-2">
                {items.map((item, index) => {
                  const isSkipped = skippedItems.includes(item.meal_name);
                  const isPreferred = preferredItems.includes(item.meal_name);

                  return (
                    <div
                      key={index}
                      className={`flex flex-wrap justify-between sm:justify-around items-center py-2 sm:py-1 transition-colors rounded px-2 sm:px-4 cursor-pointer hover:bg-orange-100 ${
                        isSkipped ? "bg-red-100" : isPreferred ? "bg-green-100" : ""
                      }`}
                      onClick={() => {
                        if (window.confirm("Mark this item as 'Skip'? Click Cancel to mark as 'Preference'.")) {
                          handleSkip(item.meal_name);
                        } else {
                          handlePreference(item.meal_name);
                        }
                      }}
                    >
                      <div className="capitalize w-1/2 sm:w-48 text-sm sm:text-base">{item.meal_name}</div>
                      <div className="w-1/3 sm:w-28 text-sm sm:text-base">{item.quantity}</div>
                      <div className="text-green-500 text-lg sm:text-xl">
                        <FaCheck />
                      </div>
                      <div className="text-red-500 text-lg sm:text-xl">
                        <ImCross />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </main>
      </div>

      <Footer />
    </div>
  );
};
