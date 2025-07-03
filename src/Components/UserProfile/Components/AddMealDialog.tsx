"use client";

import { useState, useEffect, useRef } from "react";
import { useProfileStore } from "../store/userProfileStore";
import { Toast } from "@/Components/ui/Toast";

interface MealItem {
  id: number;
  meal_name: string;
  quantity: string;
  recipe: string;
}

interface ToastState {
  message: string;
  type: "success" | "error";
}

type MealInput = Omit<MealItem, "id">;

interface MealSection {
  id: number;
  sectionName: string;
  tempSectionName: string;
  mealTime: string;
  meals: MealInput[];
}

export default function AddMealDialog() {
  const { dialogOpen, setDialogOpen } = useProfileStore();
  const dialogRef = useRef<HTMLDivElement>(null);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [weekday, setWeekday] = useState<string>("monday");

  const [sections, setSections] = useState<MealSection[]>(
    ["Breakfast", "Lunch", "Dinner"].map((name, idx) => ({
      id: Date.now() + idx,
      sectionName: name,
      tempSectionName: name,
      mealTime: "",
      meals: [{ meal_name: "", quantity: "", recipe: "" }],
    }))
  );

  const handleInputChange = (
    sectionIndex: number,
    mealIndex: number,
    field: keyof MealInput,
    value: string
  ) => {
    const updated = [...sections];
    updated[sectionIndex].meals[mealIndex][field] = value;
    setSections(updated);
  };

  const handleAddMore = (sectionIndex: number) => {
    const updated = [...sections];
    updated[sectionIndex].meals.push({
      meal_name: "",
      quantity: "",
      recipe: "",
    });
    setSections(updated);
  };

  const handleAddSection = () => {
    setSections([
      ...sections,
      {
        id: Date.now(),
        sectionName: `Section ${sections.length + 1}`,
        tempSectionName: `Section ${sections.length + 1}`,
        mealTime: "",
        meals: [{ meal_name: "", quantity: "", recipe: "" }],
      },
    ]);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dialogRef.current && !dialogRef.current.contains(event.target as Node)) {
        setDialogOpen("mealSeprate", false);
      }
    };

    if (dialogOpen.mealSeprate) {
      document.addEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "";
    };
  }, [dialogOpen.mealSeprate, setDialogOpen]);

  if (!dialogOpen.mealSeprate) return null;

  const formatTimeTo12H = (time24: string) => {
    if (!time24 || !time24.includes(":")) return "12:00 AM";
    const [h, m] = time24.split(":").map(Number);
    const period = h >= 12 ? "PM" : "AM";
    const hour = ((h + 11) % 12 + 1).toString().padStart(2, "0");
    return `${hour}:${m.toString().padStart(2, "0")} ${period}`;
  };

  const handleSubmitMeals = async () => {
    const { userid } = useProfileStore.getState().user;
    const token = localStorage.getItem("token");
    if (!userid || !token) {
      setToast({ message: "User ID not found or unauthenticated", type: "error" });
      return;
    }

    const payload = sections.map((section) => ({
      name: section.tempSectionName,
      time: formatTimeTo12H(section.mealTime),
      elements: section.meals.map((m) => ({
        mealname: m.meal_name,
        quantity: m.quantity,
        recipe: m.recipe,
      })),
      weekday,
    }));

    try {
      const res = await fetch(
        `https://xyz.healthiclick.com/admin/meals?user_id=${userid}&weekday=${weekday}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) throw new Error(await res.text());

      setToast({ message: "Meals added successfully", type: "success" });
      setDialogOpen("mealSeprate", false);
    } catch (error) {
      console.error("Submit error:", error);
      setToast({ message: "Something went wrong", type: "error" });
    }
  };

  return (
    <>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="w-full fixed inset-0 bg-black/50 flex justify-center items-center z-50 overflow-y-auto p-4">
        <div ref={dialogRef} className="bg-white rounded-xl shadow-lg w-full max-w-[90%] max-h-screen overflow-y-auto">
          <h3 className="text-xl font-semibold text-center mt-5 text-teal-700">Add Meals</h3>

          <div className="text-center mt-2 mb-4">
            <select
              value={weekday}
              onChange={(e) => setWeekday(e.target.value)}
              className="w-40 p-2 border rounded text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-400"
            >
              {["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"].map((day) => (
                <option key={day} value={day}>
                  {day.charAt(0).toUpperCase() + day.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="px-6 pb-6 space-y-8">
            {sections.map((section, sectionIndex) => (
              <div key={section.id} className="border-t pt-4 space-y-4">
                <div className="flex flex-col md:flex-row justify-between gap-3 items-center">
                  <input
                    type="text"
                    value={section.tempSectionName}
                    onChange={(e) => {
                      const updated = [...sections];
                      updated[sectionIndex].tempSectionName = e.target.value;
                      setSections(updated);
                    }}
                    className="border px-3 py-2 rounded text-sm w-full md:w-1/2 bg-gray-50 focus:ring-2 focus:ring-teal-400"
                  />

                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-600">Meal Time:</label>
                    <input
                      type="time"
                      value={section.mealTime}
                      onChange={(e) => {
                        const updated = [...sections];
                        updated[sectionIndex].mealTime = e.target.value;
                        setSections(updated);
                      }}
                      className="border px-3 py-2 rounded text-sm bg-gray-50 focus:ring-2 focus:ring-teal-400"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  {section.meals.map((input, idx) => (
                    <div key={idx} className="flex flex-wrap gap-3">
                      <input
                        type="text"
                        placeholder="Meal name"
                        value={input.meal_name}
                        onChange={(e) => handleInputChange(sectionIndex, idx, "meal_name", e.target.value)}
                        className="w-44 md:w-64 p-2 border rounded bg-gray-50 focus:ring-2 focus:ring-teal-400"
                      />
                      <input
                        type="text"
                        placeholder="Quantity"
                        value={input.quantity}
                        onChange={(e) => handleInputChange(sectionIndex, idx, "quantity", e.target.value)}
                        className="w-36 md:w-52 p-2 border rounded bg-gray-50 focus:ring-2 focus:ring-teal-400"
                      />
                      <input
                        type="text"
                        placeholder="Recipe"
                        value={input.recipe}
                        onChange={(e) => handleInputChange(sectionIndex, idx, "recipe", e.target.value)}
                        className="flex-1 p-2 border rounded bg-gray-50 focus:ring-2 focus:ring-teal-400"
                      />
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => handleAddMore(sectionIndex)}
                  className="mt-2 px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 transition"
                >
                  Add More
                </button>
              </div>
            ))}

            <div className="flex justify-between mt-6">
              <button
                onClick={handleSubmitMeals}
                className="px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600 transition"
              >
                Done
              </button>
              <button
                onClick={handleAddSection}
                className="px-4 py-2 bg-gray-100 text-gray-800 rounded hover:bg-gray-200 transition"
              >
                Add Section
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
