"use client";

import React, { useEffect, useState } from "react";
import { useDietPlanStore } from "@/Components/DietPlan/store/DietStore";
import { useProfileStore } from "../store/userProfileStore";
import { Toast } from "@/Components/ui/Toast";
import {
  DietSection,
  weekDays,
  MealItem,
} from "@/Components/DietPlan/store/DietStore";
import EditPopup from "@/Components/EditPopUpComponent/EditPopUp";

export const ProfileDietPlan = () => {
  const { weekDay, meals, setWeekDay, setMeals } = useDietPlanStore();
  const { user } = useProfileStore();
  const [editPopupOpen, setEditPopupOpen] = useState(false);
  const [editInitialData, setEditInitialData] = useState<
    Record<string, MealItem[]>
  >({});
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  useEffect(() => {
    const fetchDietPlan = async () => {
      const token = localStorage.getItem("token");
      if (!user?.userid || !weekDay) return;

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/diet-plan/${
            user.userid
          }?weekday=${weekDay.toLowerCase()}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          throw new Error("Failed to fetch diet plan");
        }

        const data: DietSection[] = await res.json();

        const structured = data.reduce(
          (
            acc: Record<string, MealItem[]>,
            section: DietSection,
            index: number
          ) => {
            const category = section.name || `Section ${index + 1}`;
            const meals = section.elements.map((el, idx) => ({
              id: index * 100 + idx,
              meal_name: el.mealname,
              quantity: el.quantity,
              recipe: el.recipe,
              weekday: section.weekday,
              category,
            }));
            acc[category] = meals;
            return acc;
          },
          {}
        );

        setMeals(structured);
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error("Diet plan fetch failed:", error);
          setToast({
            message: error.message || "Failed to load meals",
            type: "error",
          });
        } else {
          setToast({ message: "Unknown error occurred", type: "error" });
        }
      }
    };

    fetchDietPlan();
  }, [weekDay, user?.userid, setMeals]);

  const openEditPopup = () => {
    setEditInitialData(meals);
    setEditPopupOpen(true);
  };

  const handleEditSave = async (updatedData: Record<string, MealItem[]>) => {
    if (!user?.userid || !weekDay) {
      setToast({ message: "Missing user or weekday info", type: "error" });
      return;
    }

    const token = localStorage.getItem("token");
    const formattedPayload = Object.entries(updatedData).map(
      ([category, items]) => ({
        name: category,
        time: new Date().toISOString(), // You can adjust this based on your actual time field
        weekday: weekDay,
        elements: items.map((item) => ({
          mealname: item.meal_name,
          quantity: item.quantity,
          recipe: item.recipe,
        })),
      })
    );

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/admin/meals?user_id=${
          user.userid
        }&weekday=${weekDay.toLowerCase()}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formattedPayload),
        }
      );

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Failed to update diet: ${text}`);
      }

      setMeals(updatedData); // Optimistically update state
      setToast({ message: "Diet updated successfully", type: "success" });
    } catch (error: unknown) {
      console.error("PUT request failed:", error);
      setToast({
        message: "Failed to update meals",
        type: "error",
      });
    }
  };

  return (
    <div className="h-fit bg-[#fef7f2]">
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

          <button onClick={openEditPopup}>
            <span className="ml-2 text-sm text-blue-600 hover:underline">
              Edit
            </span>
          </button>
        </div>

        {Object.entries(meals).map(([mealTitle, items]) => (
          <div
            key={mealTitle}
            className="mb-2 bg-white rounded shadow-md border border-gray-300 dark:border-gray-700"
          >
            <div className="border-b px-4 py-2 font-semibold text-base sm:text-lg">
              {mealTitle}
            </div>
            <div className="px-2 sm:px-4 py-2 overflow-x-auto">
              <div className="min-w-fit md:min-w-full">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex md:justify-between items-center py-2 rounded px-2 hover:bg-orange-100 whitespace-nowrap"
                  >
                    <div className="w-32 md:w-60 text-sm sm:text-base capitalize ">
                      {item.meal_name}
                    </div>
                    <div className="w-28 md:w-48 text-sm sm:text-base ">
                      {item.quantity}
                    </div>
                    <div className="w-28 md:w-72 text-sm sm:text-base ">
                      {item.recipe}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </main>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <EditPopup<MealItem>
        isOpen={editPopupOpen}
        title="Edit Diet Plan"
        groupedData={editInitialData}
        onClose={() => setEditPopupOpen(false)}
        onSave={handleEditSave}
        visibleFields={["meal_name", "quantity", "recipe"]}
      />
    </div>
  );
};
