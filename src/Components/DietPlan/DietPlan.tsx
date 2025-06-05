"use client";

import React, { useEffect, useState } from "react";
import { useDietPlanStore } from "./store/DietStore";
import { Sidebar } from "@/shared/atoms/Sidebar";
import { Header } from "@/shared/atoms/Header";
import { ImCross } from "react-icons/im";
import { FaCheck } from "react-icons/fa";
import { Footer } from "@/shared/atoms/Footer";
import { Toast } from "../ui/Toast";

interface MealItem {
  id: number;
  meal_name: string;
  quantity: string;
  recipe: string;
  weekday?: string;
  category?: string;
}

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
  const { weekDay, meals, setWeekDay, setMeals } = useDietPlanStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState<MealItem | null>(null);
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    const dummyMeals: MealItem[] = [
      { id: 1, meal_name: "Oats", quantity: "1 bowl", recipe: "Boil oats with milk", category: "Breakfast" },
      { id: 2, meal_name: "Grilled Chicken", quantity: "150g", recipe: "Grill with spices", category: "Lunch" },
      { id: 3, meal_name: "Salad", quantity: "1 bowl", recipe: "Mix veggies", category: "Dinner" },
    ];

    const grouped = dummyMeals.reduce((acc, meal) => {
      const category = meal.category || "Other";
      if (!acc[category]) acc[category] = [];
      acc[category].push(meal);
      return acc;
    }, {} as Record<string, MealItem[]>);

    setMeals(grouped);
  }, [weekDay, setMeals]);

  const handleTrackMeal = async (
    meal_id: number,
    followed: boolean,
    reason: string
  ) => {
    console.log("Tracked:", { meal_id, followed, reason });
    setToast({
      message: followed ? "Diet followed" : "Meal not followed",
      type: followed ? "success" : "error",
    });
  };

  const openModal = (meal: MealItem) => {
    setSelectedMeal(meal);
    setModalOpen(true);
  };

  const submitReason = () => {
    if (selectedMeal) {
      handleTrackMeal(selectedMeal.id, false, reason || "No reason given");
    }
    setModalOpen(false);
    setReason("");
    setNotes("");
    setSelectedMeal(null);
  };

  return (
    <div className="min-h-screen bg-[#fef7f2]">
      <Header />
      <div className="flex flex-col lg:flex-row">
        <div className="hidden md:block">
          <Sidebar />
        </div>

        <main className="p-4 sm:p-6 overflow-y-auto w-full">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">Diet Plan</h2>

          <div className="mb-6">
            <label className="text-base sm:text-lg font-medium mr-2 sm:mr-4">
              Weekdays
            </label>
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

          {Object.entries(meals).map(([mealTitle, items]) => (
            <div key={mealTitle} className="mb-6 bg-white rounded shadow-md">
              <div className="border-b px-4 py-2 font-semibold text-base sm:text-lg">
                {mealTitle}
              </div>
              <div className="px-2 sm:px-4 py-2">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-wrap justify-between items-center py-2 rounded px-2 hover:bg-orange-100"
                  >
                    <div className="w-1/2 sm:w-48 text-sm sm:text-base capitalize">
                      {item.meal_name}
                    </div>
                    <div className="w-1/3 sm:w-28 text-sm sm:text-base">
                      {item.quantity}
                    </div>
                    <div
                      className="text-green-500 text-xl cursor-pointer"
                      onClick={() =>
                        handleTrackMeal(item.id, true, "Diet followed")
                      }
                    >
                      <FaCheck />
                    </div>
                    <div
                      className="text-red-500 text-xl cursor-pointer"
                      onClick={() => openModal(item)}
                    >
                      <ImCross />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </main>
      </div>

      <Footer />

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {modalOpen && selectedMeal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">
              Reason for skipping: {selectedMeal.meal_name}
            </h3>
            <label className="block mb-2 text-sm font-medium">Reason</label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full p-2 border rounded mb-4"
              placeholder="E.g. Didn't feel hungry"
            />
            <label className="block mb-2 text-sm font-medium">
              Additional Notes (optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-2 border rounded mb-4"
              rows={3}
              placeholder="Any other information you want to add"
            />
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-300 rounded"
                onClick={() => setModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded"
                onClick={submitReason}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};