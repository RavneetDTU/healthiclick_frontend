"use client";

import React, { useEffect, useState } from "react";
import { useDietPlanStore } from "./store/DietStore";
import { useProfileStore } from "../UserProfile/store/userProfileStore";
import { Sidebar } from "@/shared/atoms/Sidebar";
import { Header } from "@/shared/atoms/Header";
import { ImCross } from "react-icons/im";
import { FaCheck } from "react-icons/fa";
import { Footer } from "@/shared/atoms/Footer";
import { Toast } from "../ui/Toast";
import { DietSection, MealItem, weekDays } from "./store/DietStore";
import Link from "next/link";
import {
  fetchDietPlan,
  fetchDietPdfAvailability,
} from "@/lib/api";

export const DietPlan = () => {
  const { weekDay, meals, setWeekDay, setMeals } = useDietPlanStore();
  const { user } = useProfileStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState<MealItem | null>(null);
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [hasMeals, setHasMeals] = useState(false);
  const [pdfAvailable, setPdfAvailable] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlan = async () => {
      if (!user?.userid || !weekDay) return;

      try {
        const data: DietSection[] = await fetchDietPlan(
          user.userid,
          weekDay.toLowerCase()
        );

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
        setHasMeals(Object.keys(structured).length > 0);
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

    fetchPlan();
  }, [weekDay, user?.userid, setMeals]);

  const extractLastUpdatedFromHeaders = (res: Response): string | null => {
    const xLast = res.headers.get("x-last-modified");
    const stdLast = res.headers.get("last-modified");
    const xFile = res.headers.get("x-file-modified-date");

    const raw: string | null = xLast || stdLast || xFile;
    if (!raw) return null;
    let d: Date | null = null;

    if (raw === xFile) {
      const normalized = raw.replace(" ", "T");
      const tryDate = new Date(normalized);
      d = isNaN(tryDate.getTime()) ? null : tryDate;
    } else {
      const tryDate = new Date(raw);
      d = isNaN(tryDate.getTime()) ? null : tryDate;
    }

    if (!d) return null;

    // Format for display
    return d.toLocaleString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  useEffect(() => {
    const checkPdfAvailability = async () => {
      if (!user?.userid || !weekDay) {
        setPdfAvailable(false);
        setLastUpdated(null);
        return;
      }

      try {
        const res = (await fetchDietPdfAvailability(
          user.userid,
          weekDay.toLowerCase()
        )) as Response;

        if (res && res.ok) {
          setPdfAvailable(true);

          const formatted = extractLastUpdatedFromHeaders(res);
          setLastUpdated(formatted);
        } else {
          setPdfAvailable(false);
          setLastUpdated(null);
        }
      } catch (err) {
        console.warn("❌ PDF not available", err);
        setPdfAvailable(false);
        setLastUpdated(null);
      }
    };

    checkPdfAvailability();
  }, [user?.userid, weekDay]);

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
    <div className="min-h-screen flex flex-col bg-[#f9fafb]">
      <Header />
      <div className="flex flex-1 flex-col lg:flex-row">
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
              onChange={(e) => {
                setWeekDay(e.target.value);
                setPdfAvailable(false);
                setLastUpdated(null);
              }}
            >
              <option value="">Choose a Day...</option>
              {weekDays.map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>
          </div>

          {!hasMeals && (
            <div className="bg-teal-100 border border-teal-300 text-gray-600 p-4 rounded mb-6">
              Your dietician hasn`t uploaded or added your diet plan yet.
            </div>
          )}

          {pdfAvailable && (
            <div className="mb-6">
              <Link href="/feature/DietPlanPdf" target="_blank">
                <button className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700">
                  View Uploaded Diet Plan
                </button>
              </Link>

              {lastUpdated && (
                <p className="text-sm text-gray-600 mt-2">
                  Last updated on: {lastUpdated}
                </p>
              )}
            </div>
          )}

          {Object.entries(meals).map(([mealTitle, items]) => (
            <div key={mealTitle} className="mb-6 bg-white rounded shadow-md">
              <div className="border-b px-4 py-2 font-semibold text-base sm:text-lg">
                {mealTitle}
              </div>

              {/* Scrollable table container */}
              <div className="px-2 sm:px-4 py-2 overflow-x-auto">
                <div className="inline-block min-w-full align-middle">
                  <table className="w-full table-auto border-collapse">
                    <thead className="bg-gray-100 dark:bg-gray-700">
                      <tr>
                        <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 dark:text-gray-200 whitespace-nowrap">
                          Meal Name
                        </th>
                        <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 dark:text-gray-200 whitespace-nowrap">
                          Quantity
                        </th>
                        <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 dark:text-gray-200 whitespace-nowrap">
                          Recipe
                        </th>
                        <th className="px-4 py-2 text-center text-sm font-semibold text-gray-700 dark:text-gray-200 whitespace-nowrap">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item) => (
                        <tr
                          key={item.id}
                          className="hover:bg-teal-100 dark:hover:bg-gray-700"
                        >
                          <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200 capitalize whitespace-nowrap">
                            {item.meal_name}
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200 whitespace-nowrap">
                            {item.quantity}
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200 whitespace-nowrap">
                            {item.recipe}
                          </td>
                          <td className="px-4 py-2 text-sm text-center text-gray-700 dark:text-gray-200 whitespace-nowrap">
                            <div className="flex justify-center items-center gap-4">
                              <div
                                className="text-green-500 text-xl cursor-pointer"
                                onClick={() =>
                                  handleTrackMeal(
                                    item.id,
                                    true,
                                    "Diet followed"
                                  )
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
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
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
                className="px-4 py-2 bg-gray-300 dark:bg-gray-300 rounded"
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
