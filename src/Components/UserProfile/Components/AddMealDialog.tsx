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
      meals: [
        { meal_name: "", quantity: "", recipe: "" },
      ],
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
      if (
        dialogRef.current &&
        !dialogRef.current.contains(event.target as Node)
      ) {
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

  // function to format time to HH:MM format
  const formatTimeTo12H = (time24: string) => {
    if (!time24 || !time24.includes(":")) return "12:00 AM";

    const [hoursStr, minutesStr] = time24.split(":");
    const hours = Number(hoursStr);
    const minutes = Number(minutesStr);

    if (isNaN(hours) || isNaN(minutes)) return "12:00 AM";

    const period = hours >= 12 ? "PM" : "AM";
    const formattedHours = (((hours + 11) % 12) + 1)
      .toString()
      .padStart(2, "0");
    return `${formattedHours}:${minutes.toString().padStart(2, "0")} ${period}`;
  };

  // Calling the API for adding meals
  const handleSubmitMeals = async () => {
    const { userid } = useProfileStore.getState().user;
    const token = localStorage.getItem("token");
    if (!userid || !token) {
      setToast({
        message: "User ID not found or unauthenticated",
        type: "error",
      });
      return;
    }

    // Copy sections and update sectionName from tempSectionName
    const cleanedSections = sections.map((section) => ({
      ...section,
      sectionName: section.tempSectionName,
    }));

    const payload = cleanedSections.map((section) => ({
      name: section.sectionName,
      time: formatTimeTo12H(section.mealTime),
      elements: section.meals.map((meal) => ({
        mealname: meal.meal_name,
        quantity: meal.quantity,
        recipe: meal.recipe,
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

      const data = await res.json();
      console.log("Response from server:", data);

      if (!res.ok) {
        const error = await res.text();
        throw new Error(error);
      }

      setToast({ message: "Meals added successfully", type: "success" });
      setDialogOpen("mealSeprate", false);
    } catch (error) {
      console.log("Something went wrong" + error);
    }
  };

  return (
    <>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="w-full fixed inset-0 bg-black/50 flex justify-center items-center z-50 overflow-y-auto md:p-4 ">
        <div
          ref={dialogRef}
          className="bg-white md:rounded-lg shadow-lg w-full max-w-[90%] max-h-screen overflow-y-auto"
        >
          <h3 className="text-xl font-semibold mb-4 text-center mt-4">
            Add Meals
          </h3>

          <div className="mb-4 text-center">
            <select
              value={weekday}
              onChange={(e) => setWeekday(e.target.value)}
              className="w-40 p-2 border rounded"
            >
              {[
                "monday",
                "tuesday",
                "wednesday",
                "thursday",
                "friday",
                "saturday",
                "sunday",
              ].map((day) => (
                <option key={day} value={day}>
                  {day.charAt(0).toUpperCase() + day.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="md:px-6 pb-4">
            {sections.map((section, sectionIndex) => (
              <div className="mb-4 pt-4 border-t" key={section.id}>
                <div className="flex items-center justify-between mb-2 pr-2 md:p-1">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={section.tempSectionName}
                      onChange={(e) => {
                        const updated = [...sections];
                        updated[sectionIndex].tempSectionName = e.target.value;
                        setSections(updated);
                      }}
                      className="text-sm border rounded px-2 py-1 ml-2"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium">Meal Time:</label>
                    <input
                      type="time"
                      value={section.mealTime}
                      onChange={(e) => {
                        const updated = [...sections];
                        updated[sectionIndex].mealTime = e.target.value;
                        setSections(updated);
                      }}
                      className="border px-2 py-1 rounded text-sm"
                    />
                  </div>
                </div>

                <div className="max-h-36 overflow-y-auto p-2 md:pr-1 space-y-2">
                  {section.meals.map((input, idx) => (
                    <div className="flex gap-4 md:gap-8 flex-wrap" key={idx}>
                      <input
                        type="text"
                        placeholder="Meal name"
                        value={input.meal_name}
                        onChange={(e) =>
                          handleInputChange(
                            sectionIndex,
                            idx,
                            "meal_name",
                            e.target.value
                          )
                        }
                        className=" w-44 md:w-64 p-2 border rounded"
                      />
                      <input
                        type="text"
                        placeholder="Quantity"
                        value={input.quantity}
                        onChange={(e) =>
                          handleInputChange(
                            sectionIndex,
                            idx,
                            "quantity",
                            e.target.value
                          )
                        }
                        className="w-44 md:w-52 p-2 border rounded"
                      />
                      <input
                        type="text"
                        placeholder="Recipe"
                        value={input.recipe}
                        onChange={(e) =>
                          handleInputChange(
                            sectionIndex,
                            idx,
                            "recipe",
                            e.target.value
                          )
                        }
                        className="flex-1 p-2 border rounded"
                      />
                    </div>
                  ))}
                </div>

                <button
                  className="px-3 py-2 ml-2 mt-3  bg-blue-500 text-white rounded"
                  onClick={() => handleAddMore(sectionIndex)}
                >
                  Add More
                </button>
              </div>
            ))}

            <div className="flex justify-between mt-6">
              <button
                className="px-4 py-2 ml-2 bg-orange-400 text-white rounded"
                onClick={() => handleSubmitMeals()}
              >
                Done
              </button>
              <button
                className="px-4 py-2 mr-2 md:mr-0 bg-green-500 text-white rounded"
                onClick={handleAddSection}
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
