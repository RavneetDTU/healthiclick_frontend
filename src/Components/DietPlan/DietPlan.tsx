"use client";

import React, { useEffect } from "react";
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

  useEffect(() => {
    loadMockMeals();
  }, [loadMockMeals]);

  return (
    <div className="min-h-screen bg-[#fef7f2]">
      <Header />

      <div className="flex h-[calc(100vh-64px)]">
        <Sidebar />
        <main className="p-6 overflow-y-auto w-full">
          <h2 className="text-3xl font-bold mb-4">Diet Plan</h2>

          <div className="mb-6">
            <label className="text-lg font-medium mr-4">Weekdays</label>
            <select
              className="border rounded px-4 py-1 text-sm bg-white"
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

          {Object.entries(meals).map(([mealTitle, items]) => (
            <div
              key={mealTitle}
              className="mb-6 bg-white rounded shadow-md shadow-gray-300"
            >
              <div className="border-b px-4 py-2 font-semibold">
                {mealTitle}
              </div>
              <div className="px-4 py-2">
                {items.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-around items-center py-1"
                  >
                    <div className="capitalize w-48 ">{item.meal_name}</div>
                    <div className="w-28 ">{item.quantity}</div>
                    <div className="text-green-500 text-xl">
                      <FaCheck />
                    </div>
                    <div className="text-red-500 text-xl">
                      <ImCross />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </main>
      </div>

      <Footer/>
    </div>
  );
};
